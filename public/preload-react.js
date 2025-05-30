// Preload React script
// This ensures React is loaded before any other scripts run

(function() {
  console.log('Preloading React...');
  
  // Add a timestamp to avoid caching issues
  const timestamp = new Date().getTime();
  
  // Create a global status object to track React loading
  window.__REACT_STATUS__ = {
    loading: true,
    error: null,
    version: null,
    timestamp: timestamp
  };
  
  // Create script elements to load React and ReactDOM with high priority
  const reactScript = document.createElement('script');
  reactScript.src = `https://unpkg.com/react@18.2.0/umd/react.production.min.js?_=${timestamp}`;
  reactScript.crossOrigin = 'anonymous';
  reactScript.async = false; // Load synchronously
  
  const reactDomScript = document.createElement('script');
  reactDomScript.src = `https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js?_=${timestamp}`;
  reactDomScript.crossOrigin = 'anonymous';
  reactDomScript.async = false; // Load synchronously
  
  // Handle loading errors
  reactScript.onerror = function(e) {
    console.error('Failed to load React:', e);
    window.__REACT_STATUS__.error = 'Failed to load React';
    window.__REACT_STATUS__.loading = false;
  };
  
  reactDomScript.onerror = function(e) {
    console.error('Failed to load ReactDOM:', e);
    window.__REACT_STATUS__.error = 'Failed to load ReactDOM';
    window.__REACT_STATUS__.loading = false;
  };
  
  // React loaded successfully
  reactScript.onload = function() {
    console.log('React loaded successfully:', React.version);
  };
  
  // ReactDOM loaded successfully
  reactDomScript.onload = function() {
    if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
      console.log('React and ReactDOM loaded successfully:', React.version);
      window.__REACT_STATUS__.loading = false;
      window.__REACT_STATUS__.version = React.version;
      
      // Dispatch an event to notify the application that React is ready
      document.dispatchEvent(new CustomEvent('reactReady', { 
        detail: { version: React.version } 
      }));
    }
  };
  
  // Add scripts to document head with high priority
  document.head.insertBefore(reactScript, document.head.firstChild);
  document.head.insertBefore(reactDomScript, document.head.childNodes[1] || null);
  
  // Set a timeout to check if React loaded
  setTimeout(function() {
    if (window.__REACT_STATUS__.loading) {
      console.warn('React loading timeout exceeded');
      window.__REACT_STATUS__.error = 'Loading timeout exceeded';
      window.__REACT_STATUS__.loading = false;
    }
  }, 10000); // 10 second timeout
})(); 