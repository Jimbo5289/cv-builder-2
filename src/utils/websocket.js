/**
 * WebSocket utility for handling connections more gracefully
 */

// Keep track of connection attempts
let connectionAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY = 2000; // 2 seconds
const WS_TIMEOUT = 5000; // 5 seconds

/**
 * Creates a WebSocket connection with error handling and reconnection logic
 * @param {string} url - WebSocket URL to connect to
 * @param {object} options - Configuration options
 * @returns {Promise<WebSocket>} - Promise that resolves to WebSocket or rejects with error
 */
export const createWebSocketConnection = (url, options = {}) => {
  const {
    onOpen = () => {},
    onMessage = () => {},
    onError = () => {},
    onClose = () => {},
    protocols = [],
    autoReconnect = true,
    debugMode = import.meta.env.DEV
  } = options;

  return new Promise((resolve, reject) => {
    try {
      if (!url) {
        const error = new Error('WebSocket URL is required');
        if (debugMode) console.error('WebSocket error:', error);
        reject(error);
        return;
      }

      if (debugMode) console.log(`Attempting WebSocket connection to ${url}`);
      
      // Create connection
      const ws = new WebSocket(url, protocols);
      let timeoutId = null;
      
      // Set up connection timeout
      timeoutId = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          if (debugMode) console.warn('WebSocket connection timed out');
          ws.close();
          reject(new Error('WebSocket connection timed out'));
        }
      }, WS_TIMEOUT);
      
      // Connection opened
      ws.addEventListener('open', (event) => {
        clearTimeout(timeoutId);
        connectionAttempts = 0;
        if (debugMode) console.log('WebSocket connection established');
        onOpen(event);
        resolve(ws);
      });
      
      // Listen for messages
      ws.addEventListener('message', (event) => {
        try {
          onMessage(event);
        } catch (e) {
          if (debugMode) console.error('Error processing WebSocket message:', e);
        }
      });
      
      // Connection error
      ws.addEventListener('error', (event) => {
        clearTimeout(timeoutId);
        connectionAttempts++;
        if (debugMode) console.error('WebSocket error:', event);
        onError(event);
        
        // Don't reject here as the connection might still be established
      });
      
      // Connection closed
      ws.addEventListener('close', (event) => {
        clearTimeout(timeoutId);
        if (debugMode) console.log('WebSocket connection closed', event);
        onClose(event);
        
        // Auto-reconnect logic
        if (autoReconnect && connectionAttempts < MAX_RECONNECT_ATTEMPTS) {
          if (debugMode) {
            console.log(`Attempting to reconnect (${connectionAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
          }
          
          setTimeout(() => {
            createWebSocketConnection(url, options)
              .then(resolve)
              .catch(reject);
          }, RECONNECT_DELAY);
        } else if (connectionAttempts >= MAX_RECONNECT_ATTEMPTS) {
          if (debugMode) {
            console.error(`Maximum reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached.`);
          }
          reject(new Error('Maximum WebSocket reconnection attempts reached'));
        }
      });
    } catch (error) {
      connectionAttempts++;
      if (debugMode) console.error('Error creating WebSocket:', error);
      reject(error);
    }
  });
};

/**
 * Safely sends data through WebSocket with error handling
 * @param {WebSocket} ws - WebSocket instance
 * @param {any} data - Data to send
 * @param {boolean} debugMode - Enable debugging output
 * @returns {boolean} - Success status
 */
export const safelySendMessage = (ws, data, debugMode = import.meta.env.DEV) => {
  try {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      if (debugMode) console.warn('Cannot send message: WebSocket is not open');
      return false;
    }
    
    const message = typeof data === 'string' ? data : JSON.stringify(data);
    ws.send(message);
    return true;
  } catch (error) {
    if (debugMode) console.error('Error sending WebSocket message:', error);
    return false;
  }
};

/**
 * Safely closes a WebSocket connection
 * @param {WebSocket} ws - WebSocket instance
 * @param {number} code - Close code (default: 1000 - normal closure)
 * @param {string} reason - Close reason
 * @param {boolean} debugMode - Enable debugging output
 */
export const safelyCloseConnection = (ws, code = 1000, reason = 'Closed by client', debugMode = import.meta.env.DEV) => {
  try {
    if (!ws) return;
    
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      if (debugMode) console.log(`Closing WebSocket connection: ${reason}`);
      ws.close(code, reason);
    }
  } catch (error) {
    if (debugMode) console.error('Error closing WebSocket:', error);
  }
};

/**
 * Mock WebSocket for development environments without WebSocket server
 */
export class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = WebSocket.CONNECTING;
    this.listeners = {
      open: [],
      message: [],
      error: [],
      close: []
    };
    
    // Simulate connection
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      this.dispatchEvent({ type: 'open' });
    }, 100);
    
    console.log(`MockWebSocket created for ${url}`);
  }
  
  addEventListener(type, callback) {
    if (this.listeners[type]) {
      this.listeners[type].push(callback);
    }
  }
  
  removeEventListener(type, callback) {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter(cb => cb !== callback);
    }
  }
  
  dispatchEvent(event) {
    if (this.listeners[event.type]) {
      this.listeners[event.type].forEach(callback => callback(event));
    }
  }
  
  send(data) {
    console.log(`MockWebSocket sending data: ${data}`);
    // Simulate echo response
    setTimeout(() => {
      this.dispatchEvent({ 
        type: 'message', 
        data: `Echo: ${data}` 
      });
    }, 100);
  }
  
  close(code = 1000, reason = 'Normal closure') {
    this.readyState = WebSocket.CLOSING;
    setTimeout(() => {
      this.readyState = WebSocket.CLOSED;
      this.dispatchEvent({ 
        type: 'close', 
        code, 
        reason, 
        wasClean: true 
      });
    }, 100);
  }
}

/**
 * Creates a WebSocket or MockWebSocket based on environment
 */
export const getWebSocketInstance = (url, useMock = import.meta.env.DEV) => {
  if (useMock) {
    return new MockWebSocket(url);
  }
  return new WebSocket(url);
};

// WebSocket ready states for reference
export const WebSocketState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
}; 