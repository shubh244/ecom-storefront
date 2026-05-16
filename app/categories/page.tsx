'use client'

import { useEffect, useState } from 'react'
import CategorySection from '@/components/CategorySection'
import { apiClient } from '@/lib/api'
import { Category } from '@/lib/types'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await apiClient.getCategories()
        if (!cancelled) setCategories(data)
      } catch {
        if (!cancelled) setError('Unable to load categories.')
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
        <h1 className="text-3xl sm:text-4xl font-bold">All Categories</h1>
        <p className="mt-2 text-white/90 max-w-2xl mx-auto">
          Explore collections for every room and commercial space.
        </p>
      </div>

      <div className="container mx-auto px-4 py-10">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        )}
        {error && (
          <p className="text-center text-red-600 font-medium" role="alert">
            {error}
          </p>
        )}
        {!loading && !error && <CategorySection categories={categories} />}
        {!loading && !error && categories.length === 0 && (
          <p className="text-center text-gray-600">No categories found.</p>
        )}
      </div>
    </main>
  )
}
