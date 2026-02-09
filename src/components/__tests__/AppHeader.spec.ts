import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
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
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders branding and dynamic navigation links', async () => {
    const mockCategories = ['electronics', 'jewelry']
    ;(productService.getCategories as any).mockResolvedValue(mockCategories)

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            auth: { isAuthenticated: false, user: null }
          }
        })],
        stubs: {
          RouterLink: RouterLinkStub,
          ThemeToggle: true,
          LoginModal: true
        },
      },
    })

    // Wait for onMounted async call
    await flushPromises()

    expect(wrapper.find('.logo-img').exists()).toBe(true)
    expect(wrapper.text()).toContain('Electronics')
    expect(wrapper.text()).toContain('Jewelry')
  })

  it('renders login button when unauthenticated', () => {
    ;(productService.getCategories as any).mockResolvedValue([])
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            auth: { isAuthenticated: false, user: null }
          }
        })],
        stubs: {
          RouterLink: RouterLinkStub,
          ThemeToggle: true,
          LoginModal: true
        },
      },
    })

    expect(wrapper.find('[aria-label="Open login modal"]').exists()).toBe(true)
  })

  it('renders user greeting and logout when authenticated', () => {
    ;(productService.getCategories as any).mockResolvedValue([])
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            auth: { 
              token: 'fake-token',
              user: { name: { firstname: 'John' } } 
            }
          }
        })],
        stubs: {
          RouterLink: RouterLinkStub,
          ThemeToggle: true,
          LoginModal: true
        },
      },
    })

    expect(wrapper.text()).toContain('Hi, John')
    expect(wrapper.find('.logout-btn').exists()).toBe(true)
  })
})
