'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/lib/types'

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const result: unknown = await apiClient.getProducts({ per_page: 60 })
        const items: Product[] = Array.isArray(result)
          ? result
          : result &&
              typeof result === 'object' &&
              'data' in result &&
              Array.isArray((result as { data: unknown }).data)
            ? ((result as { data: Product[] }).data)
            : []
        if (!cancelled) setProducts(items)
      } catch (e) {
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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-10 sm:py-14 text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Shop</h1>
        <p className="mt-2 text-white/90 max-w-2xl mx-auto">
          Browse our catalog — filter by category from the menu or open a product for details.
        </p>
      </div>

      <div className="container mx-auto px-4 py-10">
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

        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-600">No products available right now.</p>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
