import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';
import { FiAlertTriangle, FiClock, FiX, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { safeFetch } from '../utils/apiUtils';

export default function ExpirationNotifications() {
  const { user, getAuthHeader } = useAuth();
  const { apiUrl, status: serverStatus } = useServer();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user || serverStatus !== 'connected' || !apiUrl) {
        setLoading(false);
        return;
      }

      try {
        const data = await safeFetch(
          `${apiUrl}/api/users/notifications`,
          { headers: getAuthHeader() },
          { notifications: [] } // fallback
        );

        if (data && data.notifications) {
          setNotifications(data.notifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user, apiUrl, serverStatus, getAuthHeader]);

  const handleDismiss = (index) => {
    setDismissed(prev => new Set([...prev, index]));
  };

  const getNotificationIcon = (severity) => {
    if (severity === 'error') {
      return <FiAlertTriangle className="h-5 w-5 text-red-500" />;
    }
    return <FiClock className="h-5 w-5 text-yellow-500" />;
  };

  const getNotificationStyles = (severity) => {
    if (severity === 'error') {
      return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
    }
    return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
  };

  const getTextStyles = (severity) => {
    if (severity === 'error') {
      return 'text-red-800 dark:text-red-200';
    }
    return 'text-yellow-800 dark:text-yellow-200';
  };

  const getActionButton = (notification) => {
    if (notification.type === 'subscription') {
      if (notification.autoRenew) {
        return (
          <Link
            to="/pricing"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiRefreshCw className="h-3 w-3 mr-1" />
            Manage Subscription
          </Link>
        );
      } else {
        return (
          <Link
            to="/pricing"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Renew Now
          </Link>
        );
      }
    } else if (notification.type === 'temporary_access') {
      return (
        <Link
          to="/pricing"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Extend Access
        </Link>
      );
    }
    return null;
  };

  if (loading) {
    return null; // Don't show loading state for notifications
  }

  const visibleNotifications = notifications.filter((_, index) => !dismissed.has(index));

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6">
      {visibleNotifications.map((notification, index) => (
        <div
          key={index}
          className={`rounded-lg border p-4 ${getNotificationStyles(notification.severity)}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getNotificationIcon(notification.severity)}
            </div>
            <div className="ml-3 flex-1">
              <h3 className={`text-sm font-medium ${getTextStyles(notification.severity)}`}>
                {notification.title}
              </h3>
              <div className={`mt-1 text-sm ${getTextStyles(notification.severity)}`}>
                <p>{notification.message}</p>
                {notification.expiryDate && (
                  <p className="mt-1 text-xs opacity-75">
                    Expires: {new Date(notification.expiryDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  {getActionButton(notification)}
                </div>
                <button
                  onClick={() => handleDismiss(index)}
                  className={`inline-flex items-center p-1.5 border border-transparent rounded-full ${
                    notification.severity === 'error' 
                      ? 'text-red-400 hover:text-red-600 dark:text-red-300 dark:hover:text-red-100' 
                      : 'text-yellow-400 hover:text-yellow-600 dark:text-yellow-300 dark:hover:text-yellow-100'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  title="Dismiss notification"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 