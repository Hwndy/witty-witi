import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Truck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import useOrderStore from '../../store/orderStore';

const Orders: React.FC = () => {
  const { orders, fetchOrders, updateStatus, updatePayment, isLoading, error } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
  
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus(orderId, newStatus);
    } catch (error) {
      // Error is handled in the store
    }
  };
  
  const handleUpdatePayment = async (orderId: string, newPaymentStatus: string) => {
    try {
      await updatePayment(orderId, newPaymentStatus);
    } catch (error) {
      // Error is handled in the store
    }
  };
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof order.user === 'object' && order.user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof order.user === 'object' && order.user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 ml-64">
        <AdminHeader />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Orders</h1>
              <p className="text-gray-600">Manage and track customer orders</p>
            </div>
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
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-gray-500" />
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          )}
          
          {/* Orders Table */}
          {!isLoading && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-gray-500">
                      <th className="px-6 py-3 font-medium">Order ID</th>
                      <th className="px-6 py-3 font-medium">Customer</th>
                      <th className="px-6 py-3 font-medium">Date</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Payment</th>
                      <th className="px-6 py-3 font-medium">Total</th>
                      <th className="px-6 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{order.id}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">
                              {typeof order.user === 'object' 
                                ? order.user.username 
                                : order.customerName || 'Unknown'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {typeof order.user === 'object' 
                                ? order.user.email 
                                : order.customerEmail || 'No email'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'delivered' 
                              ? 'bg-green-100 text-green-800' 
                              : order.status === 'processing'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'shipped'
                              ? 'bg-purple-100 text-purple-800'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.paymentStatus === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : order.paymentStatus === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium">₦{order.totalPrice.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleViewOrder(order)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Eye className="h-5 w-5 text-blue-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No orders found</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      
      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Order Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="flex justify-between mb-2">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{selectedOrder.id}</span>
                    </p>
                    <p className="flex justify-between mb-2">
                      <span className="text-gray-600">Date:</span>
                      <span>{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Items:</span>
                      <span>{selectedOrder.items.length} items</span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Customer</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="mb-2 font-medium">
                      {typeof selectedOrder.user === 'object' 
                        ? selectedOrder.user.username 
                        : selectedOrder.customerName || 'Unknown'}
                    </p>
                    <p className="mb-2">
                      {typeof selectedOrder.user === 'object' 
                        ? selectedOrder.user.email 
                        : selectedOrder.customerEmail || 'No email'}
                    </p>
                    <p>{selectedOrder.customerPhone || 'No phone'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Payment</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="flex justify-between mb-2">
                      <span className="text-gray-600">Status:</span>
                      <span className={`${
                        selectedOrder.paymentStatus === 'paid' 
                          ? 'text-green-600' 
                          : selectedOrder.paymentStatus === 'failed'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      } font-medium`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </p>
                    <p className="flex justify-between mb-2">
                      <span className="text-gray-600">Method:</span>
                      <span className="capitalize">{selectedOrder.paymentMethod.replace('_', ' ')}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-bold">₦{selectedOrder.totalPrice.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Order Status</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedOrder.status === 'delivered' 
                        ? 'bg-green-100 text-green-800' 
                        : selectedOrder.status === 'processing'
                        ? 'bg-blue-100 text-blue-800'
                        : selectedOrder.status === 'shipped'
                        ? 'bg-purple-100 text-purple-800'
                        : selectedOrder.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'pending')}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedOrder.status === 'pending' 
                          ? 'bg-yellow-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Pending
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedOrder.status === 'processing' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Processing
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedOrder.status === 'shipped' 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <Truck className="h-4 w-4 inline mr-1" />
                      Shipped
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedOrder.status === 'delivered' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      Delivered
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedOrder.status === 'cancelled' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <XCircle className="h-4 w-4 inline mr-1" />
                      Cancelled
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Payment Status</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => handleUpdatePayment(selectedOrder.id, 'pending')}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedOrder.paymentStatus === 'pending' 
                          ? 'bg-yellow-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Pending
                    </button>
                    <button 
                      onClick={() => handleUpdatePayment(selectedOrder.id, 'paid')}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedOrder.paymentStatus === 'paid' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Paid
                    </button>
                    <button 
                      onClick={() => handleUpdatePayment(selectedOrder.id, 'failed')}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedOrder.paymentStatus === 'failed' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Failed
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Order Items</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="pb-3 font-medium">Product</th>
                          <th className="pb-3 font-medium">Price</th>
                          <th className="pb-3 font-medium">Quantity</th>
                          <th className="pb-3 font-medium text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item: any, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="py-3">
                              <div className="flex items-center">
                                <div className="h-10 w-10 bg-gray-200 rounded mr-3"></div>
                                <span>{item.name}</span>
                              </div>
                            </td>
                            <td className="py-3">₦{item.price.toLocaleString()}</td>
                            <td className="py-3">{item.quantity}</td>
                            <td className="py-3 text-right font-medium">
                              ₦{(item.price * item.quantity).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>₦{selectedOrder.totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Shipping:</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>₦{selectedOrder.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline mr-2"
                >
                  Close
                </button>
                <button className="btn btn-primary">
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;