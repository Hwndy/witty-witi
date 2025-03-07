import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const AdminHeader: React.FC = () => {
  const { user } = useAuthStore();
  
  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-6">
      <div className="flex-1">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="h-6 w-6 text-gray-600" />
          <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium">{user?.username || 'Admin'}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;