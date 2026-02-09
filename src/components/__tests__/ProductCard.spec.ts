import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import ProductCard from '../ProductCard.vue'
import type { Product } from '@/types'

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'Test Description',
  category: 'electronics',
  image: 'test-image.jpg',
  rating: {
    rate: 4.5,
    count: 10,
  },
}

describe('ProductCard', () => {
  it('renders product details correctly', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Test Product')
    expect(wrapper.text()).toContain('Electronics')
    expect(wrapper.text()).toContain('$29.99')
    expect(wrapper.text()).toContain('4.5')
    expect(wrapper.text()).toContain('(10)')

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('test-image.jpg')
    expect(img.attributes('alt')).toBe('Test Product')
  })

  it('links to the correct product detail page', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const link = wrapper.getComponent(RouterLinkStub)
    expect(link.props().to).toBe('/product/1')
  })
})
