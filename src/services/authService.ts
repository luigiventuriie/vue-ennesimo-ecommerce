import { api } from './api';
import type { LoginCredentials, LoginResponse, User } from '@/types';

export const authService = {
  /**
   * Logs in a user and returns a JWT token
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return api.post<LoginResponse>('/auth/login', credentials);
  },

  /**
   * Fetches all users (used to find profile on login as FakeStoreAPI lacks 'me' endpoint)
   */
  async getAllUsers(): Promise<User[]> {
    return api.get<User[]>('/users');
  },

  /**
   * Fetches a specific user profile by ID
   */
  async getUserProfile(id: number): Promise<User> {
    return api.get<User>(`/users/${id}`);
  }
};
