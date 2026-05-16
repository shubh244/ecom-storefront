export interface Product {
  id: number
  name: string
  price: number
  original_price?: number
  category_id: number
  subcategory?: string
  description?: string
  image?: string
  rating: number
  reviews: number
  in_stock: boolean
  is_featured: boolean
  hot_offer?: boolean
  offer_percentage?: number
  category?: Category
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  parent_id?: number
  subcategories?: Category[]
  created_at?: string
  updated_at?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

