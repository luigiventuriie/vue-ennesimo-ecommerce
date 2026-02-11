<script setup lang="ts">
import logo from '@/assets/ennesimo_logo.png'
import { useSearchStore } from '@/stores/search'

const searchStore = useSearchStore()
</script>

<template>
  <router-link to="/" class="logo" @click="searchStore.clearSearch">
    <img :src="logo" alt="Ennesimo logo" class="logo-img" />
  </router-link>
</template>

<style scoped lang="scss">
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--color-primary);
  text-decoration: none;

  &:hover {
    color: var(--color-primary-hover);
  }

  .logo-img {
    height: 30px;
    width: auto;
    display: block;
  }
}
</style>
