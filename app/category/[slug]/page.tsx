'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { Product, Category } from '@/lib/types'
import ProductCard from '@/components/ProductCard'

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

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
        <h1 className="text-4xl font-bold mb-8">{category.name}</h1>
        
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Subcategories</h2>
            <div className="flex flex-wrap gap-2">
              {category.subcategories.map((sub) => (
                <a
                  key={sub.id}
                  href={`/category/${sub.slug || sub.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-4 py-2 bg-gray-200 hover:bg-primary hover:text-white rounded-lg transition"
                >
                  {sub.name}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {products.length} products
          </p>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>Sort by: Default</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest First</option>
            <option>Highest Rated</option>
          </select>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}

