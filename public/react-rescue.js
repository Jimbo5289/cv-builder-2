/**
 * React Rescue Script
 * This script runs before the React app to ensure React is properly loaded
 * It's a standalone script that doesn't depend on any external libraries
 */

(function() {
  // Console log wrapper with prefix for debugging
  const logRescue = function(message) {
    console.log('[ReactRescue] ' + message);
  };

  logRescue('React rescue script initialized');
  
  // Variable to track if we've already attempted a rescue
  window.__reactRescueAttempted = window.__reactRescueAttempted || false;
  
  // Prevent multiple executions
  if (window.__reactRescueAttempted) {
    logRescue('Rescue already attempted, skipping');
    return;
  }
  
  window.__reactRescueAttempted = true;

  // Check if React is available
  const isReactAvailable = function() {
    try {
      return (
        typeof React !== 'undefined' &&
        typeof React.createElement === 'function' &&
        typeof ReactDOM !== 'undefined' &&
        typeof ReactDOM.createRoot === 'function'
      );
    } catch (e) {
      return false;
    }
  };

  // Ensure the root element exists
  const ensureRootElement = function() {
    try {
      // Check if document and body are available
      if (!document || !document.body) {
        logRescue('Document or body not available yet');
        return null;
      }
      
      // Check if root already exists
      let rootElement = document.getElementById('root');
      
      // If not, create it
      if (!rootElement) {
        logRescue('Root element not found, creating one');
        rootElement = document.createElement('div');
        rootElement.id = 'root';
        document.body.appendChild(rootElement);
        logRescue('Root element created and appended to body');
      }
      
      return rootElement;
    } catch (e) {
      console.error('Error ensuring root element:', e);
      return null;
    }
  };

  // Load React from CDN
  const loadReactFromCDN = function(callback) {
    logRescue('Loading React from CDN');
    
    try {
      // Function to load a script
      const loadScript = function(src, onLoad, onError) {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;  // Important: Load scripts in order
        script.onload = onLoad;
        script.onerror = onError;
        document.head.appendChild(script);
        return script;
      };
      
      // Load React first, then ReactDOM
      const reactScript = loadScript(
        'https://unpkg.com/react@18.2.0/umd/react.production.min.js',
        function() {
          logRescue('React core loaded successfully');
          
          // Load ReactDOM after React is loaded
          const reactDomScript = loadScript(
            'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js',
            function() {
              logRescue('ReactDOM loaded successfully');
              if (callback) callback(true);
            },
            function() {
              logRescue('Failed to load ReactDOM');
              if (callback) callback(false);
            }
          );
        },
        function() {
          logRescue('Failed to load React core');
          if (callback) callback(false);
        }
      );
    } catch (e) {
      console.error('Error setting up React CDN load:', e);
      if (callback) callback(false);
    }
  };

  // Initialize rescue operations
  const initialize = function() {
    try {
      // Patch document.body if it's null or undefined
      if (!document.body && document.documentElement) {
        logRescue('document.body is missing, creating it');
        const body = document.createElement('body');
        document.documentElement.appendChild(body);
      }
      
      // Check if React is already available
      if (isReactAvailable()) {
        logRescue('React is already available, no rescue needed');
        return;
      }
      
      // React is not available, load from CDN
      loadReactFromCDN(function(success) {
        if (success) {
          logRescue('React rescue completed successfully');
          ensureRootElement();
        } else {
          logRescue('React rescue failed');
        }
      });
      
      // Ensure the root element exists regardless of React loading
      ensureRootElement();
    } catch (e) {
      console.error('Error in React rescue initialization:', e);
    }
  };

  // Start initialization immediately if document is ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initialize();
  } else {
    // Otherwise wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', initialize);
    
    // Also set a timeout as a fallback
    setTimeout(initialize, 1000);
  }
})(); 