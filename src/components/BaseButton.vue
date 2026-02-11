<script setup lang="ts">
import { computed } from 'vue'
import BaseSpinner from './BaseSpinner.vue'

interface Props {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  disabled?: boolean
  block?: boolean
  to?: string | object
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  isLoading: false,
  disabled: false,
  block: false,
  type: 'button'
})

const isRouterLink = computed(() => !!props.to)

const componentType = computed(() => {
  if (isRouterLink.value) return 'router-link'
  return 'button'
})

const buttonProps = computed(() => {
  if (isRouterLink.value) {
    return { to: props.to }
  }
  return { 
    type: props.type, 
    disabled: props.disabled || props.isLoading 
  }
})
</script>

<template>
  <component
    :is="componentType"
    v-bind="buttonProps"
    class="base-button"
    :class="[variant, size, { 'is-loading': isLoading, 'is-block': block }]"
  >
    <div v-if="isLoading" class="button-loader">
      <BaseSpinner :size="size === 'lg' ? 'md' : 'sm'" :variant="variant === 'primary' ? 'white' : 'primary'" />
    </div>
    <span class="button-content" :class="{ 'opacity-0': isLoading }">
      <slot></slot>
    </span>
  </component>
</template>

<style scoped lang="scss">
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-weight: 600;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  border: 1px solid transparent;
  white-space: nowrap;
  user-select: none;

  &.is-block {
    display: flex;
    width: 100%;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  .button-loader {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
  }

  .button-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .opacity-0 {
    opacity: 0;
  }
}

/* Sizes */
.base-button.sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.8125rem;
}

.base-button.md {
  padding: 0.75rem 1.25rem;
  font-size: 0.9375rem;
}

.base-button.lg {
  padding: 1rem 2rem;
  font-size: 1.0625rem;
  border-radius: var(--radius-lg);
}

/* Variants */
.base-button.primary {
  background-color: var(--color-primary);
  color: white;

  &:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
}

.base-button.outline {
  background-color: transparent;
  border-color: var(--border-color);
  color: var(--text-primary);

  &:hover:not(:disabled) {
    background-color: var(--bg-body);
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
}

.base-button.ghost {
  background-color: transparent;
  color: var(--text-secondary);

  &:hover:not(:disabled) {
    background-color: var(--bg-body);
    color: var(--color-primary);
  }
}

.base-button.danger {
  background-color: transparent;
  border-color: #fecaca; // Red-200
  color: #ef4444; // Red-500

  &:hover:not(:disabled) {
    background-color: #fef2f2; // Red-50
    border-color: #ef4444;
  }
}

/* Custom rounded corners from variables where applicable */
.base-button {
  &.lg { border-radius: var(--radius-lg); }
}
</style>
