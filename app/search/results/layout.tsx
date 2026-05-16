import type { Metadata } from 'next'
import { SITE_NAME, getSiteUrl, siteSeo } from '@/lib/site'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: 'Search Furniture',
  description: `Search wooden furniture at ${SITE_NAME}. Beds, sofas, dining & more — Delhi NCR stores and Pan India delivery.`,
  robots: { index: false, follow: true },
  openGraph: {
    title: `Search | ${SITE_NAME}`,
    description: siteSeo.defaultDescription,
    url: `${siteUrl}/search/results`,
    siteName: SITE_NAME,
    locale: 'en_IN',
  },
}

export default function SearchResultsLayout({ children }: { children: React.ReactNode }) {
  return children
}
