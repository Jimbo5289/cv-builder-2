// This is a simplified React application that will render if the main app fails to load

// Simple React component
const FallbackApp = () => {
  const [debugInfo, setDebugInfo] = React.useState(null);
  const [showDebugInfo, setShowDebugInfo] = React.useState(false);

  React.useEffect(() => {
    // Collect diagnostic information
    const info = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      reactLoaded: true,
      reactVersion: React.version,
      reactDomVersion: ReactDOM.version,
      environment: {
        ENV_VITE_DEV_MODE: window.ENV_VITE_DEV_MODE || 'not set',
        ENV_VITE_SKIP_AUTH: window.ENV_VITE_SKIP_AUTH || 'not set',
        ENV_VITE_API_URL: window.ENV_VITE_API_URL || 'not set'
      }
    };
    
    setDebugInfo(info);
    
    // Log to console
    console.log('Fallback app mounted', info);
  }, []);

  return React.createElement('div', { 
    style: {
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    }
  }, [
    React.createElement('h1', { key: 'title' }, 'CV Builder - Fallback App'),
    React.createElement('div', { 
      key: 'card',
      style: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }
    }, [
      React.createElement('h2', { key: 'subtitle' }, 'Main Application Error'),
      React.createElement('p', { key: 'description' }, 
        'The main application could not be loaded. This is a simplified fallback interface.'
      ),
      React.createElement('button', { 
        key: 'reload-btn',
        onClick: () => window.location.reload(),
        style: {
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px'
        }
      }, 'Reload Application'),
      React.createElement('button', { 
        key: 'debug-btn',
        onClick: () => setShowDebugInfo(!showDebugInfo),
        style: {
          backgroundColor: '#2ecc71',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer'
        }
      }, showDebugInfo ? 'Hide Debug Info' : 'Show Debug Info')
    ]),
    showDebugInfo && debugInfo && React.createElement('div', { 
      key: 'debug-card',
      style: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }
    }, [
      React.createElement('h2', { key: 'debug-title' }, 'Debug Information'),
      React.createElement('pre', { 
        key: 'debug-content',
        style: {
          backgroundColor: '#f5f5f5',
          padding: '10px',
          borderRadius: '4px',
          overflow: 'auto'
        }
      }, JSON.stringify(debugInfo, null, 2))
    ])
  ]);
};

// Mount the app when the document is ready
const mountFallbackApp = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found for fallback app');
    return;
  }
  
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(FallbackApp));
    console.log('Fallback app rendered successfully');
  } catch (error) {
    console.error('Failed to render fallback app:', error);
    rootElement.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1>CV Builder</h1>
        <div style="background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2>Critical Error</h2>
          <p>Both the main application and fallback application failed to load.</p>
          <p>Error: ${error.message}</p>
          <button onclick="window.location.reload()">Reload Page</button>
        </div>
      </div>
    `;
  }
};

// Wait for the DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountFallbackApp);
} else {
  mountFallbackApp();
} 