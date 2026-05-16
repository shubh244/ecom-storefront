import { getPublicApiUrl } from '@/lib/site'

const API_BASE_URL = getPublicApiUrl()

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        let msg = `${response.status} ${response.statusText || 'HTTP Error'}`
        try {
          const errBody = await response.json()
          if (typeof errBody.message === 'string' && errBody.message) {
            msg = `${msg}: ${errBody.message}`
          }
        } catch {
          /* ignore */
        }
        throw new Error(`${msg} — ${url}`)
      }

      const data: ApiResponse<T> = await response.json()
      return data.data
    } catch (error) {
      const hint =
        error instanceof TypeError
          ? ` (network/CORS/wrong API URL — base is "${this.baseUrl}")`
          : ''
      console.error(`API Request failed${hint}:`, url, error)
      throw error instanceof Error ? error : new Error(String(error))
    }
  }

  // Products
  async getProducts(params?: {
    category?: string
    subcategory?: string
    search?: string
    sort_by?: string
    sort_order?: string
    per_page?: number
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value))
        }
      })
    }
    const query = queryParams.toString()
    return this.request<any[]>(`/products${query ? `?${query}` : ''}`)
  }

  async getProduct(id: string) {
    return this.request<any>(`/products/${id}`)
  }

  async getProductsByCategory(category: string) {
    return this.request<any[]>(`/products/category/${category}`)
  }

  async getFeaturedProducts() {
    return this.request<any[]>(`/products/featured`)
  }

  async getHotOffers() {
    return this.request<any[]>(`/products/hot-offers`)
  }

  // Categories
  async getCategories() {
    return this.request<any[]>(`/categories`)
  }

  async getCategory(id: string) {
    return this.request<any>(`/categories/${id}`)
  }

  async getCategoryProducts(id: string) {
    return this.request<any[]>(`/categories/${id}/products`)
  }

  // Cart
  async addToCart(productId: number, quantity: number = 1) {
    return this.request<any>('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    })
  }

  async getCart() {
    return this.request<any[]>('/cart')
  }

  async removeFromCart(id: string) {
    return this.request<any>(`/cart/${id}`, {
      method: 'DELETE',
    })
  }

  async updateCartItem(id: string, quantity: number) {
    return this.request<any>(`/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    })
  }

  async clearCart() {
    return this.request<any>('/cart', {
      method: 'DELETE',
    })
  }

  // Admin
  async adminLogin(email: string, password: string) {
    return this.request<any>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async adminLogout() {
    const token = localStorage.getItem('admin_token')
    return this.request<any>('/admin/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  private getAdminHeaders() {
    const token = localStorage.getItem('admin_token')
    return {
      'Authorization': `Bearer ${token}`,
    }
  }

  async getAdminDashboard() {
    return this.request<any>('/admin/dashboard', {
      headers: this.getAdminHeaders(),
    })
  }

  async getAdminProducts(params?: any) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value))
        }
      })
    }
    const query = queryParams.toString()
    return this.request<any>(`/admin/products${query ? `?${query}` : ''}`, {
      headers: this.getAdminHeaders(),
    })
  }

  async createAdminProduct(product: any) {
    return this.request<any>('/admin/products', {
      method: 'POST',
      headers: this.getAdminHeaders(),
      body: JSON.stringify(product),
    })
  }

  async updateAdminProduct(id: number, product: any) {
    return this.request<any>(`/admin/products/${id}`, {
      method: 'PUT',
      headers: this.getAdminHeaders(),
      body: JSON.stringify(product),
    })
  }

  async deleteAdminProduct(id: number) {
    return this.request<any>(`/admin/products/${id}`, {
      method: 'DELETE',
      headers: this.getAdminHeaders(),
    })
  }

  /** Multipart upload; persists file on API server and returns public image URL. */
  async uploadAdminProductImage(productId: number, file: File) {
    const url = `${this.baseUrl}/admin/products/${productId}/image`
    const form = new FormData()
    form.append('image', file)
    const response = await fetch(url, {
      method: 'POST',
      body: form,
      headers: {
        Accept: 'application/json',
        ...this.getAdminHeaders(),
      },
    })
    if (!response.ok) {
      let msg = response.statusText
      try {
        const err = await response.json()
        msg =
          (typeof err.message === 'string' && err.message) ||
          (err.errors && JSON.stringify(err.errors)) ||
          JSON.stringify(err)
      } catch {
        /* ignore */
      }
      throw new Error(msg)
    }
    const json = (await response.json()) as ApiResponse<{
      url: string
      product: unknown
    }>
    return json.data
  }

  async getAdminOrders(params?: any) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value))
        }
      })
    }
    const query = queryParams.toString()
    return this.request<any>(`/admin/orders${query ? `?${query}` : ''}`, {
      headers: this.getAdminHeaders(),
    })
  }

  async getAdminOrder(id: number) {
    return this.request<any>(`/admin/orders/${id}`, {
      headers: this.getAdminHeaders(),
    })
  }

  async updateOrderStatus(id: number, status: string) {
    return this.request<any>(`/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: this.getAdminHeaders(),
      body: JSON.stringify({ status }),
    })
  }

  // Orders
  async createOrder(orderData: any) {
    return this.request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async reportOrderPayment(
    orderId: number,
    body: { status: 'success' | 'failed'; utr?: string; note?: string }
  ) {
    return this.request<any>(`/orders/${orderId}/payment/report`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  async createRazorpayCheckoutOrder(orderId: number) {
    return this.request<{
      key_id: string
      amount: number
      currency: string
      order_id: string
      order_number: string
      prefill: { name: string; email: string; contact: string }
    }>(`/orders/${orderId}/payment/razorpay/order`, {
      method: 'POST',
      body: JSON.stringify({}),
    })
  }

  async verifyRazorpayPayment(
    orderId: number,
    body: {
      razorpay_order_id: string
      razorpay_payment_id: string
      razorpay_signature: string
    }
  ) {
    return this.request<any>(`/orders/${orderId}/payment/razorpay/verify`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  async uploadPaymentScreenshot(orderId: number, file: File) {
    const url = `${this.baseUrl}/orders/${orderId}/payment/screenshot`
    const form = new FormData()
    form.append('screenshot', file)
    const response = await fetch(url, {
      method: 'POST',
      body: form,
      headers: {
        Accept: 'application/json',
      },
    })
    if (!response.ok) {
      let msg = response.statusText
      try {
        const err = await response.json()
        msg = err.message || JSON.stringify(err)
      } catch {
        /* ignore */
      }
      throw new Error(msg)
    }
    const json = (await response.json()) as ApiResponse<any>
    return json.data
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

