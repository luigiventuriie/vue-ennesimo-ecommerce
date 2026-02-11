<script setup lang="ts">
import { formatCategory } from '@/utils/formatters'
import type { CartItem } from '@/types'

defineProps<{
  items: CartItem[]
}>()

const emit = defineEmits<{
  (e: 'update-quantity', productId: number, quantity: number): void
  (e: 'remove-item', productId: number): void
}>()
</script>

<template>
  <div class="cart-items">
    <div v-for="item in items" :key="item.id" class="cart-item">
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
            @click="emit('update-quantity', item.id, item.quantity - 1)"
            class="qty-btn"
            aria-label="Decrease quantity"
          >−</button>
          <span class="qty-value">{{ item.quantity }}</span>
          <button 
            @click="emit('update-quantity', item.id, item.quantity + 1)"
            class="qty-btn"
            aria-label="Increase quantity"
          >+</button>
        </div>
        
        <button @click="emit('remove-item', item.id)" class="remove-btn" aria-label="Remove item">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>

      <div class="item-total">
        ${{ (item.price * item.quantity).toFixed(2) }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
</style>
