import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Cookies from 'js-cookie';
import type { Product } from '@/types';

const WISHLIST_KEY = 'ennesimo_wishlist_items';

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<Product[]>([]);

  // Initialize from Cookies
  const savedItems = Cookies.get(WISHLIST_KEY);
  if (savedItems) {
    try {
      items.value = JSON.parse(savedItems);
    } catch (e) {
      console.error('Failed to parse wishlist items:', e);
      items.value = [];
    }
  }

  const totalItems = computed(() => items.value.length);

  const isInWishlist = (productId: number) => {
    return items.value.some(item => item.id === productId);
  };

  function toggleWishlist(product: Product) {
    const index = items.value.findIndex(item => item.id === product.id);
    if (index > -1) {
      items.value.splice(index, 1);
    } else {
      items.value.push(product);
    }
    saveWishlist();
  }

  function removeFromWishlist(productId: number) {
    items.value = items.value.filter(item => item.id !== productId);
    saveWishlist();
  }

  function clearWishlist() {
    items.value = [];
    saveWishlist();
  }

  function saveWishlist() {
    Cookies.set(WISHLIST_KEY, JSON.stringify(items.value), { expires: 30, secure: true, sameSite: 'strict' });
  }

  return {
    items,
    totalItems,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist
  };
});
