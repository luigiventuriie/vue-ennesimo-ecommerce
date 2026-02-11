<script setup lang="ts">
import type { Product } from '@/types'
import { formatCategory } from '@/utils/formatters'
import ProductWishlistButton from '@/components/ProductWishlistButton.vue'
import CategoryTag from '@/components/CategoryTag.vue'
import ProductRating from '@/components/ProductRating.vue'

defineProps<{
  product: Product
}>()
</script>

<template>
  <router-link :to="`/product/${product.id}`" class="product-card">
    <div class="product-image-wrapper">
      <img :src="product.image" :alt="product.title" class="product-image" loading="lazy" />
      <CategoryTag :category="product.category" class="category-tag" />

      <ProductWishlistButton :product="product" size="sm" class="wishlist-toggle" />
    </div>
    <div class="product-info">
      <h3 class="product-title">{{ product.title }}</h3>
      <div class="product-footer">
        <span class="product-price">${{ product.price.toFixed(2) }}</span>
        <ProductRating :rate="product.rating.rate" :count="product.rating.count" mode="short" />
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

.category-tag {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 1;
}

.wishlist-toggle {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 10;
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
</style>
