import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCartStore } from '../cart';
import Cookies from 'js-cookie';

// Mock js-cookie
vi.mock('js-cookie');

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 10,
    description: 'Test Description',
    category: 'test',
    image: 'test.jpg',
    rating: { rate: 4.5, count: 10 }
  };

  it('initializes with empty items if no cookies', () => {
    (Cookies.get as any).mockReturnValue(undefined);
    const store = useCartStore();
    expect(store.items).toEqual([]);
    expect(store.totalItems).toBe(0);
  });

  it('adds a new product to the cart', () => {
    const store = useCartStore();
    store.addItem(mockProduct);
    
    expect(store.items.length).toBe(1);
    expect(store.items[0]?.id).toBe(1);
    expect(store.items[0]?.quantity).toBe(1);
    expect(store.totalItems).toBe(1);
    expect(store.totalPrice).toBe(10);
  });

  it('increments quantity if product already in cart', () => {
    const store = useCartStore();
    store.addItem(mockProduct);
    store.addItem(mockProduct);
    
    expect(store.items.length).toBe(1);
    expect(store.items[0]?.quantity).toBe(2);
    expect(store.totalItems).toBe(2);
    expect(store.totalPrice).toBe(20);
  });

  it('updates item quantity', () => {
    const store = useCartStore();
    store.addItem(mockProduct);
    store.updateQuantity(1, 5);
    
    expect(store.items[0]?.quantity).toBe(5);
    expect(store.totalItems).toBe(5);
    expect(store.totalPrice).toBe(50);
  });

  it('removes item if quantity set to 0', () => {
    const store = useCartStore();
    store.addItem(mockProduct);
    store.updateQuantity(1, 0);
    
    expect(store.items.length).toBe(0);
  });

  it('removes item by ID', () => {
    const store = useCartStore();
    store.addItem(mockProduct);
    store.removeItem(1);
    
    expect(store.items.length).toBe(0);
  });

  it('clears the cart', () => {
    const store = useCartStore();
    store.addItem(mockProduct);
    store.clearCart();
    
    expect(store.items.length).toBe(0);
    expect(Cookies.set).toHaveBeenCalledWith(expect.any(String), '[]', expect.any(Object));
  });
});
