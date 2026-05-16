'use client'

import { usePathname } from 'next/navigation'
import Footer from '@/components/Footer'

export default function AppFooter() {
  const pathname = usePathname()
  const edgeToEdge =
    pathname?.startsWith('/admin') || pathname?.startsWith('/checkout')

  return <Footer edgeToEdge={!!edgeToEdge} />
}
