import type { Metadata } from 'next'
import { SITE_NAME, siteSeo, getOgImageUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Hot Offers',
  description: `Limited-time deals and discounts on premium furniture — ${SITE_NAME}.`,
  openGraph: {
    title: `Hot Offers | ${SITE_NAME}`,
    description: siteSeo.defaultDescription,
    images: [{ url: getOgImageUrl(), width: 512, height: 512, alt: SITE_NAME }],
  },
}

export default function HotOffersLayout({ children }: { children: React.ReactNode }) {
  return children
}
