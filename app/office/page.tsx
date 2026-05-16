import type { Metadata } from 'next'
import CommercialSectionPage from '@/components/CommercialSectionPage'
import { commercialMetadata } from '@/lib/commercialPages'

const key = 'office'
export const metadata: Metadata = commercialMetadata(key)

export default function OfficePage() {
  return <CommercialSectionPage slug={key} />
}
