<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
</script>

<template>
  <div class="main-layout">
    <AppHeader />
    
    <main class="main-content">
      <div class="container">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  width: 100%;
  padding: 2rem 0;
}

.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
