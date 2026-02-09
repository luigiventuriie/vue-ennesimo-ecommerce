import type { Product } from '@/types';
import { api } from './api';

export const productService = {

  async getCategories(): Promise<string[]> {
    return api.get<string[]>('/products/categories');
  },
  
  async getAllProducts(): Promise<Product[]> {
    return api.get<Product[]>('/products');
  }
};
