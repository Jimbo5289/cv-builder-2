/**
 * Error handler utilities for CV Builder application
 */

// Global error handler to prevent app crashes
export const setupErrorHandler = () => {
  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    // Prevent the default browser behavior which might show error dialogs
    event.preventDefault();
  });

  // Capture uncaught exceptions
  window.addEventListener('error', (event) => {
    console.error('Uncaught Exception:', event.error || event.message);
    // Prevent the default browser behavior which might show error dialogs
    event.preventDefault();
  });

  // Replace console.error to add custom handling if needed
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Call the original console.error
    originalConsoleError.apply(console, args);
    
    // Add custom error logging here if needed
    // For example, you could send errors to a logging service
  };

  console.log('Error handler initialized successfully');
};

// Handle API errors
export const handleApiError = (error) => {
  let errorMessage = 'An unexpected error occurred';
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const statusCode = error.response.status;
    const responseData = error.response.data;
    
    if (responseData && responseData.message) {
      errorMessage = responseData.message;
    } else if (statusCode === 401) {
      errorMessage = 'Authentication required. Please log in.';
    } else if (statusCode === 403) {
      errorMessage = 'You do not have permission to perform this action.';
    } else if (statusCode === 404) {
      errorMessage = 'The requested resource was not found.';
    } else if (statusCode >= 500) {
      errorMessage = 'Server error. Please try again later.';
    }
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'No response from server. Please check your connection.';
  } else if (error.message) {
    // Something happened in setting up the request that triggered an Error
    errorMessage = error.message;
  }
  
  return errorMessage;
};

// Format error for display
export const formatError = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (error && typeof error === 'object' && error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}; 