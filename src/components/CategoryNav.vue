<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productService } from '@/services/productService'
import { formatCategory } from '@/utils/formatters'

interface Props {
  mode?: 'desktop' | 'mobile'
}

withDefaults(defineProps<Props>(), {
  mode: 'desktop',
})

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
  <nav :class="['category-nav', mode]">
    <router-link
      v-for="category in categories"
      :key="category"
      :to="{ path: '/', query: { category } }"
      class="nav-link"
      @click="$emit('item-click')"
    >
      {{ formatCategory(category) }}
    </router-link>
  </nav>
</template>

<style scoped lang="scss">
.category-nav {
  display: flex;
  gap: 1rem;

  &.desktop {
    display: none;

    @media (min-width: 768px) {
      display: flex;
    }
  }

  &.mobile {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;

    .nav-link {
      display: block;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--border-color);
      font-size: 1rem;

      &:last-child {
        border-bottom: none;
      }
    }
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
