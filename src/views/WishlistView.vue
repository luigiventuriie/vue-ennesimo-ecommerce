<script setup lang="ts">
import { useWishlistStore } from '@/stores/wishlist';
import ProductCard from '@/components/ProductCard.vue';

const wishlistStore = useWishlistStore();
</script>

<template>
  <div class="wishlist-view">
    <div class="container">
      <h1 class="page-title">My Wishlist</h1>

      <div v-if="wishlistStore.items.length === 0" class="empty-wishlist">
        <div class="empty-icon">💖</div>
        <h2>Your wishlist is empty</h2>
        <p>Save items you love to find them easily later.</p>
        <router-link to="/" class="continue-btn">Start Shopping</router-link>
      </div>

      <div v-else class="wishlist-grid">
        <div v-for="product in wishlistStore.items" :key="product.id">
          <ProductCard :product="product" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wishlist-view {
  padding: 2rem 0 4rem;
  min-height: calc(100vh - var(--header-height));
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

.empty-wishlist {
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

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}
</style>
