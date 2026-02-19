<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Product } from '@/types'
import { productService } from '@/services/productService'
import ProductCard from '@/components/ProductCard.vue'
import { useSearchStore } from '@/stores/search'
import { computed } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseSpinner from '@/components/BaseSpinner.vue'

const route = useRoute()
const products = ref<Product[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const searchStore = useSearchStore()

const sortOption = ref('alphabetical-asc')
const currentPage = ref(1)
const itemsPerPage = ref(8)

let abortController: AbortController | null = null

const fetchProducts = async () => {
  // Cancel previous request if it exists
  if (abortController) {
    abortController.abort()
  }

  // Create new abort controller for this request
  abortController = new AbortController()

  isLoading.value = true
  error.value = null

  try {
    const category = route.query.category as string
    const searchQuery = searchStore.debouncedQuery

    // Use the new filtered products method with abort signal
    products.value = await productService.getFilteredProducts(
      {
        category: category || undefined,
        search: searchQuery || undefined,
      },
      abortController.signal,
    )
  } catch (err: any) {
    // Don't show error if request was aborted
    if (err.name === 'AbortError') {
      return
    }

    error.value = 'Failed to load products. Please try again later.'
    console.error('Error fetching products:', err)
  } finally {
    isLoading.value = false
    abortController = null
  }
}

const filteredProducts = computed(() => products.value)

const sortedProducts = computed(() => {
  const list = [...filteredProducts?.value]
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

// Watch for search changes - always refetch from API and reset page
watch(
  () => searchStore.debouncedQuery,
  () => {
    currentPage.value = 1
    fetchProducts()
  },
  { immediate: false },
)

// Watch for category changes - refetch from API
watch(
  () => route.query.category,
  () => {
    currentPage.value = 1
    fetchProducts()
  },
)

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="home-page">
    <div class="page-header">
      <div class="header-main">
        <h1 class="page-title">
          {{ route.query.category ? `${route.query.category} Products` : 'All Products' }}
        </h1>
        <p v-if="!isLoading && filteredProducts?.length > 0" class="product-count">
          {{ filteredProducts.length }} items found
          <span v-if="searchStore.debouncedQuery">for "{{ searchStore.debouncedQuery }}"</span>
        </p>
        <p v-else-if="isLoading && searchStore.debouncedQuery" class="product-count loading">
          <BaseSpinner size="sm" />
          Searching for "{{ searchStore.debouncedQuery }}"...
        </p>
      </div>

      <!-- Controls (Sort) -->
      <div v-if="!isLoading && products?.length > 0" class="controls">
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
      <BaseSpinner size="lg" />
      <p>Fetching amazing products...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <BaseButton @click="fetchProducts">Try Again</BaseButton>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredProducts?.length === 0" class="empty-state">
      <div class="empty-icon">🔍</div>
      <p v-if="searchStore.debouncedQuery">
        No products match your search "{{ searchStore.debouncedQuery }}".
      </p>
      <p v-else>No products found in this category.</p>
      <BaseButton @click="searchStore.clearSearch()">Clear Search</BaseButton>
    </div>

    <!-- Product Grid & Pagination -->
    <template v-else>
      <div class="product-grid">
        <ProductCard v-for="product in paginatedProducts" :key="product.id" :product="product" />
      </div>

      <div v-if="totalPages > 1" class="pagination" data-test="pagination">
        <BaseButton
          variant="outline"
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage === 1"
          class="page-btn prev"
        >
          &larr; Previous
        </BaseButton>

        <div class="page-numbers">
          <BaseButton
            v-for="page in totalPages"
            :key="page"
            @click="handlePageChange(page)"
            :variant="currentPage === page ? 'primary' : 'outline'"
            class="page-num-btn"
            data-test="page-num-btn"
          >
            {{ page }}
          </BaseButton>
        </div>

        <BaseButton
          variant="outline"
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="page-btn next"
        >
          Next &rarr;
        </BaseButton>
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

  &.loading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-primary);
  }
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

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-num-btn {
  width: 40px;
  min-width: 40px;
  padding: 0;
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

.error-icon {
  font-size: 3rem;
}
</style>
