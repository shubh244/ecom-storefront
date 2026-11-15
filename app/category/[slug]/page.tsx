'use client'

import { useEffect, useMemo, useState } from 'react'
import { apiClient } from '@/lib/api'
import { Product, Category } from '@/lib/types'
import ProductCard from '@/components/ProductCard'

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'rating'

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('newest')
  const [subcategory, setSubcategory] = useState('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await apiClient.getCategories()
        const foundCategory = categories.find(
          (cat: Category) => cat.slug === params.slug
        )

        if (foundCategory) {
          setCategory(foundCategory)
          const categoryProducts = await apiClient.getCategoryProducts(foundCategory.id.toString())
          setProducts(categoryProducts)
        }
      } catch (error) {
        console.error('Error fetching category data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.slug])

  const subcategories = useMemo(() => {
    const names = new Set<string>()
    products.forEach((product) => {
      if (product.subcategory) names.add(product.subcategory)
    })
    return Array.from(names).sort()
  }, [products])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const filtered = products.filter((product) => {
      if (subcategory !== 'all' && product.subcategory !== subcategory) return false
      if (!needle) return true
      return (
        product.name.toLowerCase().includes(needle) ||
        (product.description || '').toLowerCase().includes(needle) ||
        (product.subcategory || '').toLowerCase().includes(needle)
      )
    })

    return filtered.sort((a, b) => {
      if (sort === 'price-asc') return Number(a.price) - Number(b.price)
      if (sort === 'price-desc') return Number(b.price) - Number(a.price)
      if (sort === 'rating') return Number(b.rating) - Number(a.rating)
      return Number(b.id) - Number(a.id)
    })
  }, [products, query, sort, subcategory])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">{category.name}</h1>
        <p className="text-gray-600 mb-6">
          {visible.length} of {products.length} products. Newest are shown first.
        </p>

        <div className="mb-6 flex flex-col lg:flex-row gap-3">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search this category..."
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

        {subcategories.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSubcategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                subcategory === 'all' ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {subcategories.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setSubcategory(name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  subcategory === name ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {visible.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products match that search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
