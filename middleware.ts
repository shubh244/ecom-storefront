import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** Paths that must keep long cache (hashed build assets). */
function isImmutableAsset(pathname: string): boolean {
  return (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    /\.(?:css|js|mjs|map|png|jpe?g|gif|webp|svg|ico|woff2?|ttf|eot|txt|xml|json|webmanifest)$/i.test(
      pathname
    )
  )
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const { pathname } = request.nextUrl

  // Homepage is aggressively CDN-cached on Hostinger; force revalidation.
  if (pathname === '/' || pathname === '') {
    response.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate')
    response.headers.set('CDN-Cache-Control', 'no-store')
    response.headers.set('Surrogate-Control', 'no-store')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  if (!isImmutableAsset(pathname)) {
    // Prevent CDN from serving year-old HTML that points at deleted CSS chunks after deploy.
    response.headers.set(
      'Cache-Control',
      'private, no-cache, no-store, max-age=0, must-revalidate, proxy-revalidate'
    )
    response.headers.set('CDN-Cache-Control', 'no-store')
    response.headers.set('Surrogate-Control', 'no-store')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Vary', 'Accept-Encoding, Cookie')
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
