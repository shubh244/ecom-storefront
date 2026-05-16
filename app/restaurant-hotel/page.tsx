import type { Metadata } from 'next'
import CommercialSectionPage from '@/components/CommercialSectionPage'
import { commercialMetadata } from '@/lib/commercialPages'

const key = 'restaurant-hotel'
export const metadata: Metadata = commercialMetadata(key)

export default function RestaurantHotelPage() {
  return <CommercialSectionPage slug={key} />
}
