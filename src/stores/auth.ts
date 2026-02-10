import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Cookies from 'js-cookie';
import { authService } from '@/services/authService';
import { api } from '@/services/api';
import type { LoginCredentials, User } from '@/types';

const TOKEN_KEY = 'ennesimo_auth_token';
const USER_KEY = 'ennesimo_user_data';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(Cookies.get(TOKEN_KEY) || null);
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Set initial token in API if it exists
  if (token.value) {
    api.setToken(token.value);
    // Load user data from cookie if available (simplified for persistence)
    const savedUser = Cookies.get(USER_KEY);
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
  }

  const isAuthenticated = computed(() => !!token.value);

  async function login(credentials: LoginCredentials) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authService.login(credentials);
      token.value = response.token;
      
      // Persist token in cookie (expires in 7 days)
      Cookies.set(TOKEN_KEY, response.token, { expires: 7, secure: true, sameSite: 'strict' });
      api.setToken(response.token);

      // Fetch real user profile. 
      // Since FakeStoreAPI doesn't have a 'me' endpoint, we fetch all users and find the match.
      const users = await authService.getAllUsers();
      const authenticatedUser = users.find(u => u.username === credentials.username);

      if (authenticatedUser) {
        user.value = authenticatedUser;
        Cookies.set(USER_KEY, JSON.stringify(authenticatedUser), { expires: 7, secure: true, sameSite: 'strict' });
      } else {
        // Fallback for safety, though login should have failed if user didn't exist
        console.warn('Authenticated user profile not found in users list');
      }
      
      return true;
    } catch (err: any) {
      error.value = err.message || 'Login failed. Please check your credentials.';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
    api.setToken(null);
  }

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout
  };
});
