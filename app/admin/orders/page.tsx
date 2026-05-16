'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiEye, FiCheck, FiX } from 'react-icons/fi'
import { apiClient } from '@/lib/api'

interface OrderPayment {
  id: number
  order_id: number
  status: string
  method: string
  amount: string | number
  currency?: string
  utr_reference?: string | null
  note?: string | null
  created_at: string
}

interface OrderPaymentScreenshot {
  id: number
  order_id: number
  url: string
  original_name?: string | null
  created_at: string
}

interface Order {
  id: number
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  shipping_address: string
  status: string
  total_amount: number
  items: OrderItem[]
  payments?: OrderPayment[]
  payment_screenshots?: OrderPaymentScreenshot[]
  created_at: string
}

interface OrderItem {
  id: number
  product_name: string
  quantity: number
  price: number
  subtotal: number
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchOrders()
  }, [router, statusFilter])

  const fetchOrders = async () => {
    try {
      const params: Record<string, string | number> = { per_page: 100 }
      if (statusFilter !== 'all') {
        params.status = statusFilter
      }
      const paginator = await apiClient.getAdminOrders(params)
      const list = paginator?.data
      setOrders(Array.isArray(list) ? list : [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await apiClient.updateOrderStatus(orderId, status)
      await fetchOrders()
      if (selectedOrder?.id === orderId) {
        const fresh = await apiClient.getAdminOrder(orderId)
        setSelectedOrder(fresh)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Order Management</h1>
          <Link href="/admin/dashboard" className="text-gray-600 hover:text-primary">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg ${statusFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              All Orders
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg ${statusFilter === 'pending' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('processing')}
              className={`px-4 py-2 rounded-lg ${statusFilter === 'processing' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              Processing
            </button>
            <button
              onClick={() => setStatusFilter('delivered')}
              className={`px-4 py-2 rounded-lg ${statusFilter === 'delivered' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              Delivered
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Order #</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-semibold">{order.order_number}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-semibold">{order.customer_name}</div>
                      <div className="text-sm text-gray-600">{order.customer_email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{order.items?.length || 0} items</td>
                  <td className="px-4 py-3 font-bold text-primary">₹{order.total_amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={async () => {
                        try {
                          const full = await apiClient.getAdminOrder(order.id)
                          setSelectedOrder(full)
                        } catch {
                          setSelectedOrder(order)
                        }
                      }}
                      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                      <FiEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={updateOrderStatus}
        />
      )}
    </div>
  )
}

function OrderDetailModal({ order, onClose, onStatusUpdate }: {
  order: Order
  onClose: () => void
  onStatusUpdate: (id: number, status: string) => void
}) {
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="text-2xl" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-2">Order Information</h3>
            <p className="text-sm text-gray-600">Order #: <span className="font-mono font-semibold">{order.order_number}</span></p>
            <p className="text-sm text-gray-600">Date: {new Date(order.created_at).toLocaleString()}</p>
            <p className="text-sm text-gray-600">Status: <span className="font-semibold">{order.status}</span></p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Customer Information</h3>
            <p className="text-sm">{order.customer_name}</p>
            <p className="text-sm text-gray-600">{order.customer_email}</p>
            {order.customer_phone && <p className="text-sm text-gray-600">{order.customer_phone}</p>}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <p className="text-sm text-gray-600 whitespace-pre-line">{order.shipping_address}</p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Payment screenshots</h3>
          {order.payment_screenshots && order.payment_screenshots.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {order.payment_screenshots.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border rounded-lg overflow-hidden w-28 h-28 bg-gray-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.url} alt={s.original_name || 'Payment proof'} className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No screenshots uploaded.</p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Payment history (UPI)</h3>
          {order.payments && order.payments.length > 0 ? (
            <div className="border rounded-lg overflow-hidden text-sm">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Time</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Amount</th>
                    <th className="px-3 py-2 text-left">UTR</th>
                  </tr>
                </thead>
                <tbody>
                  {order.payments.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="px-3 py-2 whitespace-nowrap">
                        {new Date(p.created_at).toLocaleString()}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            p.status === 'success'
                              ? 'bg-green-100 text-green-800'
                              : p.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">₹{Number(p.amount).toLocaleString()}</td>
                      <td className="px-3 py-2 font-mono text-xs">{p.utr_reference || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No payment records yet.</p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Order Items</h3>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{item.product_name}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">₹{item.price.toLocaleString()}</td>
                  <td className="px-4 py-2 font-semibold">₹{item.subtotal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2">
                <td colSpan={3} className="px-4 py-2 text-right font-bold">Total:</td>
                <td className="px-4 py-2 font-bold text-primary">₹{order.total_amount.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex gap-4">
          <label className="font-semibold">Update Status:</label>
          <select
            value={order.status}
            onChange={(e) => onStatusUpdate(order.id, e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

