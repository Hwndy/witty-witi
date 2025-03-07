import React, { useState } from 'react';
import { Save } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import axios from 'axios';

const Settings: React.FC = () => {
  const [generalSettings, setGeneralSettings] = useState({
    storeName: 'WITTY WITI',
    storeEmail: 'adeniji1440@gmail.com',
    storePhone: '08096560016',
    storeAddress: '20 Jubril Martins street, Surulere, Lagos Nigeria',
    currencySymbol: '₦',
    // taxRate: '5'
  });
  
  const [paymentSettings, setPaymentSettings] = useState({
    enableCashOnDelivery: true,
    enableBankTransfer: true,
    bankName: 'OPAY',
    accountNumber: '8096560016',
    accountName: 'Adeniji Abd Razzaq'
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    orderStatusUpdate: true,
    lowStockAlert: true,
    newCustomerRegistration: true
  });
  
  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePaymentSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPaymentSettings(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };
  
  const handleNotificationSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/settings', {
        generalSettings,
        paymentSettings,
        notificationSettings
      });
      if (response.status === 200) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('An error occurred while saving settings.');
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 ml-64">
        <AdminHeader />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Settings</h1>
            <p className="text-gray-600">Configure your store settings</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">General Settings</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    id="storeName"
                    name="storeName"
                    value={generalSettings.storeName}
                    onChange={handleGeneralSettingsChange}
                    className="input"
                  />
                </div>
                
                <div>
                  <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Store Email
                  </label>
                  <input
                    type="email"
                    id="storeEmail"
                    name="storeEmail"
                    value={generalSettings.storeEmail}
                    onChange={handleGeneralSettingsChange}
                    className="input"
                  />
                </div>
                
                <div>
                  <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Store Phone
                  </label>
                  <input
                    type="text"
                    id="storePhone"
                    name="storePhone"
                    value={generalSettings.storePhone}
                    onChange={handleGeneralSettingsChange}
                    className="input"
                  />
                </div>
                
                <div>
                  <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Store Address
                  </label>
                  <input
                    type="text"
                    id="storeAddress"
                    name="storeAddress"
                    value={generalSettings.storeAddress}
                    onChange={handleGeneralSettingsChange}
                    className="input"
                  />
                </div>
                
                <div>
                  <label htmlFor="currencySymbol" className="block text-sm font-medium text-gray-700 mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    id="currencySymbol"
                    name="currencySymbol"
                    value={generalSettings.currencySymbol}
                    onChange={handleGeneralSettingsChange}
                    className="input"
                  />
                </div>
                
                <div>
                  <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    id="taxRate"
                    name="taxRate"
                    // value={generalSettings.taxRate}
                    onChange={handleGeneralSettingsChange}
                    className="input"
                  />
                </div>
              </div>
              
              <h2 className="text-xl font-bold mb-4">Payment Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableCashOnDelivery"
                        name="enableCashOnDelivery"
                        checked={paymentSettings.enableCashOnDelivery}
                        onChange={handlePaymentSettingsChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="enableCashOnDelivery" className="ml-2 block text-sm text-gray-700">
                        Enable Cash on Delivery
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableBankTransfer"
                        name="enableBankTransfer"
                        checked={paymentSettings.enableBankTransfer}
                        onChange={handlePaymentSettingsChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="enableBankTransfer" className="ml-2 block text-sm text-gray-700">
                        Enable Bank Transfer
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={paymentSettings.bankName}
                    onChange={handlePaymentSettingsChange}
                    className="input"
                  />
                </div>
                
                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={paymentSettings.accountNumber}
                    onChange={handlePaymentSettingsChange}
                    className="input"
                  />
                </div>
                
                <div>
                  <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Name
                  </label>
                  <input
                    type="text"
                    id="accountName"
                    name="accountName"
                    value={paymentSettings.accountName}
                    onChange={handlePaymentSettingsChange}
                    className="input"
                  />
                </div>
              </div>
              
              <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="col-span-1 md:col-span-2">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="orderConfirmation"
                        name="orderConfirmation"
                        checked={notificationSettings.orderConfirmation}
                        onChange={handleNotificationSettingsChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="orderConfirmation" className="ml-2 block text-sm text-gray-700">
                        Send order confirmation emails
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="orderStatusUpdate"
                        name="orderStatusUpdate"
                        checked={notificationSettings.orderStatusUpdate}
                        onChange={handleNotificationSettingsChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="orderStatusUpdate" className="ml-2 block text-sm text-gray-700">
                        Send order status update emails
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="lowStockAlert"
                        name="lowStockAlert"
                        checked={notificationSettings.lowStockAlert}
                        onChange={handleNotificationSettingsChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="lowStockAlert" className="ml-2 block text-sm text-gray-700">
                        Receive low stock alerts
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="newCustomerRegistration"
                        name="newCustomerRegistration"
                        checked={notificationSettings.newCustomerRegistration}
                        onChange={handleNotificationSettingsChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="newCustomerRegistration" className="ml-2 block text-sm text-gray-700">
                        Receive new customer registration notifications
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary flex items-center">
                  <Save className="h-5 w-5 mr-2" />
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;