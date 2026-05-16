'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { apiClient } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/lib/types'

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const query = (searchParams.get('q') || '').trim()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setProducts([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        // getProducts returns a paginated response object from the API
        const result: any = await apiClient.getProducts({ search: query, per_page: 60 })
        const items: Product[] = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : []
        setProducts(items)
      } catch (err) {
        console.error('Error fetching search results:', err)
        setError('Failed to load search results. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [query])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {query ? (
              <>
                Showing results for <span className="font-semibold">&quot;{query}&quot;</span>
              </>
            ) : (
              'Type a product name in the search box to find items.'
            )}
          </p>
        </div>

        {loading && (
          <div className="py-12 flex justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
              <p className="mt-4 text-gray-600">Searching products...</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="py-12 text-center text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && query && products.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-700 mb-2">No products found.</p>
            <p className="text-gray-500 text-sm">
              Try searching with a different keyword like &quot;sofa&quot; or &quot;table&quot;.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4 py-12 text-center text-gray-600">
            Loading...
          </div>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  )
}


