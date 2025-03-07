import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary to-accent text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573739713131-57c1d3d98d5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] opacity-10 bg-cover bg-center"></div>
      <div className="container relative z-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              WITTY WITI
            </h1>
            <p className="text-xl md:text-2xl font-medium mb-6">
              A gizmo planet where smart gadget equals MERCHANDISE
            </p>
            <p className="text-lg mb-8 max-w-lg">
              Tech gadgets wholesales and retails. Phone accessories (Charger, headset, powerbank, etc.)
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn bg-white text-primary hover:bg-gray-100 flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Link>
              <Link to="/contact" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Headphones" 
                className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              />
              <img 
                src="https://images.unsplash.com/photo-1585338447937-7082f8fc763d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Power Bank" 
                className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 mt-8"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;