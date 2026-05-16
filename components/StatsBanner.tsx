'use client'

import { FiUsers, FiPackage, FiAward, FiHeart } from 'react-icons/fi'

const stats = [
  {
    icon: FiUsers,
    number: '10K+',
    label: 'Happy Customers',
    color: 'text-blue-500',
  },
  {
    icon: FiPackage,
    number: '500+',
    label: 'Products',
    color: 'text-green-500',
  },
  {
    icon: FiAward,
    number: '15+',
    label: 'Years Experience',
    color: 'text-yellow-500',
  },
  {
    icon: FiHeart,
    number: '98%',
    label: 'Satisfaction Rate',
    color: 'text-red-500',
  },
]

export default function StatsBanner() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-r from-primary via-secondary to-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4 group-hover:bg-white/30 transition-all duration-300 transform group-hover:scale-110">
                  <Icon className={`text-3xl sm:text-4xl ${stat.color}`} />
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base md:text-lg text-white/90 font-medium">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

