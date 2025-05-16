import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import * as Sentry from '@sentry/react'
// Remove import that might be causing issues
// import { BrowserTracing, Replay } from '@sentry/react'
import './index.css'
import App from './App'

// Initialize Sentry
const isProd = import.meta.env.PROD;
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

// Simplified Sentry initialization - only initialize if explicitly configured
if (isProd && sentryDsn) {
  try {
    Sentry.init({
      dsn: sentryDsn,
      environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'production',
      tracesSampleRate: 0.2,
      
      // Simplified configuration with no additional integrations
      integrations: [],
      
      // Disable PII information
      sendDefaultPii: false,
    });
    
    console.log('Sentry initialized in production mode');
  } catch (error) {
    console.error('Failed to initialize Sentry:', error);
  }
} else {
  console.info('Running in development mode. Sentry is disabled.');
}

// Error fallback component
const ErrorFallback = ({ error, resetError }) => {
  console.error('Application error:', error);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={resetError}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

// Create root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Create root and render app
const root = createRoot(rootElement);

// Wrap the app with error boundary and router
root.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={ErrorFallback}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
