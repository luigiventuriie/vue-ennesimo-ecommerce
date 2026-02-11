<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import EmptyCart from '@/components/EmptyCart.vue'
import CartItemList from '@/components/CartItemList.vue'
import CartSummary from '@/components/CartSummary.vue'

const cartStore = useCartStore()

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

      <EmptyCart v-if="cartStore.items.length === 0" />

      <div v-else class="cart-grid">
        <CartItemList 
          :items="cartStore.items" 
          @update-quantity="handleUpdateQuantity"
          @remove-item="handleRemoveItem"
        />

        <CartSummary 
          :totalItems="cartStore.totalItems"
          :totalPrice="cartStore.totalPrice"
        />
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

.cart-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 350px;
    align-items: flex-start;
  }
}
</style>
