<script setup lang="ts">
import type { Product } from '@/types'
import { formatCategory } from '@/utils/formatters'
import { useWishlistStore } from '@/stores/wishlist'
import { useAuthStore } from '@/stores/auth'

const wishlistStore = useWishlistStore()
const authStore = useAuthStore()

const props = defineProps<{
  product: Product
}>()

const handleToggleWishlist = () => {
  if (authStore.isAuthenticated) {
    wishlistStore.toggleWishlist(props.product)
  }
}
</script>

<template>
  <router-link :to="`/product/${product.id}`" class="product-card">
    <div class="product-image-wrapper">
      <img :src="product.image" :alt="product.title" class="product-image" loading="lazy" />
      <span class="product-category">{{ formatCategory(product.category) }}</span>

      <!-- Wishlist Toggle -->
      <button
        v-if="authStore.isAuthenticated"
        @click.prevent.stop="handleToggleWishlist"
        class="wishlist-toggle"
        :class="{ active: wishlistStore.isInWishlist(product.id) }"
        :aria-label="
          wishlistStore.isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'
        "
        :title="wishlistStore.isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
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
    </div>
    <div class="product-info">
      <h3 class="product-title">{{ product.title }}</h3>
      <div class="product-footer">
        <span class="product-price">${{ product.price.toFixed(2) }}</span>
        <div class="product-rating">
          <span class="rating-stars">⭐ {{ product.rating.rate }}</span>
          <span class="rating-count">({{ product.rating.count }})</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped lang="scss">
.product-card {
  display: flex;
  flex-direction: column;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
  height: 100%;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border-color: var(--color-primary-light);

    .product-title {
      color: var(--color-primary);
    }
  }
}

.product-image-wrapper {
  aspect-ratio: 1 / 1;
  padding: 1.5rem;
  background-color: white; // FakeStoreAPI images often have white backgrounds
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;

  .product-card:hover & {
    transform: scale(1.05);
  }
}

.product-category {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.025em;
  z-index: 1;
}

.wishlist-toggle {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 34px;
  height: 34px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
  z-index: 10;
  box-shadow: var(--shadow-sm);

  &:hover {
    transform: scale(1.1);
    color: #ef4444;
    border-color: #fecaca;
  }

  &.active {
    color: #ef4444;
    background-color: #fef2f2;
    border-color: #fecaca;
  }
}

.product-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-title {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.8rem;
  color: var(--text-primary);
  transition: color 0.2s ease;
}

.product-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-primary);
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.rating-stars {
  font-weight: 600;
  color: #f59e0b; // Yellow-500
}
</style>
