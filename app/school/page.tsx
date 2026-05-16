import type { Metadata } from 'next'
import CommercialSectionPage from '@/components/CommercialSectionPage'
import { commercialMetadata } from '@/lib/commercialPages'

const key = 'school'
export const metadata: Metadata = commercialMetadata(key)

export default function SchoolPage() {
  return <CommercialSectionPage slug={key} />
}
