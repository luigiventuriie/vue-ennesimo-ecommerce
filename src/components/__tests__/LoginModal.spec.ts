import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import LoginModal from '../LoginModal.vue'
import { useAuthStore } from '@/stores/auth'
import { nextTick } from 'vue'

describe('LoginModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly when open', () => {
    const wrapper = mount(LoginModal, {
      props: { isOpen: true },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    expect(wrapper.find('.modal-content').exists()).toBe(true)
    expect(wrapper.find('.modal-title').text()).toBe('Welcome Back')
  })

  it('does not render when closed', () => {
    const wrapper = mount(LoginModal, {
      props: { isOpen: false },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    expect(wrapper.find('.modal-content').exists()).toBe(false)
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(LoginModal, {
      props: { isOpen: true },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    await wrapper.find('.close-btn').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('close')
  })

  it('shows error if fields are empty during login', async () => {
    const wrapper = mount(LoginModal, {
      props: { isOpen: true },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.find('.error-message').text()).toContain(
      'Please enter both username and password',
    )
  })

  it('calls authStore.login with correct credentials', async () => {
    const wrapper = mount(LoginModal, {
      props: { isOpen: true },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    })

    const authStore = useAuthStore()
    // createTestingPinia automatically mocks actions, so authStore.login is already a spy
    ;(authStore.login as any).mockResolvedValue(true)

    const usernameInput = wrapper.find('#username')
    const passwordInput = wrapper.find('#password')

    await usernameInput.setValue('johnd')
    await passwordInput.setValue('m38rmF$')
    await nextTick()

    await wrapper.find('form').trigger('submit.prevent')

    expect(authStore.login).toHaveBeenCalledWith({
      username: 'johnd',
      password: 'm38rmF$',
    })

    await flushPromises()
    expect(wrapper.emitted()).toHaveProperty('close')
  })
})
