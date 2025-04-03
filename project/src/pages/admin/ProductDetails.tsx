import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import useProductStore from '../../store/productStore';
import AdminLayout from '../../components/layouts/AdminLayout';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProduct, fetchProductById, isLoading, error } = useProductStore();

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-red-600">{error}</div>
      </AdminLayout>
    );
  }

  if (!currentProduct) {
    return (
      <AdminLayout>
        <div>Product not found</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/admin/products')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Products
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/admin/products/edit/${id}`)}
              className="btn btn-secondary flex items-center"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this product?')) {
                  // Handle delete
                }
              }}
              className="btn btn-danger flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div>
              <img
                src={currentProduct.image.startsWith('http') 
                  ? currentProduct.image 
                  : `http://localhost:5000${currentProduct.image}`}
                alt={currentProduct.name}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">{currentProduct.name}</h1>
              <div className="space-y-2">
                <p className="text-gray-600">Category: <span className="text-gray-900 capitalize">{currentProduct.category}</span></p>
                <p className="text-gray-600">Price: <span className="text-gray-900">₦{currentProduct.price.toFixed(2)}</span></p>
                <p className="text-gray-600">Stock: <span className="text-gray-900">{currentProduct.stock}</span></p>
                <p className="text-gray-600">Featured: <span className="text-gray-900">{currentProduct.featured ? 'Yes' : 'No'}</span></p>
                <p className="text-gray-600">Image Source: <span className="text-gray-900">{currentProduct.imageType === 'url' ? 'External URL' : 'Uploaded File'}</span></p>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{currentProduct.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductDetails;
