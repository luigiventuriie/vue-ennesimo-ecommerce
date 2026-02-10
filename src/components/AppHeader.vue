<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productService } from '@/services/productService'
import ThemeToggle from '@/components/ThemeToggle.vue'
import LoginModal from '@/components/LoginModal.vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useSearchStore } from '@/stores/search'
import { useRouter, useRoute } from 'vue-router'
import { formatCategory } from '@/utils/formatters'
import logo from '@/assets/ennesimo_logo.png'

const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const searchStore = useSearchStore()
const router = useRouter()
const route = useRoute()
const isLoginModalOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  if (route.meta.requiresAuth) {
    router.push('/')
  }
}

const handleCartClick = () => {
  if (authStore.isAuthenticated) {
    router.push('/cart')
  } else {
    isLoginModalOpen.value = true
  }
}

const handleWishlistClick = () => {
  if (authStore.isAuthenticated) {
    router.push('/wishlist')
  } else {
    isLoginModalOpen.value = true
  }
}

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
      <router-link to="/" class="logo" @click="searchStore.clearSearch">
        <img :src="logo" alt="Ennesimo logo" class="logo-img" />
      </router-link>

      <!-- Search Bar -->
      <div class="search-container">
        <div class="search-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            v-model="searchStore.searchQuery"
            placeholder="Search products..." 
            class="search-input"
            @focus="router.push('/')"
          />
          <button 
            v-if="searchStore.searchQuery" 
            @click="searchStore.clearSearch"
            class="clear-search"
            aria-label="Clear search"
          >
            &times;
          </button>
        </div>
      </div>

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

        <!-- Wishlist Icon -->
        <button 
          v-if="authStore.isAuthenticated"
          class="icon-btn wishlist-btn" 
          @click="handleWishlistClick"
          aria-label="View wishlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span v-if="wishlistStore.totalItems > 0" :key="wishlistStore.totalItems" class="cart-badge">
            {{ wishlistStore.totalItems }}
          </span>
        </button>

        <!-- Cart Icon -->
        <button 
          v-if="authStore.isAuthenticated"
          class="icon-btn cart-btn" 
          @click="handleCartClick"
          aria-label="View shopping cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span v-if="cartStore.totalItems > 0" :key="cartStore.totalItems" class="cart-badge">
            {{ cartStore.totalItems }}
          </span>
        </button>

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
                @click="handleLogout" 
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

.search-container {
  flex: 1;
  max-width: 400px;
  margin: 0 1.5rem;
  display: none;

  @media (min-width: 640px) {
    display: block;
  }
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
    pointer-events: none;
    z-index: 1;
  }

  .search-input {
    width: 100%;
    padding: 0.6rem 2.5rem 0.6rem 2.5rem;
    background-color: var(--bg-body);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    color: var(--text-primary);
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      background-color: var(--bg-card);
      box-shadow: 0 0 0 3px var(--color-primary-light);
    }
  }

  .clear-search {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.25rem;
    cursor: pointer;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;

    &:hover {
      background-color: var(--border-color);
      color: var(--text-primary);
    }
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

.cart-btn, .wishlist-btn {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: var(--color-primary);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid var(--bg-card);
  animation: badge-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes badge-pop {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}
</style>
