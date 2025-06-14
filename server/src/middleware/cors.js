const cors = require('cors');
const { logger } = require('../config/logger');

/**
 * Creates a flexible CORS configuration that handles Vercel preview deployments automatically
 * 
 * @param {Object} options Custom CORS options
 * @returns {Function} CORS middleware
 */
function createCorsMiddleware(options = {}) {
  // Default options that handle all Vercel preview deployments automatically
  const defaultOptions = {
    // List of explicitly allowed origins
    allowedOrigins: [
      // Local development
      'http://localhost:5173', 
      'http://127.0.0.1:5173', 
      'http://localhost:5174', 
      'http://127.0.0.1:5174',
      
      // Production domains
      'https://cv-builder-vercel.vercel.app',
      'https://cv-builder-2.vercel.app',
      'https://cv-builder-2-omega.vercel.app',
      'https://mycvbuilder.co.uk',
      'https://cv-builder-2-ducp9u2vf-jimbo5289s-projects.vercel.app',
      'https://cv-builder-backend-2jax.onrender.com'
    ],
    
    // Patterns for dynamic origins (like Vercel preview deployments)
    allowedPatterns: [
      /^https:\/\/cv-builder-2-[a-z0-9]+-jimbo5289s-projects\.vercel\.app$/,
      /^https:\/\/cv-builder-2-git-[a-z0-9]+-jimbo5289s-projects\.vercel\.app$/,
      /^https:\/\/cv-builder-backend-[a-z0-9]+\.onrender\.com$/
    ],
    
    // Default CORS configuration
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Origin', 
      'Accept', 
      'X-Requested-With'
    ],
    
    // Max age for preflight requests (1 hour)
    maxAge: 3600,
    
    // Whether to log CORS requests
    enableLogging: true
  };

  // Merge provided options with defaults
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    // Merge arrays if provided
    allowedOrigins: options.allowedOrigins || defaultOptions.allowedOrigins,
    allowedPatterns: options.allowedPatterns || defaultOptions.allowedPatterns,
    methods: options.methods || defaultOptions.methods,
    allowedHeaders: options.allowedHeaders || defaultOptions.allowedHeaders
  };

  // Create the origin function that checks against both explicit origins and patterns
  const corsOptions = {
    origin: function(origin, callback) {
      // Log origins for debugging
      if (origin) {
        logger.info(`CORS request from: ${origin}`);
      }
      
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) {
        callback(null, true);
        return;
      }

      // Check if origin is in our allowed list or matches patterns
      if (mergedOptions.allowedOrigins.includes(origin)) {
        // Origin is explicitly allowed
        callback(null, true);
      } else if (mergedOptions.allowedPatterns.some(pattern => pattern.test(origin))) {
        // Origin matches one of our dynamic patterns (e.g., Vercel previews)
        logger.info(`Allowing dynamic origin: ${origin}`);
        callback(null, true);
      } else {
        // Origin is not allowed - log and reject
        logger.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: mergedOptions.credentials,
    methods: mergedOptions.methods,
    allowedHeaders: mergedOptions.allowedHeaders,
    maxAge: mergedOptions.maxAge
  };

  return cors(corsOptions);
}

/**
 * Enhanced handler for OPTIONS preflight requests
 * 
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @param {Function} next Express next middleware
 */
function handlePreflight(req, res, next) {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;
    // Set CORS headers for preflight requests
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '3600');
    res.status(200).end();
    return;
  }
  next();
}

/**
 * Adds direct CORS headers to a response (useful for error handlers)
 * 
 * @param {Object} req Express request
 * @param {Object} res Express response
 */
function addCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept, X-Requested-With');
}

module.exports = {
  createCorsMiddleware,
  handlePreflight,
  addCorsHeaders
}; 