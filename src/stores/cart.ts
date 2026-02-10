import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import Cookies from 'js-cookie';
import type { Product, CartItem } from '@/types';

const CART_KEY = 'ennesimo_cart_items';

export const useCartStore = defineStore('cart', () => {
  // Initialize state from cookies
  const items = ref<CartItem[]>([]);
  
  const savedItems = Cookies.get(CART_KEY);
  if (savedItems) {
    try {
      items.value = JSON.parse(savedItems);
    } catch (e) {
      console.error('Failed to parse saved cart items:', e);
      items.value = [];
    }
  }

  // Getters
  const totalItems = computed(() => 
    items.value.reduce((acc, item) => acc + item.quantity, 0)
  );

  const totalPrice = computed(() => 
    items.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  const isProductInCart = (productId: number) => {
    return items.value.some(item => item.id === productId);
  };

  // Actions
  function addItem(product: Product) {
    const existingItem = items.value.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.value.push({ ...product, quantity: 1 });
    }
    
    saveCart();
  }

  function removeItem(productId: number) {
    items.value = items.value.filter(item => item.id !== productId);
    saveCart();
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = items.value.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        removeItem(productId);
      } else {
        item.quantity = quantity;
        saveCart();
      }
    }
  }

  function clearCart() {
    items.value = [];
    saveCart();
  }

  function saveCart() {
    Cookies.set(CART_KEY, JSON.stringify(items.value), { expires: 14, secure: true, sameSite: 'strict' });
  }

  return {
    items,
    totalItems,
    totalPrice,
    isProductInCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };
});
