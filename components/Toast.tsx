'use client'

import { useEffect } from 'react'
import { FiCheckCircle, FiX, FiAlertCircle } from 'react-icons/fi'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose, duration])

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type]

  const Icon = type === 'success' ? FiCheckCircle : type === 'error' ? FiAlertCircle : FiCheckCircle

  return (
    <div className="w-full animate-slide-in">
      <div
        className={`${bgColor} text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-lg flex items-center gap-3 w-full sm:min-w-[280px] sm:max-w-md ml-auto`}
      >
        <Icon className="text-xl shrink-0" />
        <span className="flex-1 text-sm sm:text-base leading-snug">{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center hover:bg-white/20 rounded-lg touch-manipulation"
          aria-label="Dismiss"
        >
          <FiX className="text-lg" />
        </button>
      </div>
    </div>
  )
}

