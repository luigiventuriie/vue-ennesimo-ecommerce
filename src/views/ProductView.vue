<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { Product } from '@/types';
import { productService } from '@/services/productService';
import { formatCategory } from '@/utils/formatters';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useWishlistStore } from '@/stores/wishlist';

const route = useRoute();
const product = ref<Product | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const cartStore = useCartStore();
const authStore = useAuthStore();
const wishlistStore = useWishlistStore();
const isAdding = ref(false);
const showRemovedFeedback = ref(false);

const cartItem = computed(() => 
  product.value ? cartStore.items.find(item => item.id === product.value!.id) : null
);

const handleToggleWishlist = () => {
  if (authStore.isAuthenticated && product.value) {
    wishlistStore.toggleWishlist(product.value);
  }
};

const handleUpdateQuantity = (quantity: number) => {
  if (product.value) {
    if (quantity === 0 && cartItem.value?.quantity === 1) {
      showRemovedFeedback.value = true;
      setTimeout(() => {
        showRemovedFeedback.value = false;
      }, 2000);
    }
    cartStore.updateQuantity(product.value.id, quantity);
  }
};

const handleAddToCart = () => {
  if (product.value) {
    isAdding.value = true;
    cartStore.addItem(product.value);
    
    // Short delay for the spinner
    setTimeout(() => {
      isAdding.value = false;
    }, 500);
  }
};

const fetchProduct = async () => {
  const idParam = route.params.id;
  const id = Number(idParam);
  
  if (!idParam || isNaN(id)) {
    error.value = 'Invalid product ID.';
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    error.value = null;
    product.value = await productService.getProductById(id);
  } catch (err) {
    error.value = 'Failed to load product details. Please try again later.';
    console.error('Error fetching product:', err);
  } finally {
    isLoading.value = false;
  }
};

// Re-fetch when ID changes (e.g., navigating between products)
watch(() => route.params.id, () => {
  fetchProduct();
});

onMounted(() => {
  fetchProduct();
});
</script>

<template>
  <div class="product-view">
    <!-- Back Navigation -->
    <router-link to="/" class="back-link">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      Back to collection
    </router-link>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading product details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button @click="fetchProduct" class="retry-btn">Try Again</button>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="product-container">
      <div class="product-grid">
        <!-- Image Section -->
        <div class="image-section">
          <div class="image-wrapper">
            <img :src="product.image" :alt="product.title" class="product-image" />
          </div>
        </div>

        <!-- Info Section -->
        <div class="info-section">
          <span class="category-tag">{{ formatCategory(product.category) }}</span>
          <h1 class="product-title">{{ product.title }}</h1>
          
          <div class="rating-box">
            <div class="stars">
              <span v-for="i in 5" :key="i" :class="['star', { active: i <= Math.round(product.rating.rate) }]">★</span>
            </div>
            <span class="rating-text">{{ product.rating.rate }} ({{ product.rating.count }} reviews)</span>
          </div>

          <div class="price-box">
            <span class="price">${{ product.price.toFixed(2) }}</span>
          </div>

          <div class="description-box">
            <h2 class="section-title">Description</h2>
            <p class="description">{{ product.description }}</p>
          </div>

          <div class="actions-box">
            <template v-if="authStore.isAuthenticated">
              <!-- Quantity Controls if in cart -->
              <div v-if="cartItem" class="quantity-selector">
                <button 
                  @click="handleUpdateQuantity(cartItem.quantity - 1)" 
                  class="qty-btn"
                  aria-label="Decrease quantity"
                >-</button>
                <span class="qty-value">{{ cartItem.quantity }} in cart</span>
                <button 
                  @click="handleUpdateQuantity(cartItem.quantity + 1)" 
                  class="qty-btn"
                  aria-label="Increase quantity"
                >+</button>
              </div>

              <!-- Add to Cart Button if not in cart -->
              <button 
                v-else
                class="add-to-cart-btn" 
                @click="handleAddToCart"
                :disabled="isAdding"
              >
                <span v-if="isAdding" class="spinner-tiny"></span>
                <span v-else-if="showRemovedFeedback">Removed from cart</span>
                <span v-else>Add to Cart</span>
              </button>

              <!-- Wishlist Button -->
              <button 
                class="wishlist-btn" 
                :class="{ active: product && wishlistStore.isInWishlist(product.id) }"
                @click="handleToggleWishlist"
                :title="product && wishlistStore.isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" :fill="product && wishlistStore.isInWishlist(product.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-view {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 1rem 1rem 4rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  margin-bottom: 2rem;
  transition: color 0.2s;

  &:hover {
    color: var(--color-primary);
  }
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rem 0;
  text-align: center;
  gap: 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-primary-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.product-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
}

.image-section {
  .image-wrapper {
    background-color: white;
    border-radius: var(--radius-xl);
    padding: 3rem;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-sm);
  }

  .product-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-tag {
  display: inline-block;
  align-self: flex-start;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.product-title {
  font-size: 2rem;
  line-height: 1.2;
  color: var(--text-primary);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.rating-box {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stars {
  color: var(--color-divider);
  font-size: 1.25rem;

  .star.active {
    color: #f59e0b; // Yellow-500
  }
}

.rating-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.price-box {
  .price {
    font-size: 2.25rem;
    font-weight: 700;
    color: var(--color-primary);
  }
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.description {
  color: var(--text-secondary);
  line-height: 1.7;
}

.actions-box {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  
  @media (min-width: 640px) {
    flex-direction: row;
  }
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: var(--bg-card);
  border: 2px solid var(--color-primary-light);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  flex: 1;
  justify-content: space-between;

  .qty-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-body);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: var(--color-primary-light);
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  }

  .qty-value {
    font-weight: 700;
    color: var(--text-primary);
    font-size: 0.95rem;
  }
}

.add-to-cart-btn {
  flex: 1;
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: translateY(0);
  }
}

.wishlist-btn {
  width: 52px;
  height: 52px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #ef4444; // Red-500
    border-color: #fecaca; // Red-200
    background-color: #fef2f2; // Red-50
  }

  &.active {
    color: #ef4444;
    border-color: #fecaca;
    background-color: #fef2f2;
  }
}

.retry-btn {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: var(--color-primary-hover);
  }
}

.spinner-tiny {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
</style>
