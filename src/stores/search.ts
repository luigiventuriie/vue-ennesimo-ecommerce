import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSearchStore = defineStore('search', () => {
  const searchQuery = ref('');

  function setSearchQuery(query: string) {
    searchQuery.value = query;
  }

  function clearSearch() {
    searchQuery.value = '';
  }

  return {
    searchQuery,
    setSearchQuery,
    clearSearch
  };
});
