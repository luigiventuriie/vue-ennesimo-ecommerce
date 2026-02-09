import type { Product } from '@/types';
import { api } from './api';

export const productService = {

  async getCategories(): Promise<string[]> {
    return api.get<string[]>('/products/categories');
  },

  async getProducts(): Promise<Product[]> {
    return api.get<Product[]>('/products');
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    return api.get<Product[]>(`/products/category/${category}`);
  },

  async getProductById(id: number): Promise<Product> {
    return api.get<Product>(`/products/${id}`);
  },
};
