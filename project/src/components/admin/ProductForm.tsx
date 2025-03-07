import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Product } from '../../types';
import { Upload } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const categories = [
  { value: 'phones', label: 'Phones' },
  { value: 'laptops', label: 'Laptops' },
  { value: 'fans', label: 'Fans' },
  { value: 'headphones', label: 'Headphones' },
  { value: 'chargers', label: 'Chargers' },
  { value: 'powerbanks', label: 'Power Banks' },
  { value: 'accessories', label: 'Accessories' }
];

const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  onSubmit, 
  isLoading = false 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm({
    defaultValues: product ? {
      ...product,
      stock: product.stock.toString(),
      price: product.price.toString(),
      featured: product.featured ? 'true' : 'false'
    } : {
      featured: 'false'
    }
  });
  
  const imageFile = watch('image');
  const existingImage = product?.image;
  
  return (
    <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Product Name*
        </label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'Product name is required' })}
          className="input"
          placeholder="Wireless Earbuds"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message?.toString()}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (₦)*
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            {...register('price', { 
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' }
            })}
            className="input"
            placeholder="49.99"
            disabled={isLoading}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message?.toString()}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            Stock*
          </label>
          <input
            id="stock"
            type="number"
            min="0"
            {...register('stock', { 
              required: 'Stock is required',
              min: { value: 0, message: 'Stock must be positive' }
            })}
            className="input"
            placeholder="15"
            disabled={isLoading}
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock.message?.toString()}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category*
        </label>
        <select
          id="category"
          {...register('category', { required: 'Category is required' })}
          className="input"
          disabled={isLoading}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message?.toString()}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="featured" className="block text-sm font-medium text-gray-700 mb-1">
          Featured Product
        </label>
        <select
          id="featured"
          {...register('featured')}
          className="input"
          disabled={isLoading}
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Image*
        </label>
        <div className="mt-1 flex items-center">
          {(existingImage || imageFile) && (
            <div className="mr-4">
              <img 
                src={
                  imageFile && imageFile[0] 
                    ? URL.createObjectURL(imageFile[0]) 
                    : existingImage?.startsWith('http') 
                      ? existingImage 
                      : `http://localhost:5000${existingImage}`
                }
                alt="Product preview" 
                className="h-20 w-20 object-cover rounded-md"
              />
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={isLoading}
          >
            <Upload className="h-5 w-5 inline mr-1" />
            {product ? 'Change Image' : 'Upload Image'}
          </button>
          <input
            type="file"
            id="image"
            ref={fileInputRef}
            {...register('image', { 
              required: product ? false : 'Product image is required',
              validate: {
                acceptedFormats: files => 
                  !files[0] || 
                  ['image/jpeg', 'image/png', 'image/webp'].includes(files[0]?.type) || 
                  'Only JPEG, PNG, and WebP formats are supported'
              }
            })}
            className="hidden"
            accept="image/*"
            disabled={isLoading}
          />
        </div>
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image.message?.toString()}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description*
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description', { required: 'Description is required' })}
          className="input"
          placeholder="Product description..."
          disabled={isLoading}
        ></textarea>
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message?.toString()}</p>
        )}
      </div>
    </form>
  );
};

export default ProductForm;