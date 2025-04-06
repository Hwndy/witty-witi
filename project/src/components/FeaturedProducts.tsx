import React, { useEffect, useState } from 'react';
import useProductStore from '../store/productStore';
import useCartStore from '../store/cartStore';
import { Product } from '../types';
import useApiStatus from '../hooks/useApiStatus';

const FeaturedProducts: React.FC = () => {
  const { featuredProducts, fetchFeaturedProducts, isLoading, error } = useProductStore();
  const addToCart = useCartStore((state) => state.addItem);
  const [retryCount, setRetryCount] = useState(0);
  const apiStatus = useApiStatus();

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        console.log('Loading featured products, attempt:', retryCount + 1);
        await fetchFeaturedProducts();
      } catch (error) {
        console.error('Error loading featured products:', error);
        // If we've tried less than 3 times and the API is offline, retry after a delay
        if (retryCount < 2 && apiStatus.status !== 'online') {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000); // Wait 2 seconds before retrying
        }
      }
    };

    loadFeaturedProducts();
  }, [fetchFeaturedProducts, retryCount, apiStatus.status]);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>

          {/* Show API status */}
          <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded relative">
            <strong className="font-bold">API Status: </strong>
            <span className={`inline-block px-2 py-1 rounded-full text-xs ${apiStatus.status === 'online' ? 'bg-green-100 text-green-800' : apiStatus.status === 'checking' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
              {apiStatus.status}
            </span>
            {apiStatus.lastChecked && (
              <span className="block text-xs mt-1">Last checked: {apiStatus.lastChecked.toLocaleTimeString()}</span>
            )}

            {/* Retry button */}
            <button
              onClick={() => setRetryCount(prev => prev + 1)}
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded text-sm"
            >
              Retry Loading Products
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts?.map((product: Product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">₦{product.price}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
