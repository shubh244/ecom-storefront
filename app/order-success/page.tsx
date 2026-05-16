'use client'

import Link from 'next/link'
import { FiCheckCircle, FiShoppingBag, FiHome } from 'react-icons/fi'

export default function OrderSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="text-5xl text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. We'll send you an order confirmation email shortly.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <FiHome />
            Continue Shopping
          </Link>
          <Link
            href="/admin/orders"
            className="block w-full border-2 border-primary text-primary py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <FiShoppingBag />
            View Orders (Admin)
          </Link>
        </div>
      </div>
    </div>
  )
}

