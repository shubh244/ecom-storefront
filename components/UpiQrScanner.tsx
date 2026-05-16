'use client'

import { useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

/**
 * Lets the customer use this device’s camera to scan a physical UPI QR (e.g. printed).
 * If the decoded payload is a UPI intent, we open it (same as tapping “Open UPI app”).
 */
export default function UpiQrScanner() {
  useEffect(() => {
    const regionId = 'checkout-upi-html5-reader'
    const scanner = new Html5QrcodeScanner(
      regionId,
      { fps: 8, qrbox: { width: 220, height: 220 }, aspectRatio: 1 },
      false
    )
    scanner.render(
      (decodedText) => {
        const t = decodedText.trim()
        if (t.toLowerCase().startsWith('upi://')) {
          window.location.href = t
          scanner.clear().catch(() => {})
        }
      },
      () => {}
    )
    return () => {
      scanner.clear().catch(() => {})
    }
  }, [])

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-1">Camera scanner</h3>
      <p className="text-xs text-gray-600 mb-3">
        Allow camera access to scan a UPI QR (for example from a printout). If it is a valid UPI link,
        your UPI app may open automatically.
      </p>
      <div id="checkout-upi-html5-reader" className="min-h-[120px]" />
    </div>
  )
}
