import { Product } from '@/lib/types'

const categoryFallbacks: Record<string, string[]> = {
  beds: [
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1631049035182-249067d7618e?auto=format&fit=crop&w=900&q=80',
  ],
  'sofa-sets': [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=900&q=80',
  ],
  'dining-table-sets': [
    'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=80',
  ],
  'tv-units': [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1616627561839-074385245ff6?auto=format&fit=crop&w=900&q=80',
  ],
  'coffee-tables': [
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80',
  ],
  'book-shelves': [
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
  ],
}

export function getProductImage(product: Pick<Product, 'id' | 'image' | 'category'>): string {
  if (product.image && product.image.trim() !== '') return product.image

  const slug = product.category?.slug ?? ''
  const options = categoryFallbacks[slug]
  if (options?.length) {
    return options[Number(product.id) % options.length]
  }

  return `https://picsum.photos/seed/furniture-${product.id}/900/900`
}
