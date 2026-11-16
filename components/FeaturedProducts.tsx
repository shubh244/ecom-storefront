'use client'

import Link from 'next/link'
import { Product } from '@/lib/types'
import ProductCard from './ProductCard'

interface FeaturedProductsProps {
  products?: Product[]
  title?: string
  subtitle?: string
  viewAllHref?: string
  viewAllLabel?: string
}

export default function FeaturedProducts({
  products = [],
  title = 'Latest products',
  subtitle,
  viewAllHref,
  viewAllLabel = 'View all',
}: FeaturedProductsProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">{title}</h2>
          {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
          {viewAllHref && (
            <Link href={viewAllHref} className="inline-block mt-3 font-semibold text-primary hover:underline">
              {viewAllLabel}
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
