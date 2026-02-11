<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Product } from '@/types'
import { productService } from '@/services/productService'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import ProductWishlistButton from '@/components/ProductWishlistButton.vue'
import CategoryTag from '@/components/CategoryTag.vue'
import ProductRating from '@/components/ProductRating.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseSpinner from '@/components/BaseSpinner.vue'
import ProductToast, { type Toast } from '@/components/ProductToast.vue'

const route = useRoute()
const product = ref<Product | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const cartStore = useCartStore()
const authStore = useAuthStore()
const isAdding = ref(false)

const toasts = ref<Toast[]>([])
let nextToastId = 0

const addToast = (
  message: string,
  type: 'success' | 'error' | 'info' = 'info',
  duration = 2000,
) => {
  const id = nextToastId++
  const toast: Toast = { id, message, type }
  toasts.value.push(toast)

  setTimeout(() => {
    removeToast(id)
  }, duration)
}

const removeToast = (id: number) => {
  const index = toasts.value.findIndex((t) => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

const cartItem = computed(() =>
  product.value ? cartStore.items.find((item) => item.id === product.value!.id) : null,
)

const handleUpdateQuantity = (quantity: number) => {
  if (product.value) {
    if (quantity === 0 && cartItem.value?.quantity === 1) {
      addToast('Item removed from cart', 'info')
    }
    cartStore.updateQuantity(product.value.id, quantity)
  }
}

const handleAddToCart = () => {
  if (product.value) {
    isAdding.value = true
    cartStore.addItem(product.value)

    setTimeout(() => {
      isAdding.value = false
      addToast('Item added to cart', 'success')
    }, 500)
  }
}

const fetchProduct = async () => {
  const idParam = route.params.id
  const id = Number(idParam)

  if (!idParam || isNaN(id)) {
    error.value = 'Invalid product ID.'
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true
    error.value = null
    product.value = await productService.getProductById(id)
  } catch (err) {
    error.value = 'Failed to load product details. Please try again later.'
    console.error('Error fetching product:', err)
  } finally {
    isLoading.value = false
  }
}

// Re-fetch when ID changes (e.g., navigating between products)
watch(
  () => route.params.id,
  () => {
    fetchProduct()
  },
)

onMounted(() => {
  fetchProduct()
})
</script>

<template>
  <div class="product-view">
    <!-- Back Navigation -->
    <BaseButton to="/" variant="ghost" size="sm" class="back-link">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      Back to collection
    </BaseButton>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <BaseSpinner size="lg" />
      <p>Loading product details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <BaseButton @click="fetchProduct">Try Again</BaseButton>
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
          <CategoryTag :category="product.category" />
          <h1 class="product-title">{{ product.title }}</h1>

          <ProductRating
            :rate="product.rating.rate"
            :count="product.rating.count"
            mode="extended"
          />

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
                <BaseButton
                  variant="outline"
                  size="sm"
                  @click="handleUpdateQuantity(cartItem.quantity - 1)"
                  aria-label="Decrease quantity"
                >
                  -
                </BaseButton>
                <span class="qty-value">{{ cartItem.quantity }} in cart</span>
                <BaseButton
                  variant="outline"
                  size="sm"
                  @click="handleUpdateQuantity(cartItem.quantity + 1)"
                  aria-label="Increase quantity"
                >
                  +
                </BaseButton>
              </div>

              <!-- Add to Cart Button if not in cart -->
              <BaseButton
                v-else
                @click="handleAddToCart"
                :isLoading="isAdding"
                block
                data-test="add-to-cart-btn"
              >
                Add to Cart
              </BaseButton>

              <!-- Wishlist Button -->
              <ProductWishlistButton v-if="product" :product="product" size="md" />
            </template>
          </div>
        </div>
      </div>
    </div>

    <ProductToast :toasts="toasts" />
  </div>
</template>

<style scoped lang="scss">
.product-view {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 1rem 1rem 4rem;
}

.back-link {
  margin-bottom: 2rem;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rem 0;
  text-align: center;
  gap: 2rem;
}

.error-icon {
  font-size: 3rem;
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

.product-title {
  font-size: 2rem;
  line-height: 1.2;
  color: var(--text-primary);
  font-weight: 700;
  letter-spacing: -0.02em;
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
  position: relative; /* For toast positioning */

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

  .qty-value {
    font-weight: 700;
    color: var(--text-primary);
    font-size: 0.95rem;
  }
}
</style>
