'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

function tailwindApplied(): boolean {
  if (typeof document === 'undefined') return true
  const el = document.createElement('div')
  el.className = 'text-primary'
  el.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden'
  document.body.appendChild(el)
  const rgb = getComputedStyle(el).color
  el.remove()
  return rgb === 'rgb(139, 69, 19)' || rgb === 'rgb(139,69,19)'
}

/** Client-side guard for App Router navigations and bfcache on mobile Safari. */
export default function CssRecovery() {
  const pathname = usePathname()

  useEffect(() => {
    const recover = () => {
      if (tailwindApplied()) {
        document.documentElement.classList.add('css-ready')
        return
      }

      document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
        const href = link.getAttribute('href')?.split('?')[0]
        if (!href) return
        const fresh = document.createElement('link')
        fresh.rel = 'stylesheet'
        fresh.href = `${href}?v=${Date.now()}`
        document.head.prepend(fresh)
      })

      window.setTimeout(() => {
        if (tailwindApplied()) {
          document.documentElement.classList.add('css-ready')
        } else {
          document.documentElement.classList.remove('css-ready')
        }
      }, 500)
    }

    recover()

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) recover()
    }

    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [pathname])

  return null
}
