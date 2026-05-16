'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import PromoBanner from '@/components/PromoBanner'
import CategoryBanner from '@/components/CategoryBanner'
import StatsBanner from '@/components/StatsBanner'
import CategorySection from '@/components/CategorySection'
import FeaturedProducts from '@/components/FeaturedProducts'
import TopPicks from '@/components/TopPicks'
import BedsSection from '@/components/BedsSection'
import SofaSection from '@/components/SofaSection'
import HotOffers from '@/components/HotOffers'
import { apiClient } from '@/lib/api'
import { Category, Product } from '@/lib/types'

const heroHeightClass =
  'w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] bg-gradient-to-br from-primary/15 via-stone-100 to-secondary/15'

const Hero = dynamic(() => import('@/components/Hero'), {
  ssr: false,
  loading: () => <div className={heroHeightClass} aria-hidden />,
})

function FeaturedSkeleton() {
  return (
    <section className="py-12 bg-gray-50">
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
  const [featuredSettled, setFeaturedSettled] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadFeatured = async () => {
      try {
        const featuredData = await apiClient.getFeaturedProducts()
        if (!cancelled) setFeaturedProducts(featuredData)
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        if (!cancelled) setFeaturedSettled(true)
      }
    }

    const loadCategories = async () => {
      try {
        const categoriesData = await apiClient.getCategories()
        if (!cancelled) setCategories(categoriesData)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    void loadFeatured()
    void loadCategories()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="overflow-x-hidden">
      {featuredSettled ? <Hero /> : <div className={heroHeightClass} aria-hidden />}

      {!featuredSettled ? <FeaturedSkeleton /> : <FeaturedProducts products={featuredProducts} />}

      <PromoBanner />
      <HotOffers />
      <CategoryBanner />
      <TopPicks categories={categories} />
      <StatsBanner />
      <BedsSection />
      <SofaSection />
      <CategorySection categories={categories} />
    </div>
  )
}
