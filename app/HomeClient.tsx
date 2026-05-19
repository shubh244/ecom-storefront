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
const HotOffers = dynamic(() => import('@/components/HotOffers'), { ssr: false })
const BedsSection = dynamic(() => import('@/components/BedsSection'), { ssr: false })
const SofaSection = dynamic(() => import('@/components/SofaSection'), { ssr: false })

function FeaturedSkeleton() {
  return (
    <section className="py-12 bg-gray-50" aria-busy="true" aria-label="Loading featured products">
      <div className="container mx-auto px-4">
        <div className="h-9 max-w-xs bg-gray-200 rounded mx-auto mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
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
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [featuredLoading, setFeaturedLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const [featuredData, categoriesData] = await Promise.all([
          apiClient.getFeaturedProducts(),
          apiClient.getCategories(),
        ])
        if (!cancelled) {
          setFeaturedProducts(featuredData)
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
        <FeaturedProducts products={featuredProducts} />
      )}

      <PromoBanner />

      <LazyWhenVisible minHeight="320px">
        <HotOffers />
      </LazyWhenVisible>

      <LazyWhenVisible minHeight="400px">
        <CategoryBanner />
      </LazyWhenVisible>

      <TopPicks categories={categories} />
      <StatsBanner />

      <LazyWhenVisible minHeight="280px">
        <BedsSection />
      </LazyWhenVisible>

      <LazyWhenVisible minHeight="280px">
        <SofaSection />
      </LazyWhenVisible>

      <CategorySection categories={categories} />
    </div>
  )
}
