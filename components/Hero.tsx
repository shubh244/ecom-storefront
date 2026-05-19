'use client'

import { useState, useEffect, useMemo } from 'react'
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi'
import Link from 'next/link'
import { unsplash } from '@/lib/unsplash'

const slideDefs = [
  {
    title: 'Premium Wooden Furniture — Delhi & Pan India',
    subtitle: 'Shreejee Blessings Wood',
    description:
      'Shop online or visit our Delhi NCR showrooms. Fast, reliable delivery across India — beds, sofas, dining & more.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
    cta: 'Shop Now',
    ctaLink: '/shop',
    badge: 'New Arrivals',
    discount: 'Up to 70% OFF',
  },
  {
    title: 'Modern Design Meets Comfort',
    subtitle: 'Stylish Furniture for Every Room',
    description: 'Create your dream home with our curated collection of premium furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
    cta: 'Explore Collection',
    ctaLink: '/categories',
    badge: 'Best Sellers',
    discount: 'Free Shipping',
  },
  {
    title: 'Exclusive Hot Deals',
    subtitle: "Limited Time Offers - Don't Miss Out!",
    description: 'Get the best prices on premium furniture with our special promotions',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304',
    cta: 'View Offers',
    ctaLink: '/hot-offers',
    badge: 'Hot Sale',
    discount: 'Save Big Today',
  },
] as const

export default function Hero() {
  const slides = useMemo(
    () =>
      slideDefs.map((s, i) => ({
        ...s,
        image: unsplash(s.image, i === 0 ? 1280 : 960),
      })),
    []
  )

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, slides.length])

  useEffect(() => {
    const prefetchRest = () => {
      for (let i = 1; i < slides.length; i++) {
        const img = new Image()
        img.src = slides[i].image
      }
    }
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(prefetchRest)
      return () => window.cancelIdleCallback(id)
    }
    const t = setTimeout(prefetchRest, 1500)
    return () => clearTimeout(t)
  }, [slides])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length)
  }

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length)
  }

  const slide = slides[currentSlide]

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden group">
      <div className="absolute inset-0 z-10 transition-opacity duration-1000 ease-in-out">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%), url(${slide.image})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 animate-gradient-shift" />
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl lg:max-w-3xl">
              <div className="mb-4 sm:mb-6 animate-fade-in-up" key={`badge-${currentSlide}`}>
                <span className="inline-block bg-red-500 text-white px-4 py-2 rounded-full text-sm sm:text-base font-bold shadow-lg animate-pulse">
                  🔥 {slide.badge}
                </span>
                {slide.discount && (
                  <span className="ml-3 inline-block bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm sm:text-base font-bold shadow-lg">
                    {slide.discount}
                  </span>
                )}
              </div>

              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 leading-tight animate-fade-in-up animation-delay-200"
                key={`title-${currentSlide}`}
              >
                {slide.title}
              </h1>

              <h2
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-yellow-300 mb-3 sm:mb-4 font-semibold animate-fade-in-up animation-delay-400"
                key={`sub-${currentSlide}`}
              >
                {slide.subtitle}
              </h2>

              <p
                className="text-sm sm:text-base md:text-lg text-gray-200 mb-6 sm:mb-8 max-w-xl leading-relaxed animate-fade-in-up animation-delay-600"
                key={`desc-${currentSlide}`}
              >
                {slide.description}
              </p>

              <div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up animation-delay-800"
                key={`cta-${currentSlide}`}
              >
                <Link
                  href={slide.ctaLink}
                  className="group/btn inline-flex items-center justify-center bg-primary hover:bg-secondary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
                >
                  {slide.cta}
                  <FiArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105"
                >
                  Browse All
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2 sm:p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 transform hover:scale-110"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="text-xl sm:text-2xl" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2 sm:p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 transform hover:scale-110"
        aria-label="Next slide"
      >
        <FiChevronRight className="text-xl sm:text-2xl" />
      </button>

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'bg-white w-8 sm:w-10 h-3 sm:h-4 shadow-lg'
                : 'bg-white/50 w-3 sm:w-4 h-3 sm:h-4 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-8 sm:bottom-12 right-4 sm:right-8 z-20 hidden md:block animate-bounce">
        <div className="flex flex-col items-center text-white/80">
          <span className="text-xs mb-2">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-scroll" />
          </div>
        </div>
      </div>
    </div>
  )
}
