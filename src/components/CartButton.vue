<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()

const handleCartClick = () => {
  if (authStore.isAuthenticated) {
    router.push('/cart')
  }
}
</script>

<template>
  <button
    v-if="authStore.isAuthenticated"
    class="icon-btn cart-btn"
    data-test="cart-btn"
    @click="handleCartClick"
    aria-label="View shopping cart"
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
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
    <span v-if="cartStore.totalItems > 0" :key="cartStore.totalItems" class="cart-badge">
      {{ cartStore.totalItems }}
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

.cart-btn {
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
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
