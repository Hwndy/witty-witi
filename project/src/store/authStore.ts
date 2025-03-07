import { create } from 'zustand';
import { AuthState } from '../types';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../api';

const useAuthStore = create<AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiLogin({ email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, error: null });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Login failed. Please check your credentials.' 
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  register: async (username, email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiRegister({ username, email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, error: null });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Registration failed. Please try again.' 
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    
    try {
      set({ isLoading: true });
      const response = await getCurrentUser();
      set({ user: response.data, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('token');
      set({ isAuthenticated: false, user: null, token: null });
    } finally {
      set({ isLoading: false });
    }
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
}));

export default useAuthStore;