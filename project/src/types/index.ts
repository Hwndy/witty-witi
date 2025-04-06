export interface Product {
  id: string;
  _id?: string; // MongoDB ObjectId
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  stock: number;
  featured?: boolean;
  rating?: number;
  numReviews?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  createdAt?: string;
}

export interface Order {
  id: string;
  user: string | User;
  items: Array<{
    product: string | Product;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalPrice: number;
  shippingAddress: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: 'card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  product: string | Product;
  user: string | User;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  lowStockProducts: Product[];
  recentOrders: Order[];
  categorySales: Record<string, number>;
  monthlySales: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

export interface SalesReport {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  salesByPaymentMethod: Record<string, number>;
  salesByStatus: Record<string, number>;
  orders: Order[];
}

export interface UserStats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  newUsers: number;
}