import type { Metadata } from 'next'
import { SITE_NAME, getSiteUrl, siteSeo, getOgImageUrl } from '@/lib/site'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: 'Contact & Showrooms in Delhi NCR',
  description: `Visit ${SITE_NAME} showrooms in Rajouri Garden (Delhi), Gurgaon & Noida — or call 8467082350 / 9760232667. Wooden furniture experts with Pan India delivery support.`,
  keywords: [
    ...siteSeo.keywords,
    'furniture showroom Delhi',
    'Rajouri Garden furniture store',
    'contact furniture shop NCR',
  ],
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: `Contact ${SITE_NAME} | Delhi NCR & Pan India`,
    description: `Showrooms in Delhi, Gurgaon, Noida. Nationwide delivery enquiries.`,
    url: `${siteUrl}/contact`,
    siteName: SITE_NAME,
    locale: 'en_IN',
    images: [{ url: getOgImageUrl(), alt: SITE_NAME }],
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
