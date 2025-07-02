/* eslint-disable */
/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { logger } = require('../config/logger');
// eslint-disable-next-line no-unused-vars
const database = require('../config/database');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const isDevelopment = process.env.NODE_ENV !== 'production';
const useMockDb = process.env.MOCK_DATABASE === 'true';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

// Read the development.env file to get the DEV_USER_ID value
let devUserId = null;
let devUserName = null;
if (isDevelopment || useMockDb) {
  try {
    const devEnvPath = path.join(__dirname, '../../development.env');
    if (fs.existsSync(devEnvPath)) {
      const devEnvContent = fs.readFileSync(devEnvPath, 'utf8');
      const idMatch = devEnvContent.match(/DEV_USER_ID=(.+)/);
      const nameMatch = devEnvContent.match(/DEV_USER_NAME=(.+)/);
      
      if (idMatch && idMatch[1]) {
        devUserId = idMatch[1].trim();
        logger.info(`Loaded DEV_USER_ID from development.env: ${devUserId}`);
      }
      
      if (nameMatch && nameMatch[1]) {
        devUserName = nameMatch[1].trim();
        logger.info(`Loaded DEV_USER_NAME from development.env: ${devUserName}`);
      }
    }
  } catch (error) {
    logger.warn('Failed to read development.env file:', error.message);
  }
}

// Fall back to environment variable if not found in file
if (!devUserId && process.env.DEV_USER_ID) {
  devUserId = process.env.DEV_USER_ID;
  logger.info(`Using DEV_USER_ID from environment: ${devUserId}`);
}

if (!devUserName && process.env.DEV_USER_NAME) {
  devUserName = process.env.DEV_USER_NAME;
  logger.info(`Using DEV_USER_NAME from environment: ${devUserName}`);
}

// Create a mock user for development
const createMockUser = (existingUser = null) => {
  // If we have existing user data, preserve their personal information
  if (existingUser) {
    return {
      ...existingUser,
      // Always include these fields to avoid errors
      id: existingUser.id || devUserId || 'devuser123',
      name: existingUser.name || devUserName || 'James Singleton',
      email: existingUser.email || 'dev@example.com',
      createdAt: existingUser.createdAt || new Date(),
      // Add mock subscription as an object (not an array)
      subscription: {
        status: 'active',
        plan: 'pro',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      }
    };
  }
  
  // Try to get the user's real name from headers if available
  let userName = devUserName || 'James Singleton'; // Use environment variable or default
  
  // Otherwise, create a completely mock user
  return {
    id: devUserId || 'devuser123',
    email: 'dev@example.com',
    name: userName,
    createdAt: new Date(),
    // Always provide subscription as an object (not an array)
    subscription: {
      status: 'active',
      plan: 'pro',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    }
  };
};

/**
 * Authentication middleware
 */
