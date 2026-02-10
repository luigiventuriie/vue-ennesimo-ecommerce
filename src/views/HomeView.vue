<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Product } from '@/types'
import { productService } from '@/services/productService'
import ProductCard from '@/components/ProductCard.vue'
import { useSearchStore } from '@/stores/search'
import { computed } from 'vue'

const route = useRoute()
const products = ref<Product[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const searchStore = useSearchStore()

// Sorting & Pagination State
const sortOption = ref('alphabetical-asc')
const currentPage = ref(1)
const itemsPerPage = ref(8)

const fetchProducts = async () => {
  isLoading.value = true
  error.value = null
  currentPage.value = 1 // Reset pagination on new fetch (category change)

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

// Search & Filter Logic
const filteredProducts = computed(() => {
  if (!searchStore.searchQuery) return products.value
  const query = searchStore.searchQuery.toLowerCase()
  return products.value.filter(p => p.title?.toLowerCase().includes(query))
})

// Sorting Logic
const sortedProducts = computed(() => {
  const list = [...filteredProducts.value]
  switch (sortOption.value) {
    case 'alphabetical-asc':
      return list.sort((a, b) => a.title.localeCompare(b.title))
    case 'alphabetical-desc':
      return list.sort((a, b) => b.title.localeCompare(a.title))
    case 'price-low':
      return list.sort((a, b) => a.price - b.price)
    case 'price-high':
      return list.sort((a, b) => b.price - a.price)
    case 'rating':
      return list.sort((a, b) => b.rating.rate - a.rating.rate)
    default:
      return list
  }
})

// Pagination Logic
const totalPages = computed(() => Math.ceil(sortedProducts.value.length / itemsPerPage.value))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedProducts.value.slice(start, end)
})

const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watch for search changes to reset page
watch(() => searchStore.searchQuery, () => {
  currentPage.value = 1
})

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
      <div class="header-main">
        <h1 class="page-title">
          {{ route.query.category ? `${route.query.category} Products` : 'All Products' }}
        </h1>
        <p v-if="filteredProducts.length > 0" class="product-count">
          {{ filteredProducts.length }} items found
          <span v-if="searchStore.searchQuery">for "{{ searchStore.searchQuery }}"</span>
        </p>
      </div>

      <!-- Controls (Sort) -->
      <div v-if="!isLoading && products.length > 0" class="controls">
        <div class="sort-wrapper">
          <label for="sort" class="sort-label">Sort by:</label>
          <select id="sort" v-model="sortOption" class="sort-select">
            <option value="alphabetical-asc">Alphabetical: A-Z</option>
            <option value="alphabetical-desc">Alphabetical: Z-A</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>
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
    <div v-else-if="filteredProducts.length === 0" class="empty-state">
      <div class="empty-icon">🔍</div>
      <p v-if="searchStore.searchQuery">No products match your search "{{ searchStore.searchQuery }}".</p>
      <p v-else>No products found in this category.</p>
      <button @click="searchStore.clearSearch(); fetchProducts()" class="clear-btn">Clear All Filters</button>
    </div>

    <!-- Product Grid & Pagination -->
    <template v-else>
      <div class="product-grid">
        <ProductCard v-for="product in paginatedProducts" :key="product.id" :product="product" />
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="handlePageChange(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="page-btn prev"
        >
          &larr; Previous
        </button>
        
        <div class="page-numbers">
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="handlePageChange(page)"
            :class="['page-num', { active: currentPage === page }]"
          >
            {{ page }}
          </button>
        </div>

        <button 
          @click="handlePageChange(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          class="page-btn next"
        >
          Next &rarr;
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.home-page {
  padding-bottom: 3rem;
}

.page-header {
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.header-main {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.page-title {
  text-transform: capitalize;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.product-count {
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 500;
}

.controls {
  display: flex;
  gap: 1rem;
}

.sort-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .sort-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .sort-select {
    padding: 0.5rem 2rem 0.5rem 1rem;
    background-color: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px var(--color-primary-light);
    }

    &:hover {
      border-color: var(--color-primary);
    }
  }
}

.pagination {
  margin-top: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.page-btn {
  padding: 0.6rem 1.25rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background-color: var(--color-primary-light);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-num {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(.active) {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  &.active {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
    cursor: default;
  }
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
