import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import CartView from '../CartView.vue';
import { useCartStore } from '@/stores/cart';

describe('CartView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockItems = [
    {
      id: 1,
      title: 'Product 1',
      price: 10,
      quantity: 2,
      category: 'cat1',
      image: 'img1.jpg',
      description: 'desc1',
      rating: { rate: 4, count: 5 }
    },
    {
      id: 2,
      title: 'Product 2',
      price: 20,
      quantity: 1,
      category: 'cat2',
      image: 'img2.jpg',
      description: 'desc2',
      rating: { rate: 5, count: 2 }
    }
  ];

  it('renders empty state when cart is empty', () => {
    const wrapper = mount(CartView, {
      global: {
        plugins: [createTestingPinia({ 
          createSpy: vi.fn,
          initialState: { cart: { items: [] } }
        })],
        stubs: { 
          RouterLink: RouterLinkStub,
          // continue-btn is also a router-link in the template
          'router-link': RouterLinkStub 
        }
      }
    });

    expect(wrapper.find('.empty-cart').exists()).toBe(true);
    expect(wrapper.text()).toContain('Your cart is empty');
  });

  it('renders items and summary when cart has items', () => {
    const wrapper = mount(CartView, {
      global: {
        plugins: [createTestingPinia({ 
          createSpy: vi.fn,
          initialState: { cart: { items: mockItems } }
        })],
        stubs: { 
          RouterLink: RouterLinkStub,
          'router-link': RouterLinkStub
        }
      }
    });

    expect(wrapper.find('.empty-cart').exists()).toBe(false);
    expect(wrapper.findAll('.cart-item').length).toBe(2);
    expect(wrapper.text()).toContain('Product 1');
    expect(wrapper.text()).toContain('Product 2');
  });

  it('calls cartStore actions when buttons are clicked', async () => {
    const wrapper = mount(CartView, {
      global: {
        plugins: [createTestingPinia({ 
          createSpy: vi.fn,
          initialState: { cart: { items: mockItems } }
        })],
        stubs: { 
          RouterLink: RouterLinkStub,
          'router-link': RouterLinkStub
        }
      }
    });

    const cartStore = useCartStore();

    // Remove button
    await wrapper.find('.remove-btn').trigger('click');
    expect(cartStore.removeItem).toHaveBeenCalledWith(1);

    // Increase quantity
    const qtyButtons = wrapper.findAll('.qty-btn');
    // qtyButtons[0] is "-", qtyButtons[1] is "+" for the first item
    await qtyButtons[1]?.trigger('click');
    expect(cartStore.updateQuantity).toHaveBeenCalledWith(1, 3);
  });
});
