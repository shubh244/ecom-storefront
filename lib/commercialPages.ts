import type { Metadata } from 'next'
import { SITE_NAME, getSiteUrl, siteSeo } from '@/lib/site'

export const COMMERCIAL_ROUTES = [
  'office',
  'outdoor',
  'restaurant-hotel',
  'banquet',
  'school',
  'hospital',
  'customize',
] as const

export type CommercialRoute = (typeof COMMERCIAL_ROUTES)[number]

const heroQ = 'auto=format&fit=crop&w=1600&q=80'

type PageDef = {
  slug: CommercialRoute
  title: string
  headline: string
  description: string
  /** Wide hero photo for the section (Unsplash) */
  heroImage: string
}

const PAGES: Record<CommercialRoute, PageDef> = {
  office: {
    slug: 'office',
    title: 'Office Furniture',
    headline: 'Office furniture for productive workspaces',
    description:
      'Executive desks, ergonomic chairs, conference tables and storage — ideal for offices in Delhi NCR and Pan India projects.',
    heroImage: `https://images.unsplash.com/photo-1497366216548-37526070297c?${heroQ}`,
  },
  outdoor: {
    slug: 'outdoor',
    title: 'Outdoor Furniture',
    headline: 'Outdoor & patio furniture',
    description:
      'Weather-resistant sofas, dining sets and loungers for balconies, terraces and gardens.',
    heroImage: `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?${heroQ}`,
  },
  'restaurant-hotel': {
    slug: 'restaurant-hotel',
    title: 'Restaurant & Hotel Furniture',
    headline: 'Commercial dining & lobby furniture',
    description:
      'Durable chairs, tables and seating for restaurants, cafés and hotel lobbies.',
    heroImage: `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?${heroQ}`,
  },
  banquet: {
    slug: 'banquet',
    title: 'Banquet Furniture',
    headline: 'Banquet & event furniture',
    description:
      'Folding tables, stackable chairs and round banquet setups for halls and celebrations.',
    heroImage: `https://images.unsplash.com/photo-1464366400600-7161149a31f0?${heroQ}`,
  },
  school: {
    slug: 'school',
    title: 'School Furniture',
    headline: 'School & classroom furniture',
    description:
      'Student desks, library tables and lab seating for schools and institutions.',
    heroImage: `https://images.unsplash.com/photo-1509062522246-375597792107?${heroQ}`,
  },
  hospital: {
    slug: 'hospital',
    title: 'Hospital Furniture',
    headline: 'Healthcare & waiting area furniture',
    description:
      'Patient beds, waiting benches and storage suited for clinics and hospitals.',
    heroImage: `https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?${heroQ}`,
  },
  customize: {
    slug: 'customize',
    title: 'Custom & Bespoke Furniture',
    headline: 'Made-to-order furniture',
    description:
      'Custom wardrobes, dining tables and TV units — designed to your space and finish at our workshop.',
    heroImage: `https://images.unsplash.com/photo-1615876234886-fd9a39fb94f3?${heroQ}`,
  },
}

export function getCommercialPage(route: CommercialRoute): PageDef {
  return PAGES[route]
}

export function commercialMetadata(route: CommercialRoute): Metadata {
  const p = PAGES[route]
  const siteUrl = getSiteUrl()
  const path = `/${route}`
  const desc = `${p.description} Shop ${p.title} from ${SITE_NAME} with delivery across India.`
  return {
    title: `${p.title} | ${SITE_NAME}`,
    description: desc,
    keywords: [...siteSeo.keywords, p.title, `${p.title} Delhi`, 'commercial furniture India'],
    alternates: { canonical: `${siteUrl}${path}` },
    openGraph: {
      title: `${p.title} | ${SITE_NAME}`,
      description: desc,
      url: `${siteUrl}${path}`,
      siteName: SITE_NAME,
      locale: 'en_IN',
      images: [{ url: p.heroImage, alt: p.title }],
    },
  }
}
