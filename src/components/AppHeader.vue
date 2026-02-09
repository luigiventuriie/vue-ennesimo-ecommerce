<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productService } from '@/services/productService'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { formatCategory } from '@/utils/formatters'
import logo from '@/assets/ennesimo_logo.png'

// Categories Logic
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
  <header class="app-header">
    <div class="container">
      <!-- Logo -->
      <router-link to="/" class="logo">
        <img :src="logo" alt="Ennesimo logo" class="logo-img" />
      </router-link>

      <!-- Desktop Nav -->
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

      <!-- Actions -->
      <div class="actions">
        <!-- Theme Toggle -->
        <ThemeToggle />

        <!-- Login -->
        <button class="icon-btn" aria-label="Login">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  height: var(--header-height);
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 50;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;

  .container {
    max-width: var(--container-width);
    margin: 0 auto;
    padding: 0 1rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--color-primary);

  &:hover {
    color: var(--color-primary-hover);
  }

  &-text {
    letter-spacing: -0.025em;
  }

  .logo-img {
    height: 30px; // adjust as needed
    width: auto;
    display: block;
  }
}

.desktop-nav {
  display: none;
  gap: 2rem;

  @media (min-width: 768px) {
    display: flex;
  }

  .nav-link {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);

    &:hover {
      color: var(--color-primary);
    }
  }
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-btn {
  padding: 0.5rem;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--bg-body);
    color: var(--color-primary);
  }
}
</style>
