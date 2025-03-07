import { create } from 'zustand';
import { Product } from '../types';
import { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist as clearWishlistApi 
} from '../api';

interface WishlistState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
  
  fetchWishlist: () => Promise<void>;
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const useWishlistStore = create<WishlistState>((set) => ({
  items: [],
  isLoading: false,
  error: null,
  
  fetchWishlist: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await getWishlist();
      set({ items: response.data.products });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch wishlist' 
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  addItem: async (productId) => {
    try {
      set({ isLoading: true, error: null });
      await addToWishlist(productId);
      // Refresh wishlist after adding
      const response = await getWishlist();
      set({ items: response.data.products });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to add item to wishlist' 
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  removeItem: async (productId) => {
    try {
      set({ isLoading: true, error: null });
      await removeFromWishlist(productId);
      set((state) => ({
        items: state.items.filter(item => item.id !== productId)
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to remove item from wishlist' 
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  clearWishlist: async () => {
    try {
      set({ isLoading: true, error: null });
      await clearWishlistApi();
      set({ items: [] });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to clear wishlist' 
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
}));

export default useWishlistStore;