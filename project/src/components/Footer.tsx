import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Instagram, Facebook } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-white pt-12 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1">
            <Logo className="h-10 mb-4" />
            <p className="text-gray-300 mt-4">
              A gizmo planet where smart gadget equals MERCHANDISE
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/products/phones" className="text-gray-300 hover:text-white transition-colors">Phones</Link></li>
              <li><Link to="/products/laptops" className="text-gray-300 hover:text-white transition-colors">Laptops</Link></li>
              <li><Link to="/products/headphones" className="text-gray-300 hover:text-white transition-colors">Headphones</Link></li>
              <li><Link to="/products/chargers" className="text-gray-300 hover:text-white transition-colors">Chargers</Link></li>
              <li><Link to="/products/powerbanks" className="text-gray-300 hover:text-white transition-colors">Power Banks</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary" />
                <a href="tel:08096560016" className="text-gray-300 hover:text-white transition-colors">08096560016</a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary" />
                <a href="tel:07031467508" className="text-gray-300 hover:text-white transition-colors">07031467508</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                <a href="mailto:adeniji1440@gmail.com" className="text-gray-300 hover:text-white transition-colors">adeniji1440@gmail.com</a>
              </li>
              <li className="flex items-center mt-4">
                <a href="https://facebook.com/wittywiti" className="text-gray-300 hover:text-white transition-colors mr-4">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="https://instagram.com/wittywiti" className="text-gray-300 hover:text-white transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <span className="ml-2 text-gray-300">@wittywiti</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} WITTY WITI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;