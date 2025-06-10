import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Create context with default values
const ServerContext = createContext({
  serverUrl: 'https://cv-builder-api.onrender.com',
  apiUrl: 'https://cv-builder-api.onrender.com',
  updateServerUrl: () => {},
  status: 'connected', // Always start as connected
  isConnected: true,
  isChecking: false,
  isReconnecting: false,
  connectionError: null,
  lastChecked: null,
  retryConnection: () => {}
});

// Update this URL to your production backend URL deployed on Render
const SERVER_URL = 'https://cv-builder-api.onrender.com';

// Environment detection
const isDevelopment = () => {
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('local') ||
    window.location.href.includes('dev=true')
  );
};

export const ServerProvider = ({ children }) => {
  // Always use the fixed server URL
  const [serverUrl] = useState(SERVER_URL);
  
  // In development mode, always consider connected
  const [status, setStatus] = useState(isDevelopment() ? 'connected' : 'checking');
  const [isChecking, setIsChecking] = useState(!isDevelopment());
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  
  // Simple no-op function since we don't allow changing the server URL
  const updateServerUrl = () => {
    console.log('Server URL is fixed to', SERVER_URL);
  };
  
  // Retry connection function - simplified for development
  const retryConnection = async () => {
    if (isDevelopment()) {
      // In development, just pretend it's connected
      setStatus('connected');
      setConnectionError(null);
      return;
    }
    
    setIsReconnecting(true);
    try {
      // Make a simple request to check server status
      const response = await fetch(`${SERVER_URL}/api/health`);
      if (response.ok) {
        setStatus('connected');
        setConnectionError(null);
      } else {
        setStatus('error');
        setConnectionError('Server returned an error');
      }
    } catch (error) {
      setStatus('error');
      setConnectionError(error.message);
    } finally {
      setIsReconnecting(false);
      setIsChecking(false);
      setLastChecked(new Date());
    }
  };
  
  // Initial check on component mount
  useEffect(() => {
    // In development mode, we don't need to check the server
    if (isDevelopment()) {
      setStatus('connected');
      setIsChecking(false);
      return;
    }
    
    // Only check in production mode
    retryConnection();
  }, []);
  
  // Context value - in development always appear connected
  const contextValue = {
    serverUrl,
    apiUrl: serverUrl,
    updateServerUrl,
    status: isDevelopment() ? 'connected' : status,
    isConnected: isDevelopment() ? true : status === 'connected',
    isChecking,
    isReconnecting,
    connectionError,
    lastChecked,
    retryConnection
  };
  
  return (
    <ServerContext.Provider value={contextValue}>
      {children}
    </ServerContext.Provider>
  );
};

// Custom hook to use the context
export const useServer = () => useContext(ServerContext);

export default ServerContext; 