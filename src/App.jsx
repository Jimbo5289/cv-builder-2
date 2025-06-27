/* eslint-disable */

/**
 * @component App
 * @description The root component of the CV Builder application that sets up the entire application structure.
 * This component is responsible for:
 * - Setting up global providers for authentication, server communication, theming, and premium features
 * - Configuring global error handling and error boundaries
 * - Implementing the main layout structure (header, main content, footer)
 * - Managing UI elements like cookie consent and toast notifications
 * - Setting up WebSocket communication for real-time updates
 * 
 * The component creates a hierarchical context structure where each provider wraps its children,
 * making their functionality available throughout the component tree.
 * 
 * @providers
 * - ErrorBoundary - Catches JavaScript errors in child components
 * - ThemeProvider - Manages light/dark mode theming
 * - ServerProvider - Manages server connection and API communication
 * - WebSocketProvider - Handles real-time communication with the server
 * - AuthProvider - Manages user authentication state
 * - PremiumBundleProvider - Manages premium feature access
 * 
 * @states
 * - showCookieConsent {boolean} - Controls visibility of the cookie consent banner
 * - showServerStatus {boolean} - Controls visibility of the server status indicator
 * 
 * @returns {JSX.Element} The complete application with all providers, routing, and layout components
 */
import React, { useState, useEffect, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './context/AuthContext';
import { ServerProvider } from './context/ServerContext';
import { ThemeProvider } from './context/ThemeContext';
import { PremiumBundleProvider } from './context/PremiumBundleContext';
import ErrorBoundary from './components/ErrorBoundary';
import WebSocketProvider from './components/WebSocketProvider';
import AppRoutes from './AppRoutes';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import ServerStatusIndicator from './components/ServerStatusIndicator';
import ScrollToTop from './components/ScrollToTop';
import { setupErrorHandler } from './utils/errorHandler';
import storageUtils from './utils/storageCleanup';
import { AnalyticsProvider } from './context/AnalyticsContext';

// Set up global error handling
setupErrorHandler();

/**
 * @component LoadingFallback
 * @description Displays a loading spinner when content is being loaded through Suspense
 * Used during code-splitting and asynchronous component loading
 * 
 * @returns {JSX.Element} A centered spinner animation
 */
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

/**
 * @component SimpleErrorFallback
 * @description Displays an error message when components throw errors caught by ErrorBoundary
 * Provides options to reload the page or clear local storage and reload
 * 
 * @param {Object} props - Component props
 * @param {Error} props.error - The error that was caught
 * @param {string} props.errorType - The type of error that occurred
 * @param {Function} props.reset - Function to reset the error boundary
 * 
 * @returns {JSX.Element} Error UI with recovery options
 */
const SimpleErrorFallback = ({ error, errorType, reset }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{error?.message || 'An unknown error occurred'}</p>
      <div className="flex space-x-2">
        <button
          onClick={reset}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Reload Page
        </button>
        <button
          onClick={() => {
            storageUtils.resetAllLocalStorage();
            window.location.reload();
          }}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Clear Storage & Reload
        </button>
      </div>
    </div>
  </div>
);

function App() {
  // State for UI elements
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showServerStatus, setShowServerStatus] = useState(false);
  
  /**
   * Check if cookie consent has been given on component mount
   * Sets up event listeners to handle consent changes across browser tabs
   */
  useEffect(() => {
    try {
      // Check if cookie consent is already accepted
      const hasConsent = localStorage.getItem('cookieConsent');
      setShowCookieConsent(!hasConsent);
      
      // Listen for storage events (in case cookie consent is accepted in another tab)
      const handleStorageChange = () => {
        try {
          const hasConsent = localStorage.getItem('cookieConsent');
          setShowCookieConsent(!hasConsent);
        } catch (e) {
          console.error('Error handling storage change:', e);
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    } catch (e) {
      console.error('Error checking cookie consent:', e);
    }
  }, []);

  /**
   * Toast notification configuration
   * Provides consistent styling for toast notifications across the application
   * Includes responsive styling and dark mode support
   */
  const toastOptions = {
    style: {
      maxWidth: '90vw',
      '@media (min-width: 640px)': {
        maxWidth: '350px'
      }
    },
    className: '',
    success: {
      className: 'dark:bg-green-800 dark:text-white'
    },
    error: {
      className: 'dark:bg-red-800 dark:text-white'
    },
    loading: {
      className: 'dark:bg-gray-700 dark:text-white'
    }
  };

  return (
    <ErrorBoundary fallback={SimpleErrorFallback}>
      <ThemeProvider>
        <ServerProvider>
          <WebSocketProvider path="/ws" autoConnect={false} reconnectOnFailure={false} useMockInDev={true}>
            <AuthProvider>
              <PremiumBundleProvider>
                <AnalyticsProvider>
                {/* Main application layout */}
                <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col ${showCookieConsent ? 'pb-24 md:pb-16' : ''}`}>
                  {/* Toast notification container */}
                  <Toaster position="top-right" toastOptions={toastOptions} />
                  
                  {/* Header navigation */}
                  <Header />
                  
                  {/* Scroll restoration for navigation */}
                  <ScrollToTop />
                  
                  {/* Main content area with routing */}
                  <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-grow">
                    <ErrorBoundary fallback={SimpleErrorFallback}>
                      <Suspense fallback={<LoadingFallback />}>
                        <AppRoutes />
                      </Suspense>
                    </ErrorBoundary>
                  </main>
                  
                  {/* Footer */}
                  <Footer />
                  
                  {/* Cookie consent banner */}
                  <CookieConsent onConsentChange={(hasConsent) => setShowCookieConsent(!hasConsent)} />
                  
                  {/* Server status indicator (conditionally shown) */}
                  {showServerStatus && <ServerStatusIndicator />}
                </div>
                </AnalyticsProvider>
              </PremiumBundleProvider>
            </AuthProvider>
          </WebSocketProvider>
        </ServerProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;