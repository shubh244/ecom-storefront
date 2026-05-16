import { Category } from '@/lib/types'
import Link from 'next/link'

interface TopPicksProps {
  categories?: Category[]
}

export default function TopPicks({ categories = [] }: TopPicksProps) {
  const topCategories = categories.slice(0, 8)

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Top Picks For You</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {topCategories.map((category) => (
            <Link
              key={category.name}
              href={`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition text-center group"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center group-hover:bg-primary transition">
                <span className="text-2xl">🪑</span>
              </div>
              <h3 className="font-semibold text-sm group-hover:text-primary transition">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

