import { Category, Product } from '@/lib/types'
import { getPublicApiUrl } from '@/lib/site'

function readProducts(result: unknown): Product[] {
  if (Array.isArray(result)) return result
  if (
    result &&
    typeof result === 'object' &&
    'data' in result &&
    Array.isArray((result as { data: unknown }).data)
  ) {
    return (result as { data: Product[] }).data
  }
  return []
}

function isCatalogPhoto(product: Product): boolean {
  const image = product.image || ''
  return (
    image.startsWith('/') ||
    (image.startsWith('http') && !image.includes('unsplash.com') && !image.includes('picsum.photos'))
  )
}

export function pickShowcase(result: unknown, limit = 10): Product[] {
  const products = readProducts(result)
  const catalog = products.filter(isCatalogPhoto)
  const others = products.filter((product) => !isCatalogPhoto(product))
  return [...catalog, ...others].slice(0, limit)
}

async function getJson(path: string): Promise<unknown> {
  const response = await fetch(`${getPublicApiUrl()}${path}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 300 },
  })
  if (!response.ok) return null
  const body = (await response.json()) as { data?: unknown }
  return body.data ?? null
}

export async function fetchHomeShowcase(): Promise<{
  sofas: Product[]
  dining: Product[]
  beds: Product[]
  categories: Category[]
}> {
  try {
    const [sofas, dining, beds, categories] = await Promise.all([
      getJson('/products?category=1&per_page=10&sort_by=id&sort_order=desc'),
      getJson('/products?category=2&per_page=10&sort_by=id&sort_order=desc'),
      getJson('/products?category=3&per_page=10&sort_by=id&sort_order=desc'),
      getJson('/categories'),
    ])
    return {
      sofas: pickShowcase(sofas),
      dining: pickShowcase(dining),
      beds: pickShowcase(beds),
      categories: Array.isArray(categories) ? (categories as Category[]) : [],
    }
  } catch {
    return { sofas: [], dining: [], beds: [], categories: [] }
  }
}
