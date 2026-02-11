import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HamburgerButton from '../HamburgerButton.vue'

describe('HamburgerButton', () => {
  it('renders correctly', () => {
    const wrapper = mount(HamburgerButton)
    expect(wrapper.find('button.hamburger-btn').exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(HamburgerButton)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
