import { describe, it, expect, vi, beforeEach } from 'vitest'
import { productService } from '../productService'
import { api } from '../api'
import type { Product } from '@/types'

vi.mock('../api')

describe('productService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCategories', () => {
    it('should fetch all categories', async () => {
      const mockCategories = ['electronics', 'jewelery', 'men\'s clothing', 'women\'s clothing']
      vi.mocked(api.get).mockResolvedValue(mockCategories)

      const result = await productService.getCategories()

      expect(api.get).toHaveBeenCalledWith('/products/categories')
      expect(result).toEqual(mockCategories)
    })

    it('should handle errors when fetching categories', async () => {
      const mockError = new Error('Network error')
      vi.mocked(api.get).mockRejectedValue(mockError)

      await expect(productService.getCategories()).rejects.toThrow('Network error')
    })
  })

  describe('getProducts', () => {
    it('should fetch all products', async () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          title: 'Test Product',
          price: 99.99,
          description: 'Test description',
          category: 'electronics',
          image: 'test.jpg',
          rating: { rate: 4.5, count: 100 }
        }
      ]
      vi.mocked(api.get).mockResolvedValue(mockProducts)

      const result = await productService.getProducts()

      expect(api.get).toHaveBeenCalledWith('/products')
      expect(result).toEqual(mockProducts)
    })

    it('should handle errors when fetching products', async () => {
      const mockError = new Error('API error')
      vi.mocked(api.get).mockRejectedValue(mockError)

      await expect(productService.getProducts()).rejects.toThrow('API error')
    })
  })

  describe('getProductsByCategory', () => {
    it('should fetch products by category', async () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          title: 'Electronics Product',
          price: 199.99,
          description: 'Test description',
          category: 'electronics',
          image: 'test.jpg',
          rating: { rate: 4.5, count: 50 }
        }
      ]
      vi.mocked(api.get).mockResolvedValue(mockProducts)

      const result = await productService.getProductsByCategory('electronics')

      expect(api.get).toHaveBeenCalledWith('/products/category/electronics')
      expect(result).toEqual(mockProducts)
    })

    it('should handle errors when fetching products by category', async () => {
      const mockError = new Error('Category not found')
      vi.mocked(api.get).mockRejectedValue(mockError)

      await expect(productService.getProductsByCategory('invalid')).rejects.toThrow('Category not found')
    })
  })

  describe('getProductById', () => {
    it('should fetch a product by ID', async () => {
      const mockProduct: Product = {
        id: 1,
        title: 'Test Product',
        price: 99.99,
        description: 'Test description',
        category: 'electronics',
        image: 'test.jpg',
        rating: { rate: 4.5, count: 100 }
      }
      vi.mocked(api.get).mockResolvedValue(mockProduct)

      const result = await productService.getProductById(1)

      expect(api.get).toHaveBeenCalledWith('/products/1')
      expect(result).toEqual(mockProduct)
    })

    it('should handle errors when fetching product by ID', async () => {
      const mockError = new Error('Product not found')
      vi.mocked(api.get).mockRejectedValue(mockError)

      await expect(productService.getProductById(999)).rejects.toThrow('Product not found')
    })
  })
})
