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
      set({ products: response.data });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch products' 
      });
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
      set({ featuredProducts: response.data });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch featured products' 
      });
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