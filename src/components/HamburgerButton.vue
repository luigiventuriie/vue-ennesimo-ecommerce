<script setup lang="ts">
defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button class="hamburger-btn" @click="$emit('click')" aria-label="Open menu">
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
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  </button>
</template>

<style scoped lang="scss">
.hamburger-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.5rem;
  margin-right: 0.5rem;
  
  @media (min-width: 768px) {
    display: none;
  }
}
</style>
