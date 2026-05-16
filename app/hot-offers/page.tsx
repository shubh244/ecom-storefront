'use client'

import HotOffers from '@/components/HotOffers'

export default function HotOffersPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-10 sm:py-14 text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Hot Offers</h1>
        <p className="mt-2 text-base sm:text-lg text-white/90 max-w-2xl mx-auto">
          Limited-time savings on selected furniture — same quality, better prices.
        </p>
      </div>
      <HotOffers standalone />
    </main>
  )
}
