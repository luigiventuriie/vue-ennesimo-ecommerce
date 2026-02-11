<script setup lang="ts">
defineProps<{
  totalItems: number
  totalPrice: number
}>()
</script>

<template>
  <aside class="cart-summary">
    <div class="summary-card">
      <h2 class="summary-title">Order Summary</h2>
      
      <div class="summary-row">
        <span>Subtotal ({{ totalItems }} items)</span>
        <span>${{ totalPrice.toFixed(2) }}</span>
      </div>
      
      <div class="summary-row">
        <span>Shipping</span>
        <span class="free-shipping">FREE</span>
      </div>
      
      <div class="summary-divider"></div>
      
      <div class="summary-row total">
        <span>Total</span>
        <span>${{ totalPrice.toFixed(2) }}</span>
      </div>

      <button class="checkout-btn">
        Proceed to Checkout
      </button>
      
      <p class="shipping-info">
        Shipping and taxes calculated at checkout
      </p>
    </div>
    
    <router-link to="/" class="back-link">
      ← Continue Shopping
    </router-link>
  </aside>
</template>

<style scoped lang="scss">
.cart-summary {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.summary-card {
  background-color: var(--bg-card);
  padding: 2rem;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  color: var(--text-secondary);

  &.total {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-top: 1rem;
    margin-bottom: 0;
  }

  .free-shipping {
    color: #10b981; // Emerald-500
    font-weight: 700;
  }
}

.summary-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 1.5rem 0;
}

.checkout-btn {
  width: 100%;
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: var(--radius-lg);
  font-weight: 700;
  font-size: 1rem;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
}

.shipping-info {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: center;
  margin-top: 1rem;
}

.back-link {
  text-align: center;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: color 0.2s;

  &:hover {
    color: var(--color-primary);
  }
}
</style>
