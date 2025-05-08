import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App'

// Initialize Sentry only in production
const isProd = import.meta.env.PROD;
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

if (isProd && sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
    // Adjust sample rates in production as needed
    tracesSampleRate: 0.2, // sample 20% of transactions
    replaysSessionSampleRate: 0.05, // sample 5% of sessions
    replaysOnErrorSampleRate: 1.0, // capture 100% of sessions with errors
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'production',
  });
  
  console.log('Sentry initialized in production mode');
} else if (isProd) {
  console.warn('Sentry DSN is missing. Error monitoring is disabled.');
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
