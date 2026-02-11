import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import CategoryNav from '../CategoryNav.vue'
import { productService } from '@/services/productService'

// Mock productService
vi.mock('@/services/productService', () => ({
  productService: {
    getCategories: vi.fn(),
  },
}))

describe('CategoryNav', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/', component: { template: '<div>Home</div>' } }]
  })

  it('renders desktop mode by default', async () => {
    (productService.getCategories as any).mockResolvedValue(['electronics', 'jewelry'])
    const wrapper = mount(CategoryNav, {
      global: { plugins: [router] }
    })

    await flushPromises()
    expect(wrapper.find('nav').classes()).toContain('category-nav')
    expect(wrapper.find('nav').classes()).not.toContain('mobile')
    expect(wrapper.text()).toContain('Electronics')
    expect(wrapper.text()).toContain('Jewelry')
  })

  it('renders mobile mode when prop is passed', async () => {
    (productService.getCategories as any).mockResolvedValue(['electronics'])
    const wrapper = mount(CategoryNav, {
      props: { mode: 'mobile' },
      global: { plugins: [router] }
    })

    await flushPromises()
    expect(wrapper.find('nav').classes()).toContain('mobile')
  })

  it('emits item-click when a link is clicked', async () => {
    (productService.getCategories as any).mockResolvedValue(['electronics'])
    const wrapper = mount(CategoryNav, {
      global: { plugins: [router] }
    })

    await flushPromises()
    await wrapper.find('.nav-link').trigger('click')
    expect(wrapper.emitted('item-click')).toBeTruthy()
  })
})
