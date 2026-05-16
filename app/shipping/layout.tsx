import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Shipping',
  description: `Shipping and delivery — ${SITE_NAME}.`,
}

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
  return children
}
