import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { login as apiLogin, getCurrentUser, register as apiRegister } from '../api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastChecked: number | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  clearError: () => void;
}

// Use persist middleware to keep auth state across page refreshes
const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastChecked: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiLogin({ email, password });

      if (response.data.token) {
        // Store token in localStorage for API requests
        localStorage.setItem('token', response.data.token);

        // Store user data and auth state in persisted store
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          lastChecked: Date.now()
        });

        toast.success('Login successful!');
      }
    } catch (error: any) {
      set({
        error: error.message || 'Login failed',
        isLoading: false,
        isAuthenticated: false
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      isAuthenticated: false,
      error: null,
      lastChecked: null
    });
    toast.success('Logged out successfully');
  },

  checkAuth: async () => {
    try {
      // Check if we already have a user in the store and if we checked recently (within 5 minutes)
      const state = get();
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (state.isAuthenticated && state.user && state.lastChecked &&
          (now - state.lastChecked < fiveMinutes)) {
        // Already authenticated and checked recently, no need to check with server
        return;
      }

      set({ isLoading: true });
      const token = localStorage.getItem('token');

      if (!token) {
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          lastChecked: now
        });
        return;
      }

      // Only make the API call if we have a token but no user data
      const response = await getCurrentUser();
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
        lastChecked: now
      });
    } catch (error: any) {
      console.error('Auth check failed:', error?.message || 'Unknown error');

      // Only clear token if it's an authentication error
      if (error?.response?.status === 401) {
        localStorage.removeItem('token');
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Session expired. Please login again.',
          lastChecked: Date.now()
        });
      } else {
        // For other errors, don't change auth state
        set({
          isLoading: false,
          error: 'Could not verify authentication status.',
          lastChecked: Date.now()
        });
      }
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiRegister({ username, email, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          lastChecked: Date.now()
        });
        toast.success('Registration successful!');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}),
{
  name: 'auth-storage', // name of the item in localStorage
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    lastChecked: state.lastChecked
  }), // only store user and authentication status
})
);



export default useAuthStore;
