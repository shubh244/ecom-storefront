import type { Metadata } from 'next'
import HomeClient from './HomeClient'
import { fetchHomeShowcase } from '@/lib/homeShowcase'
import { SITE_NAME, getSiteUrl, siteSeo, getOgImageUrl } from '@/lib/site'

const siteUrl = getSiteUrl()

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

export default async function HomePage() {
  const showcase = await fetchHomeShowcase()
  const listed = [...showcase.sofas, ...showcase.dining, ...showcase.beds]
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Furniture highlights',
    itemListElement: listed.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: product.name,
      url: `${siteUrl}/product/${product.id}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <HomeClient
        initialSofas={showcase.sofas}
        initialDining={showcase.dining}
        initialBeds={showcase.beds}
        initialCategories={showcase.categories}
      />
    </>
  )
}
