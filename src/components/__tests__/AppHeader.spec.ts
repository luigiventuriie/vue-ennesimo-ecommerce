import { describe, it, expect, vi } from 'vitest'
import { mount, RouterLinkStub, flushPromises } from '@vue/test-utils'
import AppHeader from '../AppHeader.vue'
import { productService } from '@/services/productService'

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock productService
vi.mock('@/services/productService', () => ({
  productService: {
    getCategories: vi.fn(),
  },
}))

describe('AppHeader', () => {
  it('renders navigation links from service', async () => {
    // Mock return values
    const mockCategories = ['electronics', 'jewelry', "men's clothing", "women's clothing"]
    ;(productService.getCategories as any).mockResolvedValue(mockCategories)

    const wrapper = mount(AppHeader, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    // Wait for onMounted async call
    await flushPromises()

    // check if formatCategory works (capitalization)
    expect(wrapper.text()).toContain('Electronics')
    expect(wrapper.text()).toContain('Jewelry')
    expect(wrapper.text()).toContain("Men's Clothing")
    expect(wrapper.text()).toContain("Women's Clothing")
  })

  it('renders ThemeToggle component', () => {
    ;(productService.getCategories as any).mockResolvedValue([])
    const wrapper = mount(AppHeader, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
          ThemeToggle: true,
        },
      },
    })

    expect(wrapper.find('theme-toggle-stub').exists()).toBe(true)
  })
})
