import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../HomeView.vue'
import { productService } from '@/services/productService'

// Mock productService
vi.mock('@/services/productService', () => ({
  productService: {
    getProducts: vi.fn(),
    getProductsByCategory: vi.fn(),
  },
}))

// Mock Router
// Will be initialized in beforeEach

const mockProducts = [
  {
    id: 1,
    title: 'Product 1',
    price: 10,
    category: 'electronics',
    image: '',
    rating: { rate: 4, count: 5 },
  },
  {
    id: 2,
    title: 'Product 2',
    price: 20,
    category: 'jewelry',
    image: '',
    rating: { rate: 5, count: 10 },
  },
]

describe('HomeView', () => {
  let router: any

  beforeEach(async () => {
    vi.clearAllMocks()
    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: { template: '<div>Home</div>' } }],
    })
    router.push('/')
    await router.isReady()
  })

  it('fetches all products on mount when no category is specified', async () => {
    ;(productService.getProducts as any).mockResolvedValue(mockProducts)

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    expect(productService.getProducts).toHaveBeenCalled()
    expect(wrapper.findAll('.product-card').length).toBe(2)
    expect(wrapper.text()).toContain('All Products')
  })

  it('fetches products by category when specified in query', async () => {
    ;(productService.getProductsByCategory as any).mockResolvedValue([mockProducts[0]])

    // Set query before mount
    await router.push({ path: '/', query: { category: 'electronics' } })

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    expect(productService.getProductsByCategory).toHaveBeenCalledWith('electronics')
    expect(wrapper.findAll('.product-card').length).toBe(1)
    expect(wrapper.text()).toContain('electronics Products')
  })

  it('shows loading state while fetching', async () => {
    // Create a promise that we control
    let resolvePromise: any
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })

    ;(productService.getProducts as any).mockReturnValue(promise)

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router],
      },
    })

    await nextTick()
    expect(wrapper.find('.loading-state').exists()).toBe(true)

    resolvePromise(mockProducts)
    await flushPromises()

    expect(wrapper.find('.loading-state').exists()).toBe(false)
  })

  it('shows error state when fetching fails', async () => {
    ;(productService.getProducts as any).mockRejectedValue(new Error('API Error'))

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()

    expect(wrapper.find('.error-state').exists()).toBe(true)
    expect(wrapper.text()).toContain('Failed to load products')
  })
})
