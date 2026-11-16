import type { Metadata } from 'next'
import { SITE_NAME, getSiteUrl, siteSeo, buildProductMetaDescription, getOgImageUrl, productJsonLd, breadcrumbJsonLd } from '@/lib/site'
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

export default async function ProductLayout({ children, params }: Props) {
  const product = await fetchProductForMeta(params.id)
  const siteUrl = getSiteUrl()
  const pageUrl = `${siteUrl}/product/${params.id}`
  const crumbs = [
    { name: 'Home', url: siteUrl },
    ...(product?.category?.name && product.category.slug
      ? [{ name: product.category.name, url: `${siteUrl}/category/${product.category.slug}` }]
      : []),
    { name: product?.name || 'Product', url: pageUrl },
  ]
  const blocks = [
    breadcrumbJsonLd(crumbs),
    ...(product?.name ? [productJsonLd(product, params.id)] : []),
  ]
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blocks) }} />
      {children}
    </>
  )
}
