import type { Metadata } from 'next'
import { SITE_NAME, siteSeo, getOgImageUrl } from '@/lib/site'

const description =
  'Shop sofas, beds, dining tables and office furniture from Shreejee Blessings Wood. Newest arrivals are listed first, with Delhi NCR showrooms and delivery across India.'

export const metadata: Metadata = {
  title: 'Shop Furniture Online',
  description,
  alternates: { canonical: '/shop' },
  openGraph: {
    title: `Shop Furniture Online | ${SITE_NAME}`,
    description,
    images: [{ url: getOgImageUrl(), width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Shop Furniture Online | ${SITE_NAME}`,
    description: siteSeo.defaultDescription,
    images: [getOgImageUrl()],
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
