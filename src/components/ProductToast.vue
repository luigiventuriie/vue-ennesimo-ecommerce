<script setup lang="ts">
export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

defineProps<{
  toasts: Toast[]
}>()
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="base-toast"
        :class="toast.type"
        role="alert"
      >
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.toast-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 9999;
  pointer-events: none;
}

.base-toast {
  padding: 1rem 2rem;
  border-radius: var(--radius-lg);
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
  box-shadow: var(--shadow-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-width: 300px;
  max-width: 90vw;

  &.success {
    background-color: var(--color-primary);
  }

  &.error {
    background-color: #ef4444;
  }

  &.info {
    background-color: var(--text-primary);
  }
}

/* Transition */
.toast-enter-active,
.toast-leave-active,
.toast-move {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.toast-leave-to {
  opacity: 0;
}
</style>
