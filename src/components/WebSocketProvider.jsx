/* eslint-disable */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createWebSocketConnection, safelySendMessage, safelyCloseConnection, MockWebSocket } from '../utils/websocket';
import { useServer } from '../context/ServerContext';

// Create WebSocket context
const WebSocketContext = createContext({
  isConnected: false,
  isConnecting: false,
  send: () => {},
  error: null,
  lastMessage: null,
  reconnect: () => {}
});

/**
 * Utility to catch unhandled promise rejections for WebSocket operations
 */
const safePromise = (promise) => {
  if (!promise || typeof promise.catch !== 'function') return promise;
  return promise.catch(err => {
    console.error('Caught WebSocket promise error:', err);
    // Return a default value (null) to prevent further rejections
    return null;
  });
};

/**
 * WebSocket Provider component to manage WebSocket connections
 */
export const WebSocketProvider = ({ 
  path = '/ws', 
  children,
  autoConnect = true,
  reconnectOnFailure = true,
  useMockInDev = true,
  maxReconnectAttempts = 3
}) => {
  const { serverUrl, isConnected: isServerConnected } = useServer();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  // Determine if we should use mock WebSocket
  const shouldUseMock = useMockInDev && import.meta.env.DEV;
  
  // Format WebSocket URL
  const getWebSocketUrl = useCallback(() => {
    try {
      if (!serverUrl) return null;
      
      // Convert http(s) to ws(s)
      const wsProtocol = serverUrl.startsWith('https') ? 'wss' : 'ws';
      const baseUrl = serverUrl.replace(/^https?:\/\//, '');
      return `${wsProtocol}://${baseUrl}${path}`;
    } catch (e) {
      console.error('Error creating WebSocket URL:', e);
      return null;
    }
  }, [serverUrl, path]);
  
  // Connect to WebSocket
  const connect = useCallback(() => {
    try {
      // If we've reached the max reconnect attempts, don't try again
      if (reconnectAttempts >= maxReconnectAttempts) {
        console.log(`Maximum WebSocket reconnect attempts (${maxReconnectAttempts}) reached`);
        return;
      }
      
      if (!isServerConnected) {
        console.log('Server not connected, skipping WebSocket connection');
        return;
      }
      
      const wsUrl = getWebSocketUrl();
      if (!wsUrl) {
        console.error('Could not create WebSocket URL');
        return;
      }
      
      setIsConnecting(true);
      setError(null);
      
      // Use mock WebSocket in development if enabled
      if (shouldUseMock) {
        console.log('Using mock WebSocket in development mode');
        const mockSocket = new MockWebSocket(wsUrl);
        
        mockSocket.addEventListener('open', () => {
          setIsConnected(true);
          setIsConnecting(false);
          setReconnectAttempts(0); // Reset reconnect attempts on successful connection
        });
        
        mockSocket.addEventListener('message', (event) => {
          setLastMessage(event.data);
        });
        
        mockSocket.addEventListener('error', (event) => {
          console.error('Mock WebSocket error:', event);
          setError('Mock WebSocket error');
        });
        
        mockSocket.addEventListener('close', () => {
          setIsConnected(false);
        });
        
        setSocket(mockSocket);
        return;
      }
      
      // Use real WebSocket in production - wrap in safePromise to prevent unhandled rejections
      safePromise(createWebSocketConnection(wsUrl, {
        onOpen: () => {
          setIsConnected(true);
          setIsConnecting(false);
          setReconnectAttempts(0); // Reset reconnect attempts on successful connection
        },
        onMessage: (event) => {
          setLastMessage(event.data);
        },
        onError: (event) => {
          console.error('WebSocket error:', event);
          setError('WebSocket connection error');
          setIsConnecting(false);
          setReconnectAttempts(prev => prev + 1);
        },
        onClose: () => {
          setIsConnected(false);
          setIsConnecting(false);
          // Only increment reconnect attempts if not caused by us calling close
          if (reconnectOnFailure) {
            setReconnectAttempts(prev => prev + 1);
          }
        },
        autoReconnect: reconnectOnFailure
      }))
      .then(ws => {
        if (ws) setSocket(ws);
      })
      .catch(err => {
        console.error('WebSocket connection failed:', err);
        setError(err.message);
        setIsConnecting(false);
        setReconnectAttempts(prev => prev + 1);
      });
    } catch (e) {
      console.error('Error in WebSocket connect:', e);
      setError(e.message);
      setIsConnecting(false);
      setReconnectAttempts(prev => prev + 1);
    }
  }, [isServerConnected, getWebSocketUrl, shouldUseMock, reconnectOnFailure, reconnectAttempts, maxReconnectAttempts]);
  
  // Reconnect WebSocket
  const reconnect = useCallback(() => {
    try {
      if (socket) {
        safelyCloseConnection(socket);
        setSocket(null);
      }
      setIsConnected(false);
      // Reset reconnect attempts when manually reconnecting
      setReconnectAttempts(0);
      connect();
    } catch (e) {
      console.error('Error reconnecting to WebSocket:', e);
      setError(e.message);
    }
  }, [socket, connect]);
  
  // Send message through WebSocket
  const send = useCallback((data) => {
    try {
      if (!socket) {
        console.warn('Cannot send message: WebSocket not connected');
        return false;
      }
      
      return safelySendMessage(socket, data);
    } catch (e) {
      console.error('Error sending WebSocket message:', e);
      setError(e.message);
      return false;
    }
  }, [socket]);
  
  // Connect on mount if autoConnect is true
  useEffect(() => {
    if (autoConnect && isServerConnected && !socket && !isConnecting && reconnectAttempts < maxReconnectAttempts) {
      // Add a small delay to allow other providers to initialize
      const timeoutId = setTimeout(connect, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [autoConnect, isServerConnected, socket, isConnecting, connect, reconnectAttempts, maxReconnectAttempts]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        safelyCloseConnection(socket);
      }
    };
  }, [socket]);
  
  // Create context value
  const contextValue = {
    isConnected,
    isConnecting,
    send,
    error,
    lastMessage,
    reconnect,
    reconnectAttempts
  };
  
  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket context
export const useWebSocket = () => {
  try {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
      throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
  } catch (e) {
    console.error('Error using WebSocket context:', e);
    // Return a default value if context is not available
    return {
      isConnected: false,
      isConnecting: false,
      send: () => false,
      error: 'WebSocketContext not available',
      lastMessage: null,
      reconnect: () => {},
      reconnectAttempts: 0
    };
  }
};

export default WebSocketProvider; 