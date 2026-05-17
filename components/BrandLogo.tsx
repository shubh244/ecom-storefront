'use client'

import { useMemo, useState } from 'react'
import { getLogoCandidates, SITE_NAME } from '@/lib/site'

const sizeClasses = {
  header: 'h-14 w-auto sm:h-16 md:h-[4.25rem] max-h-20',
  hero: 'h-36 w-auto sm:h-48 md:h-56 lg:h-64 max-w-[min(100%,28rem)]',
  splash: 'h-44 w-auto sm:h-56 md:h-72 lg:h-80 max-w-[min(100%,32rem)]',
} as const

type BrandLogoProps = {
  size?: keyof typeof sizeClasses
  className?: string
  priority?: boolean
  showName?: boolean
}

export default function BrandLogo({
  size = 'header',
  className = '',
  priority = false,
  showName = false,
}: BrandLogoProps) {
  const candidates = useMemo(() => getLogoCandidates(), [])
  const [index, setIndex] = useState(0)
  const src = candidates[index] ?? '/brand-mark.svg'

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <img
        src={src}
        alt={`${SITE_NAME} logo`}
        className={`${sizeClasses[size]} object-contain bg-transparent drop-shadow-sm`}
        width={size === 'splash' ? 320 : size === 'hero' ? 256 : 180}
        height={size === 'splash' ? 320 : size === 'hero' ? 256 : 72}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onError={() => setIndex((i) => (i + 1 < candidates.length ? i + 1 : i))}
      />
      {showName ? (
        <span className="text-primary font-bold text-center text-lg sm:text-2xl tracking-tight">
          {SITE_NAME}
        </span>
      ) : null}
    </div>
  )
}
