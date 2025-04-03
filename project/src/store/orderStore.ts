import { create } from 'zustand';
import { Order } from '../types';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder
} from '../api';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;

  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  placeOrder: (orderData: any) => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<void>;
  updatePayment: (id: string, paymentStatus: string) => Promise<void>;
  cancelUserOrder: (id: string) => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await getOrders();
      set({ orders: response.data });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch orders'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOrderById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await getOrderById(id);
      set({ currentOrder: response.data });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch order details'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  placeOrder: async (orderData) => {
    try {
      set({ isLoading: true, error: null });

      // Check if token exists before making the request
      const token = localStorage.getItem('token');
      if (!token) {
        set({ error: 'Authentication required. Please log in to place an order.' });
        throw new Error('Authentication required');
      }

      console.log('Placing order with authentication token');
      const response = await createOrder(orderData);

      set((state) => ({
        orders: [response.data, ...state.orders],
        currentOrder: response.data
      }));

      return response.data;
    } catch (error: any) {
      console.error('Error in placeOrder:', error);

      // Handle different error types
      if (error.response?.status === 401) {
        set({ error: 'Your session has expired. Please log in again.' });
        // Clear invalid token
        localStorage.removeItem('token');
      } else {
        set({
          error: error.response?.data?.message || error.message || 'Failed to place order'
        });
      }

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateStatus: async (id, status) => {
    try {
      set({ isLoading: true, error: null });
      const response = await updateOrderStatus(id, status);
      set((state) => ({
        orders: state.orders.map(order =>
          order.id === id ? { ...order, status } : order
        ),
        currentOrder: state.currentOrder?.id === id
          ? { ...state.currentOrder, status }
          : state.currentOrder
      }));
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update order status'
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updatePayment: async (id, paymentStatus) => {
    try {
      set({ isLoading: true, error: null });
      const response = await updatePaymentStatus(id, paymentStatus);
      set((state) => ({
        orders: state.orders.map(order =>
          order.id === id ? { ...order, paymentStatus } : order
        ),
        currentOrder: state.currentOrder?.id === id
          ? { ...state.currentOrder, paymentStatus }
          : state.currentOrder
      }));
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update payment status'
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  cancelUserOrder: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await cancelOrder(id);
      set((state) => ({
        orders: state.orders.map(order =>
          order.id === id ? { ...order, status: 'cancelled' } : order
        ),
        currentOrder: state.currentOrder?.id === id
          ? { ...state.currentOrder, status: 'cancelled' }
          : state.currentOrder
      }));
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to cancel order'
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));

export default useOrderStore;