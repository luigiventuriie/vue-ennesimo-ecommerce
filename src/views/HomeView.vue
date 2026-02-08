<script setup lang="ts">
import { onMounted } from 'vue';
import { api } from '@/services/api';

onMounted(async () => {
  try {
    const products = await api.get('/products?limit=5');
    console.log('API Check:', products);
  } catch (error) {
    console.error('API Check Failed:', error);
  }
});
</script>

<template>
  <div class="home">
    <h1 class="title">Welcome to Ennesimo Ecommerce</h1>
    <p>Loading products for test... check console.</p>
  </div>
</template>

<style scoped lang="scss">
.title {
  color: var(--color-primary);
}
</style>
