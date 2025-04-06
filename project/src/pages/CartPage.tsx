import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import useCartStore from '../store/cartStore';

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  
  if (items.length === 0) {
    return (
      <div className="py-16 container">
        <div className="text-center">
          <div className="inline-block p-6 rounded-full bg-gray-100 mb-6">
            <ShoppingBag className="h-16 w-16 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-8 container">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">Quantity</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Price</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Total</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img 
                            src={item.product.image.startsWith('http') ? item.product.image : `http://localhost:5000${item.product.image}`}
                            alt={item.product.name}
                            className="h-16 w-16 object-cover rounded mr-4"
                          />
                          <div>
                            <h3 className="font-medium">{item.product.name}</h3>
                            <p className="text-sm text-gray-500 capitalize">{item.product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className={`p-1 rounded-full ${
                              item.quantity <= 1 
                                ? 'text-gray-300 cursor-not-allowed' 
                                : 'text-gray-500 hover:bg-gray-100'
                            }`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="mx-2 w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className={`p-1 rounded-full ${
                              item.quantity >= item.product.stock 
                                ? 'text-gray-300 cursor-not-allowed' 
                                : 'text-gray-500 hover:bg-gray-100'
                            }`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        ₦{item.product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium">
                        ₦{(item.product.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => removeItem(item.product.id)}
                          className="p-1 rounded-full text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <Link to="/products" className="btn btn-outline flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₦{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₦{(getTotalPrice() * 0.05).toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">₦{(getTotalPrice() * 1.05).toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Including VAT</p>
              </div>
            </div>
            
            <Link to="/checkout" className="btn btn-primary w-full mt-6">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
