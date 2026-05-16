import type { Metadata } from 'next'
import CommercialSectionPage from '@/components/CommercialSectionPage'
import { commercialMetadata } from '@/lib/commercialPages'

const key = 'hospital'
export const metadata: Metadata = commercialMetadata(key)

export default function HospitalPage() {
  return <CommercialSectionPage slug={key} />
}
