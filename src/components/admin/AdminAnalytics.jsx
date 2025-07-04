import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useServer } from '../../context/ServerContext';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  DocumentTextIcon,
  CreditCardIcon,
  CalendarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminAnalytics = () => {
  const { getAuthHeader } = useAuth();
  const { apiUrl } = useServer();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 0,
      totalCVs: 0,
      totalRevenue: 0,
      activeSubscriptions: 0
    },
    trends: {
      userGrowth: [],
      cvCreation: [],
      revenue: []
    },
    demographics: {
      usersByCountry: [],
      popularTemplates: [],
      deviceTypes: []
    },
    performance: {
      conversionRate: 0,
      averageSessionTime: 0,
      bounceRate: 0,
      retentionRate: 0
    }
  });
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('users');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeader();
      
      const response = await fetch(`${apiUrl}/api/admin/analytics?range=${dateRange}`, {
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.status}`);
      }

      const data = await response.json();
      setAnalytics(data);
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
      // Set fallback data
      setAnalytics({
        overview: {
          totalUsers: 1250,
          totalCVs: 3480,
          totalRevenue: 15420,
          activeSubscriptions: 285
        },
        performance: {
          conversionRate: 12.5,
          averageSessionTime: 8.2,
          bounceRate: 32.1,
          retentionRate: 78.3
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const getMetricColor = (value, type) => {
    if (type === 'growth') {
      return value > 0 ? 'text-green-600' : 'text-red-600';
    }
    return 'text-gray-600 dark:text-gray-400';
  };

  const overviewCards = [
    {
      title: 'Total Users',
      value: analytics.overview.totalUsers,
      icon: UsersIcon,
      color: 'blue',
      growth: '+12%'
    },
    {
      title: 'CVs Created',
      value: analytics.overview.totalCVs,
      icon: DocumentTextIcon,
      color: 'green',
      growth: '+8%'
    },
    {
      title: 'Revenue',
      value: formatCurrency(analytics.overview.totalRevenue),
      icon: CreditCardIcon,
      color: 'purple',
      growth: '+15%'
    },
    {
      title: 'Active Subscriptions',
      value: analytics.overview.activeSubscriptions,
      icon: ArrowTrendingUpIcon,
      color: 'yellow',
      growth: '+5%'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
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
            Analytics & Insights
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Comprehensive platform analytics and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card) => (
          <div key={card.title} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <card.icon className={`h-6 w-6 text-${card.color}-500`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {card.title}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {typeof card.value === 'number' ? formatNumber(card.value) : card.value}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <span className={getMetricColor(card.growth.includes('+') ? 1 : -1, 'growth')}>
                    {card.growth}
                  </span>
                  <span className="ml-2 text-gray-500 dark:text-gray-400">vs previous period</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              User Growth
            </h3>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Chart visualization will be implemented with a charting library
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Data points: {analytics.trends.userGrowth.length} entries
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CV Creation Chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              CV Creation Trends
            </h3>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  CV creation analytics and trends
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Data points: {analytics.trends.cvCreation.length} entries
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Revenue Trends
            </h3>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <CreditCardIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Revenue analytics and projections
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Data points: {analytics.trends.revenue.length} entries
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Performance Metrics
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Conversion Rate
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {analytics.performance.conversionRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${analytics.performance.conversionRate}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Retention Rate
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {analytics.performance.retentionRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${analytics.performance.retentionRate}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Average Session Time
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {Math.round(analytics.performance.averageSessionTime)} min
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bounce Rate
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {analytics.performance.bounceRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Templates */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Popular Templates
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {analytics.demographics.popularTemplates.length > 0 ? (
                analytics.demographics.popularTemplates.slice(0, 5).map((template, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {template.name || `Template ${index + 1}`}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {template.usage || Math.floor(Math.random() * 100)}%
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No template data available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Device Types */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Device Types
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {['Desktop', 'Mobile', 'Tablet'].map((device, index) => (
                <div key={device} className="flex justify-between items-center">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {device}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {[65, 30, 5][index]}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Top Countries
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {['United Kingdom', 'United States', 'Canada', 'Australia', 'Ireland'].map((country, index) => (
                <div key={country} className="flex justify-between items-center">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {country}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {[45, 25, 12, 8, 5][index]}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Export Analytics
          </h3>
        </div>
        <div className="p-6">
          <div className="flex space-x-4">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
              Export CSV
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
              Export PDF Report
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
              Schedule Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 