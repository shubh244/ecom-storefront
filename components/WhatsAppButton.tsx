'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { FiMessageCircle, FiX } from 'react-icons/fi'
import { SITE_NAME } from '@/lib/site'

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const hidden = pathname?.startsWith('/admin') || pathname?.startsWith('/checkout')
  
  // Primary WhatsApp number
  const whatsappNumber = '7982674272'
  const customerIntro = 'Hello, this message is from a customer.'
  const message = `${customerIntro} I would like to know more about your furniture products.`

  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(message)}`

  if (hidden) return null

  return (
    <>
      {/* WhatsApp Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 sm:right-6 z-[55] bg-green-500 hover:bg-green-600 active:scale-95 text-white rounded-full p-3.5 sm:p-4 shadow-2xl transition-transform duration-200 whatsapp-fab-mobile touch-manipulation min-h-[52px] min-w-[52px] flex items-center justify-center"
        aria-label="WhatsApp Chat"
      >
        <FiMessageCircle className="text-3xl" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          1
        </span>
      </button>

      {/* WhatsApp Chat Popup */}
      {isOpen && (
        <div className="fixed right-4 sm:right-6 z-[55] w-[min(100vw-2rem,20rem)] whatsapp-popup-mobile rounded-2xl bg-white shadow-2xl border border-gray-200 animate-slide-up overflow-hidden max-h-[min(70dvh,28rem)] flex flex-col">
          <div className="bg-green-500 text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <h3 className="font-semibold">{SITE_NAME}</h3>
                <p className="text-xs text-green-100">Typically replies within minutes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-green-600 rounded p-1"
            >
              <FiX className="text-xl" />
            </button>
          </div>
          
          <div className="p-4 bg-gray-50 overflow-y-auto">
            <p className="text-sm text-gray-700 mb-4">
              Hi! 👋 How can we help you today?
            </p>
            <div className="space-y-2">
              <a
                href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(`${customerIntro} I would like to know more about your furniture products.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-2 rounded-lg font-semibold transition"
              >
                Start Chat
              </a>
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(`${customerIntro} I want to place an order.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-center py-2 rounded-lg text-sm transition"
                >
                  Place Order
                </a>
                <a
                  href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(`${customerIntro} I need product information.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-center py-2 rounded-lg text-sm transition"
                >
                  Product Info
                </a>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-white border-t border-gray-200 shrink-0">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Online now</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

