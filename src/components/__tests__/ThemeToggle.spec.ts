import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ThemeToggle from '../ThemeToggle.vue'

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
  })

  it('toggles dark mode', async () => {
    const wrapper = mount(ThemeToggle)

    // Initial state (light)
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    // Toggle -> Dark
    await wrapper.trigger('click')
    await flushPromises()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggles back to light mode', async () => {
    const wrapper = mount(ThemeToggle)

    // Initial state (light)
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    // Toggle -> Dark
    await wrapper.trigger('click')
    await flushPromises()
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Toggle -> Light
    await wrapper.trigger('click')
    await flushPromises()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
