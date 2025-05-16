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
    
    // Then try different ports in sequence as fallbacks
    for (const port of [3005, 3006, 3007, 3008, 3009]) {
      try {
        const testUrl = `http://localhost:${port}`;
        // Simply test if we can create the URL object
        new URL(testUrl);
        return testUrl;
      } catch (e) {
        // If URL creation fails, try the next port
        continue;
      }
    }
    
    // Default as last resort
    return 'http://localhost:3005';
  });
  
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 10; // Increased for more resilience
  
  // Default ports to try
  const defaultPorts = [3005, 3006, 3007, 3008, 3009];
  
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
        // Short timeout to quickly identify connectivity issues
        signal: AbortSignal.timeout(3000),
        // Safari doesn't handle credentials well sometimes - explicitly disable
        credentials: 'omit', 
      });
      
      if (response.ok) {
        if (url && url !== serverUrl) {
          setServerUrl(url);
          localStorage.setItem('serverUrl', url); // Save working URL
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
      
      if (!url) {
        setIsConnected(false);
        setConnectionError(error.message);
        setIsLoading(false);
      }
      return false;
    }
  }, [serverUrl]);
  
  // Function to try all available ports
  const tryAllPorts = useCallback(async () => {
    // Try current configured URL first
    if (await checkServerConnection()) {
      return true;
    }
    
    // Get base URL without port
    let baseUrl;
    try {
      const urlObj = new URL(serverUrl);
      baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;
    } catch (e) {
      baseUrl = 'http://localhost';
    }
    
    // Try all ports systematically
    for (const port of defaultPorts) {
      const urlToTry = `${baseUrl}:${port}`;
      console.log(`Trying connection to: ${urlToTry}`);
      
      if (await checkServerConnection(urlToTry)) {
        console.log(`Successfully connected to: ${urlToTry}`);
        return true;
      }
    }
    
    return false;
  }, [serverUrl, checkServerConnection, defaultPorts]);
  
  // Exponential backoff retry logic
  const retryConnectionWithBackoff = useCallback(async () => {
    if (retryCount >= maxRetries) {
      console.log('Max retry attempts reached');
      return;
    }
    
    const backoffTime = Math.min(1000 * Math.pow(1.5, retryCount), 30000); // Max 30 seconds
    console.log(`Retrying connection in ${backoffTime}ms (attempt ${retryCount + 1}/${maxRetries})`);
    
    setTimeout(async () => {
      const success = await tryAllPorts();
      
      if (!success) {
        setRetryCount(prev => prev + 1);
      }
    }, backoffTime);
  }, [retryCount, maxRetries, tryAllPorts]);
  
  // Check server connection on mount and when serverUrl changes
  useEffect(() => {
    let isMounted = true;
    
    const initialize = async () => {
      // Add a small initial delay to ensure browser is ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!isMounted) return;
      
      const success = await tryAllPorts();
      
      if (!success && isMounted) {
        retryConnectionWithBackoff();
      }
    };
    
    initialize();
    
    // Periodic health check every 30 seconds
    const healthCheckInterval = setInterval(() => {
      if (!isConnected && isMounted) {
        tryAllPorts();
      } else if (isMounted) {
        // Quick lightweight check if we're already connected
        checkServerConnection();
      }
    }, 30000);
    
    return () => {
      isMounted = false;
      clearInterval(healthCheckInterval);
    };
  }, [tryAllPorts, retryConnectionWithBackoff, isConnected, checkServerConnection]);
  
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
    return tryAllPorts();
  }, [tryAllPorts]);

  // Context value
  const value = {
    serverUrl,
    isConnected,
    isLoading,
    connectionError,
    tryAllPorts,
    getAuthHeaders,
    checkServerConnection,
    retryConnection
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