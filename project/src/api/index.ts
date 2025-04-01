import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const login = (credentials: { email: string; password: string }) => 
  API.post('/auth/login', credentials);

export const register = (userData: { username: string; email: string; password: string }) => 
  API.post('/auth/register', userData);

export const getCurrentUser = () => 
  API.get('/auth/me');

export const updateProfile = (profileData: any) => 
  API.put('/auth/profile', profileData);

export const changePassword = (passwordData: { currentPassword: string; newPassword: string }) => 
  API.put('/auth/change-password', passwordData);

// Product endpoints
export const getProducts = (params?: { category?: string; search?: string; sort?: string }) => 
  API.get('/products', { params });

export const getProductById = (id: string) => 
  API.get(`/products/${id}`);

export const getFeaturedProducts = () => 
  API.get('/products/featured');

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

export default API;
