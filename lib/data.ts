export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  subcategory?: string
  rating: number
  reviews: number
  inStock: boolean
  description?: string
}

export const categories = [
  {
    name: 'Sofa Sets',
    subcategories: ['1-Seater Sofas', '2-Seater Sofas', '3-Seaters Sofas'],
    image: '/categories/sofa.jpg'
  },
  {
    name: 'Dining Table Sets',
    subcategories: ['2-Seater Dining Table', '4-Seater Dining Table', '6-Seater Dining Table', '8+ Seater Dining Table'],
    image: '/categories/dining.jpg'
  },
  {
    name: 'Beds',
    subcategories: ['King Size Beds', 'Queen Size Beds', 'Single Beds', 'Double Beds', 'Poster Beds', 'Hydraulic Beds', 'Upholstered Beds', 'Sofa Cum Beds', 'Bunk Beds', 'Platform Beds', 'Folding Beds', 'Metal Beds'],
    image: '/categories/bed.jpg'
  },
  {
    name: 'TV Units',
    subcategories: ['TV Units and Stands', 'Wall Mount Tv Units', 'TV Cabinets', 'Hutch Tv Units', 'Modular TV Units'],
    image: '/categories/tv-unit.jpg'
  },
  {
    name: 'Book Shelves',
    subcategories: ['Bookshelves', 'Glass Door Bookshelf', 'Wall Bookshelf', 'Book Rack', 'Modular Bookshelves'],
    image: '/categories/bookshelf.jpg'
  },
  {
    name: 'Coffee Tables',
    subcategories: ['Round Coffee Tables', 'Coffee Table & Center Tables', 'Coffee Tables Sets', 'Modular Coffee Tables', 'Glass Coffee Table', 'Marble Coffee Table'],
    image: '/categories/coffee-table.jpg'
  },
  {
    name: 'Study Tables',
    subcategories: ['Study Tables', 'Folding Study Tables', 'Corner Study Table', 'Study Table With Chair', 'Kids Study Tables', 'Writing Tables'],
    image: '/categories/study-table.jpg'
  },
  {
    name: 'Home Decor',
    subcategories: ['Wall Shelves', 'Home Temple', 'Wall Mirrors', 'Wall Clocks', 'Photo Frames'],
    image: '/categories/home-decor.jpg'
  },
  {
    name: 'Home Furnishing',
    subcategories: ['Rugs & Carpets', 'Cushion Covers', 'Bed Sheets', 'Table Runners'],
    image: '/categories/furnishing.jpg'
  },
  {
    name: 'Outdoor Furniture',
    subcategories: ['Sofa Set', 'Dining Set', 'Coffee Table Set', 'Bar Set', 'Loungers', 'Swings'],
    image: '/categories/outdoor.jpg'
  },
  {
    name: 'Restaurant/Hotel Furniture',
    subcategories: ['Chairs', 'Tables', 'Sofas'],
    image: '/categories/restaurant.jpg'
  },
  {
    name: 'Office Furniture',
    subcategories: ['Computer Table', 'Director Table', 'Workstation Table', 'Conference Table', 'Director Chair', 'Executive Ergonomic Chair'],
    image: '/categories/office.jpg'
  },
]

