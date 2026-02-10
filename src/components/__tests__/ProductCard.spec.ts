import { describe, it, expect, vi } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ProductCard from '../ProductCard.vue'
import { useWishlistStore } from '@/stores/wishlist'
import type { Product } from '@/types'

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'Test Description',
  category: 'electronics',
  image: 'test-image.jpg',
  rating: {
    rate: 4.5,
    count: 10,
  },
}

describe('ProductCard', () => {
  it('renders product details correctly', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Test Product')
    expect(wrapper.text()).toContain('Electronics')
    expect(wrapper.text()).toContain('$29.99')
    expect(wrapper.text()).toContain('4.5')
    expect(wrapper.text()).toContain('(10)')

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('test-image.jpg')
    expect(img.attributes('alt')).toBe('Test Product')
  })

  it('links to the correct product detail page', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const link = wrapper.getComponent(RouterLinkStub)
    expect(link.props().to).toBe('/product/1')
  })

  it('shows wishlist toggle when authenticated', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct },
      global: {
        plugins: [createTestingPinia({ 
          createSpy: vi.fn,
          initialState: { auth: { token: 'fake-token' } }
        })],
        stubs: { RouterLink: RouterLinkStub }
      }
    });

    expect(wrapper.find('.wishlist-toggle').exists()).toBe(true);
  });

  it('hides wishlist toggle when unauthenticated', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct },
      global: {
        plugins: [createTestingPinia({ 
          createSpy: vi.fn,
          initialState: { auth: { token: null } }
        })],
        stubs: { RouterLink: RouterLinkStub }
      }
    });

    expect(wrapper.find('.wishlist-toggle').exists()).toBe(false);
  });

  it('calls wishlistStore.toggleWishlist when toggle clicked', async () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct },
      global: {
        plugins: [createTestingPinia({ 
          createSpy: vi.fn,
          initialState: { auth: { token: 'fake-token' } }
        })],
        stubs: { RouterLink: RouterLinkStub }
      }
    });

    const wishlistStore = useWishlistStore();
    await wrapper.find('.wishlist-toggle').trigger('click');
    expect(wishlistStore.toggleWishlist).toHaveBeenCalledWith(mockProduct);
  });

  it('shows correct title and aria-label based on wishlist state', async () => {
    // Case 1: Not in wishlist
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct },
      global: {
        plugins: [createTestingPinia({ 
          createSpy: vi.fn,
          stubActions: false,
          initialState: { 
            auth: { token: 'fake-token' },
            wishlist: { items: [] }
          }
        })],
        stubs: { RouterLink: RouterLinkStub }
      }
    });
    const btn = wrapper.find('.wishlist-toggle');
    expect(btn.attributes('title')).toBe('Add to wishlist');
    expect(btn.attributes('aria-label')).toBe('Add to wishlist');

    // Case 2: In wishlist
    const wrapperIn = mount(ProductCard, {
      props: { product: mockProduct },
      global: {
        plugins: [createTestingPinia({ 
          createSpy: vi.fn,
          stubActions: false,
          initialState: { 
            auth: { token: 'fake-token' },
            wishlist: { items: [mockProduct] }
          }
        })],
        stubs: { RouterLink: RouterLinkStub }
      }
    });
    const btnIn = wrapperIn.find('.wishlist-toggle');
    expect(btnIn.attributes('title')).toBe('Remove from wishlist');
    expect(btnIn.attributes('aria-label')).toBe('Remove from wishlist');
  });
})
