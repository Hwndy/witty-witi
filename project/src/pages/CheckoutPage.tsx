import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Truck, Check, AlertCircle } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import useOrderStore from '../store/orderStore';
import { toast } from 'react-toastify';

const CheckoutPage: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated, user, checkAuth } = useAuthStore();
  const { placeOrder, isLoading, error } = useOrderStore();
  const navigate = useNavigate();

  // Check authentication status when component mounts
  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated && !isLoading) {
        await checkAuth();
        // After checking, if still not authenticated, redirect to login
        // We need to get the latest state after the checkAuth call
        const currentState = useAuthStore.getState();
        if (!currentState.isAuthenticated) {
          navigate('/login', { state: { from: '/checkout', message: 'Please log in to complete your purchase' } });
        }
      }
    };

    verifyAuth();
    // Only run this effect once when the component mounts
  }, []);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    notes: ''
  });

  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    try {
      const orderData = {
        items: items.map(item => ({
          product: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        totalPrice: getTotalPrice() * 1.05, // Including tax
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes || ''
      };

      const order = await placeOrder(orderData);
      clearCart();
      navigate('/checkout/success', { state: { orderId: order.id } });
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
      
      if (error.response?.status === 401) {
        navigate('/login', {
          state: {
            from: '/checkout',
            message: 'Please log in to complete your purchase'
          }
        });
      }
    }
  };

  const subtotal = getTotalPrice();
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="py-16 container">
        <div className="text-center">
          <div className="inline-block p-6 rounded-full bg-gray-100 mb-6">
            <Check className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            You have no items in your shopping cart.
          </p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 container">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Checkout Steps */}
      <div className="flex justify-between mb-8">
        <div className={`flex-1 text-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
            step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            1
          </div>
          <span className="text-sm font-medium">Shipping</span>
        </div>
        <div className="w-full max-w-[100px] pt-4">
          <div className={`h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
        </div>
        <div className={`flex-1 text-center ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
            step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </div>
          <span className="text-sm font-medium">Payment</span>
        </div>
        <div className="w-full max-w-[100px] pt-4">
          <div className={`h-1 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
        </div>
        <div className={`flex-1 text-center ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
            step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            3
          </div>
          <span className="text-sm font-medium">Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name*
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address*
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City*
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State*
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code*
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Link to="/cart" className="btn btn-outline">
                    Back to Cart
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  Payment Information
                </h2>

                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="card"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <label htmlFor="card" className="ml-2 block text-sm font-medium text-gray-700">
                        Credit/Debit Card
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="paypal"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <label htmlFor="paypal" className="ml-2 block text-sm font-medium text-gray-700">
                        PayPal
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="cash_on_delivery"
                        name="paymentMethod"
                        value="cash_on_delivery"
                        checked={formData.paymentMethod === 'cash_on_delivery'}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <label htmlFor="cash_on_delivery" className="ml-2 block text-sm font-medium text-gray-700">
                        Cash on Delivery
                      </label>
                    </div>
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number*
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          placeholder="1234 5678 9012 3456"
                          required
                          className="input"
                        />
                      </div>

                      <div>
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                          Name on Card*
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          required
                          className="input"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date*
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            placeholder="MM/YY"
                            required
                            className="input"
                          />
                        </div>
                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                            CVV*
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            placeholder="123"
                            required
                            className="input"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'paypal' && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600">
                        You will be redirected to PayPal to complete your payment.
                      </p>
                    </div>
                  )}

                  {formData.paymentMethod === 'cash_on_delivery' && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600">
                        You will pay when your order is delivered to your address.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn-outline"
                  >
                    Back to Shipping
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Continue to Review
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Order Review */}
            {step === 3 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Order Review</h2>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Shipping Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="mb-1">
                      <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                    </p>
                    <p className="mb-1 text-gray-600">{formData.address}</p>
                    <p className="mb-1 text-gray-600">
                      {formData.city}, {formData.state} {formData.zipCode}
                    </p>
                    <p className="text-gray-600">{formData.email} | {formData.phone}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Payment Method</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {formData.paymentMethod === 'card' ? (
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-primary mr-2" />
                        <span>
                          Card ending in {formData.cardNumber.slice(-4)}
                        </span>
                      </div>
                    ) : formData.paymentMethod === 'paypal' ? (
                      <div className="flex items-center">
                        <span>PayPal</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span>Cash on Delivery</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Order Items</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="divide-y divide-gray-200">
                      {items.map((item) => (
                        <div key={item.product.id} className="py-3 flex justify-between">
                          <div className="flex items-center">
                            <img
                              src={item.product.image.startsWith('http') ? item.product.image : `http://localhost:5000${item.product.image}`}
                              alt={item.product.name}
                              className="h-12 w-12 object-cover rounded mr-4"
                            />
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Shipping Method</h3>
                  <div className="bg-gray-50 p-4 rounded-md flex items-center">
                    <Truck className="h-5 w-5 text-primary mr-2" />
                    <span>Standard Shipping (Free)</span>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn btn-outline"
                  >
                    Back to Payment
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Including VAT</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center mb-2">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm">Secure Checkout</span>
              </div>
              <div className="flex items-center mb-2">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
