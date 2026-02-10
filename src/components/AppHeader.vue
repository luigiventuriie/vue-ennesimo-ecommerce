<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productService } from '@/services/productService'
import ThemeToggle from '@/components/ThemeToggle.vue'
import LoginModal from '@/components/LoginModal.vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useRouter, useRoute } from 'vue-router'
import { formatCategory } from '@/utils/formatters'
import logo from '@/assets/ennesimo_logo.png'

const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
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
          <span v-if="wishlistStore.totalItems > 0" class="cart-badge">
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
          <span v-if="cartStore.totalItems > 0" class="cart-badge">
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
