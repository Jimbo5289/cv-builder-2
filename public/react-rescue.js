// React Rescue Script
// This script ensures React is available even if the bundled version fails to load

(function() {
  console.log('React Rescue Script activated');
  
  // Check if React is already defined
  if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
    console.log('React already loaded, no rescue needed:', React.version);
    return;
  }
  
  console.warn('React not found, loading from CDN...');
  
  // Function to load a script
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }
  
  // Load React and ReactDOM from CDN
  Promise.all([
    loadScript('https://unpkg.com/react@18.2.0/umd/react.production.min.js'),
    loadScript('https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js')
  ])
    .then(() => {
      console.log('React rescue successful!', React.version);
      
      // Check if the root element exists
      const rootElement = document.getElementById('root');
      if (!rootElement) {
        console.error('Root element not found');
        return;
      }
      
      // Try to render a simple React component to confirm React is working
      try {
        const element = React.createElement('div', null, [
          React.createElement('h2', { key: 'title', style: { color: '#3498db' } }, 'React Rescue Successful'),
          React.createElement('p', { key: 'info' }, `React ${React.version} loaded from CDN`)
        ]);
        
        // Create a test div to render to (won't affect the actual app)
        const testDiv = document.createElement('div');
        testDiv.style.position = 'fixed';
        testDiv.style.bottom = '10px';
        testDiv.style.left = '10px';
        testDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        testDiv.style.padding = '10px';
        testDiv.style.borderRadius = '4px';
        testDiv.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        testDiv.style.zIndex = '9999';
        document.body.appendChild(testDiv);
        
        // Render to test div
        const root = ReactDOM.createRoot(testDiv);
        root.render(element);
        
        console.log('Test render successful');
        
        // After 5 seconds, fade out and remove the test div
        setTimeout(() => {
          testDiv.style.transition = 'opacity 1s';
          testDiv.style.opacity = '0';
          setTimeout(() => {
            try {
              document.body.removeChild(testDiv);
            } catch (e) {
              // Ignore if already removed
            }
          }, 1000);
        }, 5000);
      } catch (e) {
        console.error('Test render failed:', e);
      }
    })
    .catch(error => {
      console.error('React rescue failed:', error);
      
      // Show error in UI
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.innerHTML = `
          <div style="padding: 20px; text-align: center;">
            <h2 style="color: #e74c3c;">React Loading Failed</h2>
            <p>Could not load React from CDN: ${error.message}</p>
            <button onclick="window.location.reload()">Reload Page</button>
            <button onclick="window.location.href='/fallback.html'">Go to Fallback Page</button>
          </div>
        `;
      }
    });
})(); 