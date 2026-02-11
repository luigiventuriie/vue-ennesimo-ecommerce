<template>
  <div class="empty-cart">
    <div class="empty-icon">🛒</div>
    <h2>Your cart is empty</h2>
    <p>Looks like you haven't added anything to your cart yet.</p>
    <router-link to="/" class="continue-btn">Start Shopping</router-link>
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

  .continue-btn {
    display: inline-block;
    background-color: var(--color-primary);
    color: white;
    padding: 0.75rem 2rem;
    border-radius: var(--radius-md);
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;

    &:hover {
      background-color: var(--color-primary-hover);
      transform: translateY(-2px);
    }
  }
}
</style>
