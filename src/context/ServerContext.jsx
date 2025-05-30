import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Create context
const ServerContext = createContext(null);

// Default server URLs - FIX: Use fixed URL to prevent port scanning issues
const DEFAULT_URLS = {
  development: 'http://localhost:3005',
  production: window.location.origin.replace(/:\d+$/, ''),
  fallback: 'http://localhost:3005' // Fallback for when environment detection fails
};

// Provider component
export function ServerProvider({ children }) {
  // Initialize serverUrl based on environment variables or reasonable defaults
  const [serverUrl, setServerUrl] = useState(() => {
    // FIX: Use fixed development URL to avoid port scanning issues
    return 'http://localhost:3005';
    
    // Comment out port scanning logic that was causing issues
    /*
    // First try to get from environment variables
    const envUrl = import.meta.env.VITE_API_URL;
    
    if (envUrl) {
      console.log(`Using API URL from environment: ${envUrl}`);
      return envUrl;
    }
    
    // If not available, determine based on current environment
    const isDev = import.meta.env.DEV || 
                 window.location.hostname === 'localhost' || 
                 window.location.hostname === '127.0.0.1';
    
    const defaultUrl = isDev ? DEFAULT_URLS.development : DEFAULT_URLS.production;
    console.log(`Using default ${isDev ? 'development' : 'production'} API URL: ${defaultUrl}`);
    
    return defaultUrl;
    */
  });

  // State for server status
  const [serverStatus, setServerStatus] = useState({
    isAvailable: null,
    lastChecked: null,
    error: null
  });

  // Check if server is available
  useEffect(() => {
    const checkServerAvailability = async () => {
      try {
        // Don't actually check in development mode if using mock mode
        if (import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === 'true') {
          console.log('DEV MODE: Skipping server availability check');
          setServerStatus({
            isAvailable: true,
            lastChecked: new Date(),
            error: null
          });
          return;
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        console.log(`Checking server health at ${serverUrl}/health`);
        const response = await fetch(`${serverUrl}/health`, {
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log('Server health check successful');
          setServerStatus({
            isAvailable: true,
            lastChecked: new Date(),
            error: null
          });
        } else {
          console.warn(`Server health check failed with status: ${response.status}`);
          setServerStatus({
            isAvailable: false,
            lastChecked: new Date(),
            error: `Server responded with status: ${response.status}`
          });
        }
      } catch (error) {
        console.warn(`Server availability check failed: ${error.message}`);
        
        // In development mode, we'll simulate the server being available
        if (import.meta.env.DEV) {
          console.log('DEV MODE: Simulating server availability despite connection error');
          setServerStatus({
            isAvailable: true,
            lastChecked: new Date(),
            error: `Connection failed but running in dev mode: ${error.message}`
          });
        } else {
          setServerStatus({
            isAvailable: false,
            lastChecked: new Date(),
            error: error.message
          });
        }
      }
    };
    
    checkServerAvailability();
    
    // Set up periodic checking (every 5 minutes)
    const intervalId = setInterval(checkServerAvailability, 5 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [serverUrl]);
  
  // API for updating server URL
  const updateServerUrl = (newUrl) => {
    if (!newUrl) return;
    
    console.log(`Updating server URL to: ${newUrl}`);
    setServerUrl(newUrl);
    
    // Check availability with new URL
    setServerStatus(prev => ({
      ...prev,
      isAvailable: null,
      lastChecked: null
    }));
  };

  // Retry connection manually
  const retryConnection = () => {
    console.log('Manually retrying server connection');
    setServerStatus(prev => ({
      ...prev,
      isAvailable: null,
      lastChecked: null
    }));
  };

  // Calculate simplified status for easier consumption by components
  const status = serverStatus.isAvailable === null 
    ? 'checking' 
    : serverStatus.isAvailable 
      ? 'connected' 
      : 'disconnected';

  // Additional simplified flags for connection state
  const isConnected = status === 'connected';
  const isChecking = status === 'checking';
  const isReconnecting = status === 'disconnected' && serverStatus.lastChecked !== null;

  return (
    <ServerContext.Provider value={{ 
      serverUrl, 
      apiUrl: serverUrl, // Alias for backward compatibility
      updateServerUrl,
      serverStatus,
      status, // Simplified status string
      isConnected,
      isChecking,
      isReconnecting,
      connectionError: serverStatus.error,
      lastChecked: serverStatus.lastChecked,
      retryConnection
    }}>
      {children}
    </ServerContext.Provider>
  );
}

// Custom hook for using the server context
export function useServer() {
  const context = useContext(ServerContext);
  if (context === undefined) {
    throw new Error('useServer must be used within a ServerProvider');
  }
  return context;
}

export default ServerContext; 