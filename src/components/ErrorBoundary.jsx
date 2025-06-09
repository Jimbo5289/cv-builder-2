/* eslint-disable */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as storageUtils from '../utils/localStorage.js';

// Define error types
const ERROR_TYPES = {
  GENERAL: 'general',
  NOT_FOUND: 'not_found',
  STORAGE: 'storage',
  NETWORK: 'network',
  AUTH: 'auth'
};

// Internal localStorage utilities to avoid external dependencies
const localStorageUtils = storageUtils;

// Helper functions - kept internal, not exported
const reportError = (error, componentStack, errorType) => {
  console.error('Error caught by ErrorBoundary:', {
    type: errorType,
    error,
    componentStack
  });
};

// Helper to identify not found errors
const isNotFoundError = (error) => {
  if (!error) return false;
  
  try {
    // Check for "not found" in error message
    if (error.message && error.message.toLowerCase().includes('not found')) {
      return true;
    }
    
    // Check for 404 status in error
    if (error.status === 404 || error.statusCode === 404) {
      return true;
    }
  } catch (e) {
    console.error('Error checking for not found:', e);
  }
  
  return false;
};

// Helper to identify storage errors
const isStorageError = (error) => {
  if (!error) return false;
  
  try {
    // Check for storage-related keywords
    const message = error.message?.toLowerCase() || '';
    return (
      message.includes('localstorage') ||
      message.includes('storage') ||
      message.includes('quota') ||
      message.includes('json')
    );
  } catch (e) {
    console.error('Error checking for storage error:', e);
    return false;
  }
};

// Helper to identify network errors
const isNetworkError = (error) => {
  if (!error) return false;
  
  try {
    // Check for common network error patterns
    const message = error.message?.toLowerCase() || '';
    const isNetworkMessage = 
      message.includes('network') ||
      message.includes('connection') ||
      message.includes('offline') ||
      message.includes('fetch') ||
      message.includes('xhr') ||
      message.includes('timeout') ||
      message.includes('abort');
    
    // Check for network error status codes
    const isNetworkStatus = 
      error.status === 0 || 
      error.statusCode === 0 ||
      error.status === 'failed' ||
      error.name === 'NetworkError';
    
    return isNetworkMessage || isNetworkStatus;
  } catch (e) {
    console.error('Error checking for network error:', e);
    return false;
  }
};

// Helper to identify authentication errors
const isAuthError = (error) => {
  if (!error) return false;
  
  try {
    // Check for auth-related keywords
    const message = error.message?.toLowerCase() || '';
    const isAuthMessage = 
      message.includes('authentication') ||
      message.includes('authorization') ||
      message.includes('auth') ||
      message.includes('login') ||
      message.includes('token') ||
      message.includes('jwt') ||
      message.includes('permission');
    
    // Check for auth error status codes
    const isAuthStatus = 
      error.status === 401 || 
      error.status === 403 ||
      error.statusCode === 401 ||
      error.statusCode === 403;
    
    return isAuthMessage || isAuthStatus;
  } catch (e) {
    console.error('Error checking for auth error:', e);
    return false;
  }
};

// Determine error type
const getErrorType = (error) => {
  if (isNotFoundError(error)) return ERROR_TYPES.NOT_FOUND;
  if (isStorageError(error)) return ERROR_TYPES.STORAGE;
  if (isNetworkError(error)) return ERROR_TYPES.NETWORK;
  if (isAuthError(error)) return ERROR_TYPES.AUTH;
  return ERROR_TYPES.GENERAL;
};

