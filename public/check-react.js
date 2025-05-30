// React checker script
// This is a last resort script that runs immediately to ensure React is available

(function() {
  console.log('check-react.js: Checking if React is available');
  
  // Function to create a simple element for testing
  function createTestComponent() {
    try {
      const testDiv = document.createElement('div');
      testDiv.style.display = 'none';
      document.body.appendChild(testDiv);
      
      // Try to render a simple React component
      console.log('Attempting to create test React element');
      const element = window.React.createElement('div', null, 'Test Element');
      console.log('Test element created successfully');
      
      // Try to render it - handle both React 18 and older versions
      console.log('Attempting to render with ReactDOM');
      if (window.ReactDOM.createRoot) {
        // React 18+
        const root = window.ReactDOM.createRoot(testDiv);
        root.render(element);
      } else if (window.ReactDOM.render) {
        // React 17 and earlier
        window.ReactDOM.render(element, testDiv);
      } else {
        throw new Error('No ReactDOM render method available');
      }
      console.log('React test successful');
      
      // Clean up
      setTimeout(() => {
        if (document.body.contains(testDiv)) {
          document.body.removeChild(testDiv);
        }
      }, 1000);
      
      return true;
    } catch (e) {
      console.error('React test failed:', e);
      return false;
    }
  }
  
  // Check if React is defined
  if (typeof window.React === 'undefined' || typeof window.ReactDOM === 'undefined') {
    console.warn('React not found in global scope, injecting it');
    
    // Create React script element
    const reactScript = document.createElement('script');
    reactScript.src = 'https://unpkg.com/react@18.2.0/umd/react.production.min.js';
    reactScript.crossOrigin = 'anonymous';
    
    // Create ReactDOM script element
    const reactDomScript = document.createElement('script');
    reactDomScript.src = 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js';
    reactDomScript.crossOrigin = 'anonymous';
    
    // Add event handlers
    reactScript.onload = function() {
      console.log('React loaded from CDN');
      document.head.appendChild(reactDomScript);
    };
    
    reactDomScript.onload = function() {
      console.log('ReactDOM loaded from CDN');
      // Create a global Component reference to avoid i1.Component error
      if (window.React && !window.Component) {
        window.Component = window.React.Component;
      }
      window.setTimeout(function() {
        const testResult = createTestComponent();
        console.log('React test result:', testResult);
      }, 500);
    };
    
    // Handle errors
    reactScript.onerror = function() {
      console.error('Failed to load React from CDN');
      document.body.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h2 style="color: #e74c3c;">Failed to Load React</h2>
          <p>The application could not load the required React library.</p>
          <button onclick="window.location.reload()">Reload</button>
          <button onclick="window.location.href='/fallback.html'">Fallback Page</button>
        </div>
      `;
    };
    
    // Add scripts to document
    document.head.appendChild(reactScript);
  } else {
    console.log('React already defined:', window.React.version);
    
    // Create a global Component reference to avoid i1.Component error
    if (window.React && !window.Component) {
      window.Component = window.React.Component;
    }
    
    // Test if React is working properly
    window.setTimeout(function() {
      const testResult = createTestComponent();
      console.log('React test result:', testResult);
    }, 500);
  }
  
  // Set up an error handler for React-related errors
  window.addEventListener('error', function(e) {
    // Only handle React-related errors
    if (e.message && (
        e.message.includes('React') || 
        e.message.includes('react') || 
        e.message.includes('Component') ||
        e.message.includes('jsx') ||
        e.message.includes('i1.Component') || // Specific error we're seeing
        e.message.includes('undefined is not an object')
    )) {
      console.error('Caught React-related error:', e);
      
      // Try to load React from CDN if it appears to be a missing React error
      if (e.message.includes('undefined is not an object') || 
          e.message.includes('undefined is not a function') ||
          e.message.includes('Component') ||
          e.message.includes('i1.Component')) {
        
        console.warn('Attempting to reload React after error');
        
        // Create and inject React scripts
        const reactScript = document.createElement('script');
        reactScript.src = 'https://unpkg.com/react@18.2.0/umd/react.production.min.js';
        reactScript.crossOrigin = 'anonymous';
        
        const reactDomScript = document.createElement('script');
        reactDomScript.src = 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js';
        reactDomScript.crossOrigin = 'anonymous';
        
        // Create a global Component reference to avoid i1.Component error
        window.Component = window.React ? window.React.Component : null;
        
        // Add them to the document
        document.head.appendChild(reactScript);
        document.head.appendChild(reactDomScript);
      }
    }
  });
})(); 