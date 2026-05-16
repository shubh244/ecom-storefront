import type { MetadataRoute } from 'next'
import { SITE_NAME, siteSeo, getOgImageUrl } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  const iconSrc = getOgImageUrl()
  const isSvg = iconSrc.endsWith('.svg')

  return {
    name: SITE_NAME,
    short_name: 'SJB Wood',
    description: siteSeo.defaultDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#8B4513',
    orientation: 'portrait-primary',
    categories: ['shopping', 'furniture'],
    icons: [
      {
        src: iconSrc,
        sizes: isSvg ? 'any' : '192x192',
        type: isSvg ? 'image/svg+xml' : 'image/png',
        purpose: 'any',
      },
    ],
  }
}
