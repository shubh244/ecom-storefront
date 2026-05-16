'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { Product } from '@/lib/types'
import ProductCard from './ProductCard'

export default function SofaSection() {
  const [sofas, setSofas] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSofas = async () => {
      try {
        const products = await apiClient.getProductsByCategory('sofa-sets')
        setSofas(products.slice(0, 6))
      } catch (error) {
        console.error('Error fetching sofas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSofas()
  }, [])

  if (loading) {
    return null
  }

  if (sofas.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Sofa Sets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {sofas.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

