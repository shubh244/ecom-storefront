import type { Metadata } from 'next'
import { SITE_NAME, siteSeo, getOgImageUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Shop',
  description: `Browse furniture online — ${SITE_NAME}.`,
  openGraph: {
    title: `Shop | ${SITE_NAME}`,
    description: siteSeo.defaultDescription,
    images: [{ url: getOgImageUrl(), width: 512, height: 512, alt: SITE_NAME }],
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
