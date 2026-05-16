import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site'
import { COMMERCIAL_ROUTES } from '@/lib/commercialPages'

const CATEGORY_SLUGS = [
  'sofa-sets',
  'dining-table-sets',
  'beds',
  'tv-units',
  'book-shelves',
  'coffee-tables',
  'study-tables',
  'home-decor',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl()
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
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

  return [...staticRoutes, ...categoryRoutes, ...commercialRoutes]
}
