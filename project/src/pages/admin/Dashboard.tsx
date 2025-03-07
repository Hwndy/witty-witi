import React, { useEffect } from 'react';
import { BarChart, ShoppingBag, Users, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import useDashboardStore from '../../store/dashboardStore';

const Dashboard: React.FC = () => {
  const { stats, fetchDashboardStats, isLoading, error } = useDashboardStore();
  
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);
  
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <AdminHeader />
          <main className="p-6 flex justify-center items-center h-[calc(100vh-64px)]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 ml-64">
        <AdminHeader />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back to your admin dashboard</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 mb-1">Total Sales</p>
                    <h3 className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-gray-100">
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-green-500">
                  <span>+12.5%</span>
                  <span className="text-xs ml-1">from last month</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 mb-1">Orders</p>
                    <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-gray-100">
                    <ShoppingBag className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-green-500">
                  <span>+8.2%</span>
                  <span className="text-xs ml-1">from last month</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 mb-1">Customers</p>
                    <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-gray-100">
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-green-500">
                  <span>+5.1%</span>
                  <span className="text-xs ml-1">from last month</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 mb-1">Conversion Rate</p>
                    <h3 className="text-2xl font-bold">3.2%</h3>
                  </div>
                  <div className="p-3 rounded-full bg-gray-100">
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-red-500">
                  <span>-0.4%</span>
                  <span className="text-xs ml-1">from last month</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Sales Overview</h3>
                <select className="border rounded-md px-2 py-1 text-sm">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                </select>
              </div>
              {stats?.monthlySales ? (
                <div className="h-64">
                  {/* Chart would go here - using placeholder for now */}
                  <div className="h-full flex flex-col justify-between">
                    <div className="grid grid-cols-6 h-full gap-2">
                      {stats.monthlySales.map((month, index) => (
                        <div key={index} className="flex flex-col justify-end">
                          <div 
                            className="bg-primary rounded-t-sm" 
                            style={{ 
                              height: `${(month.revenue / Math.max(...stats.monthlySales.map(m => m.revenue))) * 100}%`,
                              minHeight: '10%'
                            }}
                          ></div>
                          <div className="text-xs text-center mt-1">{month.month}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <BarChart className="h-12 w-12 text-gray-300" />
                  <p className="ml-4 text-gray-500">Sales chart will be displayed here</p>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Top Selling Products</h3>
                <select className="border rounded-md px-2 py-1 text-sm">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                </select>
              </div>
              <div className="h-64 flex items-center justify-center">
                <BarChart className="h-12 w-12 text-gray-300" />
                <p className="ml-4 text-gray-500">Product chart will be displayed here</p>
              </div>
            </div>
          </div>
          
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Recent Orders</h3>
              <button className="text-primary text-sm font-medium">View All</button>
            </div>
            
            {stats?.recentOrders ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-3 font-medium">Order ID</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="py-4">{order.id}</td>
                        <td className="py-4">{typeof order.user === 'object' ? order.user.username : 'Unknown'}</td>
                        <td className="py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'delivered' 
                              ? 'bg-green-100 text-green-800' 
                              : order.status === 'processing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4">₦{order.totalPrice.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent orders found</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;