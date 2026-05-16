'use client'

import { Product } from '@/lib/types'
import { FiHeart, FiEye, FiShoppingCart } from 'react-icons/fi'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import Link from 'next/link'
import { getProductImage } from '@/lib/productImage'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const productImage = getProductImage(product)

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  const handleAddToCart = async () => {
    if (product.in_stock) {
      addToCart({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        originalPrice: product.original_price,
        image: productImage,
        category: product.category?.name || '',
        subcategory: product.subcategory,
        rating: product.rating,
        reviews: product.reviews,
        inStock: product.in_stock,
        description: product.description,
      })
      setJustAdded(true)
      window.setTimeout(() => setJustAdded(false), 1500)
    } else {
      showToast('Product is out of stock', 'error')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group">
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Link href={`/product/${product.id}`}>
          <div
            className="w-full h-full bg-cover bg-center group-hover:scale-110 transition duration-300 cursor-pointer"
            style={{
              backgroundImage: `url(${productImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
          </div>
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.hot_offer && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold animate-pulse">
              🔥 Hot Offer {product.offer_percentage}% OFF
            </span>
          )}
          {!product.hot_offer && product.original_price && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Sale
            </span>
          )}
          {!product.in_stock && (
            <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick Actions — always on touch; hover on desktop */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full bg-white/95 shadow-md hover:bg-primary hover:text-white transition touch-manipulation ${
              isWishlisted ? 'bg-primary text-white' : ''
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart />
          </button>
          <Link
            href={`/product/${product.id}`}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full bg-white/95 shadow-md hover:bg-primary hover:text-white transition touch-manipulation"
            aria-label="View product"
          >
            <FiEye />
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
          {product.original_price && (
            <>
              <span className="text-lg text-gray-400 line-through">
                ₹{product.original_price.toLocaleString()}
              </span>
              {discount > 0 && (
                <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                  -{discount}%
                </span>
              )}
            </>
          )}
        </div>

        {/* Add to Cart */}
        <button
          type="button"
          disabled={!product.in_stock}
          onClick={handleAddToCart}
          className={`w-full min-h-[48px] py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 touch-manipulation ${
            product.in_stock
              ? justAdded
                ? 'bg-green-600 text-white'
                : 'bg-primary hover:bg-secondary text-white active:scale-[0.98]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <FiShoppingCart />
          {product.in_stock ? (justAdded ? 'Added ✓' : 'Add to Cart') : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}
