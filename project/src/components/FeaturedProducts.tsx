import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useProductStore from '../store/productStore';

const FeaturedProducts: React.FC = () => {
  const { featuredProducts, fetchFeaturedProducts, isLoading, error } = useProductStore();
  const addToCart = useCartStore(state => state.addItem);
  
  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);
  
  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check out our most popular tech gadgets and accessories
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Check out our most popular tech gadgets and accessories
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="card group">
              <div className="relative overflow-hidden">
                <img 
                  src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`}
                  alt={product.name}
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link 
                    to={`/products/detail/${product.id}`}
                    className="btn bg-white text-primary hover:bg-gray-100 mx-2"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">${product.price.toFixed(2)}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="p-2 rounded-full bg-primary text-white hover:bg-opacity-90 transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/products" className="btn btn-primary">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;