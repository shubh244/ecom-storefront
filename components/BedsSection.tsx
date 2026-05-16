'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { Product } from '@/lib/types'
import ProductCard from './ProductCard'

export default function BedsSection() {
  const [beds, setBeds] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBeds = async () => {
      try {
        const products = await apiClient.getProductsByCategory('beds')
        setBeds(products.slice(0, 6))
      } catch (error) {
        console.error('Error fetching beds:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBeds()
  }, [])

  if (loading) {
    return null
  }

  if (beds.length === 0) {
    return null
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Beds</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {beds.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

