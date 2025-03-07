import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemsCount = useCartStore(state => state.getTotalItems());
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Close mobile menu when navigating
  useEffect(() => {
    return () => {
      setIsMenuOpen(false);
    };
  }, [navigate]);
  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Logo className="h-10" />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-medium hover:text-primary transition-colors">Home</Link>
          <Link to="/products" className="font-medium hover:text-primary transition-colors">Products</Link>
          <Link to="/about" className="font-medium hover:text-primary transition-colors">About</Link>
          <Link to="/contact" className="font-medium hover:text-primary transition-colors">Contact</Link>
        </div>
        
        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center space-x-1">
                <User className="h-6 w-6" />
                <span className="font-medium">{user?.username}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Admin Dashboard
                  </Link>
                )}
                <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  My Account
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">Login</Link>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 md:hidden">
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
          <button onClick={toggleMenu} className="focus:outline-none">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-inner">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="font-medium" onClick={toggleMenu}>Home</Link>
            <Link to="/products" className="font-medium" onClick={toggleMenu}>Products</Link>
            <Link to="/about" className="font-medium" onClick={toggleMenu}>About</Link>
            <Link to="/contact" className="font-medium" onClick={toggleMenu}>Contact</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/account" className="font-medium" onClick={toggleMenu}>My Account</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="font-medium" onClick={toggleMenu}>Admin Dashboard</Link>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="text-left font-medium text-red-500 flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary w-full text-center" onClick={toggleMenu}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;