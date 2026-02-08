import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const theme = ref<'light' | 'dark'>('light')
  const isLoading = ref(false)

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  function setLoading(status: boolean) {
    isLoading.value = status
  }

  return { theme, isLoading, toggleTheme, setLoading }
})
