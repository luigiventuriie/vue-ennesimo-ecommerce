import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { nextTick } from 'vue';
import ProductView from '../ProductView.vue';
import { productService } from '@/services/productService';

// Mock productService
vi.mock('@/services/productService', () => ({
  productService: {
    getProductById: vi.fn()
  }
}));

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 50,
  description: 'A great product description.',
  category: 'electronics',
  image: 'test.jpg',
  rating: { rate: 4.2, count: 100 }
};

describe('ProductView', () => {
  let router: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/product/:id', name: 'product', component: { template: '<div>Product</div>' } }]
    });
    router.push('/product/1');
    await router.isReady();
  });

  it('fetches and displays product details correctly', async () => {
    (productService.getProductById as any).mockResolvedValue(mockProduct);

    const wrapper = mount(ProductView, {
      global: {
        plugins: [router]
      }
    });

    await flushPromises();

    expect(productService.getProductById).toHaveBeenCalledWith(1);
    expect(wrapper.get('.product-title').text()).toBe('Test Product');
    expect(wrapper.get('.price').text()).toBe('$50.00');
    expect(wrapper.get('.description').text()).toBe('A great product description.');
    expect(wrapper.get('.category-tag').text()).toBe('Electronics');
  });

  it('shows loading state while fetching', async () => {
    let resolvePromise: any;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    (productService.getProductById as any).mockReturnValue(promise);

    const wrapper = mount(ProductView, {
      global: {
        plugins: [router]
      }
    });

    await nextTick();
    expect(wrapper.find('.loading-state').exists()).toBe(true);

    resolvePromise(mockProduct);
    await flushPromises();
    expect(wrapper.find('.loading-state').exists()).toBe(false);
  });

  it('shows error state when fetching fails', async () => {
    (productService.getProductById as any).mockRejectedValue(new Error('Fetch failed'));

    const wrapper = mount(ProductView, {
      global: {
        plugins: [router]
      }
    });

    await flushPromises();

    expect(wrapper.find('.error-state').exists()).toBe(true);
    expect(wrapper.text()).toContain('Failed to load product details');
  });

  it('shows error for invalid ID', async () => {
    // Create a fresh router for this test to avoid leakage
    const testRouter = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/product/:id', component: { template: '<div></div>' } }]
    });
    testRouter.push('/product/abc');
    await testRouter.isReady();

    const wrapper = mount(ProductView, {
      global: {
        plugins: [testRouter]
      }
    });

    await flushPromises();
    expect(wrapper.text()).toContain('Invalid product ID');
  });
});
