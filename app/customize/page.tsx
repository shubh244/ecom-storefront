import type { Metadata } from 'next'
import CommercialSectionPage from '@/components/CommercialSectionPage'
import { commercialMetadata } from '@/lib/commercialPages'

const key = 'customize'
export const metadata: Metadata = commercialMetadata(key)

export default function CustomizePage() {
  return <CommercialSectionPage slug={key} />
}
