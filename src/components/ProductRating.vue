<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  rate: number
  count: number
  mode?: 'short' | 'extended'
}>()

const roundedRate = computed(() => Math.round(props.rate))
</script>

<template>
  <div class="product-rating" :class="mode || 'short'">
    <!-- Extended Mode: 5 Stars -->
    <template v-if="mode === 'extended'">
      <div class="stars-visual">
        <span
          v-for="i in 5"
          :key="i"
          class="star"
          :class="{ active: i <= roundedRate }"
        >★</span>
      </div>
      <span class="rating-text">
        <span class="rate-value">{{ rate.toFixed(1) }}</span>
        <span class="count-value">({{ count }} reviews)</span>
      </span>
    </template>

    <!-- Short Mode: Single Star -->
    <template v-else>
      <div class="rating-compact">
        <span class="star active">★</span>
        <span class="rate-value">{{ rate.toFixed(1) }}</span>
        <span class="count-value">({{ count }})</span>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.product-rating {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .star {
    color: var(--color-divider);
    user-select: none;
    
    &.active {
      color: #f59e0b; // Yellow-500
    }
  }
}

/* Extended Mode Styles */
.product-rating.extended {
  gap: 1rem;

  .stars-visual {
    display: flex;
    gap: 2px;
    font-size: 1.25rem;
  }

  .rating-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
    display: flex;
    gap: 0.5rem;
    align-items: center;

    .rate-value {
      font-weight: 700;
      color: var(--text-primary);
    }
  }
}

/* Short Mode Styles */
.product-rating.short {
  gap: 0.25rem;
  font-size: 0.85rem;

  .rating-compact {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--text-secondary);

    .star {
      font-size: 1rem;
    }

    .rate-value {
      font-weight: 600;
      color: #f59e0b;
    }

    .count-value {
      opacity: 0.8;
    }
  }
}
</style>
