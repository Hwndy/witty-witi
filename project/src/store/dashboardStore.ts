import { create } from 'zustand';
import { getDashboardStats, getSalesReport } from '../api';

interface DashboardState {
  stats: any;
  salesReport: any;
  isLoading: boolean;
  error: string | null;
  
  fetchDashboardStats: () => Promise<void>;
  fetchSalesReport: (params?: { startDate?: string; endDate?: string }) => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  salesReport: null,
  isLoading: false,
  error: null,
  
  fetchDashboardStats: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await getDashboardStats();
      set({ stats: response.data });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch dashboard statistics' 
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchSalesReport: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const response = await getSalesReport(params);
      set({ salesReport: response.data });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch sales report' 
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
}));

export default useDashboardStore;