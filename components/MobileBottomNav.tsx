'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FiHome, FiGrid, FiSearch, FiShoppingBag, FiPhone, FiX } from 'react-icons/fi'
import { categories } from '@/lib/data'
import { useCart } from '@/context/CartContext'
import { categorySlugFromName } from '@/lib/categorySlug'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { getTotalItems } = useCart()
  const [catOpen, setCatOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [q, setQ] = useState('')

  if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/checkout')) {
    return null
  }

  const openCart = () => {
    window.dispatchEvent(new CustomEvent('open-cart'))
  }

  const runSearch = () => {
    const term = q.trim()
    setSearchOpen(false)
    setQ('')
    if (!term) return
    const lower = term.toLowerCase()
    if (lower.includes('bed')) {
      router.push('/category/beds')
      return
    }
    if (lower.includes('sofa')) {
      router.push('/category/sofa-sets')
      return
    }
    router.push(`/search/results?q=${encodeURIComponent(term)}`)
  }

  const itemClass = (active: boolean) =>
    `flex flex-col items-center justify-center flex-1 min-h-[3.25rem] gap-0.5 rounded-xl transition-transform active:scale-95 touch-manipulation ${
      active ? 'text-primary' : 'text-gray-600'
    }`

  return (
    <>
      {catOpen && (
        <div className="fixed inset-0 z-[45] md:hidden flex flex-col justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Close categories"
            onClick={() => setCatOpen(false)}
          />
          <div
            className="relative bg-white rounded-t-3xl shadow-2xl max-h-[88dvh] flex flex-col animate-slide-up border-t border-gray-100"
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          >
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-gray-300 shrink-0" aria-hidden />
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Shop by category</h2>
              <button
                type="button"
                onClick={() => setCatOpen(false)}
                className="p-2.5 rounded-full bg-gray-100 text-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            <ul className="overflow-y-auto overscroll-contain px-3 py-2 space-y-0.5">
              {categories.map((c) => (
                <li key={c.name}>
                  <Link
                    href={`/category/${categorySlugFromName(c.name)}`}
                    onClick={() => setCatOpen(false)}
                    className="block py-3.5 px-4 rounded-xl text-base font-medium text-gray-800 active:bg-primary/10 min-h-[48px] flex items-center"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-[45] md:hidden flex flex-col justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
          />
          <div
            className="relative bg-white rounded-t-3xl p-4 shadow-2xl animate-slide-up border-t border-gray-100"
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-300" aria-hidden />
            <h2 className="text-lg font-bold text-gray-900 mb-3">Search products</h2>
            <div className="flex gap-2">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runSearch()}
                placeholder="Beds, sofas, dining…"
                className="flex-1 min-h-[48px] px-4 rounded-xl border border-gray-200 text-base focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={runSearch}
                className="min-h-[48px] min-w-[48px] rounded-xl bg-primary text-white flex items-center justify-center px-4 font-semibold active:scale-95 touch-manipulation"
                aria-label="Search"
              >
                <FiSearch className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      )}

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-gray-200/80 bg-white/95 backdrop-blur-lg shadow-[0_-8px_32px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: 'max(0.35rem, env(safe-area-inset-bottom))' }}
        aria-label="Mobile app navigation"
      >
        <div className="flex items-stretch justify-around pt-1 max-w-lg mx-auto">
          <Link href="/" className={itemClass(pathname === '/')}>
            <FiHome className="text-xl" />
            <span className="text-[10px] font-semibold tracking-wide">Home</span>
          </Link>
          <button
            type="button"
            className={itemClass(catOpen)}
            onClick={() => {
              setSearchOpen(false)
              setCatOpen((o) => !o)
            }}
          >
            <FiGrid className="text-xl" />
            <span className="text-[10px] font-semibold tracking-wide">Browse</span>
          </button>
          <button
            type="button"
            className={itemClass(searchOpen)}
            onClick={() => {
              setCatOpen(false)
              setSearchOpen((o) => !o)
            }}
          >
            <FiSearch className="text-xl" />
            <span className="text-[10px] font-semibold tracking-wide">Search</span>
          </button>
          <button type="button" className={itemClass(false)} onClick={openCart}>
            <span className="relative inline-flex">
              <FiShoppingBag className="text-xl" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[1.125rem] h-[1.125rem] px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {getTotalItems() > 9 ? '9+' : getTotalItems()}
                </span>
              )}
            </span>
            <span className="text-[10px] font-semibold tracking-wide">Cart</span>
          </button>
          <Link href="/contact" className={itemClass(pathname === '/contact')}>
            <FiPhone className="text-xl" />
            <span className="text-[10px] font-semibold tracking-wide">Contact</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
