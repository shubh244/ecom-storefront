'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/api'
import { Product } from '@/lib/types'
import ProductCard from '@/components/ProductCard'
import type { CommercialRoute } from '@/lib/commercialPages'
import { getCommercialPage } from '@/lib/commercialPages'

type Props = {
  slug: CommercialRoute
}

export default function CommercialSectionPage({ slug }: Props) {
  const { headline, description, heroImage } = getCommercialPage(slug)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await apiClient.getProductsByCategory(slug)
        if (!cancelled) setProducts(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error(e)
        if (!cancelled) setProducts([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [slug])

  return (
    <div className="py-6 sm:py-10">
      <div className="container mx-auto px-3 sm:px-4">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">{headline}</span>
        </nav>

        <div
          className="relative overflow-hidden rounded-2xl mb-8 sm:mb-10 shadow-lg min-h-[200px] sm:min-h-[260px]"
          style={{
            backgroundImage: `linear-gradient(105deg, rgba(62,39,35,0.92) 0%, rgba(139,69,19,0.78) 45%, rgba(210,105,30,0.55) 100%), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative p-6 sm:p-10 text-white">
            <h1 className="text-2xl sm:text-4xl font-bold mb-3 leading-tight drop-shadow-sm">
              {headline}
            </h1>
            <p className="text-white/95 text-sm sm:text-lg max-w-3xl leading-relaxed drop-shadow-sm">
              {description}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-600 text-lg mb-4">No products in this section yet.</p>
            <p className="text-sm text-gray-500 mb-6">
              Please try again after the catalogue syncs, or browse all categories.
            </p>
            <Link
              href="/"
              className="inline-block min-h-[48px] px-6 leading-[48px] bg-primary text-white rounded-xl font-semibold hover:bg-secondary transition"
            >
              Back to home
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Showing <span className="font-semibold text-gray-900">{products.length}</span> products
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
