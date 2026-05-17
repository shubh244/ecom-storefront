'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FiMenu, FiX, FiShoppingCart, FiUser, FiHeart, FiSearch } from 'react-icons/fi'
import { categories } from '@/lib/data'
import { SITE_NAME } from '@/lib/site'
import BrandLogo from '@/components/BrandLogo'
import { useCart } from '@/context/CartContext'
import CartModal from './CartModal'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCartNotice, setShowCartNotice] = useState(false)
  const { getTotalItems } = useCart()
  const router = useRouter()
  const totalItems = getTotalItems()
  const prevItemsRef = useRef<number>(totalItems)
  const hydratedRef = useRef(false)

  const categorySearchMap: Record<string, string> = {
    'Beds': 'bed',
    'Sofa Sets': 'sofa',
    'Dining Table Sets': 'dining table',
    'TV Units': 'tv unit',
    'Book Shelves': 'bookshelf',
    'Coffee Tables': 'coffee table',
    'Study Tables': 'study table',
    'Home Decor': 'decor',
  }

  const handleSearch = () => {
    const term = searchTerm.trim()
    if (!term) return

    const lower = term.toLowerCase()

    // Simple mapping for common categories
    if (lower.includes('bed')) {
      router.push('/category/beds')
      return
    }
    if (lower.includes('sofa')) {
      router.push('/category/sofa-sets')
      return
    }

    // Generic search results page
    router.push(`/search/results?q=${encodeURIComponent(term)}`)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  useEffect(() => {
    const onOpenCart = () => setIsCartOpen(true)
    window.addEventListener('open-cart', onOpenCart)
    return () => window.removeEventListener('open-cart', onOpenCart)
  }, [])

  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true
      prevItemsRef.current = totalItems
      return
    }

    if (totalItems > prevItemsRef.current) {
      setShowCartNotice(true)
      const timer = setTimeout(() => setShowCartNotice(false), 1800)
      prevItemsRef.current = totalItems
      return () => clearTimeout(timer)
    }

    prevItemsRef.current = totalItems
  }, [totalItems])

  return (
    <header
      className="bg-white shadow-md sticky top-0 z-50 supports-[padding:max(0px)]:pt-[max(0px,env(safe-area-inset-top))]"
    >
      {/* Top Bar — compact on phones (bottom nav covers primary actions) */}
      <div className="hidden sm:block bg-gray-800 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>INR</span>
            <span>USD</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="hover:text-yellow-400">Login</a>
            <a href="/register" className="hover:text-yellow-400">Register</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-3 sm:px-4 py-2.5 md:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              type="button"
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-2xl rounded-xl active:bg-gray-100 touch-manipulation"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
            <a href="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
              <BrandLogo size="header" priority />
              <span className="text-lg sm:text-2xl font-bold text-primary hidden md:block truncate max-w-[10rem] lg:max-w-none">
                {SITE_NAME}
              </span>
            </a>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSearch}
                className="absolute right-0 top-0 h-full px-4 bg-primary text-white rounded-r-lg hover:bg-secondary"
              >
                <FiSearch />
              </button>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
            <button
              type="button"
              className="relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:text-primary active:bg-gray-50 touch-manipulation hidden sm:flex"
              aria-label="Wishlist"
            >
              <FiHeart className="text-xl" />
            </button>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:text-primary active:bg-gray-50 touch-manipulation"
              aria-label={`Shopping cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}
            >
              <FiShoppingCart className="text-xl" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[1.125rem] h-[1.125rem] px-0.5 flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
              {showCartNotice && (
                <span className="hidden sm:block absolute -right-2 -bottom-8 whitespace-nowrap bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md animate-slide-up">
                  Added to cart
                </span>
              )}
            </button>
            <button
              type="button"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:text-primary active:bg-gray-50 touch-manipulation hidden sm:flex"
              aria-label="Account"
            >
              <FiUser className="text-xl" />
            </button>
          </div>
        </div>

        {/* Mobile Search — optional quick search; full search also in bottom bar */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <input
              type="search"
              placeholder="Quick search…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full min-h-[44px] px-4 py-2.5 pr-12 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary"
              enterKeyHint="search"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-primary"
              aria-label="Search"
            >
              <FiSearch className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation — desktop / large tablet only (mobile uses bottom app bar) */}
      <nav className="hidden lg:block bg-gray-100 border-t">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <div className="relative">
              <button
                className="px-6 py-3 bg-primary text-white font-semibold hover:bg-secondary flex items-center gap-2"
                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                <FiMenu className="text-xl" />
                <span>All Categories</span>
              </button>
              
              {/* Category Dropdown */}
              {isCategoryMenuOpen && (
                <div
                  className="absolute top-full left-0 bg-white shadow-lg w-64 max-h-[600px] overflow-y-auto"
                  onMouseEnter={() => setIsCategoryMenuOpen(true)}
                  onMouseLeave={() => setIsCategoryMenuOpen(false)}
                >
                  {categories.map((category) => (
                    <div key={category.name} className="border-b">
                      <a
                        href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-4 py-3 hover:bg-gray-100 font-semibold"
                      >
                        {category.name}
                      </a>
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="bg-gray-50">
                          {category.subcategories.map((sub) => {
                            const baseQuery = categorySearchMap[category.name] || category.name
                            return (
                              <a
                                key={sub}
                                href={`/search/results?q=${encodeURIComponent(baseQuery)}`}
                                className="block px-6 py-2 text-sm hover:bg-gray-200"
                              >
                                {sub}
                              </a>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-6 ml-6">
              <a href="/" className="py-3 hover:text-primary font-medium">Home</a>
              <a href="/office" className="py-3 hover:text-primary font-medium">Office</a>
              <a href="/outdoor" className="py-3 hover:text-primary font-medium">Outdoor</a>
              <a href="/restaurant-hotel" className="py-3 hover:text-primary font-medium">Restaurant/Hotel</a>
              <a href="/banquet" className="py-3 hover:text-primary font-medium">Banquet</a>
              <a href="/school" className="py-3 hover:text-primary font-medium">School</a>
              <a href="/hospital" className="py-3 hover:text-primary font-medium">Hospital</a>
              <a href="/customize" className="py-3 hover:text-primary font-medium">Customize</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t max-h-[min(70dvh,28rem)] overflow-y-auto overscroll-contain">
          <div className="container mx-auto px-4 py-2">
            <a href="/" className="block min-h-[48px] flex items-center py-2 text-base font-medium border-b border-gray-100 active:bg-gray-50 rounded-lg px-1">
              Home
            </a>
            <a href="/office" className="block min-h-[48px] flex items-center py-2 text-base font-medium border-b border-gray-100 active:bg-gray-50 rounded-lg px-1">
              Office
            </a>
            <a href="/outdoor" className="block min-h-[48px] flex items-center py-2 text-base font-medium border-b border-gray-100 active:bg-gray-50 rounded-lg px-1">
              Outdoor
            </a>
            <a href="/restaurant-hotel" className="block min-h-[48px] flex items-center py-2 text-base font-medium border-b border-gray-100 active:bg-gray-50 rounded-lg px-1">
              Restaurant/Hotel
            </a>
            <a href="/banquet" className="block min-h-[48px] flex items-center py-2 text-base font-medium border-b border-gray-100 active:bg-gray-50 rounded-lg px-1">
              Banquet
            </a>
            <a href="/school" className="block min-h-[48px] flex items-center py-2 text-base font-medium border-b border-gray-100 active:bg-gray-50 rounded-lg px-1">
              School
            </a>
            <a href="/hospital" className="block min-h-[48px] flex items-center py-2 text-base font-medium border-b border-gray-100 active:bg-gray-50 rounded-lg px-1">
              Hospital
            </a>
            <a href="/customize" className="block min-h-[48px] flex items-center py-2 text-base font-medium active:bg-gray-50 rounded-lg px-1">
              Customize
            </a>
          </div>
        </div>
      )}

      {/* Support Bar */}
      <div className="bg-primary text-white py-1.5 sm:py-2">
        <div className="container mx-auto px-3 sm:px-4 flex items-center justify-center gap-2 sm:gap-4 flex-wrap text-xs sm:text-sm">
          <span className="font-semibold">Support 24/7</span>
          <span>|</span>
          <a href="tel:7982674272" className="hover:text-yellow-400">7982674272</a>
          <span>|</span>
          <a href="tel:8467082350" className="hover:text-yellow-400">8467082350</a>
          <span>|</span>
          <a href="tel:9760232667" className="hover:text-yellow-400">9760232667</a>
        </div>
      </div>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}

