import type { Metadata } from 'next'
import CommercialSectionPage from '@/components/CommercialSectionPage'
import { commercialMetadata } from '@/lib/commercialPages'

const key = 'outdoor'
export const metadata: Metadata = commercialMetadata(key)

export default function OutdoorPage() {
  return <CommercialSectionPage slug={key} />
}
