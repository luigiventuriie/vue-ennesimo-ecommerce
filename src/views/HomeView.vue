<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Product } from '@/types'
import { productService } from '@/services/productService'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const products = ref<Product[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const fetchProducts = async () => {
  isLoading.value = true
  error.value = null

  try {
    const category = route.query.category as string
    if (category) {
      products.value = await productService.getProductsByCategory(category)
    } else {
      products.value = await productService.getProducts()
    }
  } catch (err) {
    error.value = 'Failed to load products. Please try again later.'
    console.error('Error fetching products:', err)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => route.query.category,
  () => {
    fetchProducts()
  },
)

onMounted(() => {
  fetchProducts()
})

const clearFilter = () => {
  // Clearing the query will trigger the watcher
}
</script>

<template>
  <div class="home-page">
    <div class="page-header">
      <h1 class="page-title">
        {{ route.query.category ? `${route.query.category} Products` : 'All Products' }}
      </h1>
      <p v-if="products.length > 0" class="product-count">{{ products.length }} items found</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Fetching amazing products...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button @click="fetchProducts" class="retry-btn">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="products.length === 0" class="empty-state">
      <p>No products found in this category.</p>
      <router-link to="/" class="clear-btn">Back to All Products</router-link>
    </div>

    <!-- Product Grid -->
    <div v-else class="product-grid">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-page {
  padding-bottom: 3rem;
}

.page-header {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.page-title {
  text-transform: capitalize;
  font-size: 1.75rem;
  color: var(--text-primary);
}

.product-count {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 1rem;
  text-align: center;
  gap: 1.5rem;
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-primary-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-icon {
  font-size: 3rem;
}

.retry-btn,
.clear-btn {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-primary-hover);
  }
}

.clear-btn {
  display: inline-block;
  color: white;

  &:hover {
    color: white;
  }
}
</style>
