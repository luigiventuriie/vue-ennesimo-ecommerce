<script setup lang="ts">
import BaseButton from './BaseButton.vue'

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

      <BaseButton class="checkout-btn" variant="primary" size="lg" block>
        Proceed to Checkout
      </BaseButton>
      
      <p class="shipping-info">
        Shipping and taxes calculated at checkout
      </p>
    </div>
    
    <BaseButton to="/" variant="ghost" block>
      ← Continue Shopping
    </BaseButton>
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



.shipping-info {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: center;
  margin-top: 1rem;
}


</style>
