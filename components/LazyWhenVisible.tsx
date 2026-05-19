'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

type LazyWhenVisibleProps = {
  children: ReactNode
  /** Placeholder while waiting to scroll into view */
  fallback?: ReactNode
  rootMargin?: string
  minHeight?: string
}

/**
 * Mounts children only when near the viewport — defers API calls and heavy subtrees.
 */
export default function LazyWhenVisible({
  children,
  fallback = null,
  rootMargin = '200px 0px',
  minHeight,
}: LazyWhenVisibleProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || visible) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold: 0.01 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [visible, rootMargin])

  return (
    <div ref={ref} style={minHeight ? { minHeight } : undefined}>
      {visible ? children : fallback}
    </div>
  )
}
