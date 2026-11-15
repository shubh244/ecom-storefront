'use client'

import { useEffect, useMemo, useState } from 'react'
import { apiClient } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/lib/types'

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'rating'

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

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('newest')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const result: unknown = await apiClient.getProducts({
          per_page: 300,
          sort_by: 'created_at',
          sort_order: 'desc',
        })
        if (!cancelled) setProducts(readProducts(result))
      } catch {
        if (!cancelled) setError('Unable to load products. Please try again later.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(() => {
    const names = new Map<string, string>()
    products.forEach((product) => {
      const name = product.category?.name
      const slug = product.category?.slug || name
      if (name && slug) names.set(slug, name)
    })
    return Array.from(names, ([slug, name]) => ({ slug, name })).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  }, [products])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const filtered = products.filter((product) => {
      if (category !== 'all' && (product.category?.slug || product.category?.name) !== category) {
        return false
      }
      if (!needle) return true
      return (
        product.name.toLowerCase().includes(needle) ||
        (product.description || '').toLowerCase().includes(needle)
      )
    })
    return filtered.sort((a, b) => {
      if (sort === 'price-asc') return Number(a.price) - Number(b.price)
      if (sort === 'price-desc') return Number(b.price) - Number(a.price)
      if (sort === 'rating') return Number(b.rating) - Number(a.rating)
      return Number(b.id) - Number(a.id)
    })
  }, [products, query, sort, category])

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-10 sm:py-14 text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Shop</h1>
        <p className="mt-2 text-white/90 max-w-2xl mx-auto">
          Newest arrivals are listed first. Search or pick a category to narrow the list.
        </p>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col lg:flex-row gap-3">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search sofas, dining sets, beds..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
            aria-label="Search products"
          />
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            className="px-4 py-3 border border-gray-300 rounded-lg bg-white"
            aria-label="Sort products"
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Highest rated</option>
          </select>
        </div>

        {categories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                category === 'all' ? 'bg-primary text-white' : 'bg-white border border-gray-300'
              }`}
            >
              All ({products.length})
            </button>
            {categories.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setCategory(item.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  category === item.slug ? 'bg-primary text-white' : 'bg-white border border-gray-300'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}

        {!loading && !error && (
          <p className="text-gray-600 mb-4">Showing {visible.length} products</p>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-center text-red-600 font-medium" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && visible.length === 0 && (
          <p className="text-center text-gray-600">No products match that search.</p>
        )}

        {!loading && visible.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
