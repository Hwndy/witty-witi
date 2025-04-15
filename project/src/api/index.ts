import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://witty-witti-backend.onrender.com/api';

// We'll use the actual API for all environments
const USE_MOCK_DATA = false;

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization, X-Request-With'
  },
  timeout: 60000, // Increased timeout to 60 seconds
  withCredentials: false // Set to false to avoid CORS preflight issues
});

// Log the base URL and mock data status
console.log('API Base URL:', API_BASE_URL);
console.log('Using mock data:', USE_MOCK_DATA ? 'Yes' : 'No');

// Request interceptor with improved token handling
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const publicEndpoints = ['/health', '/products/featured', '/products', '/products/category'];
  const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));

  // Log for debugging
  console.log('Making request to:', config.url);

  // Only log token info for non-public endpoints
  if (!isPublicEndpoint) {
    console.log('Token exists:', !!token);
  }

  if (token && !isPublicEndpoint) {
    // Ensure headers object exists
    config.headers = config.headers || {};

    // Set Authorization header with Bearer token
    config.headers.Authorization = `Bearer ${token}`;

    // Log the authorization header (for debugging only, remove in production)
    console.log('Authorization header set:', `Bearer ${token.substring(0, 10)}...`);
  }

  // Add CORS headers to every request
  if (config.headers) {
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    config.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, X-Request-With';
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

// Mock data for all products
const mockProducts = [
  ...mockFeaturedProducts,
  {
    id: '5',
    name: 'Bluetooth Speaker',
    price: 79.99,
    category: 'speakers',
    description: 'Portable Bluetooth speaker with 20 hours of battery life',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    stock: 8,
    rating: 4.2
  },
  {
    id: '6',
    name: 'Wireless Mouse',
    price: 24.99,
    category: 'accessories',
    description: 'Ergonomic wireless mouse with long battery life',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    stock: 30,
    rating: 4.0
  },
  {
    id: '7',
    name: 'Mechanical Keyboard',
    price: 89.99,
    category: 'accessories',
    description: 'RGB mechanical keyboard with customizable keys',
    image: 'https://images.unsplash.com/photo-1595225476474-63038da0e238?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    stock: 15,
    rating: 4.6
  },
  {
    id: '8',
    name: 'USB-C Hub',
    price: 39.99,
    category: 'accessories',
    description: '7-in-1 USB-C hub with HDMI, USB-A, and SD card reader',
    image: 'https://images.unsplash.com/photo-1636118128964-5b31968f31e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    stock: 20,
    rating: 4.3
  }
];

// Product endpoints
export const getProducts = async (params?: { category?: string; search?: string; sort?: string }) => {
  // If USE_MOCK_DATA is true, skip the API call and return mock data directly
  if (USE_MOCK_DATA) {
    console.log('Using mock products data (CORS prevention)');

    // Filter mock data based on params
    let filteredProducts = [...mockProducts];

    if (params?.category) {
      filteredProducts = filteredProducts.filter(p => p.category === params.category);
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    if (params?.sort) {
      switch (params.sort) {
        case 'price_asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'name_asc':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
    }

    return { data: filteredProducts };
  }

  try {
    const response = await API.get('/products', {
      params,
      timeout: 15000 // Increase timeout for product fetching
    });
    return response;
  } catch (error: any) {
    console.error('Error fetching products:', error);

    // If there's any error, return mock data as fallback
    console.log('Using mock products data (API error fallback)');
    return { data: mockProducts };
  }
};

export const getProductById = async (id: string) => {
  // If USE_MOCK_DATA is true, skip the API call and return mock data directly
  if (USE_MOCK_DATA) {
    console.log('Using mock product data for ID:', id);
    const product = mockProducts.find(p => p.id === id);

    if (product) {
      return { data: product };
    } else {
      throw new Error('Product not found');
    }
  }

  try {
    const response = await API.get(`/products/${id}`);
    return response;
  } catch (error: any) {
    console.error('Error fetching product by ID:', error);

    // If there's any error, try to return mock data as fallback
    const product = mockProducts.find(p => p.id === id);
    if (product) {
      console.log('Using mock product data (API error fallback)');
      return { data: product };
    }

    throw error;
  }
};

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
  // If USE_MOCK_DATA is true, skip the API call and return mock data directly
  if (USE_MOCK_DATA) {
    console.log('Using mock featured products data (CORS prevention)');
    return { data: mockFeaturedProducts };
  }

  try {
    console.log('Fetching featured products from:', `${API_BASE_URL}/products/featured`);
    const response = await API.get('/products/featured');
    console.log('Featured products response:', response);
    return response;
  } catch (error: any) {
    console.error('Error in getFeaturedProducts:', error);

    // If there's any error, return mock data as fallback
    console.log('Using mock featured products data (API error fallback)');
    return { data: mockFeaturedProducts };
  }
};

export const getProductsByCategory = async (category: string) => {
  // If USE_MOCK_DATA is true, skip the API call and return mock data directly
  if (USE_MOCK_DATA) {
    console.log('Using mock products data for category:', category);
    const filteredProducts = mockProducts.filter(p => p.category === category);
    return { data: filteredProducts };
  }

  try {
    const response = await API.get(`/products/category/${category}`);
    return response;
  } catch (error: any) {
    console.error('Error fetching products by category:', error);

    // If there's any error, return mock data as fallback
    console.log('Using mock products data for category (API error fallback):', category);
    const filteredProducts = mockProducts.filter(p => p.category === category);
    return { data: filteredProducts };
  }
};

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
// Mock order storage in localStorage
const saveMockOrder = (order: any) => {
  try {
    // Get existing orders from localStorage
    const existingOrdersStr = localStorage.getItem('mockOrders');
    const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];

    // Add the new order
    existingOrders.push(order);

    // Save back to localStorage
    localStorage.setItem('mockOrders', JSON.stringify(existingOrders));
    console.log('Saved mock order to localStorage');
  } catch (error) {
    console.error('Error saving mock order to localStorage:', error);
  }
};

// Mock order creation function - completely independent of backend
const createMockOrder = (orderData: any) => {
  console.log('Creating mock order with data:', orderData);

  // Generate a random order ID
  const orderId = 'mock_' + Math.random().toString(36).substring(2, 15);

  // Validate order items
  if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
    console.error('Order validation failed: No items in order');
    throw new Error('Order must contain at least one item');
  }

  // Process and normalize the items
  const processedItems = orderData.items.map((item: any) => {
    // Extract product ID from various possible formats
    let productId;

    if (item.product) {
      // If product is a string, use it directly
      if (typeof item.product === 'string') {
        productId = item.product;
      }
      // If product is an object with id, use that
      else if (item.product.id) {
        productId = item.product.id;
      }
      // If product is an object with _id, use that
      else if (item.product._id) {
        productId = item.product._id;
      }
    }
    // Fall back to productId if available
    else if (item.productId) {
      productId = item.productId;
    }
    // Last resort - generate a random ID
    else {
      productId = 'unknown_' + Math.random().toString(36).substring(2, 10);
      console.warn('Generated random product ID for item:', item.name || 'Unknown item');
    }

    // Return a normalized item structure
    return {
      product: productId,
      productId: productId,
      name: item.name || 'Unknown Product',
      price: item.price || 0,
      quantity: item.quantity || 1,
      image: item.image || ''
    };
  });

  // Create a complete mock order
  const mockOrder = {
    id: orderId,
    items: processedItems,
    totalPrice: orderData.totalPrice,
    shippingAddress: orderData.shippingAddress,
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail,
    customerPhone: orderData.customerPhone,
    paymentMethod: orderData.paymentMethod,
    paymentStatus: 'pending',
    status: 'pending',
    notes: orderData.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Save the mock order to localStorage
  saveMockOrder(mockOrder);

  // Return a mock successful response
  return {
    data: {
      success: true,
      order: mockOrder,
      message: 'Order created successfully (mock)'
    }
  };
};

// Create an order using the actual API
export const createOrder = async (orderData: any) => {
  try {
    console.log('Creating order with API');
    console.log('Order data being sent:', JSON.stringify(orderData, null, 2));

    // Ensure the order data is properly formatted
    const formattedOrderData = {
      ...orderData,
      // Make sure each item has the required product field
      items: orderData.items.map((item: any) => ({
        product: item.product, // This should be the product ID
        quantity: item.quantity,
        price: item.price,
        name: item.name
      }))
    };

    // Make the actual API call
    const response = await API.post('/orders', formattedOrderData);
    console.log('Order creation response:', response.data);
    return response;
  } catch (error: any) {
    console.error('Error in createOrder:', error);

    // Handle different error types
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Server responded with error:', error.response.status);
      console.error('Error data:', error.response.data);

      if (error.response.status === 401) {
        throw new Error('Authentication required to place order');
      } else if (error.response.status === 400) {
        // Bad request - likely validation error
        const errorMessage = error.response.data?.message ||
                            error.response.data?.error ||
                            'Invalid order data. Please check your information.';
        throw new Error(errorMessage);
      } else {
        throw new Error(error.response.data?.message || 'Server error while creating order');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please try again later.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      throw new Error('Error setting up request: ' + error.message);
    }
  }
};

// Get mock orders from localStorage
const getMockOrders = () => {
  try {
    const ordersStr = localStorage.getItem('mockOrders');
    const orders = ordersStr ? JSON.parse(ordersStr) : [];
    console.log('Retrieved mock orders from localStorage:', orders.length);
    return { data: orders };
  } catch (error) {
    console.error('Error retrieving mock orders:', error);
    return { data: [] };
  }
};

export const getOrders = async () => {
  try {
    console.log('Fetching orders from API');
    const response = await API.get('/orders');
    console.log('Orders fetched successfully:', response.data.length);
    return response;
  } catch (error) {
    console.error('Error getting orders:', error);
    // Fallback to mock orders if API fails
    console.warn('Falling back to mock orders');
    return getMockOrders();
  }
};

// Get a single mock order by ID
const getMockOrderById = (id: string) => {
  try {
    const ordersStr = localStorage.getItem('mockOrders');
    const orders = ordersStr ? JSON.parse(ordersStr) : [];
    const order = orders.find((o: any) => o.id === id);

    if (order) {
      console.log('Found mock order by ID:', id);
      return { data: order };
    } else {
      console.warn('Mock order not found with ID:', id);
      return { data: null };
    }
  } catch (error) {
    console.error('Error retrieving mock order by ID:', error);
    return { data: null };
  }
};

export const getOrderById = async (id: string) => {
  try {
    console.log('Fetching order from API with ID:', id);
    const response = await API.get(`/orders/${id}`);
    console.log('Order fetched successfully:', response.data);
    return response;
  } catch (error) {
    console.error('Error getting order by ID:', error);
    // Fallback to mock order if API fails
    console.warn('Falling back to mock order');
    return getMockOrderById(id);
  }
};

// Update a mock order's status
const updateMockOrderStatus = (id: string, status: string) => {
  try {
    const ordersStr = localStorage.getItem('mockOrders');
    const orders = ordersStr ? JSON.parse(ordersStr) : [];
    const updatedOrders = orders.map((order: any) => {
      if (order.id === id) {
        return { ...order, status, updatedAt: new Date().toISOString() };
      }
      return order;
    });

    localStorage.setItem('mockOrders', JSON.stringify(updatedOrders));
    const updatedOrder = updatedOrders.find((o: any) => o.id === id);
    console.log('Updated mock order status:', id, status);
    return { data: updatedOrder };
  } catch (error) {
    console.error('Error updating mock order status:', error);
    return { data: null };
  }
};

// Update a mock order's payment status
const updateMockPaymentStatus = (id: string, paymentStatus: string) => {
  try {
    const ordersStr = localStorage.getItem('mockOrders');
    const orders = ordersStr ? JSON.parse(ordersStr) : [];
    const updatedOrders = orders.map((order: any) => {
      if (order.id === id) {
        return { ...order, paymentStatus, updatedAt: new Date().toISOString() };
      }
      return order;
    });

    localStorage.setItem('mockOrders', JSON.stringify(updatedOrders));
    const updatedOrder = updatedOrders.find((o: any) => o.id === id);
    console.log('Updated mock order payment status:', id, paymentStatus);
    return { data: updatedOrder };
  } catch (error) {
    console.error('Error updating mock order payment status:', error);
    return { data: null };
  }
};

// Cancel a mock order
const cancelMockOrder = (id: string) => {
  try {
    const ordersStr = localStorage.getItem('mockOrders');
    const orders = ordersStr ? JSON.parse(ordersStr) : [];
    const updatedOrders = orders.map((order: any) => {
      if (order.id === id) {
        return { ...order, status: 'cancelled', updatedAt: new Date().toISOString() };
      }
      return order;
    });

    localStorage.setItem('mockOrders', JSON.stringify(updatedOrders));
    const updatedOrder = updatedOrders.find((o: any) => o.id === id);
    console.log('Cancelled mock order:', id);
    return { data: updatedOrder };
  } catch (error) {
    console.error('Error cancelling mock order:', error);
    return { data: null };
  }
};

export const updateOrderStatus = async (id: string, status: string) => {
  try {
    console.log('Updating order status via API:', id, status);
    const response = await API.put(`/orders/${id}/status`, { status });
    console.log('Order status updated successfully:', response.data);
    return response;
  } catch (error) {
    console.error('Error updating order status:', error);
    // Fallback to mock system if API fails
    console.warn('Falling back to mock system for status update');
    return updateMockOrderStatus(id, status);
  }
};

export const updatePaymentStatus = async (id: string, paymentStatus: string) => {
  try {
    console.log('Updating payment status via API:', id, paymentStatus);
    const response = await API.put(`/orders/${id}/payment`, { paymentStatus });
    console.log('Payment status updated successfully:', response.data);
    return response;
  } catch (error) {
    console.error('Error updating payment status:', error);
    // Fallback to mock system if API fails
    console.warn('Falling back to mock system for payment status update');
    return updateMockPaymentStatus(id, paymentStatus);
  }
};

export const cancelOrder = async (id: string) => {
  try {
    console.log('Cancelling order via API:', id);
    const response = await API.put(`/orders/${id}/cancel`);
    console.log('Order cancelled successfully:', response.data);
    return response;
  } catch (error) {
    console.error('Error cancelling order:', error);
    // Fallback to mock system if API fails
    console.warn('Falling back to mock system for order cancellation');
    return cancelMockOrder(id);
  }
};

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
