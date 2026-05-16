import type { Metadata } from 'next'
import { SITE_NAME, siteSeo, getOgImageUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Categories',
  description: `Shop furniture by category — ${SITE_NAME}.`,
  openGraph: {
    title: `Categories | ${SITE_NAME}`,
    description: siteSeo.defaultDescription,
    images: [{ url: getOgImageUrl(), width: 512, height: 512, alt: SITE_NAME }],
  },
}

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return children
}
