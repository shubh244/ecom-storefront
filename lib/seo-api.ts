import { getPublicApiUrl } from '@/lib/site'

type ProductMeta = {
  name: string
  description?: string | null
  image?: string | null
}

type CategoryMeta = { name: string; slug: string }

function apiBase(): string {
  return getPublicApiUrl()
}

export async function fetchProductForMeta(id: string): Promise<ProductMeta | null> {
  try {
    const res = await fetch(`${apiBase()}/products/${encodeURIComponent(id)}`, {
      next: { revalidate: 120 },
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return null
    const json = (await res.json()) as { data?: ProductMeta }
    return json.data ?? null
  } catch {
    return null
  }
}

export async function fetchCategoryBySlugForMeta(slug: string): Promise<CategoryMeta | null> {
  try {
    const res = await fetch(`${apiBase()}/categories`, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return null
    const json = (await res.json()) as { data?: CategoryMeta[] }
    const list = json.data ?? []
    return list.find((c) => c.slug === slug) ?? null
  } catch {
    return null
  }
}
