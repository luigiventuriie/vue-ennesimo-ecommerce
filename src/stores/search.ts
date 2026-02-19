import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const searchQuery = ref('')
  const debouncedQuery = ref('')

  let debounceTimeout: ReturnType<typeof setTimeout> | null = null

  // Sanitize input to prevent XSS and trim whitespace
  function sanitizeSearchQuery(searchQuery: string): string {
    return searchQuery
      .trim() // Remove leading/trailing whitespace
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/[^\w\s\-']/g, '') // Allow only alphanumeric, spaces, hyphens, and apostrophes
      .substring(0, 100) // Limit length to 100 characters
  }

  function startDebounceTimeout(sanitizeSearchQuery: string) {
    debounceTimeout = setTimeout(() => {
      debouncedQuery.value = sanitizeSearchQuery
    }, 300)
  }

  function clearPendingDebounce() {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
      debounceTimeout = null
    }
  }

  watch(searchQuery, (newSearchQueryValue) => {
    clearPendingDebounce()

    const sanitizedSearchQuery = sanitizeSearchQuery(newSearchQueryValue)

    startDebounceTimeout(sanitizedSearchQuery)
  })

  function setSearchQuery(query: string) {
    searchQuery.value = sanitizeSearchQuery(query)
  }

  function clearSearch() {
    searchQuery.value = ''
    debouncedQuery.value = ''
    clearPendingDebounce()
  }

  return {
    searchQuery,
    debouncedQuery,
    setSearchQuery,
    clearSearch,
  }
})
