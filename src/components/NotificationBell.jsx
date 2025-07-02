import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';
import { FiBell } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { safeFetch } from '../utils/apiUtils';

export default function NotificationBell() {
  const { user, getAuthHeader, isAuthenticated } = useAuth();
  const { apiUrl, status: serverStatus } = useServer();
  const [notificationCount, setNotificationCount] = useState(0);
  const intervalRef = useRef(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  useEffect(() => {
    const fetchNotificationCount = async () => {
      // Don't fetch if user is not authenticated or server is not connected
      if (!user || !isAuthenticated || serverStatus !== 'connected' || !apiUrl) {
        setNotificationCount(0);
        return false; // Return false to indicate failure
      }

      try {
        const data = await safeFetch(
          `${apiUrl}/api/users/notifications`,
          { headers: getAuthHeader() },
          { notifications: [] } // fallback
        );

        if (data && data.notifications) {
          setNotificationCount(data.notifications.length);
          retryCountRef.current = 0; // Reset retry count on success
          return true; // Success
        }
        return false;
      } catch (error) {
        console.error('Error fetching notification count:', error);
        
        // If it's an authentication error, stop polling
        if (error.status === 401 || error.message?.includes('Token expired')) {
          console.log('Authentication failed, stopping notification polling');
          setNotificationCount(0);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return false;
        }
        
        retryCountRef.current++;
        return false;
      }
    };

    const startPolling = () => {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Initial fetch
      fetchNotificationCount();
      
      // Set up polling interval - only if authenticated
      if (isAuthenticated && user) {
        intervalRef.current = setInterval(async () => {
          const success = await fetchNotificationCount();
          
          // If we've failed too many times, stop polling temporarily
          if (!success && retryCountRef.current >= maxRetries) {
            console.log('Too many failed attempts, pausing notification polling');
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            
            // Retry after 10 minutes
            setTimeout(() => {
              retryCountRef.current = 0;
              if (isAuthenticated && user) {
                startPolling();
              }
            }, 10 * 60 * 1000);
          }
        }, 5 * 60 * 1000); // 5 minutes
      }
    };

    startPolling();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [user, isAuthenticated, apiUrl, serverStatus, getAuthHeader]);

  // Clear notifications when user logs out
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotificationCount(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isAuthenticated, user]);

  if (!user || !isAuthenticated || notificationCount === 0) {
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