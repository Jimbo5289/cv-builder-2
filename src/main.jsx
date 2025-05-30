import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import './index.css';
import App from './App';
import ThemeProvider from './context/ThemeContext';
import { ServerProvider } from './context/ServerContext';
import AuthProvider from './context/AuthContext';
import { setupErrorHandler } from './utils/errorHandler';

// Debug - log the loading process
console.log('Main.jsx loading - Step 1: Before any initialization');

// Log React version for debugging
console.log('React Version:', React.version);
console.log('React DOM available:', typeof ReactDOM !== 'undefined');

// Safari detection
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
console.log('Browser detection - Safari:', isSafari);

// Safari-specific workarounds
if (isSafari) {
  console.log('Applying Safari-specific workarounds');
  // Force hardware acceleration for Safari
  document.documentElement.style.transform = 'translateZ(0)';
  document.documentElement.style.backfaceVisibility = 'hidden';
  // Add meta tag for Safari viewport issues
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  document.getElementsByTagName('head')[0].appendChild(meta);
}

// Verify React is available before proceeding
if (typeof React !== 'object' || React === null) {
  console.error('React is not properly defined in main.jsx');
  throw new Error('React not found');
}

// Initialize error handler to prevent unnecessary reloads
try {
  console.log('Step 2: Setting up error handler');
  setupErrorHandler();
  console.log('Error handler set up successfully');
} catch (e) {
  console.error('Failed to setup error handler:', e);
}

// Apply theme from localStorage on initial load
const applyStoredTheme = () => {
  console.log('Step 3: Applying stored theme');
  try {
    // Default to light mode to prevent blank blue screen
    document.documentElement.classList.remove('dark');
    
    const theme = localStorage.getItem('theme') || 'light'; // Changed from 'auto' to 'light'
    const root = window.document.documentElement;
    
    if (theme === 'dark' || 
        (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    console.log('Theme applied successfully:', theme);
  } catch (e) {
    console.error('Error applying theme:', e);
    // Ensure light mode as fallback
    document.documentElement.classList.remove('dark');
  }
};

// Apply theme immediately
applyStoredTheme();

// Error fallback component
const ErrorFallback = ({ error, resetError }) => {
  console.error('Error fallback triggered with error:', error);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{error?.message || 'An unknown error occurred'}</p>
        <button
          onClick={resetError || (() => window.location.reload())}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Try again
        </button>
        <button
          onClick={() => window.location.href = '/fallback-react.html'}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 ml-2"
        >
          Go to Fallback Page
        </button>
      </div>
    </div>
  );
};

// Simple loading component
const LoadingFallback = () => {
  console.log('Step 4: Rendering loading fallback');
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-800 dark:text-gray-200">Loading application...</p>
      </div>
    </div>
  );
};

// Simplified app render function
const renderApp = () => {
  console.log('Step 5: Rendering application');
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element #root not found!');
    return;
  }
  
  try {
    console.log('Creating React root');
    const root = createRoot(rootElement);
    
    // First render a loading indicator
    console.log('Rendering loading indicator');
    root.render(<LoadingFallback />);
    
    // Check for dev mode in URL
    const isDevMode = new URLSearchParams(window.location.search).has('devMode');
    
    // Then render the full app
    setTimeout(() => {
      try {
        console.log('Rendering full application');
        root.render(
          <React.StrictMode>
            <BrowserRouter>
              <ThemeProvider>
                <ServerProvider>
                  <AuthProvider>
                    <Sentry.ErrorBoundary fallback={ErrorFallback}>
                      <App />
                    </Sentry.ErrorBoundary>
                  </AuthProvider>
                </ServerProvider>
              </ThemeProvider>
            </BrowserRouter>
          </React.StrictMode>
        );
        console.log('App rendered successfully');
      } catch (error) {
        console.error('Error rendering app:', error);
        root.render(
          <BrowserRouter>
            <ErrorFallback error={error} />
          </BrowserRouter>
        );
      }
    }, 300);
  } catch (error) {
    console.error('Fatal error during initialization:', error);
    // Last resort - render HTML directly
    rootElement.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 class="text-2xl font-bold text-red-600 mb-4">Fatal Error</h2>
          <p class="text-gray-600 mb-4">The application could not be loaded: ${error.message}</p>
          <div style="display: flex; gap: 10px;">
            <button 
              onclick="window.location.reload()" 
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Reload Application
            </button>
            <button 
              onclick="window.location.href='/fallback-react.html'" 
              class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Fallback Page
            </button>
          </div>
        </div>
      </div>
    `;
  }
};

// Only start the app once DOM is fully loaded to ensure root element exists
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
