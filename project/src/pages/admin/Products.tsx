import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, AlertCircle } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import ProductForm from '../../components/admin/ProductForm';
import useProductStore from '../../store/productStore';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

const Products: React.FC = () => {
  const { products, fetchProducts, addProduct, editProduct, removeProduct, isLoading, error } = useProductStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  useEffect(() => {
    fetchProducts();
   }, []); // Ensure dependency array is empty
  
  const handleAddProduct = () => {
    setCurrentProduct(undefined);
    setIsModalOpen(true);
  };
  
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };
  
  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await removeProduct(productId);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }
  };
  
  interface ProductFormData {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image: FileList | null;
  }

  const handleSubmit = async (data: ProductFormData) => {
    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(data).forEach(key => {
        const value = data[key as keyof ProductFormData];
        if (key === 'image' && value instanceof FileList) {
          formData.append('image', value[0]);
        } else {
          formData.append(key, value as string | Blob);
        }
      });
      
      if (currentProduct) {
        // Update existing product
        await editProduct(currentProduct.id, formData);
      } else {
        // Add new product
        await addProduct(formData);
      }
      
      setIsModalOpen(false);
    } catch {
      // Error is handled in the store
    }
  };
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 ml-64">
        <AdminHeader />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Products</h1>
              <p className="text-gray-600">Manage your product inventory</p>
            </div>
            <button 
              onClick={handleAddProduct}
              className="btn btn-primary flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
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
              
              <div className="flex items-center space-x-2">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="phones">Phones</option>
                  <option value="laptops">Laptops</option>
                  <option value="fans">Fans</option>
                  <option value="headphones">Headphones</option>
                  <option value="chargers">Chargers</option>
                  <option value="powerbanks">Power Banks</option>
                  <option value="accessories">Accessories</option>
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
          
          {/* Products Table */}
          {!isLoading && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-gray-500">
                      <th className="px-6 py-3 font-medium">Image</th>
                      <th className="px-6 py-3 font-medium">Name</th>
                      <th className="px-6 py-3 font-medium">Category</th>
                      <th className="px-6 py-3 font-medium">Price</th>
                      <th className="px-6 py-3 font-medium">Stock</th>
                      <th className="px-6 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <img 
                            src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`}
                            alt={product.name}
                            className="h-12 w-12 object-cover rounded"
                          />
                        </td>
                        <td className="px-6 py-4 font-medium">{product.name}</td>
                        <td className="px-6 py-4 capitalize">{product.category}</td>
                        <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.stock > 10 
                              ? 'bg-green-100 text-green-800' 
                              : product.stock > 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stock} in stock
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <Edit className="h-5 w-5 text-blue-500" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <Trash2 className="h-5 w-5 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No products found</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      
      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {currentProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              
              <ProductForm 
                product={currentProduct}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
              
              <div className="flex justify-end mt-6 space-x-2">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  form="product-form"
                  type="submit"
                  className="btn btn-primary flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                      {currentProduct ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    currentProduct ? 'Update Product' : 'Add Product'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;