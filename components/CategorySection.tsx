'use client'

import { Category } from '@/lib/types'
import Link from 'next/link'

interface CategorySectionProps {
  categories?: Category[]
}

export default function CategorySection({ categories = [] }: CategorySectionProps) {
  if (categories.length === 0) {
    return null
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition"
            >
              <div className="aspect-video bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                {category.image ? (
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl">🪑</span>
                )}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center">
                <h3 className="text-white text-xl font-bold opacity-0 group-hover:opacity-100 transition">
                  {category.name}
                </h3>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-lg group-hover:text-primary transition">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {category.subcategories?.length || 0} subcategories
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

