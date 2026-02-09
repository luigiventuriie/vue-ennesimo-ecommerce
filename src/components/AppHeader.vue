<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productService } from '@/services/productService'
import ThemeToggle from '@/components/ThemeToggle.vue'
import LoginModal from '@/components/LoginModal.vue'
import { useAuthStore } from '@/stores/auth'
import { formatCategory } from '@/utils/formatters'
import logo from '@/assets/ennesimo_logo.png'

const authStore = useAuthStore()
const isLoginModalOpen = ref(false)

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

        <!-- Auth Section -->
        <div class="auth-section">
          <template v-if="!authStore.isAuthenticated">
            <button 
              class="icon-btn" 
              @click="isLoginModalOpen = true" 
              aria-label="Open login modal"
            >
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
          </template>

          <template v-else>
            <div class="user-menu">
              <span class="user-greeting">Hi, {{ authStore.user?.name.firstname }}</span>
              <button 
                class="icon-btn logout-btn" 
                @click="authStore.logout" 
                title="Logout"
                aria-label="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Login Modal -->
    <LoginModal 
      :is-open="isLoginModalOpen" 
      @close="isLoginModalOpen = false" 
    />
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
  gap: 0.75rem;

  @media (min-width: 768px) {
    gap: 1.5rem;
  }
}

.auth-section {
  display: flex;
  align-items: center;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-greeting {
  display: none;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);

  @media (min-width: 640px) {
    display: block;
  }
}

.logout-btn {
  &:hover {
    color: #ef4444; // Red-500
    background-color: #fef2f2; // Red-50
  }
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
