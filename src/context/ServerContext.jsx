import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';

// Create context
const ServerContext = createContext();

// Create provider component
export const ServerProvider = ({ children }) => {
  // Initialize with stored server URL or environment variable or default
  const [serverUrl, setServerUrl] = useState(() => {
    // First try to use the URL from localStorage (from previous successful connection)
    const savedUrl = localStorage.getItem('serverUrl');
    if (savedUrl) return savedUrl;
    
    // Then try environment variable 
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    
    // Default as last resort
    return 'http://localhost:3005';
  });
  
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  
  // Function to check connection to a specific server URL
  const checkServerConnection = useCallback(async (url = null) => {
    // Use provided URL or current serverUrl
    const checkUrl = url || serverUrl;
    try {
      setIsLoading(true);
      setConnectionError(null);
      // Add a timestamp to prevent caching
      const timestamp = Date.now();
      const response = await fetch(`${checkUrl}/health?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(3000),
        credentials: 'omit',
      });
      if (response.ok) {
        if (url && url !== serverUrl) {
          setServerUrl(url);
          localStorage.setItem('serverUrl', url);
        }
        setIsConnected(true);
        setIsLoading(false);
        setRetryCount(0);
        console.log(`Successfully connected to server: ${url || serverUrl}`);
        return true;
      } else {
        console.warn(`Server returned status: ${response.status}`);
        throw new Error(`Server returned status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Connection failed to ${checkUrl}:`, error.message);
      setIsConnected(false);
      setConnectionError(error.message);
      setIsLoading(false);
      return false;
    }
  }, [serverUrl]);
  
  // Check server connection on mount and when serverUrl changes
  useEffect(() => {
    let isMounted = true;
    const initialize = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!isMounted) return;
      await checkServerConnection();
    };
    initialize();
    // Periodic health check every 30 seconds
    const healthCheckInterval = setInterval(() => {
      if (isMounted) {
        checkServerConnection();
      }
    }, 30000);
    return () => {
      isMounted = false;
      clearInterval(healthCheckInterval);
    };
  }, [checkServerConnection]);
  
  // Utility function to get authentication headers (with token if available)
  const getAuthHeaders = useCallback(() => {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const token = Cookies.get('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }, []);
  
  // Manual retry function that can be exposed to components
  const retryConnection = useCallback(() => {
    setRetryCount(0);
    return checkServerConnection();
  }, [checkServerConnection]);

  // Context value
  const value = {
    serverUrl,
    apiUrl: serverUrl,
    isConnected,
    isLoading,
    connectionError,
    getAuthHeaders,
    checkServerConnection,
    retryConnection,
    status: isConnected ? 'connected' : (isLoading ? 'connecting' : 'disconnected')
  };

  return (
    <ServerContext.Provider value={value}>
      {children}
    </ServerContext.Provider>
  );
};

// Custom hook to use the server context
export const useServer = () => {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error('useServer must be used within a ServerProvider');
  }
  return context;
};

export default ServerContext; 