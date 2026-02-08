<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="layout">
    <header class="header">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
    </header>
    <main class="main">
      <RouterView />
    </main>
    <footer class="footer">
      <p>&copy; 2024 Ennesimo Ecommerce</p>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  padding: 1rem;
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);

  nav {
    display: flex;
    gap: 1rem;
  }
}

.main {
  flex: 1;
  padding: 2rem;
}

.footer {
  padding: 1rem;
  text-align: center;
  border-top: 1px solid var(--color-border);
}
</style>
