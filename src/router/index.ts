import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('../views/ProductView.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
      meta: { requiresAuth: true }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // If we were using a separate login page: next({ name: 'login', query: { redirect: to.fullPath } })
    // Since we use a modal, we might want to stay on the current page and open the modal.
    // However, the cleanest way for router is to redirect home or keep position.
    // For now, let's allow navigation and we will handle the "empty/login" state in CartView itself, 
    // OR we can redirect to home and trigger the modal via a query param or store state.
    
    // Actually, let's keep it simple: if not authenticated, redirect to home.
    // The AppHeader/Cart icon logic will already prevent navigation to /cart if not logged in by opening the modal instead.
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
