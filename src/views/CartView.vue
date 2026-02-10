<script setup lang="ts">
import { useCartStore } from '@/stores/cart';
import { formatCategory } from '@/utils/formatters';

const cartStore = useCartStore();

const handleUpdateQuantity = (productId: number, quantity: number) => {
  cartStore.updateQuantity(productId, quantity);
};

const handleRemoveItem = (productId: number) => {
  cartStore.removeItem(productId);
};
</script>

<template>
  <div class="cart-view">
    <div class="container">
      <h1 class="page-title">Shopping Cart</h1>

      <div v-if="cartStore.items.length === 0" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <router-link to="/" class="continue-btn">Start Shopping</router-link>
      </div>

      <div v-else class="cart-grid">
        <!-- Items List -->
        <div class="cart-items">
          <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <div class="item-image">
              <img :src="item.image" :alt="item.title" />
            </div>
            
            <div class="item-details">
              <span class="item-category">{{ formatCategory(item.category) }}</span>
              <router-link :to="`/product/${item.id}`" class="item-title">
                {{ item.title }}
              </router-link>
              <p class="item-price">${{ item.price.toFixed(2) }}</p>
            </div>

            <div class="item-actions">
              <div class="quantity-controls">
                <button 
                  @click="handleUpdateQuantity(item.id, item.quantity - 1)"
                  class="qty-btn"
                  aria-label="Decrease quantity"
                >−</button>
                <span class="qty-value">{{ item.quantity }}</span>
                <button 
                  @click="handleUpdateQuantity(item.id, item.quantity + 1)"
                  class="qty-btn"
                  aria-label="Increase quantity"
                >+</button>
              </div>
              
              <button @click="handleRemoveItem(item.id)" class="remove-btn" aria-label="Remove item">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>

            <div class="item-total">
              ${{ (item.price * item.quantity).toFixed(2) }}
            </div>
          </div>
        </div>

        <!-- Summary -->
        <aside class="cart-summary">
          <div class="summary-card">
            <h2 class="summary-title">Order Summary</h2>
            
            <div class="summary-row">
              <span>Subtotal ({{ cartStore.totalItems }} items)</span>
              <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            
            <div class="summary-row">
              <span>Shipping</span>
              <span class="free-shipping">FREE</span>
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="summary-row total">
              <span>Total</span>
              <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>

            <button class="checkout-btn">
              Proceed to Checkout
            </button>
            
            <p class="shipping-info">
              Shipping and taxes calculated at checkout
            </p>
          </div>
          
          <router-link to="/" class="back-link">
            ← Continue Shopping
          </router-link>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart-view {
  padding: 2rem 0 4rem;
  min-height: calc(100vh - var(--header-height));
  background-color: var(--bg-body);
}

.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2rem;
}

/* Empty State */
.empty-cart {
  text-align: center;
  padding: 5rem 1rem;
  background-color: var(--bg-card);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }

  .continue-btn {
    display: inline-block;
    background-color: var(--color-primary);
    color: white;
    padding: 0.75rem 2rem;
    border-radius: var(--radius-md);
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;

    &:hover {
      background-color: var(--color-primary-hover);
      transform: translateY(-2px);
    }
  }
}

/* Cart Grid */
.cart-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 350px;
    align-items: flex-start;
  }
}

/* Cart Items */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr;
  grid-template-rows: auto auto;
  gap: 1rem;
  background-color: var(--bg-card);
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  transition: all 0.2s;

  @media (min-width: 640px) {
    grid-template-columns: 100px 1fr auto 100px;
    grid-template-rows: auto;
    align-items: center;
  }

  &:hover {
    border-color: var(--color-primary-light);
    box-shadow: var(--shadow-sm);
  }
}

.item-image {
  grid-row: span 2;
  background-color: white;
  border-radius: var(--radius-md);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;

  @media (min-width: 640px) {
    grid-row: span 1;
    height: 100px;
  }

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.item-details {
  .item-category {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .item-title {
    display: block;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    text-decoration: none;
    margin: 0.25rem 0;
    
    &:hover {
      color: var(--color-primary);
    }
  }

  .item-price {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  @media (max-width: 639px) {
    grid-column: 2;
  }
}

.quantity-controls {
  display: flex;
  align-items: center;
  background-color: var(--bg-body);
  border-radius: var(--radius-md);
  padding: 0.25rem;
  border: 1px solid var(--border-color);
}

.qty-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all 0.2s;

  &:hover {
    background-color: var(--border-color);
  }
}

.qty-value {
  width: 32px;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  transition: all 0.2s;

  &:hover {
    color: #ef4444;
    background-color: #fef2f2;
  }
}

.item-total {
  font-weight: 700;
  color: var(--text-primary);
  text-align: right;
  
  @media (max-width: 639px) {
    display: none;
  }
}

/* Summary Card */
.cart-summary {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.summary-card {
  background-color: var(--bg-card);
  padding: 2rem;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  color: var(--text-secondary);

  &.total {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-top: 1rem;
    margin-bottom: 0;
  }

  .free-shipping {
    color: #10b981; // Emerald-500
    font-weight: 700;
  }
}

.summary-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 1.5rem 0;
}

.checkout-btn {
  width: 100%;
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: var(--radius-lg);
  font-weight: 700;
  font-size: 1rem;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
}

.shipping-info {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: center;
  margin-top: 1rem;
}

.back-link {
  text-align: center;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: color 0.2s;

  &:hover {
    color: var(--color-primary);
  }
}
</style>
