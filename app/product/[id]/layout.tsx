import type { Metadata } from 'next'
import { SITE_NAME, getSiteUrl, siteSeo, buildProductMetaDescription, getOgImageUrl } from '@/lib/site'
import { fetchProductForMeta } from '@/lib/seo-api'

type Props = { children: React.ReactNode; params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await fetchProductForMeta(params.id)
  const siteUrl = getSiteUrl()

  if (!product?.name) {
    return {
      title: 'Product',
      description: `Browse wooden furniture at ${SITE_NAME} — Delhi & Pan India delivery.`,
    }
  }

  const description = buildProductMetaDescription(product.name, product.description)
  const url = `${siteUrl}/product/${params.id}`

  return {
    title: product.name,
    description,
    keywords: [...siteSeo.keywords, product.name, 'buy online', 'furniture Delhi'],
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: `${product.name} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      locale: 'en_IN',
      images: product.image
        ? [{ url: product.image, alt: product.name }]
        : [{ url: getOgImageUrl(), alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: product.image ? [product.image] : [getOgImageUrl()],
    },
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children
}
