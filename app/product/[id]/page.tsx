'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { Product } from '@/lib/types'
import { FiShoppingCart, FiHeart, FiShare2 } from 'react-icons/fi'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import Link from 'next/link'
import { getProductImage } from '@/lib/productImage'

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [justAdded, setJustAdded] = useState(false)
  const { addToCart } = useCart()
  const { showToast } = useToast()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiClient.getProduct(params.id)
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link
            href="/"
            className="inline-block bg-primary hover:bg-secondary text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    )
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0
  const productImage = getProductImage(product)

  const handleAddToCart = () => {
    if (!product?.in_stock) {
      showToast('Product is out of stock', 'error')
      return
    }
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
  }

  return (
    <div className="py-4 sm:py-8 pb-36 md:pb-8">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Product Image */}
          <div className="bg-gray-100 rounded-xl sm:rounded-lg aspect-square flex items-center justify-center overflow-hidden -mx-1 sm:mx-0">
            <div
              className="w-full h-full bg-cover bg-center rounded-lg"
              style={{
                backgroundImage: `url(${productImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          </div>

          {/* Product Details */}
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 leading-snug">
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
                ))}
              </div>
              <span className="text-gray-600">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl sm:text-4xl font-bold text-primary">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.original_price && (
                  <>
                    <span className="text-lg sm:text-2xl text-gray-400 line-through">
                      ₹{product.original_price.toLocaleString()}
                    </span>
                    {discount > 0 && (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg font-semibold">
                        -{discount}% OFF
                      </span>
                    )}
                  </>
                )}
              </div>
              {product.original_price && (
                <p className="text-green-600 font-semibold">
                  You save ₹{(product.original_price - product.price).toLocaleString()}!
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              <p className={`font-semibold ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                {product.in_stock ? '✓ In Stock' : '✗ Out of Stock'}
              </p>
            </div>

            {/* Actions — desktop / tablet */}
            <div className="hidden md:flex gap-3 mb-6">
              <button
                type="button"
                disabled={!product.in_stock}
                onClick={handleAddToCart}
                className={`flex-1 min-h-[48px] py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 touch-manipulation ${
                  product.in_stock
                    ? justAdded
                      ? 'bg-green-600 text-white'
                      : 'bg-primary hover:bg-secondary text-white active:scale-[0.99]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FiShoppingCart />
                {product.in_stock ? (justAdded ? 'Added ✓' : 'Add to cart') : 'Out of stock'}
              </button>
              <button
                type="button"
                className="min-h-[48px] min-w-[48px] border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition flex items-center justify-center touch-manipulation"
                aria-label="Wishlist"
              >
                <FiHeart />
              </button>
              <button
                type="button"
                className="min-h-[48px] min-w-[48px] border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition flex items-center justify-center touch-manipulation"
                aria-label="Share"
              >
                <FiShare2 />
              </button>
            </div>

            {/* Features */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl sm:rounded-lg">
              <h3 className="font-semibold mb-3 sm:mb-4">Key features</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Premium Quality Materials</li>
                <li>✓ Free Shipping on orders over ₹20,000</li>
                <li>✓ 1 & 1 Returns Policy</li>
                <li>✓ 24/7 Customer Support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bar — above bottom tab bar */}
      <div
        className="fixed left-0 right-0 z-[38] md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.06)] product-sticky-cta px-3 py-3 flex items-center gap-3"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">Price</p>
          <p className="text-lg font-bold text-primary truncate">₹{product.price.toLocaleString()}</p>
        </div>
        <button
          type="button"
          disabled={!product.in_stock}
          onClick={handleAddToCart}
          className={`shrink-0 min-h-[48px] px-5 rounded-xl font-semibold flex items-center justify-center gap-2 touch-manipulation ${
            product.in_stock
              ? justAdded
                ? 'bg-green-600 text-white'
                : 'bg-primary text-white active:scale-[0.98]'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <FiShoppingCart className="text-lg" />
          {product.in_stock ? (justAdded ? 'Added ✓' : 'Add to cart') : 'Out of stock'}
        </button>
      </div>
    </div>
  )
}

