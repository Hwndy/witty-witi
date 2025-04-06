import { create } from 'zustand';
import { Product } from '../types';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
} from '../api';

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;

  fetchProducts: (params?: { category?: string; search?: string; sort?: string }) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<void>;
  addProduct: (productData: FormData) => Promise<void>;
  editProduct: (id: string, productData: FormData) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const useProductStore = create<ProductState>((set) => ({
  products: [],
  featuredProducts: [],
  currentProduct: null,
  isLoading: false,
  error: null,

  fetchProducts: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const response = await getProducts(params);
      if (!response.data) throw new Error('No data received from server');
      set({ products: response.data });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch products';
      set({ error: errorMessage });
      console.error('Error in fetchProducts:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProductById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await getProductById(id);
      set({ currentProduct: response.data });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch product details'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await getFeaturedProducts();
      
      if (!response.data) throw new Error('No data received from server');
      
      // Ensure the response data is an array
      const products = Array.isArray(response.data) ? response.data : 
                      (response.data.products || response.data.data || []);
      
      set({ featuredProducts: products });
      console.log('Featured products loaded successfully:', products.length, 'items');
    } catch (error: any) {
      let errorMessage = 'Failed to fetch featured products';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ error: errorMessage });
      console.error('Error in fetchFeaturedProducts:', error);
      
      // If in development or API is down, use mock data
      if (import.meta.env.DEV || error.code === 'ERR_NETWORK') {
        const { mockFeaturedProducts } = await import('../api');
        set({ featuredProducts: mockFeaturedProducts });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProductsByCategory: async (category) => {
    try {
      set({ isLoading: true, error: null });
      const response = await getProductsByCategory(category);
      set({ products: response.data });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch products by category'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addProduct: async (productData) => {
    try {
      set({ isLoading: true, error: null });
      await createProduct(productData);
      // Refresh products list after adding
      const response = await getProducts();
      set({ products: response.data });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to add product'
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  editProduct: async (id, productData) => {
    try {
      set({ isLoading: true, error: null });
      await updateProduct(id, productData);
      // Refresh products list after editing
      await useProductStore.getState().fetchProducts();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update product'
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeProduct: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await deleteProduct(id);
      // Update products list after deletion
      await useProductStore.getState().fetchProducts();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete product'
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));

export default useProductStore;
