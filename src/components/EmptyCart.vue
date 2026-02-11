<script setup lang="ts">
import BaseButton from './BaseButton.vue'
</script>

<template>
  <div class="empty-cart">
    <div class="empty-icon">🛒</div>
    <h2>Your cart is empty</h2>
    <p>Looks like you haven't added anything to your cart yet.</p>
    <BaseButton to="/" variant="primary" size="md">Start Shopping</BaseButton>
  </div>
</template>

<style scoped lang="scss">
.empty-cart {
  text-align: center;
  padding: 5rem 1rem;
  background-color: var(--bg-card);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }
}
</style>
