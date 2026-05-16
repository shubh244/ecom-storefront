'use client'

import Link from 'next/link'
import { FiArrowRight, FiTruck, FiShield, FiGift } from 'react-icons/fi'

export default function PromoBanner() {
  const banners = [
    {
      title: 'Free Shipping',
      subtitle: 'On orders over ₹20,000',
      icon: FiTruck,
      color: 'from-blue-500 to-blue-600',
      link: '/shipping',
    },
    {
      title: 'Secure Payment',
      subtitle: '100% Safe & Secure',
      icon: FiShield,
      color: 'from-green-500 to-green-600',
      link: '/payment',
    },
    {
      title: 'Special Offers',
      subtitle: 'Up to 70% OFF',
      icon: FiGift,
      color: 'from-red-500 to-red-600',
      link: '/hot-offers',
    },
  ]

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {banners.map((banner, index) => {
            const Icon = banner.icon
            return (
              <Link
                key={index}
                href={banner.link}
                className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 sm:p-8"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${banner.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 sm:p-4 rounded-lg bg-gradient-to-br ${banner.color} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="text-2xl sm:text-3xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors">
                        {banner.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {banner.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-primary font-semibold text-sm sm:text-base mt-4 group-hover:translate-x-2 transition-transform">
                    Learn More
                    <FiArrowRight className="ml-2" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

