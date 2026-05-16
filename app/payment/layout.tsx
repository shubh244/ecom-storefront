import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Payment Policy',
  description: `Payment security and options — ${SITE_NAME}.`,
}

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return children
}
