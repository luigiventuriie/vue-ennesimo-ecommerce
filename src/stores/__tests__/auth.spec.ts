import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import { authService } from '@/services/authService'
import Cookies from 'js-cookie'
import { api } from '@/services/api'

// Mock dependencies
vi.mock('@/services/authService')
vi.mock('js-cookie')
vi.mock('@/services/api', () => ({
  api: {
    setToken: vi.fn(),
  },
}))

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('initializes with null state if no cookies', () => {
    ;(Cookies.get as any).mockReturnValue(undefined)
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBe(null)
  })

  it('logs in successfully and persists token', async () => {
    const store = useAuthStore()
    const mockCredentials = { username: 'testuser', password: 'password' }
    const mockResponse = { token: 'jwt-token' }
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      name: { firstname: 'Test', lastname: 'User' },
    }

    ;(authService.login as any).mockResolvedValue(mockResponse)
    ;(authService.getAllUsers as any).mockResolvedValue([mockUser])

    const success = await store.login(mockCredentials)

    expect(success).toBe(true)
    expect(store.token).toBe('jwt-token')
    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
    expect(Cookies.set).toHaveBeenCalledWith('ennesimo_auth_token', 'jwt-token', expect.any(Object))
    expect(Cookies.set).toHaveBeenCalledWith(
      'ennesimo_user_data',
      JSON.stringify(mockUser),
      expect.any(Object),
    )
    expect(api.setToken).toHaveBeenCalledWith('jwt-token')
  })

  it('handles login failure', async () => {
    const store = useAuthStore()
    ;(authService.login as any).mockRejectedValue(new Error('Invalid credentials'))

    const success = await store.login({ username: 'wrong', password: 'pwd' })

    expect(success).toBe(false)
    expect(store.isAuthenticated).toBe(false)
    expect(store.error).toBe('Invalid credentials')
  })

  it('logs out and clears persistence', () => {
    const store = useAuthStore()
    store.token = 'existing-token'

    store.logout()

    expect(store.token).toBe(null)
    expect(store.user).toBe(null)
    expect(Cookies.remove).toHaveBeenCalledWith('ennesimo_auth_token')
    expect(api.setToken).toHaveBeenCalledWith(null)
  })
})
