<script setup lang="ts">
import CategoryNav from '@/components/CategoryNav.vue'
import SearchBar from '@/components/SearchBar.vue'
import BaseButton from '@/components/BaseButton.vue'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div class="mobile-menu-overlay" :class="{ open: isOpen }" @click.self="emit('close')">
    <div class="mobile-menu-content">
      <div class="menu-header">
        <h2 class="menu-title">Menu</h2>
        <BaseButton variant="ghost" size="sm" @click="emit('close')" aria-label="Close menu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </BaseButton>
      </div>

      <div class="menu-body">
        <div class="search-section">
          <SearchBar />
        </div>
        
        <div class="nav-section">
          <h3>Categories</h3>
          <CategoryNav mode="mobile" @item-click="emit('close')" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;

  &.open {
    opacity: 1;
    visibility: visible;

    .mobile-menu-content {
      transform: translateX(0);
    }
  }
}

.mobile-menu-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 85%;
  max-width: 320px;
  height: 100%;
  background-color: var(--bg-card);
  box-shadow: var(--shadow-xl);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.menu-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .menu-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
    color: var(--text-primary);
  }
}

.menu-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.search-section {
  /* Override SearchBar mobile styles to ensure visibility */
  :deep(.search-container) {
    display: block;
    max-width: 100%;
    margin: 0;
  }
  
  :deep(.search-wrapper .search-input) {
    background-color: var(--bg-body);
  }
}

.nav-section {
  h3 {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted); // fallback if var not defined, using text-secondary commonly
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }
}
</style>
