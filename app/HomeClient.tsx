'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'
import TopPicks from '@/components/TopPicks'
import LazyWhenVisible from '@/components/LazyWhenVisible'
import { apiClient } from '@/lib/api'
import { Category, Product } from '@/lib/types'

const PromoBanner = dynamic(() => import('@/components/PromoBanner'), { ssr: false })
const CategoryBanner = dynamic(() => import('@/components/CategoryBanner'), { ssr: false })
const StatsBanner = dynamic(() => import('@/components/StatsBanner'), { ssr: false })
const CategorySection = dynamic(() => import('@/components/CategorySection'), { ssr: false })

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

function pickShowcase(result: unknown, limit = 10): Product[] {
  const products = readProducts(result)
  const catalog = products.filter(isCatalogPhoto)
  const others = products.filter((product) => !isCatalogPhoto(product))
  return [...catalog, ...others].slice(0, limit)
}

function FeaturedSkeleton() {
  return (
    <section className="py-12 bg-gray-50" aria-busy="true" aria-label="Loading featured products">
      <div className="container mx-auto px-4">
        <div className="h-9 max-w-xs bg-gray-200 rounded mx-auto mb-8 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomeClient() {
  const [categories, setCategories] = useState<Category[]>([])
  const [sofas, setSofas] = useState<Product[]>([])
  const [dining, setDining] = useState<Product[]>([])
  const [beds, setBeds] = useState<Product[]>([])
  const [featuredLoading, setFeaturedLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const [sofaResult, diningResult, bedResult, categoriesData] = await Promise.all([
          apiClient.getProducts({ category: '1', per_page: 10, sort_by: 'id', sort_order: 'desc' }),
          apiClient.getProducts({ category: '2', per_page: 10, sort_by: 'id', sort_order: 'desc' }),
          apiClient.getProducts({ category: '3', per_page: 10, sort_by: 'id', sort_order: 'desc' }),
          apiClient.getCategories(),
        ])
        if (!cancelled) {
          setSofas(pickShowcase(sofaResult))
          setDining(pickShowcase(diningResult))
          setBeds(pickShowcase(bedResult))
          setCategories(categoriesData)
        }
      } catch (error) {
        console.error('Error fetching home data:', error)
      } finally {
        if (!cancelled) setFeaturedLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="overflow-x-hidden">
      <Hero />

      {featuredLoading ? (
        <FeaturedSkeleton />
      ) : (
        <>
          <FeaturedProducts
            products={sofas}
            title="Sofa Sets"
            subtitle={`${sofas.length} sofa sets. The rest of the range is in the category.`}
            viewAllHref="/category/sofa-sets"
            viewAllLabel="View all sofa sets"
          />
          <FeaturedProducts
            products={dining}
            title="Dining Tables"
            subtitle={`${dining.length} dining tables. The rest of the range is in the category.`}
            viewAllHref="/category/dining-table-sets"
            viewAllLabel="View all dining tables"
          />
          <FeaturedProducts
            products={beds}
            title="Beds"
            subtitle={`${beds.length} beds. The rest of the range is in the category.`}
            viewAllHref="/category/beds"
            viewAllLabel="View all beds"
          />
        </>
      )}

      <PromoBanner />

      <LazyWhenVisible minHeight="400px">
        <CategoryBanner />
      </LazyWhenVisible>

      <TopPicks categories={categories} />
      <StatsBanner />

      <CategorySection categories={categories} />
    </div>
  )
}
