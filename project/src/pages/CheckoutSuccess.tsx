import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Package, Truck, CreditCard } from 'lucide-react';
import useOrderStore from '../store/orderStore';

const CheckoutSuccess: React.FC = () => {
  const location = useLocation();
  const { getOrderById } = useOrderStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get the order ID from location state
  const orderId = location.state?.orderId;

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        try {
          setLoading(true);
          const response = await getOrderById(orderId);
          if (response && response.data) {
            setOrder(response.data);
          }
        } catch (error) {
          console.error('Error fetching order:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, getOrderById]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="py-16 container">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block p-6 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          {orderId && (
            <p className="text-gray-700 font-medium">
              Order ID: <span className="font-bold">{orderId}</span>
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-2">Loading order details...</p>
          </div>
        ) : order ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Shipping Information</h3>
                  <p className="text-gray-600">{order.customerName}</p>
                  <p className="text-gray-600">{order.shippingAddress}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Order Information</h3>
                  <p className="text-gray-600">Date: {order.createdAt ? formatDate(order.createdAt) : 'N/A'}</p>
                  <p className="text-gray-600">Payment Method: {order.paymentMethod}</p>
                  <p className="text-gray-600">Status: <span className="font-medium text-green-600">{order.status || 'Processing'}</span></p>
                </div>
              </div>
            </div>

            <div className="p-6 border-b">
              <h3 className="font-medium text-gray-700 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items && order.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gray-50">
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-medium">{formatCurrency(order.totalPrice / 1.05)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Tax (5%)</p>
                <p className="font-medium">{formatCurrency(order.totalPrice - (order.totalPrice / 1.05))}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Shipping</p>
                <p className="font-medium">Free</p>
              </div>
              <div className="flex justify-between pt-4 border-t mt-4">
                <p className="text-lg font-bold">Total</p>
                <p className="text-lg font-bold">{formatCurrency(order.totalPrice)}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-center">
            <p className="text-gray-600 mb-4">Order details not available.</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">What's Next?</h2>
          <ul className="space-y-4">
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