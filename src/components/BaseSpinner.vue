<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'white'
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'primary'
})
</script>

<template>
  <div class="spinner-container" :class="[size, variant]" aria-hidden="true">
    <div class="spinner"></div>
  </div>
</template>

<style scoped lang="scss">
.spinner-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  .spinner {
    border-style: solid;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  /* Sizes */
  &.sm .spinner {
    width: 18px;
    height: 18px;
    border-width: 2px;
  }

  &.md .spinner {
    width: 32px;
    height: 32px;
    border-width: 3px;
  }

  &.lg .spinner {
    width: 50px;
    height: 50px;
    border-width: 4px;
  }

  /* Variants */
  &.primary .spinner {
    border-color: var(--color-primary-light);
    border-top-color: var(--color-primary);
  }

  &.white .spinner {
    border-color: rgba(255, 255, 255, 0.3);
    border-top-color: white;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
