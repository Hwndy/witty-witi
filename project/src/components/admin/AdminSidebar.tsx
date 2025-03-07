import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import Logo from '../Logo';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuthStore();
  
  const menuItems = [
    {
      path: '/admin',
      name: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      path: '/admin/products',
      name: 'Products',
      icon: <Package className="h-5 w-5" />
    },
    {
      path: '/admin/orders',
      name: 'Orders',
      icon: <ShoppingCart className="h-5 w-5" />
    },
    {
      path: '/admin/customers',
      name: 'Customers',
      icon: <Users className="h-5 w-5" />
    },
    {
      path: '/admin/settings',
      name: 'Settings',
      icon: <Settings className="h-5 w-5" />
    }
  ];
  
  return (
    <div className="bg-secondary text-white h-screen w-64 fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <Logo className="h-8" />
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center p-3 w-full text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;