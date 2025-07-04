import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';
import { FiBell } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { safeFetch } from '../utils/apiUtils';

export default function NotificationBell() {
  const { user, getAuthHeader, isAuthenticated } = useAuth();
  const { apiUrl, status: serverStatus } = useServer();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    let intervalId = null;

    const fetchNotificationCount = async () => {
      // Only fetch if user is authenticated and server is connected
      if (!user || !isAuthenticated || serverStatus !== 'connected' || !apiUrl) {
        return;
      }

      try {
        const data = await safeFetch(
          `${apiUrl}/api/users/notifications`,
          { headers: getAuthHeader() },
          { notifications: [] } // fallback
        );

        if (data && data.notifications) {
          setNotificationCount(data.notifications.length);
          retryCount = 0; // Reset retry count on success
        }
      } catch (error) {
        // If authentication fails, stop polling temporarily
        if (error.status === 401) {
          retryCount++;
          if (retryCount >= maxRetries) {
            console.log('Authentication failed multiple times, stopping notification polling');
            if (intervalId) {
              clearInterval(intervalId);
            }
            return;
          }
        }
        console.error('Error fetching notification count:', error);
      }
    };

    // Initial fetch
    fetchNotificationCount();
    
    // Set up interval with longer delay (10 minutes instead of 5)
    intervalId = setInterval(fetchNotificationCount, 10 * 60 * 1000);
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user, apiUrl, serverStatus, getAuthHeader, isAuthenticated]);

  if (!user || notificationCount === 0) {
    return null;
  }

  return (
    <Link
      to="/profile"
      className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      title="View notifications"
    >
      <FiBell className="h-5 w-5" />
      {notificationCount > 0 && (
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
          {notificationCount > 9 ? '9+' : notificationCount}
        </span>
      )}
    </Link>
  );
} 