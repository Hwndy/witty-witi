import axios from 'axios';
import toast from 'react-hot-toast';

// Define the API base URL based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // Increased timeout
  withCredentials: true
});

// Log the base URL being used (for debugging)
console.log('API Base URL:', API_BASE_URL);

// Request interceptor with improved token handling
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const publicEndpoints = ['/health', '/products/featured', '/products'];
  
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  } else if (!publicEndpoints.some(endpoint => config.url?.includes(endpoint))) {
    // Only log warning for non-public endpoints
    console.warn('No authentication token found for request to:', config.url);
  }

  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Response interceptor with better error handling - without automatic redirects
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error for debugging
    console.error('API Error:', error);

    // Don't show toast for 401 errors - they will be handled by the auth store
    const is401Error = error.response?.status === 401;

    if (error.code === 'ECONNABORTED') {
      toast.error('Request timed out. Please try again.');
    } else if (!error.response) {
      toast.error('Network error. Please check your connection.');
    } else if (!is401Error) { // Only show toasts for non-401 errors
      // Handle different HTTP error status codes
      switch (error.response.status) {
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;

        case 404:
          toast.error('Resource not found.');
          break;

        case 500:
          toast.error('Server error. Please try again later.');
          console.error('Server error details:', error.response.data);
          break;

        default:
          toast.error(error.response.data?.message || 'An error occurred. Please try again.');
      }
    }

    // Let the specific components handle 401 errors and redirects
    return Promise.reject(error);
  }
);

// Auth endpoints with better error handling
export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await API.post('/auth/login', credentials);
    return response;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Invalid email or password');
    }
    throw error;
  }
};

export const register = async (userData: { username: string; email: string; password: string }) => {
  try {
    const response = await API.post('/auth/register', userData);
    return response;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error(error.response.data.message || 'User already exists');
    }
    throw error;
  }
};

export const getCurrentUser = () =>
  API.get('/auth/me');

export const updateProfile = (profileData: any) =>
  API.put('/auth/profile', profileData);

export const changePassword = (passwordData: { currentPassword: string; newPassword: string }) =>
  API.put('/auth/change-password', passwordData);

// Product endpoints
export const getProducts = async (params?: { category?: string; search?: string; sort?: string }) => {
  try {
    const response = await API.get('/products', {
      params,
      timeout: 15000 // Increase timeout for product fetching
    });
    return response;
  } catch (error: any) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = (id: string) =>
  API.get(`/products/${id}`);

// Mock data for featured products (fallback if API fails)
const mockFeaturedProducts = [
  {
    id: '1',
    name: 'Wireless Earbuds',
    price: 49.99,
    category: 'headphones',
    description: 'High-quality wireless earbuds with noise cancellation',
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    stock: 15,
    featured: true,
    rating: 4.5
  },
  {
    id: '2',
    name: 'Power Bank 10000mAh',
    price: 29.99,
    category: 'powerbanks',
    description: 'Fast charging power bank with 10000mAh capacity',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    stock: 20,
    featured: true,
    rating: 4.2
  },
  {
    id: '3',
    name: 'USB-C Charging Cable',
    price: 12.99,
    category: 'accessories',
    description: 'Durable USB-C charging cable with fast data transfer',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    stock: 30,
    featured: true,
    rating: 4.0
  },
  {
    id: '4',
    name: 'Bluetooth Speaker',
    price: 39.99,
    category: 'accessories',
    description: 'Portable Bluetooth speaker with rich bass and 10-hour battery life',
    image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    stock: 12,
    featured: true,
    rating: 4.7
  }
];

export const getFeaturedProducts = async () => {
  try {
    console.log('Fetching featured products from:', `${API_BASE_URL}/products/featured`);
    const response = await API.get('/products/featured');
    console.log('Featured products response:', response);
    return response;
  } catch (error: any) {
    console.error('Error in getFeaturedProducts:', error);

    // If in development mode or the backend is unavailable, return mock data
    if (import.meta.env.DEV || error.code === 'ERR_NETWORK' || error.response?.status === 500) {
      console.log('Using mock featured products data');
      return { data: mockFeaturedProducts };
    }

    throw error;
  }
};

export const getProductsByCategory = (category: string) =>
  API.get(`/products/category/${category}`);

export const createProduct = (productData: FormData) =>
  API.post('/products', productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const updateProduct = (id: string, productData: FormData) =>
  API.put(`/products/${id}`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteProduct = (id: string) =>
  API.delete(`/products/${id}`);

// Order endpoints
export const createOrder = (orderData: any) =>
  API.post('/orders', orderData);

export const getOrders = () =>
  API.get('/orders');

export const getOrderById = (id: string) =>
  API.get(`/orders/${id}`);

export const updateOrderStatus = (id: string, status: string) =>
  API.put(`/orders/${id}/status`, { status });

export const updatePaymentStatus = (id: string, paymentStatus: string) =>
  API.put(`/orders/${id}/payment`, { paymentStatus });

export const cancelOrder = (id: string) =>
  API.put(`/orders/${id}/cancel`);

// Review endpoints
export const createReview = (reviewData: { productId: string; rating: number; comment: string }) =>
  API.post('/reviews', reviewData);

export const getProductReviews = (productId: string) =>
  API.get(`/reviews/product/${productId}`);

export const getUserReviews = () =>
  API.get('/reviews/user');

export const updateReview = (id: string, reviewData: { rating?: number; comment?: string }) =>
  API.put(`/reviews/${id}`, reviewData);

export const deleteReview = (id: string) =>
  API.delete(`/reviews/${id}`);

// Wishlist endpoints
export const getWishlist = () =>
  API.get('/wishlist');

export const addToWishlist = (productId: string) =>
  API.post('/wishlist', { productId });

export const removeFromWishlist = (productId: string) =>
  API.delete(`/wishlist/${productId}`);

export const clearWishlist = () =>
  API.delete('/wishlist');

// User endpoints
export const getUsers = () =>
  API.get('/users');

export const getUserById = (id: string) =>
  API.get(`/users/${id}`);

export const updateUserRole = (id: string, role: string) =>
  API.put(`/users/${id}/role`, { role });

export const deleteUser = (id: string) =>
  API.delete(`/users/${id}`);

export const getUserOrders = (id?: string) =>
  id ? API.get(`/users/${id}/orders`) : API.get('/users/orders');

export const getUserStats = () =>
  API.get('/users/stats');

// Dashboard endpoints
export const getDashboardStats = () =>
  API.get('/dashboard/stats');

export const getSalesReport = (params?: { startDate?: string; endDate?: string }) =>
  API.get('/dashboard/sales', { params });

export const getSettings = () =>
  API.get('/settings');

export const updateSettings = (settings: any) =>
  API.post('/settings', settings);

// Health check endpoint
export const checkApiHealth = async () => {
  try {
    const response = await API.get('/health');
    return { status: 'online', data: response.data };
  } catch (error) {
    console.error('API health check failed:', error);
    return { status: 'offline', error };
  }
};

export default API;
