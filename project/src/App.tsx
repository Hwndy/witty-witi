import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import CheckoutSuccess from './pages/CheckoutSuccess';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminCustomers from './pages/admin/Customers';
import AdminSettings from './pages/admin/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './store/authStore';

function App() {
  const { checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminProducts />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminOrders />
          </ProtectedRoute>
        } />
        <Route path="/admin/customers" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCustomers />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminSettings />
          </ProtectedRoute>
        } />
        
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <Navbar />
            <HomePage />
            <Footer />
          </>
        } />
        <Route path="/products" element={
          <>
            <Navbar />
            <ProductsPage />
            <Footer />
          </>
        } />
        <Route path="/products/:category" element={
          <>
            <Navbar />
            <ProductsPage />
            <Footer />
          </>
        } />
        <Route path="/products/detail/:id" element={
          <>
            <Navbar />
            <ProductDetailPage />
            <Footer />
          </>
        } />
        <Route path="/cart" element={
          <>
            <Navbar />
            <CartPage />
            <Footer />
          </>
        } />
        <Route path="/checkout" element={
          <>
            <Navbar />
            <CheckoutPage />
            <Footer />
          </>
        } />
        <Route path="/checkout/success" element={
          <>
            <Navbar />
            <CheckoutSuccess />
            <Footer />
          </>
        } />
        <Route path="/login" element={
          <>
            <Navbar />
            <LoginPage />
            <Footer />
          </>
        } />
        <Route path="/register" element={
          <>
            <Navbar />
            <RegisterPage />
            <Footer />
          </>
        } />
        <Route path="/contact" element={
          <>
            <Navbar />
            <ContactPage />
            <Footer />
          </>
        } />
        <Route path="/about" element={
          <>
            <Navbar />
            <AboutPage />
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;