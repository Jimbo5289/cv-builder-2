import React from 'react';
import { useNavigate } from 'react-router-dom';

// For reporting errors to monitoring services like Sentry
const reportError = (error, componentStack) => {
  // If we're using Sentry or another error monitoring service, send the error
  if (window.Sentry && import.meta.env.PROD) {
    window.Sentry.captureException(error, {
      extra: {
        componentStack,
      },
    });
  }
  
  // Always log to console in development
  console.error('Error caught by boundary:', error, componentStack);
};

// Navigation wrapper for class component
function ErrorBoundaryWithNavigation(props) {
  const navigate = useNavigate();
  return <ErrorBoundary navigate={navigate} {...props} />;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Update state with error details
    this.setState({ errorInfo });
    
    // Report the error
    reportError(error, errorInfo?.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.handleReset();
    this.props.navigate('/');
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const errorMessage = error?.message || 'An unexpected error occurred';
      const isNetworkError = 
        errorMessage.includes('network') || 
        errorMessage.includes('fetch') ||
        errorMessage.includes('connection');

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            
            <p className="text-gray-700 mb-4">{errorMessage}</p>
            
            {isNetworkError && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                It looks like there might be a connection issue. Please check your internet connection and try again.
              </div>
            )}
            
            <div className="flex flex-col space-y-2">
              <button
                onClick={this.handleReset}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Try again
              </button>
              
              <button
                onClick={this.handleReload}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Reload page
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50"
              >
                Go to homepage
              </button>
            </div>
            
            {import.meta.env.DEV && errorInfo && (
              <details className="mt-6 p-3 border border-gray-200 rounded text-xs overflow-auto">
                <summary className="text-sm font-medium cursor-pointer">Stack trace</summary>
                <pre className="mt-2">{errorInfo.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryWithNavigation; 