const auth = async (req, res, next) => {
  // In development mode or with mock database, ALWAYS use the mock user
  // This avoids all Prisma database query errors
  if (isDevelopment || useMockDb || process.env.SKIP_AUTH_CHECK === 'true' || req.skipAuthCheck) {
    logger.debug('Using mock user in development/test mode');
    req.user = createMockUser();
    return next();
  }
  
  // The code below will only execute in production mode with a real database
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    // No token provided
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn(`No token provided for ${req.method} ${req.path}`);
      return res.status(401).json({ error: 'No token provided' });
    }

    // Get token from header
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Malformed token
    if (!decoded || !decoded.id) {
      logger.warn('Token verification failed: Missing user ID');
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Find user by ID from token - make sure we never try to include fields that don't exist
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        isActive: true
      }
    });

    // User not found
    if (!user) {
      logger.warn(`User not found for token: ${decoded.id}`);
      return res.status(404).json({ error: 'User not found' });
    }

    // Add user to request
    req.user = user;
    
    // Continue to next middleware
    next();
  } catch (error) {
    // Handle specific JWT errors with appropriate logging levels
    if (error.name === 'TokenExpiredError') {
      // Token expiration is expected behavior, log as info instead of error
      logger.info('Token expired for user session:', {
        expiredAt: error.expiredAt,
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Your session has expired. Please log in again.',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    // Handle JWT signature errors (common when JWT secret changes)
    if (error.name === 'JsonWebTokenError') {
      if (error.message.includes('invalid signature')) {
        // This is common when JWT secret changes - log as debug to reduce noise
        logger.debug('JWT signature invalid - likely due to server restart or secret rotation:', {
          path: req.path,
          method: req.method,
          ip: req.ip,
          userAgent: req.headers['user-agent']?.substring(0, 50) + '...'
        });
        return res.status(401).json({ 
          error: 'Invalid token signature',
          message: 'Your session is invalid. Please log in again.',
          code: 'INVALID_SIGNATURE',
          hint: 'Server was restarted - please refresh and log in again'
        });
      }
      
      if (error.message.includes('jwt malformed')) {
        logger.debug('Malformed JWT token received:', {
          path: req.path,
          method: req.method,
          ip: req.ip
        });
        return res.status(401).json({ 
          error: 'Malformed token',
          message: 'Invalid authentication token. Please log in again.',
          code: 'MALFORMED_TOKEN'
        });
      }
      
      // Other JWT errors
      logger.debug('JWT authentication failed:', {
        name: error.name,
        message: error.message,
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Authentication failed. Please log in again.',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'NotBeforeError') {
      logger.debug('JWT not yet active:', {
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      return res.status(401).json({ 
        error: 'Token not active',
        message: 'Token is not active yet. Please try again later.',
        code: 'TOKEN_NOT_ACTIVE'
      });
    }
    
    // Only log unexpected errors as actual errors
    logger.error('Unexpected auth middleware error:', {
      name: error.name,
      message: error.message,
      path: req.path,
      method: req.method,
      ip: req.ip,
      stack: error.stack
    });
    
    // Database or other unexpected errors
    res.status(500).json({ 
      error: 'Authentication error',
      message: 'Internal server error during authentication',
      code: 'AUTH_ERROR'
    });
  }
};

/**
 * Enhanced security middleware for user data isolation
 * Validates that any user ID parameters match the authenticated user
 */
const validateUserAccess = (req, res, next) => {
  try {
    // Skip validation in development mode
    if (isDevelopment || useMockDb || process.env.SKIP_AUTH_CHECK === 'true') {
      return next();
    }

    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      logger.warn('User access validation failed: No authenticated user');
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check for any user ID parameters in the request
    const userIdParams = ['userId', 'user_id', 'uid'];
    const userIdInPath = userIdParams.find(param => req.params[param]);
    
    if (userIdInPath) {
      const requestedUserId = req.params[userIdInPath];
      if (requestedUserId !== req.user.id) {
        logger.warn('User access validation failed: User ID mismatch', {
          authenticatedUserId: req.user.id,
          requestedUserId: requestedUserId,
          path: req.path,
          method: req.method
        });
        return res.status(403).json({ error: 'Access denied: Cannot access other user data' });
      }
    }

    // Check for user ID in request body (for POST/PUT requests)
    if (req.body && typeof req.body === 'object') {
      const bodyUserIdFields = ['userId', 'user_id', 'uid'];
      const bodyUserIdField = bodyUserIdFields.find(field => req.body[field]);
      
      if (bodyUserIdField) {
        const requestedUserId = req.body[bodyUserIdField];
        if (requestedUserId !== req.user.id) {
          logger.warn('User access validation failed: Body user ID mismatch', {
            authenticatedUserId: req.user.id,
            requestedUserId: requestedUserId,
            path: req.path,
            method: req.method
          });
          return res.status(403).json({ error: 'Access denied: Cannot modify other user data' });
        }
      }
    }

    next();
  } catch (error) {
    logger.error('User access validation error:', error);
    res.status(500).json({ error: 'Access validation error' });
  }
};

/**
 * Middleware to validate CV ownership
 * Ensures users can only access their own CVs
 */
const validateCVOwnership = async (req, res, next) => {
  try {
    // Skip validation in development mode
    if (isDevelopment || useMockDb || process.env.SKIP_AUTH_CHECK === 'true') {
      return next();
    }

    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check for CV ID in parameters
    const cvId = req.params.id || req.params.cvId;
    if (!cvId) {
      return next(); // No CV ID to validate
    }

    // Check database connection
    if (!database.client) {
      logger.error('Database client not initialized for CV ownership validation');
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Verify CV ownership
    const cv = await database.client.CV.findUnique({
      where: { id: cvId },
      select: { userId: true }
    });

    if (!cv) {
      logger.warn('CV ownership validation failed: CV not found', {
        cvId: cvId,
        userId: req.user.id
      });
      return res.status(404).json({ error: 'CV not found' });
    }

    if (cv.userId !== req.user.id) {
      logger.warn('CV ownership validation failed: Access denied', {
        cvId: cvId,
        userId: req.user.id,
        cvOwner: cv.userId
      });
      return res.status(403).json({ error: 'Access denied: CV belongs to another user' });
    }

    next();
  } catch (error) {
    logger.error('CV ownership validation error:', error);
    res.status(500).json({ error: 'Ownership validation error' });
  }
};

// Helper function to create and attach a mock user for development
function useMockUser(req, next) {
  logger.debug('Using mock user for development mode');
  
  // Create mock user with ID and basic fields
  req.user = createMockUser();
  
  next();
}

// Helper function to detect Safari browser - not used directly anymore
function isSafariBrowser(req) {
  const userAgent = req.headers['user-agent'] || '';
  return userAgent.includes('Safari') && !userAgent.includes('Chrome');
}

// Additional middleware that includes user data
const authWithUser = (req, res, next) => {
  req.fetchUser = true;
  return auth(req, res, next);
};

module.exports = { auth, validateUserAccess, validateCVOwnership, authWithUser, useMockUser }; 