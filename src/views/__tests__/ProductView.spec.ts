import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { createTestingPinia } from '@pinia/testing';
import { nextTick } from 'vue';
import ProductView from '../ProductView.vue';
import { productService } from '@/services/productService';
import { useCartStore } from '@/stores/cart';

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
        plugins: [router, createTestingPinia({ createSpy: vi.fn })]
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
        plugins: [router, createTestingPinia({ createSpy: vi.fn })]
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
        plugins: [router, createTestingPinia({ createSpy: vi.fn })]
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
        plugins: [testRouter, createTestingPinia({ createSpy: vi.fn })]
      }
    });

    await flushPromises();
    expect(wrapper.text()).toContain('Invalid product ID');
  });

  it('hides add to cart button when unauthenticated', async () => {
    (productService.getProductById as any).mockResolvedValue(mockProduct);

    const wrapper = mount(ProductView, {
      global: {
        plugins: [router, createTestingPinia({ 
          createSpy: vi.fn,
          initialState: { auth: { token: null } }
        })]
      }
    });

    await flushPromises();
    expect(wrapper.find('[data-test="add-to-cart-btn"]').exists()).toBe(false);
  });

  it('shows add to cart button when authenticated', async () => {
    (productService.getProductById as any).mockResolvedValue(mockProduct);

    const wrapper = mount(ProductView, {
      global: {
        plugins: [router, createTestingPinia({ 
          createSpy: vi.fn,
          initialState: { auth: { token: 'fake-token' } }
        })]
      }
    });

    await flushPromises();
    expect(wrapper.find('[data-test="add-to-cart-btn"]').exists()).toBe(true);
  });

  it('shows quantity selector if product is already in cart', async () => {
    (productService.getProductById as any).mockResolvedValue(mockProduct);

    const wrapper = mount(ProductView, {
      global: {
        plugins: [router, createTestingPinia({ 
          createSpy: vi.fn,
          initialState: { 
            auth: { token: 'fake-token' },
            cart: { items: [{ ...mockProduct, quantity: 2 }] }
          }
        })]
      }
    });

    await flushPromises();
    expect(wrapper.find('.quantity-selector').exists()).toBe(true);
    expect(wrapper.get('.qty-value').text()).toBe('2 in cart');
    expect(wrapper.find('[data-test="add-to-cart-btn"]').exists()).toBe(false);
  });

  it('increments quantity when clicking +', async () => {
    (productService.getProductById as any).mockResolvedValue(mockProduct);
    const pinia = createTestingPinia({ 
      createSpy: vi.fn,
      initialState: { 
        auth: { token: 'fake-token' },
        cart: { items: [{ ...mockProduct, quantity: 2 }] }
      }
    });
    const cartStore = useCartStore();

    const wrapper = mount(ProductView, {
      global: {
        plugins: [router, pinia]
      }
    });

    await flushPromises();
    await wrapper.find('[aria-label="Increase quantity"]').trigger('click');
    expect(cartStore.updateQuantity).toHaveBeenCalledWith(1, 3);
  });

  it('decrements quantity when clicking -', async () => {
    (productService.getProductById as any).mockResolvedValue(mockProduct);
    const pinia = createTestingPinia({ 
      createSpy: vi.fn,
      initialState: { 
        auth: { token: 'fake-token' },
        cart: { items: [{ ...mockProduct, quantity: 2 }] }
      }
    });
    const cartStore = useCartStore();

    const wrapper = mount(ProductView, {
      global: {
        plugins: [router, pinia]
      }
    });

    await flushPromises();
    await wrapper.find('[aria-label="Decrease quantity"]').trigger('click');
    expect(cartStore.updateQuantity).toHaveBeenCalledWith(1, 1);
  });

  it('shows "Removed from cart" feedback when last item is removed', async () => {
    (productService.getProductById as any).mockResolvedValue(mockProduct);
    const pinia = createTestingPinia({ 
      createSpy: vi.fn,
      initialState: { 
        auth: { token: 'fake-token' },
        cart: { items: [{ ...mockProduct, quantity: 1 }] }
      }
    });

    const wrapper = mount(ProductView, {
      global: {
        plugins: [router, pinia]
      }
    });

    await flushPromises();
    
    // Decrease quantity from 1 to 0
    await wrapper.find('[aria-label="Decrease quantity"]').trigger('click');
    
    // Manually update state since testing pinia doesn't execute actions
    const cartStore = useCartStore();
    cartStore.items = [];
    
    // It should now show "Removed from cart" in the add to cart button (which reappears)
    await flushPromises();
    expect(wrapper.find('[data-test="add-to-cart-btn"]').text()).toBe('Removed from cart');
  });

  it('shows correct wishlist button title based on state', async () => {
    (productService.getProductById as any).mockResolvedValue(mockProduct);
    
    // Case 1: Not in wishlist
    const wrapper = mount(ProductView, {
      global: {
        plugins: [router, createTestingPinia({ 
          createSpy: vi.fn,
          stubActions: false,
          initialState: { 
            auth: { token: 'fake-token' },
            wishlist: { items: [] }
          }
        })]
      }
    });

    await flushPromises();
    expect(wrapper.find('.wishlist-btn').attributes('title')).toBe('Add to wishlist');

    // Case 2: In wishlist
    const wrapperIn = mount(ProductView, {
      global: {
        plugins: [router, createTestingPinia({ 
          createSpy: vi.fn,
          stubActions: false,
          initialState: { 
            auth: { token: 'fake-token' },
            wishlist: { items: [mockProduct] }
          }
        })]
      }
    });

    await flushPromises();
    expect(wrapperIn.find('.wishlist-btn').attributes('title')).toBe('Remove from wishlist');
  });

  it('hides wishlist button when unauthenticated', async () => {
    (productService.getProductById as any).mockResolvedValue(mockProduct);

    const wrapper = mount(ProductView, {
      global: {
        plugins: [router, createTestingPinia({ 
          createSpy: vi.fn,
          initialState: { 
            auth: { token: null }
          }
        })]
      }
    });

    await flushPromises();
    expect(wrapper.find('.wishlist-btn').exists()).toBe(false);
  });
});
