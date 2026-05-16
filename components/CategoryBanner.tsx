'use client'

import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

const categories = [
  {
    name: 'Living Room',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    link: '/category/sofa-sets',
    count: '50+ Products',
  },
  {
    name: 'Bedroom',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    link: '/category/beds',
    count: '30+ Products',
  },
  {
    name: 'Dining Room',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    link: '/category/dining-table-sets',
    count: '25+ Products',
  },
  {
    name: 'Office',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    link: '/office',
    count: '40+ Products',
  },
]

export default function CategoryBanner() {
  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Discover our curated collections for every room
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.link}
              className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url(${category.image})`,
                  }}
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-white">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 transform group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-200 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {category.count}
                  </p>
                  <div className="flex items-center text-yellow-400 font-semibold text-sm sm:text-base opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    Shop Now
                    <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 transition-all duration-300 rounded-xl"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

