'use client'

import { usePathname } from 'next/navigation'

export default function AppMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideMobileNav =
    pathname?.startsWith('/admin') || pathname?.startsWith('/checkout')
  const padMobile = !hideMobileNav

  return (
    <main className={`min-h-[100dvh] ${padMobile ? 'app-main-mobile-pad' : ''}`}>{children}</main>
  )
}
