import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import WishlistView from '../WishlistView.vue';
import { useWishlistStore } from '@/stores/wishlist';

describe('WishlistView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockItems = [
    {
      id: 1,
      title: 'Product 1',
      price: 10,
      category: 'cat1',
      image: 'img1.jpg',
      description: 'desc1',
      rating: { rate: 4, count: 5 }
    },
    {
      id: 2,
      title: 'Product 2',
      price: 20,
      category: 'cat2',
      image: 'img2.jpg',
      description: 'desc2',
      rating: { rate: 5, count: 2 }
    }
  ];

  it('renders empty state when wishlist is empty', () => {
    const wrapper = mount(WishlistView, {
      global: {
        plugins: [createTestingPinia({ 
          createSpy: vi.fn,
          initialState: { wishlist: { items: [] } }
        })],
        stubs: { 
          RouterLink: RouterLinkStub,
          'router-link': RouterLinkStub 
        }
      }
    });

    expect(wrapper.find('.empty-wishlist').exists()).toBe(true);
    expect(wrapper.text()).toContain('Your wishlist is empty');
  });

  it('renders products when wishlist has items', () => {
    const wrapper = mount(WishlistView, {
      global: {
        plugins: [createTestingPinia({ 
          createSpy: vi.fn,
          initialState: { wishlist: { items: mockItems } }
        })],
        stubs: { 
          RouterLink: RouterLinkStub,
          'router-link': RouterLinkStub
        }
      }
    });

    expect(wrapper.find('.empty-wishlist').exists()).toBe(false);
    expect(wrapper.findAllComponents({ name: 'ProductCard' }).length).toBe(2);
  });
});
