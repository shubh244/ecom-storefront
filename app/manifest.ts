import type { MetadataRoute } from 'next'
import { SITE_NAME, siteSeo, getSiteUrl } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  const site = getSiteUrl()

  return {
    id: '/',
    name: SITE_NAME,
    short_name: 'SJB Wood',
    description: siteSeo.defaultDescription,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui', 'browser'],
    background_color: '#ffffff',
    theme_color: '#8B4513',
    orientation: 'portrait-primary',
    categories: ['shopping', 'furniture'],
    lang: 'en-IN',
    dir: 'ltr',
    icons: [
      {
        src: `${site}/icons/icon-192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `${site}/icons/icon-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `${site}/icons/icon-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
