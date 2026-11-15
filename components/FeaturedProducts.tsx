'use client'

import { Product } from '@/lib/types'
import ProductCard from './ProductCard'

interface FeaturedProductsProps {
  products?: Product[]
  title?: string
  subtitle?: string
}

export default function FeaturedProducts({
  products = [],
  title = 'Latest products',
  subtitle,
}: FeaturedProductsProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">{title}</h2>
        {subtitle && <p className="text-center text-gray-600 mb-8">{subtitle}</p>}
        {!subtitle && <div className="mb-8" />}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

