/** Smaller Unsplash URLs for faster LCP (WebP, capped width). */
export function unsplash(url: string, width = 1200): string {
  try {
    const u = new URL(url)
    u.searchParams.set('w', String(width))
    u.searchParams.set('q', '70')
    u.searchParams.set('auto', 'format')
    u.searchParams.set('fm', 'webp')
    return u.toString()
  } catch {
    return url
  }
}
