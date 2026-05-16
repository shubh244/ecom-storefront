'use client'

import { useCart } from '@/context/CartContext'
import { FiX, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart()
  const router = useRouter()

  if (!isOpen) return null

  const handleCheckout = () => {
    onClose()
    router.push('/checkout')
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-3xl shadow-2xl max-h-[min(92dvh,900px)] sm:max-h-[90vh] flex flex-col animate-slide-up"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-gray-200 sm:hidden shrink-0" aria-hidden />

        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <FiShoppingBag className="text-2xl text-primary shrink-0" />
            <h2 id="cart-title" className="text-xl sm:text-2xl font-bold truncate">
              Your cart
            </h2>
            <span className="bg-primary text-white px-2 py-1 rounded-full text-sm font-semibold shrink-0">
              {getTotalItems()}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-gray-100 transition touch-manipulation"
            aria-label="Close cart"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <FiShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
              <Link
                href="/"
                onClick={onClose}
                className="inline-block min-h-[48px] px-6 leading-[48px] bg-primary hover:bg-secondary text-white rounded-xl font-semibold touch-manipulation"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 sm:p-4 border border-gray-100 rounded-xl hover:shadow-md transition"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">🪑</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate">{item.category}</p>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-bold text-primary">₹{item.price.toLocaleString()}</span>
                      {item.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-gray-50 touch-manipulation"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus />
                        </button>
                        <span className="px-3 min-w-[2.5rem] text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-gray-50 touch-manipulation"
                          aria-label="Increase quantity"
                        >
                          <FiPlus />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 text-sm font-medium min-h-[44px] px-2 touch-manipulation"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-bold text-base sm:text-lg">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-100 px-4 sm:px-6 py-4 bg-gray-50/90">
            <div className="flex justify-between items-center mb-4">
              <span className="text-base sm:text-lg font-semibold">Total</span>
              <span className="text-xl sm:text-2xl font-bold text-primary">₹{getTotalPrice().toLocaleString()}</span>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-h-[48px] border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition touch-manipulation"
              >
                Keep shopping
              </button>
              <button
                type="button"
                onClick={handleCheckout}
                className="flex-1 min-h-[48px] bg-primary hover:bg-secondary text-white rounded-xl font-semibold transition touch-manipulation"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
