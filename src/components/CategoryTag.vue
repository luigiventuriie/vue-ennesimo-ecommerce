<script setup lang="ts">
import { formatCategory } from '@/utils/formatters'

defineProps<{
  category: string
}>()
</script>

<template>
  <span class="category-tag">
    {{ formatCategory(category) }}
  </span>
</template>

<style scoped lang="scss">
.category-tag {
  display: inline-block;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}
</style>
