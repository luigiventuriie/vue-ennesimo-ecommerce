<script setup lang="ts">
import { useSearchStore } from '@/stores/search'
import { useRouter } from 'vue-router'

const searchStore = useSearchStore()
const router = useRouter()
</script>

<template>
  <div class="search-container">
    <div class="search-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="search-icon"
      >
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
</template>

<style scoped lang="scss">
.search-container {
  flex: 1;
  max-width: 250px;
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
</style>
