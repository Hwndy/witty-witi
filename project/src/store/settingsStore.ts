import create from 'zustand';
import { getSettings, updateSettings } from '../api';

interface Settings {
  general: {
    storeName: string;
    storeEmail: string;
    storePhone: string;
    storeAddress: string;
    currencySymbol: string;
    taxRate: number;
  };
  payment: {
    enableCashOnDelivery: boolean;
    enableBankTransfer: boolean;
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  notification: {
    orderConfirmation: boolean;
    orderStatusUpdate: boolean;
    lowStockAlert: boolean;
    newCustomerRegistration: boolean;
  };
}

interface SettingsStore {
  settings: Settings | null;
  isLoading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Settings) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: null,
  isLoading: false,
  error: null,
  
  fetchSettings: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await getSettings();
      set({ settings: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch settings' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateSettings: async (settings) => {
    try {
      set({ isLoading: true, error: null });
      const response = await updateSettings(settings);
      set({ settings: response.data.settings });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update settings' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));


