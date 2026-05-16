'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import Link from 'next/link'
import { apiClient } from '@/lib/api'
import { SITE_NAME } from '@/lib/site'

const UpiQrScanner = dynamic(() => import('@/components/UpiQrScanner'), { ssr: false })

type CheckoutStep = 'form' | 'payment'

interface PlacedCheckout {
  order: {
    id: number
    order_number: string
    total_amount: string | number
  }
  razorpay_enabled: boolean
  upi_pay_url?: string
  merchant_upi_vpa?: string
  amount: string | number
}

function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (window.Razorpay) return Promise.resolve(true)
  return new Promise((resolve) => {
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.async = true
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCart()
  const { showToast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [step, setStep] = useState<CheckoutStep>('form')
  const [placed, setPlaced] = useState<PlacedCheckout | null>(null)
  const [utr, setUtr] = useState('')
  const [screenshotUploading, setScreenshotUploading] = useState(false)
  const [screenshotUrls, setScreenshotUrls] = useState<string[]>([])
  const [razorpayLoading, setRazorpayLoading] = useState(false)

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    notes: '',
  })

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.18
  const shippingCost = subtotal > 20000 ? 0 : 500
  const total = subtotal + tax + shippingCost

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        ...formData,
        items: cart.map((item) => ({
          product_id: parseInt(item.id, 10),
          quantity: item.quantity,
        })),
      }

      const data = await apiClient.createOrder(orderData)

      if (!data?.order) {
        showToast('Failed to place order. Please try again.', 'error')
        return
      }

      const razorpayEnabled = !!data.razorpay_enabled
      setPlaced({
        order: data.order,
        razorpay_enabled: razorpayEnabled,
        upi_pay_url: data.upi_pay_url,
        merchant_upi_vpa: data.merchant_upi_vpa,
        amount: data.order.total_amount ?? total,
      })
      setStep('payment')
      showToast(
        razorpayEnabled
          ? 'Order created. Pay securely with Razorpay (UPI, cards, netbanking).'
          : 'Order created. Complete UPI payment to finish.',
        'success'
      )
    } catch (error) {
      console.error('Error placing order:', error)
      showToast('Error placing order. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const openUpi = () => {
    if (!placed?.upi_pay_url) return
    window.location.href = placed.upi_pay_url
  }

  const payWithRazorpay = async () => {
    if (!placed?.razorpay_enabled) return
    setRazorpayLoading(true)
    try {
      const scriptOk = await loadRazorpayScript()
      if (!scriptOk) {
        showToast('Could not load Razorpay. Check your connection and try again.', 'error')
        setRazorpayLoading(false)
        return
      }

      const checkout = await apiClient.createRazorpayCheckoutOrder(placed.order.id)
      const orderIdForVerify = placed.order.id

      const rzp = new window.Razorpay({
        key: checkout.key_id,
        amount: checkout.amount,
        currency: checkout.currency,
        order_id: checkout.order_id,
        name: SITE_NAME,
        description: `Order ${checkout.order_number}`,
        prefill: checkout.prefill,
        handler(response) {
          void (async () => {
            try {
              await apiClient.verifyRazorpayPayment(orderIdForVerify, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
              showToast('Payment successful!', 'success')
              clearCart()
              router.push('/order-success')
            } catch (err) {
              console.error(err)
              showToast(
                err instanceof Error
                  ? err.message
                  : 'Verification failed. Contact support with your order number.',
                'error'
              )
            }
          })()
        },
        modal: {
          ondismiss: () => setRazorpayLoading(false),
        },
        theme: { color: '#8B4513' },
      })

      rzp.on('payment.failed', (res) => {
        const desc = res?.error?.description
        showToast(desc || 'Payment failed. You can try again.', 'error')
        setRazorpayLoading(false)
      })

      rzp.open()
      setRazorpayLoading(false)
    } catch (e) {
      console.error(e)
      showToast(e instanceof Error ? e.message : 'Could not start payment.', 'error')
      setRazorpayLoading(false)
    }
  }

  const reportPayment = async (status: 'success' | 'failed') => {
    if (!placed) return
    setPaymentLoading(true)
    try {
      await apiClient.reportOrderPayment(placed.order.id, {
        status,
        utr: utr.trim() || undefined,
      })
      if (status === 'success') {
        showToast('Payment marked successful.', 'success')
        clearCart()
        router.push('/order-success')
      } else {
        showToast('Payment marked as failed. You can retry from your UPI app.', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('Could not save payment status. Try again.', 'error')
    } finally {
      setPaymentLoading(false)
    }
  }

  if (cart.length === 0 && step === 'form') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <Link href="/" className="text-primary hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const handleScreenshotChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !placed) return
    setScreenshotUploading(true)
    try {
      const data = await apiClient.uploadPaymentScreenshot(placed.order.id, file)
      if (data?.url) {
        setScreenshotUrls((prev) => [...prev, data.url as string])
      }
      showToast('Payment screenshot uploaded for your order.', 'success')
    } catch (err) {
      console.error(err)
      showToast('Could not upload screenshot. Try a smaller image (JPG/PNG).', 'error')
    } finally {
      setScreenshotUploading(false)
      e.target.value = ''
    }
  }

  if (step === 'payment' && placed) {
    const screenshotBlock = (
      <div className="rounded-lg border border-dashed border-gray-300 p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Upload payment screenshot (optional)</h3>
        <p className="text-xs text-gray-600 mb-3">
          Saves proof against order #{placed.order.order_number} (order ID {placed.order.id}) for admin review.
        </p>
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
          disabled={screenshotUploading}
          onChange={handleScreenshotChange}
          className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        />
        {screenshotUploading && <p className="mt-2 text-xs text-gray-500">Uploading…</p>}
        {screenshotUrls.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {screenshotUrls.map((u, i) => (
              <a
                key={`${u}-${i}`}
                href={u}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary underline"
              >
                View upload {i + 1}
              </a>
            ))}
          </div>
        )}
      </div>
    )

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">
            {placed.razorpay_enabled ? 'Complete payment' : 'Pay with UPI'}
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            Order <span className="font-mono font-semibold">{placed.order.order_number}</span>{' '}
            <span className="text-gray-400">(ID: {placed.order.id})</span> · Amount{' '}
            <span className="font-semibold">₹{Number(placed.amount).toLocaleString()}</span>
          </p>

          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            {placed.razorpay_enabled ? (
              <>
                <p className="text-sm text-gray-600">
                  Pay with <strong>Razorpay</strong> — same secure checkout flow as our main store (UPI, cards,
                  netbanking, wallets). Your payment is verified automatically when it succeeds.
                </p>
                <button
                  type="button"
                  onClick={payWithRazorpay}
                  disabled={razorpayLoading}
                  className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  {razorpayLoading ? 'Preparing checkout…' : `Pay ₹${Number(placed.amount).toLocaleString()} with Razorpay`}
                </button>
                {screenshotBlock}
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  Pay to UPI ID:{' '}
                  <span className="font-mono font-semibold">{placed.merchant_upi_vpa}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Scan the QR below with PhonePe / Google Pay / Paytm, or use the app button. After paying,
                  upload a screenshot of the success screen so we can match it to your order.
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex flex-col items-center rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Scan to pay</h3>
                    <div className="rounded-lg bg-white p-3 shadow-sm">
                      {placed.upi_pay_url ? (
                        <QRCodeSVG value={placed.upi_pay_url} size={220} level="M" includeMargin />
                      ) : null}
                    </div>
                    <p className="mt-3 text-center text-xs text-gray-500">
                      Open your UPI app and scan this code
                    </p>
                  </div>

                  <UpiQrScanner />
                </div>

                <button
                  type="button"
                  onClick={openUpi}
                  className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg font-semibold"
                >
                  Open UPI app to pay
                </button>

                {screenshotBlock}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UTR / reference (optional)
                  </label>
                  <input
                    type="text"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="12-digit UTR if available"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    disabled={paymentLoading}
                    onClick={() => reportPayment('success')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                  >
                    I have paid successfully
                  </button>
                  <button
                    type="button"
                    disabled={paymentLoading}
                    onClick={() => reportPayment('failed')}
                    className="flex-1 border border-red-300 text-red-700 py-3 rounded-lg font-semibold hover:bg-red-50 disabled:opacity-50"
                  >
                    Payment failed
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <FiUser /> Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <FiMail /> Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.customer_email}
                      onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <FiPhone /> Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <FiMapPin /> Shipping Address *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.shipping_address}
                    onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your complete shipping address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Any special instructions..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Placing Order...' : 'Place order & pay'}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                      ) : (
                        <span className="text-xl">🪑</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm line-clamp-2">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-primary">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18% GST)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
