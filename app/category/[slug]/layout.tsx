import type { Metadata } from 'next'
import { SITE_NAME, getSiteUrl, siteSeo, getOgImageUrl } from '@/lib/site'
import { fetchCategoryBySlugForMeta } from '@/lib/seo-api'

type Props = { children: React.ReactNode; params: { slug: string } }

function titleCaseSlug(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await fetchCategoryBySlugForMeta(params.slug)
  const siteUrl = getSiteUrl()
  const label = category?.name ?? titleCaseSlug(params.slug)
  const title = `${label} — Buy Online`
  const description = `Shop ${label.toLowerCase()} from ${SITE_NAME}. Premium wooden furniture with Delhi NCR showrooms and Pan India home delivery. Secure checkout.`
  const url = `${siteUrl}/category/${params.slug}`

  return {
    title,
    description,
    keywords: [...siteSeo.keywords, label, `${label} Delhi`, `${label} online India`],
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: `${title} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      locale: 'en_IN',
      images: [{ url: siteSeo.ogImage, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [getOgImageUrl()],
    },
  }
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children
}
