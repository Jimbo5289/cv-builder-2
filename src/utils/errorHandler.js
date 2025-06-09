/**
 * Comprehensive error handling utilities for CV Builder application
 */

// Error types that we can identify and handle specifically
export const ERROR_TYPES = {
  STORAGE: 'storage_error',
  NOT_FOUND: 'not_found_error',
  AUTH: 'auth_error',
  NETWORK: 'network_error',
  RENDERING: 'rendering_error',
  VALIDATION: 'validation_error',
  PERMISSION: 'permission_error',
  UNKNOWN: 'unknown_error'
};

/**
 * Set up global error handlers to catch unhandled errors
 * @param {Function} onError - Optional callback for custom error handling
 */
export const setupErrorHandler = (onError) => {
  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    
    // Call custom handler if provided
    if (onError && typeof onError === 'function') {
      try {
        onError(event.reason, 'unhandledrejection');
      } catch (handlerError) {
        console.error('Error in custom rejection handler:', handlerError);
      }
    }
    
    // Prevent the default browser behavior which might show error dialogs
    event.preventDefault();
  });

  // Capture uncaught exceptions
  window.addEventListener('error', (event) => {
    console.error('Uncaught Exception:', event.error || event.message);
    
    // Call custom handler if provided
    if (onError && typeof onError === 'function') {
      try {
        onError(event.error || new Error(event.message), 'uncaughtexception');
      } catch (handlerError) {
        console.error('Error in custom error handler:', handlerError);
      }
    }
    
    // Prevent the default browser behavior which might show error dialogs
    event.preventDefault();
  });

  // Monitor console.error to track issues
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Call the original console.error
    originalConsoleError.apply(console, args);
    
    // Track console errors if in production
    if (import.meta.env.PROD && window.trackError) {
      try {
        // Only track the first argument if it's an error or string
        const firstArg = args[0];
        if (firstArg instanceof Error || typeof firstArg === 'string') {
          window.trackError(firstArg);
        }
      } catch (e) {
        // Silently fail if tracking fails
      }
    }
  };

  console.log('Error handler initialized successfully');
};

/**
 * Get the error type based on error characteristics
 * @param {Error|Object|string} error - The error to categorize
 * @returns {string} The error type
 */
export const getErrorType = (error) => {
  const errorStr = String(error);
  const message = error.message || errorStr;
  const name = error.name || '';
  const status = error.status || error.statusCode || 0;
  
  // Check for network errors
  if (
    name === 'NetworkError' ||
    name === 'AbortError' ||
    message.includes('network') ||
    message.includes('Network Error') ||
    message.includes('Failed to fetch') ||
    message.includes('timeout')
  ) {
    return ERROR_TYPES.NETWORK;
  }
  
  // Check for auth errors
  if (
    status === 401 ||
    status === 403 ||
    message.includes('auth') ||
    message.includes('Auth') ||
    message.includes('unauthorized') ||
    message.includes('token') ||
    message.includes('login') ||
    message.includes('permission')
  ) {
    return ERROR_TYPES.AUTH;
  }
  
  // Check for not found errors
  if (
    status === 404 ||
    name === 'NotFoundError' ||
    message.includes('NotFoundError') ||
    message.includes('not found') ||
    message.includes('object can not be found')
  ) {
    return ERROR_TYPES.NOT_FOUND;
  }
  
  // Check for storage errors
  if (
    message.includes('localStorage') ||
    message.includes('Storage') ||
    message.includes('quota') ||
    errorStr.includes('localStorage')
  ) {
    return ERROR_TYPES.STORAGE;
  }
  
  // Check for validation errors
  if (
    status === 400 ||
    status === 422 ||
    message.includes('validation') ||
    message.includes('invalid') ||
    message.includes('required')
  ) {
    return ERROR_TYPES.VALIDATION;
  }
  
  // Check for permission errors
  if (
    status === 403 ||
    message.includes('permission') ||
    message.includes('access') ||
    message.includes('forbidden')
  ) {
    return ERROR_TYPES.PERMISSION;
  }
  
  // Check for rendering errors
  if (
    name.includes('React') ||
    message.includes('render') ||
    message.includes('component') ||
    message.includes('element')
  ) {
    return ERROR_TYPES.RENDERING;
  }
  
  return ERROR_TYPES.UNKNOWN;
};

/**
 * Handle API errors with detailed classification
 * @param {Error|Object} error - The error to handle
 * @returns {Object} Formatted error with type, message, and details
 */
export const handleApiError = (error) => {
  let errorMessage = 'An unexpected error occurred';
  let errorType = getErrorType(error);
  let errorDetails = {};
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const statusCode = error.response.status;
    const responseData = error.response.data || {};
    
    errorDetails = {
      status: statusCode,
      data: responseData,
      headers: error.response.headers
    };
    
    if (responseData.message) {
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
    errorType = ERROR_TYPES.NETWORK;
    errorDetails = { request: error.request };
  } else if (error.message) {
    // Something happened in setting up the request that triggered an Error
    errorMessage = error.message;
  }
  
  return {
    type: errorType,
    message: errorMessage,
    details: errorDetails,
    original: error
  };
};

/**
 * Format error for display to user
 * @param {Error|Object|string} error - The error to format
 * @returns {string} User-friendly error message
 */
export const formatError = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object') {
    if (error.message) {
      return error.message;
    }
    
    if (error.error) {
      return typeof error.error === 'string' ? error.error : 'An error occurred';
    }
  }
  
  return 'An unexpected error occurred';
};

/**
 * Create a custom error with specific type
 * @param {string} message - Error message
 * @param {string} type - Error type from ERROR_TYPES
 * @param {Object} details - Additional error details
 * @returns {Error} Custom error object
 */
export const createError = (message, type = ERROR_TYPES.UNKNOWN, details = {}) => {
  const error = new Error(message);
  error.type = type;
  error.details = details;
  return error;
};

export default {
  setupErrorHandler,
  handleApiError,
  formatError,
  getErrorType,
  createError,
  ERROR_TYPES
}; 