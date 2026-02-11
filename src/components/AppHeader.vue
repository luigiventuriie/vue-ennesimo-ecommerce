<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
import SearchBar from '@/components/SearchBar.vue'
import WishlistButton from '@/components/WishlistButton.vue'
import CartButton from '@/components/CartButton.vue'
import AuthSection from '@/components/AuthSection.vue'
import CategoryNav from '@/components/CategoryNav.vue'
import AppLogo from '@/components/AppLogo.vue'
import MobileMenu from '@/components/MobileMenu.vue'
import HamburgerButton from '@/components/HamburgerButton.vue'
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)
</script>

<template>
  <header class="app-header">
    <div class="container">
      <HamburgerButton @click="isMobileMenuOpen = true" />

      <AppLogo />

      <SearchBar />

      <CategoryNav />

      <div class="actions">
        <ThemeToggle />

        <WishlistButton />

        <CartButton />

        <AuthSection />
      </div>
    </div>

    <MobileMenu :is-open="isMobileMenuOpen" @close="isMobileMenuOpen = false" />
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

.actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (min-width: 768px) {
    gap: 0.5rem;
  }
}
</style>
