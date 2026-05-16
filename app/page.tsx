import type { Metadata } from 'next'
import HomeClient from './HomeClient'
import { SITE_NAME, getSiteUrl, siteSeo, getOgImageUrl } from '@/lib/site'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: { absolute: siteSeo.homeTitle },
  description: siteSeo.homeDescription,
  keywords: [...siteSeo.keywords],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: SITE_NAME,
    title: siteSeo.homeTitle,
    description: siteSeo.homeDescription,
    images: [{ url: getOgImageUrl(), width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteSeo.homeTitle,
    description: siteSeo.homeDescription,
    images: [getOgImageUrl()],
  },
}

export default function HomePage() {
  return <HomeClient />
}
