import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useWishlistStore } from '../wishlist';
import Cookies from 'js-cookie';

// Mock js-cookie
vi.mock('js-cookie');

describe('Wishlist Store', () => {
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
    const store = useWishlistStore();
    expect(store.items).toEqual([]);
    expect(store.totalItems).toBe(0);
  });

  it('toggles a product into the wishlist', () => {
    const store = useWishlistStore();
    store.toggleWishlist(mockProduct);
    
    expect(store.items.length).toBe(1);
    expect(store.isInWishlist(1)).toBe(true);
    expect(store.totalItems).toBe(1);
    expect(Cookies.set).toHaveBeenCalled();
  });

  it('toggles a product out of the wishlist', () => {
    const store = useWishlistStore();
    store.toggleWishlist(mockProduct);
    expect(store.items.length).toBe(1);
    
    store.toggleWishlist(mockProduct);
    expect(store.items.length).toBe(0);
    expect(store.isInWishlist(1)).toBe(false);
  });

  it('removes item by ID', () => {
    const store = useWishlistStore();
    store.toggleWishlist(mockProduct);
    store.removeFromWishlist(1);
    
    expect(store.items.length).toBe(0);
  });

  it('clears the wishlist', () => {
    const store = useWishlistStore();
    store.toggleWishlist(mockProduct);
    store.clearWishlist();
    
    expect(store.items.length).toBe(0);
  });
});
