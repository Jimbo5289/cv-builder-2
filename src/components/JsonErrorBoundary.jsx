/* eslint-disable */
import React from 'react';

class JsonErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
    
    // Bind methods
    this.handleReset = this.handleReset.bind(this);
    this.cleanupLocalStorage = this.cleanupLocalStorage.bind(this);
  }

  static getDerivedStateFromError(error) {
    // First check if error is defined to avoid errors in error handling
    if (!error) {
      return { hasError: true, error: new Error('Unknown error occurred') };
    }
    
    // Try to identify JSON parsing errors more safely
    try {
      // Check for JSON parsing errors in a more general way
      if ((error instanceof SyntaxError && error.message.includes('JSON')) || 
          (error.name === 'SyntaxError' && error.message.includes('JSON')) ||
          // For cases where the error might be wrapped
          (error.message && error.message.includes('JSON Parse error'))) {
        return { hasError: true, error };
      }
    } catch (e) {
      console.error('Error in getDerivedStateFromError:', e);
      return { hasError: true, error: new Error('Error while processing another error') };
    }
    
    // Rethrow other types of errors to be caught by parent boundaries
    throw error;
  }

  componentDidCatch(error, errorInfo) {
    try {
      console.error('Error caught by JsonErrorBoundary:', error, errorInfo);
      this.setState({ errorInfo });
      
      // Check if it's a type we want to handle
      const isJsonError = 
        (error instanceof SyntaxError && error.message.includes('JSON')) ||
        (error.name === 'SyntaxError' && error.message.includes('JSON')) ||
        (error.message && error.message.includes('JSON Parse error'));
      
      if (isJsonError) {
        // Clean up corrupted localStorage data
        this.cleanupLocalStorage();
      }
    } catch (e) {
      console.error('Error in componentDidCatch:', e);
    }
  }

  cleanupLocalStorage() {
    try {
      console.log('Attempting to clean up corrupted localStorage data');
      
      // List of keys to check for valid JSON
      const jsonKeys = ['user', 'theme', 'cookieConsent'];
      
      // Add any premium bundle keys
      try {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('premium_bundle_')) {
            jsonKeys.push(key);
          }
        });
      } catch (e) {
        console.error('Error collecting localStorage keys:', e);
      }
      
      // Check each key and remove if invalid JSON
      jsonKeys.forEach(key => {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            // Try to parse - if it fails, remove the item
            JSON.parse(value);
          }
        } catch (e) {
          console.log(`Removing corrupted localStorage item: ${key}`);
          localStorage.removeItem(key);
        }
      });
      
      console.log('Local storage cleanup complete');
    } catch (e) {
      console.error('Error cleaning up localStorage:', e);
    }
  }

  handleReset() {
    try {
      // Clean all localStorage data as a last resort
      localStorage.clear();
      console.log('All localStorage data cleared');
      
      // Reload the page
      window.location.reload();
    } catch (e) {
      console.error('Error during reset:', e);
      // Force reload as fallback
      window.location.href = window.location.pathname;
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className="bg-yellow-600 dark:bg-yellow-700 p-4">
              <h2 className="text-white text-xl font-bold">Data Corruption Detected</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We've detected a problem with your saved data. This is likely due to a corrupted storage item.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We've attempted to fix the issue automatically. Please try refreshing the page.
              </p>
              
              {import.meta.env.DEV && this.state.error && (
                <div className="mb-4">
                  <p className="font-medium text-yellow-600 dark:text-yellow-400 mb-2">Error details:</p>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-auto max-h-40">
                    {this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}
              
              <div className="flex space-x-4">
                <button
                  onClick={this.handleReset}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Reset Data & Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Everything is fine, render children
    return this.props.children;
  }
}

export default JsonErrorBoundary; 