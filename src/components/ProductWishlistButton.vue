<script setup lang="ts">
import type { Product } from '@/types'
import { useWishlistStore } from '@/stores/wishlist'
import { useAuthStore } from '@/stores/auth'

const wishlistStore = useWishlistStore()
const authStore = useAuthStore()

defineProps<{
  product: Product
  size?: 'sm' | 'md'
}>()

const handleToggleWishlist = (product: Product) => {
  if (authStore.isAuthenticated) {
    wishlistStore.toggleWishlist(product)
  }
}
</script>

<template>
  <button
    v-if="authStore.isAuthenticated"
    class="product-wishlist-btn"
    data-test="product-wishlist-btn"
    :class="[size || 'md', { active: wishlistStore.isInWishlist(product.id) }]"
    @click.prevent.stop="handleToggleWishlist(product)"
    :title="wishlistStore.isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'"
    :aria-label="
      wishlistStore.isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'
    "
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="size === 'sm' ? 18 : 20"
      :height="size === 'sm' ? 18 : 20"
      viewBox="0 0 24 24"
      :fill="wishlistStore.isInWishlist(product.id) ? 'currentColor' : 'none'"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      ></path>
    </svg>
  </button>
</template>

<style scoped lang="scss">
.product-wishlist-btn {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--shadow-sm);

  &.md {
    width: 52px;
    height: 52px;
    border-radius: var(--radius-lg);
  }

  &.sm {
    width: 34px;
    height: 34px;
    border-radius: var(--radius-md); // Keep rounded boarder as requested
  }

  &:hover {
    color: #ef4444; // Red-500
    border-color: #fecaca; // Red-200
    background-color: #fef2f2; // Red-50
    transform: translateY(-2px);
  }

  &.active {
    color: #ef4444;
    border-color: #fecaca;
    background-color: #fef2f2;
  }
}
</style>
