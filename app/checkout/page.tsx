'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import Link from 'next/link'
import { apiClient } from '@/lib/api'
import { SITE_NAME } from '@/lib/site'

type CheckoutStep = 'form' | 'payment'

interface PaymentConfig {
  razorpay_enabled: boolean
  razorpay_key_id: string | null
}

interface PlacedCheckout {
  order: {
    id: number
    order_number: string
    total_amount: string | number
  }
  razorpay_enabled: boolean
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
  const { cart, isReady, getTotalPrice, clearCart } = useCart()
  const { showToast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<CheckoutStep>('form')
  const [placed, setPlaced] = useState<PlacedCheckout | null>(null)
  const [razorpayLoading, setRazorpayLoading] = useState(false)
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null)
  const [apiRazorpayReady, setApiRazorpayReady] = useState<boolean | null>(null)
  const autoRazorpayRef = useRef(false)

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

  const publicRazorpayKey =
    typeof process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === 'string'
      ? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.trim()
      : ''
  const razorpayUiReady =
    apiRazorpayReady !== false || !!paymentConfig?.razorpay_enabled || !!publicRazorpayKey

  useEffect(() => {
    let cancelled = false
    void apiClient.getPaymentConfig().then((cfg) => {
      if (cancelled) return
      if (cfg) {
        setPaymentConfig(cfg)
        setApiRazorpayReady(cfg.razorpay_enabled)
        return
      }
      setApiRazorpayReady(null)
      if (publicRazorpayKey) {
        setPaymentConfig({
          razorpay_enabled: true,
          razorpay_key_id: publicRazorpayKey,
        })
      }
    })
    return () => {
      cancelled = true
    }
  }, [publicRazorpayKey])

  function resolveRazorpayEnabled(data: {
    razorpay_enabled?: boolean
    payment_method?: string
    payment?: { method?: string }
  }): boolean {
    if (data.razorpay_enabled === true) return true
    if (data.payment_method === 'razorpay' || data.payment?.method === 'razorpay') {
      return true
    }
    if (data.razorpay_enabled === false) return false
    return true
  }

  const payWithRazorpay = useCallback(async () => {
    if (!placed) return
    setRazorpayLoading(true)
    try {
      const scriptOk = await loadRazorpayScript()
      if (!scriptOk) {
        showToast('Could not load Razorpay. Check your connection and try again.', 'error')
        return
      }

      const checkout = await apiClient.createRazorpayCheckoutOrder(placed.order.id)
      const orderIdForVerify = placed.order.id
      const keyId = checkout.key_id || paymentConfig?.razorpay_key_id || publicRazorpayKey
      if (!keyId) {
        showToast('Razorpay key missing. Add keys to API .env, then run: php artisan config:clear', 'error')
        return
      }

      const rzp = new window.Razorpay({
        key: keyId,
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
    } catch (e) {
      console.error(e)
      const msg = e instanceof Error ? e.message : 'Could not start payment.'
      showToast(msg, 'error')
    } finally {
      setRazorpayLoading(false)
    }
  }, [placed, paymentConfig?.razorpay_key_id, publicRazorpayKey, showToast, clearCart, router])

  useEffect(() => {
    if (step !== 'payment' || !placed || !autoRazorpayRef.current) return
    autoRazorpayRef.current = false
    const t = window.setTimeout(() => {
      void payWithRazorpay()
    }, 100)
    return () => window.clearTimeout(t)
  }, [step, placed, payWithRazorpay])

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
        payment_method: 'razorpay' as const,
      }

      const data = await apiClient.createOrder(orderData)

      if (!data?.order) {
        showToast('Failed to place order. Please try again.', 'error')
        return
      }

      const razorpayEnabled = resolveRazorpayEnabled(data)
      if (!razorpayEnabled) {
        showToast(
          'Razorpay is not configured on the server. Add keys to API .env and run php artisan config:clear.',
          'error'
        )
        return
      }

      setPlaced({
        order: data.order,
        razorpay_enabled: true,
        amount: data.order.total_amount ?? total,
      })
      setStep('payment')
      autoRazorpayRef.current = true
      showToast('Order created. Opening Razorpay checkout…', 'success')
    } catch (error) {
      console.error('Error placing order:', error)
      showToast(
        error instanceof Error ? error.message : 'Error placing order. Please try again.',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading checkout…</p>
      </div>
    )
  }

  if (cart.length === 0 && step === 'form') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6 text-sm">Add items to your cart before checkout.</p>
          <Link
            href="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (step === 'payment' && placed) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">Complete payment</h1>
          <p className="text-gray-600 text-sm mb-6">
            Order <span className="font-mono font-semibold">{placed.order.order_number}</span> · Amount{' '}
            <span className="font-semibold">₹{Number(placed.amount).toLocaleString()}</span>
          </p>

          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <p className="text-sm text-gray-600">
              Pay securely with <strong>Razorpay</strong> — UPI, cards, netbanking, and wallets. Payment is
              verified automatically when it succeeds.
            </p>
            <button
              type="button"
              onClick={payWithRazorpay}
              disabled={razorpayLoading}
              className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {razorpayLoading
                ? 'Preparing checkout…'
                : `Pay ₹${Number(placed.amount).toLocaleString()} with Razorpay`}
            </button>
            {!razorpayUiReady && (
              <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Razorpay keys may be missing on the API server. Contact support if checkout does not open.
              </p>
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

                {apiRazorpayReady === false && (
                  <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    Razorpay is not active on the API yet. Add keys to <strong>public_html/.env</strong> and run{' '}
                    <code className="text-[11px]">php artisan config:clear</code>.
                  </p>
                )}

                <p className="text-sm text-gray-600 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  Payment: <strong>Razorpay</strong> (UPI, cards, netbanking, wallets)
                </p>

                <button
                  type="submit"
                  disabled={loading || razorpayLoading || apiRazorpayReady === false}
                  className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading || razorpayLoading ? 'Processing…' : 'Place order & pay with Razorpay'}
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
