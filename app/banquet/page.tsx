import type { Metadata } from 'next'
import CommercialSectionPage from '@/components/CommercialSectionPage'
import { commercialMetadata } from '@/lib/commercialPages'

const key = 'banquet'
export const metadata: Metadata = commercialMetadata(key)

export default function BanquetPage() {
  return <CommercialSectionPage slug={key} />
}
