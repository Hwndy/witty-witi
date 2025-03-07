import { create } from 'zustand';
import { User } from '../types';
import { 
  getUsers, 
  getUserById, 
  updateUserRole, 
  deleteUser, 
  getUserStats 
} from '../api';

interface UserState {
  users: User[];
  currentUser: User | null;
  stats: any;
  isLoading: boolean;
  error: string | null;
  
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  updateRole: (id: string, role: string) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
  fetchUserStats: () => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const useUserStore = create<UserState>((set) => ({
  users: [],
  currentUser: null,
  stats: null,
  isLoading: false,
  error: null,
  
  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await getUsers();
      set({ users: response.data });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch users' 
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchUserById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await getUserById(id);
      set({ currentUser: response.data });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch user details' 
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateRole: async (id, role) => {
    try {
      set({ isLoading: true, error: null });
      await updateUserRole(id, role);
      set((state) => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, role } : user
        ),
        currentUser: state.currentUser?.id === id 
          ? { ...state.currentUser, role } 
          : state.currentUser
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update user role' 
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  removeUser: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await deleteUser(id);
      set((state) => ({
        users: state.users.filter(user => user.id !== id),
        currentUser: state.currentUser?.id === id ? null : state.currentUser
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete user' 
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchUserStats: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await getUserStats();
      set({ stats: response.data });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch user statistics' 
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
}));

export default useUserStore;