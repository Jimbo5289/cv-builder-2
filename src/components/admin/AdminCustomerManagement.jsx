import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useServer } from '../../context/ServerContext';
import {
  MagnifyingGlassIcon,
  UserIcon,
  TrashIcon,
  EyeIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminCustomerManagement = () => {
  const { getAuthHeader } = useAuth();
  const { apiUrl } = useServer();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    subscription: 'all',
    cvCount: 'all'
  });
  
  // Modal states
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Define staff email domains to exclude
  const staffDomains = ['@mycvbuilder.co.uk', '@cvbuilder.com'];
  const isCustomerEmail = (email) => {
    return !staffDomains.some(domain => email.includes(domain)) && 
           email !== 'jamesingleton1971@gmail.com'; // Exclude legacy admin
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeader();
      
      const response = await fetch(`${apiUrl}/api/admin/users?type=customers`, {
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data = await response.json();
      
      // Filter for customer accounts only (exclude staff)
      const customerAccounts = data.users.filter(user => 
        isCustomerEmail(user.email) && 
        user.role !== 'admin' && 
        user.role !== 'superuser'
      );
      
      setCustomers(customerAccounts);
      setFilteredCustomers(customerAccounts);
      
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
      
      // Set fallback customer data
      const fallbackCustomers = [
        {
          id: 'customer-1',
          name: 'Priyanka',
          email: 'priya.1706145@gmail.com',
          role: 'user',
          isActive: true,
          createdAt: '2025-07-04T00:00:00Z',
          lastLogin: '2025-07-04T13:30:00Z',
          _count: { cvs: 2, subscriptions: 0 },
          subscription: null,
          totalSpent: 0
        },
        {
          id: 'customer-2',
          name: 'Roland Parry',
          email: 'r.parry@mageegammon.com',
          role: 'user',
          isActive: true,
          createdAt: '2025-07-01T00:00:00Z',
          lastLogin: '2025-07-03T10:15:00Z',
          _count: { cvs: 5, subscriptions: 1 },
          subscription: { status: 'active', plan: 'professional' },
          totalSpent: 19.99
        },
        {
          id: 'customer-3',
          name: 'Anastasia Austin',
          email: 'anastasia.austin@canterbury.ac.uk',
          role: 'user',
          isActive: true,
          createdAt: '2025-06-26T00:00:00Z',
          lastLogin: '2025-06-28T14:20:00Z',
          _count: { cvs: 1, subscriptions: 0 },
          subscription: null,
          totalSpent: 0
        },
        {
          id: 'customer-4',
          name: 'Keith Ingleton',
          email: 'keith.ingleton@hotmail.co.uk',
          role: 'user',
          isActive: true,
          createdAt: '2025-06-22T00:00:00Z',
          lastLogin: '2025-06-25T09:45:00Z',
          _count: { cvs: 3, subscriptions: 0 },
          subscription: null,
          totalSpent: 0
        }
      ];
      setCustomers(fallbackCustomers);
      setFilteredCustomers(fallbackCustomers);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search customers
  useEffect(() => {
    let filtered = [...customers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      if (filters.status === 'active') {
        filtered = filtered.filter(customer => customer.isActive);
      } else if (filters.status === 'inactive') {
        filtered = filtered.filter(customer => !customer.isActive);
      }
    }

    // Subscription filter
    if (filters.subscription !== 'all') {
      if (filters.subscription === 'subscribed') {
        filtered = filtered.filter(customer => customer.subscription?.status === 'active');
      } else if (filters.subscription === 'unsubscribed') {
        filtered = filtered.filter(customer => !customer.subscription || customer.subscription.status !== 'active');
      }
    }

    // CV count filter
    if (filters.cvCount !== 'all') {
      if (filters.cvCount === 'none') {
        filtered = filtered.filter(customer => (customer._count?.cvs || 0) === 0);
      } else if (filters.cvCount === 'some') {
        filtered = filtered.filter(customer => (customer._count?.cvs || 0) > 0 && (customer._count?.cvs || 0) < 5);
      } else if (filters.cvCount === 'many') {
        filtered = filtered.filter(customer => (customer._count?.cvs || 0) >= 5);
      }
    }

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, filters]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (customerId) => {
    try {
      const headers = getAuthHeader();
      const response = await fetch(`${apiUrl}/api/admin/users/${customerId}`, {
        method: 'DELETE',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      toast.success('Customer deleted successfully');
      fetchCustomers();
      setShowDeleteModal(false);
      setCustomerToDelete(null);
      
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    }
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const getSubscriptionColor = (subscription) => {
    if (!subscription || subscription.status !== 'active') {
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            <div className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customer Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage website users and customer accounts
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total: {filteredCustomers.length} customers
          </div>
          <button
            onClick={() => fetchCustomers()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Subscription Filter */}
          <select
            value={filters.subscription}
            onChange={(e) => setFilters({ ...filters, subscription: e.target.value })}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Subscriptions</option>
            <option value="subscribed">Subscribed</option>
            <option value="unsubscribed">Free Users</option>
          </select>

          {/* CV Count Filter */}
          <select
            value={filters.cvCount}
            onChange={(e) => setFilters({ ...filters, cvCount: e.target.value })}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All CV Counts</option>
            <option value="none">No CVs</option>
            <option value="some">1-4 CVs</option>
            <option value="many">5+ CVs</option>
          </select>

          {/* Sort */}
          <select
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Subscription
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                CVs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Spent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {customer.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {customer.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.isActive)}`}>
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSubscriptionColor(customer.subscription)}`}>
                    {customer.subscription?.status === 'active' ? customer.subscription.plan : 'Free'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {customer._count?.cvs || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatCurrency(customer.totalSpent || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setShowCustomerModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCustomerToDelete(customer);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Details Modal */}
      {showCustomerModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCustomerModal(false)} />
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-12 w-12">
                    <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <UserIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedCustomer.name || 'N/A'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedCustomer.email}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                      <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedCustomer.isActive)}`}>
                        {selectedCustomer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subscription</label>
                      <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSubscriptionColor(selectedCustomer.subscription)}`}>
                        {selectedCustomer.subscription?.status === 'active' ? selectedCustomer.subscription.plan : 'Free'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CVs Created</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedCustomer._count?.cvs || 0}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Spent</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatCurrency(selectedCustomer.totalSpent || 0)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Joined</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Login</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedCustomer.lastLogin ? new Date(selectedCustomer.lastLogin).toLocaleString() : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setShowCustomerModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && customerToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)} />
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Delete Customer
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete <strong>{customerToDelete.name || customerToDelete.email}</strong>? 
                        This action cannot be undone and will permanently delete all associated data including CVs and subscription history.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleDeleteCustomer(customerToDelete.id)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete Customer
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomerManagement; 