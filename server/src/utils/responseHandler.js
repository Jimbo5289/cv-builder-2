/* eslint-disable */
/**
 * Standardized API response handlers
 * This ensures consistent response formats across all API endpoints
 */
const { logger } = require('../config/logger');

/**
 * Send a successful response
 * @param {Object} res - Express response object
 * @param {Object|Array} data - Data to be sent in the response
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {Object} errors - Additional error details
 */
const sendError = (res, message = 'An error occurred', statusCode = 400, errors = null) => {
  const response = {
    success: false,
    error: message,
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Handle errors in async route handlers
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware function that catches errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    logger.error('Route error:', {
      path: req.path,
      method: req.method,
      error: error.message,
      stack: error.stack,
    });

    // Handle validation errors (like Zod errors)
    if (error.name === 'ZodError') {
      const validationErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));

      return sendError(
        res,
        'Validation error',
        400,
        validationErrors
      );
    }

    // Default error response
    return sendError(
      res,
      process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : error.message,
      500
    );
  });
};

module.exports = {
  sendSuccess,
  sendError,
  asyncHandler,
}; 