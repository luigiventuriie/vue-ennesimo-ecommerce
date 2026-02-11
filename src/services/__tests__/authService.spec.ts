import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '../authService'
import { api } from '../api'
import type { LoginCredentials, LoginResponse, User } from '@/types'

vi.mock('../api')

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockCredentials: LoginCredentials = {
        username: 'johnd',
        password: 'm38rmF$'
      }
      const mockResponse: LoginResponse = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const result = await authService.login(mockCredentials)

      expect(api.post).toHaveBeenCalledWith('/auth/login', mockCredentials)
      expect(result).toEqual(mockResponse)
      expect(result.token).toBeDefined()
    })

    it('should handle login errors with invalid credentials', async () => {
      const mockCredentials: LoginCredentials = {
        username: 'invalid',
        password: 'wrong'
      }
      const mockError = new Error('Invalid credentials')
      vi.mocked(api.post).mockRejectedValue(mockError)

      await expect(authService.login(mockCredentials)).rejects.toThrow('Invalid credentials')
    })

    it('should handle network errors during login', async () => {
      const mockCredentials: LoginCredentials = {
        username: 'johnd',
        password: 'm38rmF$'
      }
      const mockError = new Error('Network error')
      vi.mocked(api.post).mockRejectedValue(mockError)

      await expect(authService.login(mockCredentials)).rejects.toThrow('Network error')
    })
  })

  describe('getAllUsers', () => {
    it('should fetch all users', async () => {
      const mockUsers: User[] = [
        {
          id: 1,
          email: 'john@example.com',
          username: 'johnd',
          password: 'm38rmF$',
          name: {
            firstname: 'John',
            lastname: 'Doe'
          },
          address: {
            city: 'kilcoole',
            street: '7835 new road',
            number: 3,
            zipcode: '12926-3874',
            geolocation: {
              lat: '-37.3159',
              long: '81.1496'
            }
          },
          phone: '1-570-236-7033'
        },
        {
          id: 2,
          email: 'morrison@example.com',
          username: 'mor_2314',
          password: '83r5^_',
          name: {
            firstname: 'David',
            lastname: 'Morrison'
          },
          address: {
            city: 'Cullman',
            street: 'Frances Ct',
            number: 86,
            zipcode: '29567-1452',
            geolocation: {
              lat: '-68.6102',
              long: '-47.0653'
            }
          },
          phone: '1-389-555-6832'
        }
      ]
      vi.mocked(api.get).mockResolvedValue(mockUsers)

      const result = await authService.getAllUsers()

      expect(api.get).toHaveBeenCalledWith('/users')
      expect(result).toEqual(mockUsers)
      expect(result).toHaveLength(2)
    })

    it('should handle errors when fetching users', async () => {
      const mockError = new Error('Failed to fetch users')
      vi.mocked(api.get).mockRejectedValue(mockError)

      await expect(authService.getAllUsers()).rejects.toThrow('Failed to fetch users')
    })
  })

  describe('getUserProfile', () => {
    it('should fetch a user profile by ID', async () => {
      const mockUser: User = {
        id: 1,
        email: 'john@example.com',
        username: 'johnd',
        password: 'm38rmF$',
        name: {
          firstname: 'John',
          lastname: 'Doe'
        },
        address: {
          city: 'kilcoole',
          street: '7835 new road',
          number: 3,
          zipcode: '12926-3874',
          geolocation: {
            lat: '-37.3159',
            long: '81.1496'
          }
        },
        phone: '1-570-236-7033'
      }
      vi.mocked(api.get).mockResolvedValue(mockUser)

      const result = await authService.getUserProfile(1)

      expect(api.get).toHaveBeenCalledWith('/users/1')
      expect(result).toEqual(mockUser)
      expect(result.id).toBe(1)
    })

    it('should handle errors when fetching user profile', async () => {
      const mockError = new Error('User not found')
      vi.mocked(api.get).mockRejectedValue(mockError)

      await expect(authService.getUserProfile(999)).rejects.toThrow('User not found')
    })
  })
})
