import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSearchStore } from '../search';

describe('Search Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with empty search query', () => {
    const store = useSearchStore();
    expect(store.searchQuery).toBe('');
  });

  it('updates search query', () => {
    const store = useSearchStore();
    store.setSearchQuery('laptop');
    expect(store.searchQuery).toBe('laptop');
  });

  it('clears search query', () => {
    const store = useSearchStore();
    store.setSearchQuery('phone');
    store.clearSearch();
    expect(store.searchQuery).toBe('');
  });
});
