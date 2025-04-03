import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="mt-4">
          <Link 
            to="/admin" 
            className="flex items-center px-4 py-2 hover:bg-gray-700"
          >
            <Home className="w-5 h-5 mr-2" />
            Dashboard
          </Link>
          <Link 
            to="/admin/products" 
            className="flex items-center px-4 py-2 hover:bg-gray-700"
          >
            <Package className="w-5 h-5 mr-2" />
            Products
          </Link>
          <Link 
            to="/admin/users" 
            className="flex items-center px-4 py-2 hover:bg-gray-700"
          >
            <Users className="w-5 h-5 mr-2" />
            Users
          </Link>
          <Link 
            to="/admin/settings" 
            className="flex items-center px-4 py-2 hover:bg-gray-700"
          >
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </Link>
          <button 
            onClick={() => {
              // Handle logout
              // You can implement this based on your auth logic
            }}
            className="flex items-center px-4 py-2 hover:bg-gray-700 w-full text-left"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100">
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;