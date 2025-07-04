import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useServer } from '../../context/ServerContext';
import {
  MagnifyingGlassIcon,
  UserIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminStaffManagement = () => {
  const { getAuthHeader } = useAuth();
  const { apiUrl } = useServer();
  const [loading, setLoading] = useState(true);
  const [staffMembers, setStaffMembers] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  
  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Modal states
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showStaffModal, setShowStaffModal] = useState(false);

  // Define staff email domains/patterns
  const staffDomains = ['@mycvbuilder.co.uk', '@cvbuilder.com'];
  const isStaffEmail = (email) => {
    return staffDomains.some(domain => email.includes(domain)) || 
           email === 'jamesingleton1971@gmail.com'; // Legacy admin account
  };

  const fetchStaffMembers = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeader();
      
      const response = await fetch(`${apiUrl}/api/admin/users?type=all`, {
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch staff members');
      }

      const data = await response.json();
      
      // Filter for staff accounts only
      const staff = data.users.filter(user => 
        isStaffEmail(user.email) || 
        user.role === 'admin' || 
        user.role === 'superuser'
      );
      
      setStaffMembers(staff);
      setFilteredStaff(staff);
      
    } catch (error) {
      console.error('Error fetching staff members:', error);
      toast.error('Failed to load staff members');
      
      // Set fallback staff data
      const fallbackStaff = [
        {
          id: 'staff-1',
          name: 'James Singleton',
          email: 'james@mycvbuilder.co.uk',
          role: 'superuser',
          department: 'Management',
          position: 'CEO',
          isActive: true,
          createdAt: '2025-01-01T00:00:00Z',
          lastLogin: new Date().toISOString()
        },
        {
          id: 'staff-2',
          name: 'James Singleton',
          email: 'jamesingleton1971@gmail.com',
          role: 'superuser',
          department: 'Management',
          position: 'CEO (Legacy)',
          isActive: true,
          createdAt: '2024-06-14T00:00:00Z',
          lastLogin: new Date().toISOString()
        }
      ];
      setStaffMembers(fallbackStaff);
      setFilteredStaff(fallbackStaff);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search staff
  useEffect(() => {
    let filtered = [...staffMembers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(staff =>
        staff.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.position?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(staff => staff.role === roleFilter);
    }

    setFilteredStaff(filtered);
  }, [staffMembers, searchTerm, roleFilter]);

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const handleUpdateStaffRole = async (staffId, newRole) => {
    try {
      const headers = getAuthHeader();
      const response = await fetch(`${apiUrl}/api/admin/users/${staffId}/role`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        throw new Error('Failed to update staff role');
      }

      toast.success('Staff role updated successfully');
      fetchStaffMembers();
      
    } catch (error) {
      console.error('Error updating staff role:', error);
      toast.error('Failed to update staff role');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'superuser': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'superuser': return '👑';
      case 'admin': return '🛡️';
      default: return '👤';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
            Staff Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage internal team members and admin accounts
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total: {filteredStaff.length} staff members
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="superuser">Superuser</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={fetchStaffMembers}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Staff Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredStaff.map((staff) => (
              <tr key={staff.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <ShieldCheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {staff.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {staff.email}
                      </div>
                      {staff.position && (
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {staff.position}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(staff.role)}`}>
                    <span className="mr-1">{getRoleIcon(staff.role)}</span>
                    {staff.role || 'admin'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {staff.department || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(staff.isActive)}`}>
                    {staff.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {staff.lastLogin ? new Date(staff.lastLogin).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => {
                      setSelectedStaff(staff);
                      setShowStaffModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Staff Details Modal */}
      {showStaffModal && selectedStaff && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowStaffModal(false)} />
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-12 w-12">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <ShieldCheckIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedStaff.name || 'N/A'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedStaff.email}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                      <select
                        value={selectedStaff.role || 'admin'}
                        onChange={(e) => handleUpdateStaffRole(selectedStaff.id, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="admin">Admin</option>
                        <option value="superuser">Superuser</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                      <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedStaff.isActive)}`}>
                        {selectedStaff.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedStaff.department || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedStaff.position || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Joined</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedStaff.createdAt ? new Date(selectedStaff.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Login</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedStaff.lastLogin ? new Date(selectedStaff.lastLogin).toLocaleString() : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setShowStaffModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaffManagement; 