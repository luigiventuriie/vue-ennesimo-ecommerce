import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
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
  let router: any

  beforeEach(async () => {
    vi.clearAllMocks()
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        {
          path: '/cart',
          name: 'cart',
          component: { template: '<div>Cart</div>' },
          meta: { requiresAuth: true },
        },
      ],
    })
  })

  it('renders branding and dynamic navigation links', async () => {
    const mockCategories = ['electronics', 'jewelry']
    ;(productService.getCategories as any).mockResolvedValue(mockCategories)

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: { isAuthenticated: false, user: null },
              cart: { items: [] },
              wishlist: { items: [] },
            },
          }),
        ],
        stubs: {
          // RouterLink: RouterLinkStub, // Use real router but stub components
          ThemeToggle: true,
          LoginModal: true,
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
        plugins: [
          router,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: { isAuthenticated: false, user: null },
              cart: { items: [] },
              wishlist: { items: [] },
            },
          }),
        ],
        stubs: {
          ThemeToggle: true,
          LoginModal: true,
        },
      },
    })

    expect(wrapper.find('[aria-label="Open login modal"]').exists()).toBe(true)
    expect(wrapper.find('.cart-btn').exists()).toBe(false)
  })

  it('renders user greeting and logout when authenticated', () => {
    ;(productService.getCategories as any).mockResolvedValue([])
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                token: 'fake-token',
                user: { name: { firstname: 'John' } },
              },
              cart: { items: [] },
              wishlist: { items: [] },
            },
          }),
        ],
        stubs: {
          ThemeToggle: true,
          LoginModal: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Hi, John')
    expect(wrapper.find('.logout-btn').exists()).toBe(true)
  })

  it('renders cart badge with correct count', () => {
    ;(productService.getCategories as any).mockResolvedValue([])
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: { token: 'fake-token' },
              cart: { items: [{ id: 1, quantity: 3 }] },
              wishlist: { items: [] },
            },
          }),
        ],
        stubs: {
          ThemeToggle: true,
          LoginModal: true,
        },
      },
    })

    expect(wrapper.find('.cart-btn').exists()).toBe(true)
    expect(wrapper.find('.cart-badge').text()).toBe('3')
  })

  it('redirects to home when logging out from a protected route', async () => {
    // Setup router at /cart
    await router.push('/cart')
    await router.isReady()

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: { token: 'fake-token', user: { name: { firstname: 'John' } } },
              cart: { items: [] },
              wishlist: { items: [] },
            },
          }),
        ],
        stubs: { ThemeToggle: true, LoginModal: true },
      },
    })

    const pushSpy = vi.spyOn(router, 'push')

    await wrapper.find('.logout-btn').trigger('click')

    expect(pushSpy).toHaveBeenCalledWith('/')
  })

  it('renders wishlist badge with correct count', () => {
    ;(productService.getCategories as any).mockResolvedValue([])
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: { token: 'fake-token' },
              cart: { items: [] },
              wishlist: { items: [{ id: 1 }] },
            },
          }),
        ],
        stubs: {
          ThemeToggle: true,
          LoginModal: true,
        },
      },
    })

    expect(wrapper.find('.wishlist-btn').exists()).toBe(true)
    // The wishlist heart icon should have a badge with '1'
    expect(wrapper.find('.wishlist-btn .wishlist-badge').text()).toBe('1')
  })
})
