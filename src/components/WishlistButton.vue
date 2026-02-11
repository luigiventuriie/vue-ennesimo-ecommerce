<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useWishlistStore } from '@/stores/wishlist'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const wishlistStore = useWishlistStore()
const router = useRouter()

const handleWishlistClick = () => {
  if (authStore.isAuthenticated) {
    router.push('/wishlist')
  }
}
</script>

<template>
  <button
    v-if="authStore.isAuthenticated"
    class="icon-btn wishlist-btn"
    @click="handleWishlistClick"
    aria-label="View wishlist"
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
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      ></path>
    </svg>
    <span v-if="wishlistStore.totalItems > 0" :key="wishlistStore.totalItems" class="cart-badge">
      {{ wishlistStore.totalItems }}
    </span>
  </button>
</template>

<style scoped lang="scss">
.icon-btn {
  padding: 0.5rem;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: var(--bg-body);
    color: var(--color-primary);
  }
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
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
