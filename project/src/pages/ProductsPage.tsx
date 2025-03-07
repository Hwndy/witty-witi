import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Filter, Search, AlertCircle } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useProductStore from '../store/productStore';

const categories = [
  { value: 'all', label: 'All Products' },
  { value: 'phones', label: 'Phones' },
  { value: 'laptops', label: 'Laptops' },
  { value: 'fans', label: 'Fans' },
  { value: 'headphones', label: 'Headphones' },
  { value: 'chargers', label: 'Chargers' },
  { value: 'powerbanks', label: 'Power Banks' },
  { value: 'accessories', label: 'Accessories' }
];

const ProductsPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [sortBy, setSortBy] = useState('default');
  
  const { products, fetchProducts, isLoading, error } = useProductStore();
  const addToCart = useCartStore(state => state.addItem);
  
  useEffect(() => {
    if (category && category !== selectedCategory) {
      setSelectedCategory(category);
    }
  }, [category, selectedCategory]);
  
  useEffect(() => {
    const params: any = {};
    
    if (selectedCategory !== 'all') {
      params.category = selectedCategory;
    }
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (sortBy !== 'default') {
      params.sort = sortBy;
    }
    
    fetchProducts(params);
  }, [fetchProducts, selectedCategory, searchTerm, sortBy]);
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };
  
  return (
    <div className="py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.value === selectedCategory)?.label}
          </h1>
          <p className="text-gray-600">
            Explore our wide range of tech gadgets and accessories
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="flex items-center w-full sm:w-auto">
                <Filter className="h-5 w-5 mr-2 text-gray-500" />
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="default">Sort By: Default</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}
        
        {/* Products Grid */}
        {!isLoading && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
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
                  <p className="text-gray-600 text-sm mb-2 capitalize">{product.category}</p>
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
        ) : !isLoading && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No products found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;