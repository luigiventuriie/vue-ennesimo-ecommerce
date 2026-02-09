import { api } from './api';
import type { LoginCredentials, LoginResponse } from '@/types';

export const authService = {
  /**
   * Logs in a user and returns a JWT token
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return api.post<LoginResponse>('/auth/login', credentials);
  },

  /**
   * Mock user data fetching (FakeStoreAPI doesn't have a direct 'me' endpoint with tokens)
   * In a real app, we would fetch the user profile using the token.
   */
  async getUserProfile(id: number) {
    return api.get(`/users/${id}`);
  }
};
