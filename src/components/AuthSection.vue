<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import LoginModal from '@/components/LoginModal.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const isLoginModalOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  if (route.meta.requiresAuth) {
    router.push('/')
  }
}
</script>

<template>
  <div class="auth-section">
    <template v-if="!authStore.isAuthenticated">
      <button class="icon-btn" @click="isLoginModalOpen = true" aria-label="Open login modal">
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
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </template>

    <LoginModal :is-open="isLoginModalOpen" @close="isLoginModalOpen = false" />
  </div>
</template>

<style scoped lang="scss">
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

  &:hover {
    background-color: var(--bg-body);
    color: var(--color-primary);
  }
}

.logout-btn {
  &:hover {
    color: #ef4444; // Red-500
    background-color: #fef2f2; // Red-50
  }
}
</style>