// The main ErrorBoundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: ERROR_TYPES.GENERAL
    };

    // Bind methods
    this.handleReload = this.handleReload.bind(this);
    this.handleGoHome = this.handleGoHome.bind(this);
    this.handleClearAndReload = this.handleClearAndReload.bind(this);
  }

  static getDerivedStateFromError(error) {
    try {
      // Determine error type
      const errorType = getErrorType(error);
      
      // When a rendering error is caught, set the error state
      return {
        hasError: true,
        error,
        errorType
      };
    } catch (e) {
      console.error('Error in getDerivedStateFromError:', e);
      // Fallback in case error processing fails
      return {
        hasError: true,
        error: error || new Error('Unknown error occurred'),
        errorType: ERROR_TYPES.GENERAL
      };
    }
  }

  componentDidCatch(error, errorInfo) {
    // Save component stack info
    this.setState({ errorInfo });
    
    // Get error type (redundant with getDerivedStateFromError, but here for completeness)
    const errorType = getErrorType(error);
    
    // If we have an onError callback, call it
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo, errorType);
      } catch (callbackError) {
        console.error('Error in onError callback:', callbackError);
      }
    }
  }

  handleReload() {
    try {
      // Clear any corrupt localStorage data first
      localStorageUtils.cleanupLocalStorage(true);
      // Then reload the page
      window.location.reload();
    } catch (e) {
      console.error('Error during reload:', e);
      // Force reload as fallback
      window.location.href = window.location.pathname;
    }
  }
  
  handleGoHome() {
    try {
      // Clear any corrupt localStorage data first
      localStorageUtils.cleanupLocalStorage(true);
      // Navigate to home and reload
      this.props.navigate?.('/');
      window.location.href = '/';
    } catch (e) {
      console.error('Error navigating home:', e);
      // Force navigation as fallback
      window.location.href = '/';
    }
  }
  
  handleClearAndReload() {
    try {
      // Clear ALL localStorage data
      localStorageUtils.resetAllLocalStorage();
      console.log('All localStorage data cleared');
      // Then reload the page
      window.location.reload();
    } catch (e) {
      console.error('Error clearing localStorage:', e);
      // Force reload as fallback
      window.location.href = window.location.pathname;
    }
  }

  render() {
    // If custom fallback is provided, use it
    if (this.state.hasError && this.props.fallback) {
      return this.props.fallback({ 
        error: this.state.error, 
        errorInfo: this.state.errorInfo,
        errorType: this.state.errorType,
        reset: this.handleReload,
        clearAndReset: this.handleClearAndReload,
        goHome: this.handleGoHome
      });
    }
    
    if (this.state.hasError) {
      // Get the appropriate error message based on error type
      let errorMessage;
      let title;
      
      switch (this.state.errorType) {
        case ERROR_TYPES.NOT_FOUND:
          title = "Data Error Detected";
          errorMessage = "We've detected a data issue. This is often caused by corrupted browser storage.";
          break;
        case ERROR_TYPES.STORAGE:
          title = "Storage Error";
          errorMessage = "There was a problem with your browser's storage. This is often temporary.";
          break;
        case ERROR_TYPES.NETWORK:
          title = "Network Error";
          errorMessage = "There was a problem connecting to our servers. Please check your internet connection.";
          break;
        case ERROR_TYPES.AUTH:
          title = "Authentication Error";
          errorMessage = "There was a problem with your login session. Please try logging in again.";
          break;
        default:
          title = "Something Went Wrong";
          errorMessage = "We're sorry, but something went wrong with the application. Please try refreshing the page.";
      }
      
      // Get background color based on error type
      const getBgColor = () => {
        switch (this.state.errorType) {
          case ERROR_TYPES.NOT_FOUND:
          case ERROR_TYPES.STORAGE:
            return 'bg-yellow-600 dark:bg-yellow-700';
          case ERROR_TYPES.NETWORK:
            return 'bg-blue-600 dark:bg-blue-700';
          case ERROR_TYPES.AUTH:
            return 'bg-purple-600 dark:bg-purple-700';
          default:
            return 'bg-red-600 dark:bg-red-700';
        }
      };
      
      // Show different buttons based on error type
      let actionButtons;
      
      if (this.state.errorType === ERROR_TYPES.NOT_FOUND || this.state.errorType === ERROR_TYPES.STORAGE) {
        actionButtons = (
          <div className="flex space-x-4">
            <button
              onClick={this.handleClearAndReload}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
            >
              Clear Storage & Reload
            </button>
            <button
              onClick={this.handleGoHome}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        );
      } else if (this.state.errorType === ERROR_TYPES.NETWORK) {
        actionButtons = (
          <div className="flex space-x-4">
            <button
              onClick={this.handleReload}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/offline.html'}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Offline Mode
            </button>
          </div>
        );
      } else if (this.state.errorType === ERROR_TYPES.AUTH) {
        actionButtons = (
          <div className="flex space-x-4">
            <button
              onClick={() => this.props.navigate?.('/login')}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Log In Again
            </button>
            <button
              onClick={this.handleClearAndReload}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Clear & Reload
            </button>
          </div>
        );
      } else {
        actionButtons = (
          <div className="flex space-x-4">
            <button
              onClick={this.handleReload}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={this.handleGoHome}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        );
      }
      
      // Fallback UI when an error occurs
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className={`${getBgColor()} p-4`}>
              <h2 className="text-white text-xl font-bold">{title}</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {errorMessage}
              </p>
              
              {import.meta.env.DEV && this.state.error && (
                <div className="mb-4">
                  <p className="font-medium text-red-600 dark:text-red-400 mb-2">Error details:</p>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-auto max-h-40">
                    {this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}
              
              {actionButtons}
            </div>
          </div>
        </div>
      );
    }

    // Everything is fine, render children
    return this.props.children;
  }
}

// HOC to inject navigate from react-router
function ErrorBoundaryWithNavigation(props) {
  const navigate = useNavigate();
  return <ErrorBoundary {...props} navigate={navigate} />;
}

export default ErrorBoundaryWithNavigation; 