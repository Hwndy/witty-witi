import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';

const CheckoutSuccess: React.FC = () => {
  return (
    <div className="py-16 container">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-block p-6 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been received and is being processed.
          You will receive a confirmation email shortly with your order details.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">What's Next?</h2>
          <ul className="text-left space-y-4">
            <li className="flex items-start">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
              <p>You'll receive an order confirmation email with your order details.</p>
            </li>
            <li className="flex items-start">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
              <p>Our team will process your order and prepare it for shipping.</p>
            </li>
            <li className="flex items-start">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
              <p>You'll receive a shipping confirmation once your order is on its way.</p>
            </li>
            <li className="flex items-start">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</span>
              <p>Your order will be delivered to your shipping address.</p>
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/" className="btn btn-primary">
            Return to Home
          </Link>
          <Link to="/products" className="btn btn-outline flex items-center justify-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;