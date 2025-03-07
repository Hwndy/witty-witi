import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return {
          items: state.items.map(item => 
            item.product.id === product.id 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      }
      
      return { items: [...state.items, { product, quantity }] };
    });
  },
  
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter(item => item.product.id !== productId)
    }));
  },
  
  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    }));
  },
  
  clearCart: () => {
    set({ items: [] });
  },
  
  getTotalPrice: () => {
    return get().items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  },
  
  getTotalItems: () => {
    return get().items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  },
}));

export default useCartStore;