export const products: Product[] = [
  // Beds
  {
    id: '1',
    name: 'Shreejee Blessings Wood Daffodil King Bed with Box Storage (Walnut)',
    price: 21990,
    originalPrice: 69000,
    image: '/products/bed1.jpg',
    category: 'Beds',
    subcategory: 'King Size Beds',
    rating: 4.5,
    reviews: 0,
    inStock: true,
  },
  {
    id: '2',
    name: 'Shreejee Blessings Wood King Bed without Storage (Walnut)',
    price: 15500,
    originalPrice: 50000,
    image: '/products/bed2.jpg',
    category: 'Beds',
    subcategory: 'King Size Beds',
    rating: 4.5,
    reviews: 0,
    inStock: true,
  },
  {
    id: '3',
    name: 'Shreejee Blessings Wood King Bed with Storage (Walnut)',
    price: 18490,
    originalPrice: 30500,
    image: '/products/bed3.jpg',
    category: 'Beds',
    subcategory: 'King Size Beds',
    rating: 4.5,
    reviews: 0,
    inStock: true,
  },
  {
    id: '4',
    name: 'Shreejee Blessings Wood King Bed With Storage (Wenge & Sonama Oak)',
    price: 19490,
    originalPrice: 32500,
    image: '/products/bed4.jpg',
    category: 'Beds',
    subcategory: 'King Size Beds',
    rating: 4.5,
    reviews: 0,
    inStock: true,
  },
  {
    id: '5',
    name: 'Shreejee Blessings Wood King Bed (Walnut)',
    price: 13990,
    originalPrice: 22500,
    image: '/products/bed5.jpg',
    category: 'Beds',
    subcategory: 'King Size Beds',
    rating: 4.5,
    reviews: 0,
    inStock: true,
  },
  {
    id: '6',
    name: 'Shreejee Blessings Wood King Bed With Storage (Wenge)',
    price: 23990,
    originalPrice: 37000,
    image: '/products/bed6.jpg',
    category: 'Beds',
    subcategory: 'King Size Beds',
    rating: 4.5,
    reviews: 0,
    inStock: true,
  },
  {
    id: '7',
    name: 'King Bed With Storage (Walnut)',
    price: 21490,
    originalPrice: 34500,
    image: '/products/bed7.jpg',
    category: 'Beds',
    subcategory: 'King Size Beds',
    rating: 4.5,
    reviews: 0,
    inStock: true,
  },
  // Sofa Sets
  {
    id: '8',
    name: 'Duroflex Ease 3 Seater Fabric Sofa In Beige Colour',
    price: 19152,
    originalPrice: 33600,
    image: '/products/sofa1.jpg',
    category: 'Sofa Sets',
    subcategory: '3-Seaters Sofas',
    rating: 4.5,
    reviews: 0,
    inStock: true,
  },
  {
    id: '9',
    name: 'Home Lifestylez Belfast 3 Seater Velvet Sofa In Grey Color',
    price: 40500,
    originalPrice: 55500,
    image: '/products/sofa2.jpg',
    category: 'Sofa Sets',
    subcategory: '3-Seaters Sofas',
    rating: 4.5,
    reviews: 0,
    inStock: true,
  },
  {
    id: '10',
    name: 'Home Lifestylez Corpen 3 Seater Velvet Sofa In Grey Color',
    price: 36500,
    originalPrice: 55500,
    image: '/products/sofa3.jpg',
    category: 'Sofa Sets',
    subcategory: '3-Seaters Sofas',
    rating: 4.5,
    reviews: 0,
    inStock: true,
  },
  {
    id: '11',
    name: '3 Seater Velvet Sofa In Grey Color',
    price: 35500,
    originalPrice: 55500,
    image: '/products/sofa4.jpg',
    category: 'Sofa Sets',
    subcategory: '3-Seaters Sofas',
    rating: 4.5,
    reviews: 0,
    inStock: true,
  },
  {
    id: '12',
    name: 'Caraven 2 Seater Velvet Sofa In Navy Blue Color',
    price: 27500,
    originalPrice: 40500,
    image: '/products/sofa5.jpg',
    category: 'Sofa Sets',
    subcategory: '2-Seater Sofas',
    rating: 4.5,
    reviews: 0,
    inStock: true,
  },
  {
    id: '13',
    name: 'Home Lifestylez Caraven 1 Seater Velvet Sofa In Navy Blue Color',
    price: 25500,
    originalPrice: 35500,
    image: '/products/sofa6.jpg',
    category: 'Sofa Sets',
    subcategory: '1-Seater Sofas',
    rating: 4.5,
    reviews: 0,
    inStock: true,
  },
  {
    id: '14',
    name: 'Duroflex Utopia 1 Seater Fabric Sofa In Grey Colour',
    price: 12500,
    originalPrice: 22000,
    image: '/products/sofa7.jpg',
    category: 'Sofa Sets',
    subcategory: '1-Seater Sofas',
    rating: 4.5,
    reviews: 0,
    inStock: true,
  },
]

