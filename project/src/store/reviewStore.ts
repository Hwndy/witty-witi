import { create } from 'zustand';
import { Review } from '../types';
import { 
  createReview, 
  getProductReviews, 
  getUserReviews, 
  updateReview, 
  deleteReview 
} from '../api';

interface ReviewState {
  productReviews: Review[];
  userReviews: Review[];
  isLoading: boolean;
  error: string | null;
  
  fetchProductReviews: (productId: string) => Promise<void>;
  fetchUserReviews: () => Promise<void>;
  addReview: (reviewData: { productId: string; rating: number; comment: string }) => Promise<void>;
  editReview: (id: string, reviewData: { rating?: number; comment?: string }) => Promise<void>;
  removeReview: (id: string) => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const useReviewStore = create<ReviewState>((set) => ({
  productReviews: [],
  userReviews: [],
  isLoading: false,
  error: null,
  
  fetchProductReviews: async (productId: string) => {
    if (!productId) {
      set({ error: 'Product ID is required', productReviews: [] });
      return;
    }

    try {
      set({ isLoading: true, error: null });
      const response = await getProductReviews(productId);
      set({ productReviews: response.data || [] });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch product reviews';
      set({ error: errorMessage, productReviews: [] });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchUserReviews: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await getUserReviews();
      set({ userReviews: response.data });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch your reviews' 
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  addReview: async (reviewData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await createReview(reviewData);
      set((state) => ({
        productReviews: [response.data, ...state.productReviews],
        userReviews: [response.data, ...state.userReviews]
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to add review' 
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  editReview: async (id, reviewData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await updateReview(id, reviewData);
      set((state) => ({
        productReviews: state.productReviews.map(review => 
          review.id === id ? response.data : review
        ),
        userReviews: state.userReviews.map(review => 
          review.id === id ? response.data : review
        )
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update review' 
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  removeReview: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await deleteReview(id);
      set((state) => ({
        productReviews: state.productReviews.filter(review => review.id !== id),
        userReviews: state.userReviews.filter(review => review.id !== id)
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete review' 
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
}));

export default useReviewStore;
