import type { Product } from '@/types'
import { api } from './api'

interface ProductFilters {
  category?: string
  search?: string
  sort?: string
  limit?: number
}

export const productService = {
  async getCategories(): Promise<string[]> {
    return api.get<string[]>('/products/categories')
  },

  async getProducts(): Promise<Product[]> {
    return api.get<Product[]>('/products')
  },

  async getProductById(id: number): Promise<Product> {
    return api.get<Product>(`/products/${id}`)
  },

  /**
   * Fetch products with filters (category and/or search)
   * Note: FakeStore API doesn't support search natively, so we simulate the behaviour
   * by fetching and filtering client-side
   * More calls, but the list of products will be always updated
   */
  async getFilteredProducts(filters: ProductFilters, signal?: AbortSignal): Promise<Product[]> {
    let url = this.buildURLForFilteredProducts(filters)

    let products = await api.get<Product[]>(url, { signal })

    products = this.applyClientSideSearchFiltering(filters, products)

    return products
  },

  buildURLForFilteredProducts(filters: ProductFilters) {
    let url = `/products`

    // If category is specified, use category endpoint
    if (filters.category) {
      url = `/products/category/${filters.category}`
    }

    // Add query parameters
    const params = new URLSearchParams()
    if (filters.limit) {
      params.append('limit', filters.limit.toString())
    }
    if (filters.sort) {
      params.append('sort', filters.sort)
    }

    const queryString = params.toString()
    if (queryString) {
      url += `?${queryString}`
    }

    return url
  },

  applyClientSideSearchFiltering(filters: ProductFilters, products: Product[]) {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      products = products.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower),
      )
    }
    return products
  },
}
