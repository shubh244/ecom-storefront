'use client'

import BrandLogo from '@/components/BrandLogo'

export default function HomeBrandBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/90 via-white to-white border-b border-amber-100/80">
      <div
        className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"
        aria-hidden
      />
      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12 flex flex-col items-center text-center relative z-10">
        <BrandLogo size="splash" priority showName />
        <p className="mt-4 max-w-xl text-sm sm:text-base text-stone-600">
          Premium wooden furniture — Delhi NCR showrooms &amp; delivery across India
        </p>
      </div>
    </section>
  )
}
