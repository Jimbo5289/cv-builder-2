import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useServer } from '../../context/ServerContext';
import {
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import EmergencySetup from './EmergencySetup';

const AdminDashboard = () => {
  const { getAuthHeader } = useAuth();
  const { apiUrl } = useServer();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    users: { total: 0, active: 0, newToday: 0 },
    cvs: { total: 0, analyzedToday: 0 },
    subscriptions: { active: 0, revenue: 0, churnRate: 0 },
    systemHealth: { status: 'unknown', uptime: 0, errors: 0 }
  });
  const [recentActivity, setRecentActivity] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeader();
      
      // Fetch dashboard statistics
      const response = await fetch(`${apiUrl}/api/admin/dashboard`, {
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      const data = await response.json();
      
      // Fetch recent activity
      const activityResponse = await fetch(`${apiUrl}/api/admin/recent-activity`, {
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        }
      });

      let activityData = [];
      if (activityResponse.ok) {
        const activity = await activityResponse.json();
        activityData = activity.activities || [];
      }

      setDashboardData({
        users: data.users || { total: 0, active: 0, newToday: 0 },
        cvs: data.cvs || { total: 0, analyzedToday: 0 },
        subscriptions: data.subscriptions || { active: 0, revenue: 0, churnRate: 0 },
        systemHealth: data.systemHealth || { status: 'healthy', uptime: 99.9, errors: 0 }
      });

      setRecentActivity(activityData);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      
      // Set fallback data to prevent UI breaking
      setDashboardData({
        users: { total: 0, active: 0, newToday: 0 },
        cvs: { total: 0, analyzedToday: 0 },
        subscriptions: { active: 0, revenue: 0, churnRate: 0 },
        systemHealth: { status: 'error', uptime: 0, errors: 1 }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Metric cards configuration
  const metrics = [
    {
      name: 'Total Users',
      value: dashboardData.users.total,
      change: `+${dashboardData.users.newToday} today`,
      changeType: dashboardData.users.newToday > 0 ? 'positive' : 'neutral',
      icon: UsersIcon,
      color: 'blue'
    },
    {
      name: 'Active Users',
      value: dashboardData.users.active,
      change: `${((dashboardData.users.active / dashboardData.users.total) * 100 || 0).toFixed(1)}% of total`,
      changeType: 'neutral',
      icon: CheckCircleIcon,
      color: 'green'
    },
    {
      name: 'CVs Created',
      value: dashboardData.cvs.total,
      change: `+${dashboardData.cvs.analyzedToday} analyzed today`,
      changeType: dashboardData.cvs.analyzedToday > 0 ? 'positive' : 'neutral',
      icon: DocumentTextIcon,
      color: 'purple'
    },
    {
      name: 'Active Subscriptions',
      value: dashboardData.subscriptions.active,
      change: `£${dashboardData.subscriptions.revenue} revenue`,
      changeType: 'positive',
      icon: CreditCardIcon,
      color: 'yellow'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ margin: 0, padding: 0 }}>
      {/* Header section aligned with sidebar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center flex-shrink-0" style={{ margin: 0, padding: 0 }}>
        <div className="px-6 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Overview of your CV Builder platform
              </p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 flex-1">

      {/* Emergency Setup Component */}
      <EmergencySetup />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <metric.icon className={`h-6 w-6 text-${metric.color}-500`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {metric.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {metric.value.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  {metric.changeType === 'positive' && (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  )}
                  {metric.changeType === 'negative' && (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`${
                    metric.changeType === 'positive' ? 'text-green-600' :
                    metric.changeType === 'negative' ? 'text-red-600' :
                    'text-gray-500 dark:text-gray-400'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Health Status */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            System Health
          </h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {dashboardData.systemHealth.status === 'healthy' ? (
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
              ) : (
                <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
              )}
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                  {dashboardData.systemHealth.status}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  System is operating normally
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardData.systemHealth.uptime}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Uptime
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent Activity
          </h3>
        </div>
        <div className="p-6">
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="ml-4 flex-1">
                    <p className="text-gray-900 dark:text-white">
                      {activity.description || `Activity ${index + 1}`}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Recently'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No recent activity to display
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Quick Actions
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <UsersIcon className="h-6 w-6 text-blue-500 mb-2" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Manage Users
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                View and manage user accounts
              </div>
            </button>
            
            <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-left hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <DocumentTextIcon className="h-6 w-6 text-green-500 mb-2" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                View Analytics
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Detailed platform analytics
              </div>
            </button>
            
            <button className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-left hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
              <CreditCardIcon className="h-6 w-6 text-yellow-500 mb-2" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Subscriptions
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Monitor subscription status
              </div>
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 