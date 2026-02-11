<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productService } from '@/services/productService'
import { formatCategory } from '@/utils/formatters'

const categories = ref<string[]>([])
const isLoading = ref(false)

const fetchCategories = async () => {
  try {
    isLoading.value = true
    categories.value = await productService.getCategories()
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<template>
  <nav class="desktop-nav">
    <router-link
      v-for="category in categories"
      :key="category"
      :to="{ path: '/', query: { category } }"
      class="nav-link"
    >
      {{ formatCategory(category) }}
    </router-link>
  </nav>
</template>

<style scoped lang="scss">
.desktop-nav {
  display: none;
  gap: 1.5rem;

  @media (min-width: 768px) {
    display: flex;
  }

  .nav-link {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: var(--color-primary);
    }
  }
}
</style>
