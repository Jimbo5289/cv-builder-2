/**
 * React Bootstrap Utilities
 * Provides functions to ensure React is properly loaded and DOM is ready
 */

// Set up timer for debugging initialization process
const startTime = Date.now();
const logInit = (message) => {
  if (import.meta.env.DEV) {
    console.log(`[ReactBootstrap] (${Date.now() - startTime}ms) ${message}`);
  }
};

logInit('Bootstrap script started');

/**
 * Check if React is available
 * @returns {boolean} Whether React and ReactDOM are properly loaded
 */
export const isReactAvailable = () => {
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

/**
 * Wait for React to be available
 * @param {number} timeout - Maximum time to wait in ms
 * @returns {Promise<boolean>} Whether React became available
 */
export const waitForReact = (timeout = 5000) => {
  return new Promise((resolve) => {
    if (isReactAvailable()) {
      logInit('React already available');
      resolve(true);
      return;
    }

    logInit('Waiting for React to load...');
    
    // Set timeout
    const timeoutId = setTimeout(() => {
      logInit('React load timeout - attempting recovery');
      resolve(false);
    }, timeout);
    
    // Check periodically
    const checkInterval = setInterval(() => {
      if (isReactAvailable()) {
        clearTimeout(timeoutId);
        clearInterval(checkInterval);
        logInit('React loaded successfully');
        resolve(true);
      }
    }, 50);
  });
};

/**
 * Ensure the root DOM element exists
 * @returns {HTMLElement|null} The root element or null
 */
export const ensureRootElement = () => {
  try {
    logInit('Ensuring root element exists');
    
    // Check if document and body are available
    if (!document || !document.body) {
      logInit('Document or body not available yet');
      return null;
    }
    
    // Check if root already exists
    let rootElement = document.getElementById('root');
    
    // If not, create it
    if (!rootElement) {
      logInit('Root element not found, creating one');
      rootElement = document.createElement('div');
      rootElement.id = 'root';
      document.body.appendChild(rootElement);
      logInit('Root element created and appended to body');
    } else {
      logInit('Existing root element found');
    }
    
    return rootElement;
  } catch (e) {
    console.error('Error ensuring root element:', e);
    return null;
  }
};

/**
 * Check if DOM is ready for React rendering
 * @returns {Promise<boolean>} Whether DOM is ready
 */
export const isDomReady = () => {
  return new Promise((resolve) => {
    const checkDom = () => {
      try {
        // Check if document and body exist
        if (!document || !document.body) {
          return false;
        }
        
        // Check if we can access basic DOM properties
        const test = document.body.childElementCount !== undefined;
        return true;
      } catch (e) {
        return false;
      }
    };
    
    // DOM already ready
    if (checkDom()) {
      logInit('DOM already ready');
      resolve(true);
      return;
    }
    
    logInit('Waiting for DOM to be ready...');
    
    // DOM not ready, wait for it
    const checkInterval = setInterval(() => {
      if (checkDom()) {
        clearInterval(checkInterval);
        logInit('DOM is now ready');
        resolve(true);
      }
    }, 50);
    
    // Also listen for DOMContentLoaded event
    document.addEventListener('DOMContentLoaded', () => {
      clearInterval(checkInterval);
      logInit('DOMContentLoaded event fired');
      resolve(true);
    });
  });
};

/**
 * Load React from CDN if not available
 * @returns {Promise<boolean>} Whether React was loaded successfully
 */
export const loadReactFromCDN = async () => {
  if (isReactAvailable()) {
    logInit('React already loaded, skipping CDN load');
    return true;
  }

  logInit('Loading React from CDN');
  
  return new Promise((resolve) => {
    try {
      // Function to load a script
      const loadScript = (src) => {
        return new Promise((resolveScript, rejectScript) => {
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          
          script.onload = () => resolveScript(true);
          script.onerror = () => rejectScript(new Error(`Failed to load script: ${src}`));
          
          document.head.appendChild(script);
        });
      };
      
      // Load React and ReactDOM
      Promise.all([
        loadScript('https://unpkg.com/react@18.2.0/umd/react.production.min.js'),
        loadScript('https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js')
      ])
      .then(() => {
        logInit('React and ReactDOM loaded from CDN');
        resolve(true);
      })
      .catch((error) => {
        console.error('Error loading React from CDN:', error);
        resolve(false);
      });
    } catch (e) {
      console.error('Error setting up React CDN load:', e);
      resolve(false);
    }
  });
};

/**
 * Bootstrap React application
 * @returns {Promise<boolean>} Whether bootstrap was successful
 */
export const bootstrapReact = async () => {
  logInit('Starting React bootstrap process');
  
  try {
    // Ensure DOM is ready
    const domReady = await isDomReady();
    if (!domReady) {
      logInit('DOM never became ready');
      return false;
    }
    
    // Check if React is available
    let reactAvailable = isReactAvailable();
    
    // If not, try to wait for it
    if (!reactAvailable) {
      reactAvailable = await waitForReact(2000);
    }
    
    // If still not available, try to load from CDN
    if (!reactAvailable) {
      reactAvailable = await loadReactFromCDN();
      
      // Wait a bit for React to initialize after loading
      if (reactAvailable) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Final check
    if (!isReactAvailable()) {
      logInit('Failed to ensure React availability');
      return false;
    }
    
    // Ensure root element exists
    const rootElement = ensureRootElement();
    if (!rootElement) {
      logInit('Failed to ensure root element');
      return false;
    }
    
    logInit('React bootstrap successful');
    return true;
  } catch (e) {
    console.error('Error during React bootstrap:', e);
    return false;
  }
};

export default {
  bootstrapReact,
  isReactAvailable,
  ensureRootElement,
  isDomReady,
  waitForReact,
  loadReactFromCDN
}; 