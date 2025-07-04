import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { ensureRootElement } from './utils/domUtils';
import storageUtils from './utils/storageCleanup';
import { suppressCssWarnings } from './utils/cssCompatibility';
import { bootstrapReact, isReactAvailable } from './utils/reactBootstrap';
import { getRouterFutureConfig } from './utils/routerConfig';
import ReactBootstrap from './components/ReactBootstrap';
import routes from './routes';
import { validateCurrentRoute } from './utils/redirectToHome';
import './utils/initializeApp.js'; // Import the initialization code
import { initializeCVBuilderTracking } from './utils/cvBuilderAnalytics';

// Import our fixes for React global definitions and ESLint errors
import './fix-react-config';
import './utils/reactEslintFix';

// Initialize Google Analytics as early as possible
import { trackPageView } from './utils/analytics';

// Debug - log the loading process
console.log('Main.jsx loading - Initializing app');

// Initialize Google Analytics
if (typeof window !== 'undefined' && window.gtag) {
  console.log('Google Analytics initialized in main.jsx');
  // Track the initial page load
  trackPageView(window.location.pathname, document.title);
} else {
  console.warn('Google Analytics not available in main.jsx');
}

// Suppress known CSS warnings that can't be fixed
suppressCssWarnings();

// Check if we should attempt to validate the current route before rendering
try {
  const currentPath = window.location.pathname;
  console.log('Initial route check:', currentPath);
  
  // Skip for development mode
  if (window.ENV_VITE_DEV_MODE !== "true" && process.env.NODE_ENV !== 'development') {
    // Don't redirect from these safe paths
    const safePaths = ['/', '/login', '/register', '/forgot-password', '/404'];
    if (!safePaths.includes(currentPath)) {
      console.log('Validating initial route');
      validateCurrentRoute(routes);
    }
  }
} catch (error) {
  console.error('Error during initial route validation:', error);
}

// Set up global error handler for unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event);
  
  // If it's a NotFoundError, clear localStorage and reload
  if (event.message && (
    event.message.includes('NotFoundError') || 
    event.message.includes('object can not be found')
  )) {
    console.log('NotFoundError detected, resetting localStorage and reloading');
    try {
      storageUtils.resetAllLocalStorage();
      // Prevent the error from propagating
      event.preventDefault();
      // Reload the page
      window.location.reload();
    } catch (e) {
      console.error('Error handling NotFoundError:', e);
    }
  }
});

// Initialize theme
initializeTheme();

// Clean up any corrupted localStorage items
try {
  const cleanedItems = storageUtils.cleanupLocalStorage();
  if (cleanedItems > 0) {
    console.log(`Cleaned up ${cleanedItems} corrupted localStorage items`);
  }
  
  // Log storage usage if available
  const storageStats = storageUtils.getStorageUsage();
  if (storageStats.available) {
    console.log(`Storage usage: ${(storageStats.usage / 1024).toFixed(2)}KB / ${(storageStats.quota / 1024 / 1024).toFixed(2)}MB (${storageStats.percentUsed.toFixed(2)}%)`);
  }
} catch (e) {
  console.error('Error during localStorage cleanup:', e);
}

// Initialize theme function (extracted for clarity)
function initializeTheme() {
  try {
    document.documentElement.classList.remove('dark');
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    console.error('Error applying theme:', e);
  }
}

// Simple error component that doesn't use any external dependencies
const FatalErrorFallback = ({ message }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '500px',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          color: '#e53e3e', 
          fontSize: '1.5rem', 
          marginBottom: '1rem' 
        }}>
          Something went wrong
        </h2>
        <p style={{ marginBottom: '1.5rem', color: '#4a5568' }}>
          {message || 'The application encountered an error and could not continue.'}
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <button 
            onClick={() => window.location.href = '/'} 
            style={{
              backgroundColor: '#3182ce',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Go to Home
          </button>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              backgroundColor: '#3182ce',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
          <button 
            onClick={() => { 
              storageUtils.resetAllLocalStorage();
              window.location.reload();
            }} 
            style={{
              backgroundColor: '#e53e3e',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Reset & Reload
          </button>
        </div>
      </div>
    </div>
  );
};

// Render function with minimal complexity
const renderApp = async () => {
  try {
    console.log('Ensuring React is available...');
    
    // Bootstrap React before rendering
    const bootstrapSuccessful = await bootstrapReact();
    
    if (!bootstrapSuccessful) {
      throw new Error('Failed to bootstrap React');
    }
    
    // Double check React is available
    if (!isReactAvailable()) {
      throw new Error('React is not available after bootstrap');
    }
    
    console.log('Ensuring root element exists');
    // Ensure we have a root element before proceeding
    const rootElement = ensureRootElement();
    
    if (!rootElement) {
      throw new Error('Could not create or find root element');
    }
    
    console.log('Creating React root');
    const root = createRoot(rootElement);
    
    // Get the future flags configuration for React Router
    const routerFutureConfig = getRouterFutureConfig();
    
    // Add a fallback for router errors
    window.handleRouterError = (error) => {
      console.error('Router error caught:', error);
      // If in development, just log the error
      if (process.env.NODE_ENV === 'development' || window.ENV_VITE_DEV_MODE === "true") {
        return;
      }
      
      // In production, redirect to home for serious errors
      if (error && (error.message.includes('No route matches') || 
                     error.message.includes('Cannot match any routes'))) {
        console.warn('Unmatched route, redirecting to home');
        window.location.href = '/';
      }
    };
    
    // Initialize CV Builder analytics tracking
    initializeCVBuilderTracking();
    
    // Directly render the app with minimal wrapping
    console.log('Rendering application');
    root.render(
      <BrowserRouter future={routerFutureConfig}>
        <ReactBootstrap>
          <App />
        </ReactBootstrap>
      </BrowserRouter>
    );
    
    console.log('App render call completed');
  } catch (error) {
    console.error('FATAL ERROR during app rendering:', error);
    
    // Try to render error fallback directly
    try {
      const rootElement = document.getElementById('root') || ensureRootElement();
      if (rootElement) {
        createRoot(rootElement).render(
          <FatalErrorFallback message={error?.message} />
        );
      } else {
        // Last resort - inject HTML directly
        document.body.innerHTML = `
          <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f5f5f5;">
            <div style="max-width: 500px; padding: 2rem; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center;">
              <h2 style="color: #e53e3e; font-size: 1.5rem; margin-bottom: 1rem;">Fatal Error</h2>
              <p style="margin-bottom: 1.5rem; color: #4a5568;">
                ${error?.message || 'The application could not be loaded.'}
              </p>
              <div style="display: flex; gap: 0.5rem; justify-content: center;">
                <button 
                  onclick="window.location.href = '/'" 
                  style="background-color: #3182ce; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">
                  Go to Home
                </button>
                <button 
                  onclick="window.location.reload()" 
                  style="background-color: #3182ce; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">
                  Reload Page
                </button>
                <button 
                  onclick="localStorage.clear(); window.location.reload()" 
                  style="background-color: #e53e3e; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">
                  Reset & Reload
                </button>
              </div>
            </div>
          </div>
        `;
      }
    } catch (finalError) {
      console.error('Failed to render error fallback:', finalError);
    }
  }
};

// Use the new bootstrap approach
if (document.readyState === 'loading') {
  // Wait for DOMContentLoaded if document is still loading
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  // Otherwise render immediately
  renderApp();
}
