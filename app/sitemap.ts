import type { MetadataRoute } from 'next'
import { getPublicApiUrl, getSiteUrl } from '@/lib/site'
import { COMMERCIAL_ROUTES } from '@/lib/commercialPages'

const FALLBACK_CATEGORY_SLUGS = [
  'sofa-sets',
  'dining-table-sets',
  'beds',
  'tv-units',
  'book-shelves',
  'coffee-tables',
  'study-tables',
  'home-decor',
  'office',
]

type ProductRow = { id: number; updated_at?: string }
type CategoryRow = { slug?: string }

async function fetchCatalogue(): Promise<{ products: ProductRow[]; slugs: string[] }> {
  const api = getPublicApiUrl()
  const products: ProductRow[] = []
  const slugs = new Set<string>(FALLBACK_CATEGORY_SLUGS)
  try {
    let page = 1
    while (page <= 8) {
      const response = await fetch(`${api}/products?per_page=100&page=${page}`, {
        headers: { Accept: 'application/json' },
        next: { revalidate: 3600 },
      })
      if (!response.ok) break
      const body = (await response.json()) as { data?: { data?: ProductRow[]; last_page?: number } }
      const block = body.data
      products.push(...(block?.data ?? []))
      if (!block?.last_page || page >= block.last_page) break
      page += 1
    }
    const categories = await fetch(`${api}/categories`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    })
    if (categories.ok) {
      const body = (await categories.json()) as { data?: CategoryRow[] }
      for (const category of body.data ?? []) {
        if (category.slug) slugs.add(category.slug)
      }
    }
  } catch {
    return { products, slugs: [...slugs] }
  }
  return { products, slugs: [...slugs] }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const now = new Date()
  const { products, slugs } = await fetchCatalogue()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/categories`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${base}/category/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  const commercialRoutes: MetadataRoute.Sitemap = COMMERCIAL_ROUTES.map((slug) => ({
    url: `${base}/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.82,
  }))

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/product/${product.id}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...categoryRoutes, ...commercialRoutes, ...productRoutes]
}
