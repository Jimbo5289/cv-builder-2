const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { logger } = require('../config/logger');
const database = require('../config/database');
const { verifyToken } = require('../utils/jwt');

const prisma = new PrismaClient();
const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Authentication middleware
 * Verifies the JWT token and adds the user object to the request
 * In development mode with SKIP_AUTH_CHECK=true, it will use a mock user
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Check if we're in development mode with auth check skipped
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_AUTH_CHECK === 'true') {
      logger.info('Auth check skipped in development mode');
      
      // Create a mock user for development
      req.user = {
        id: 'dev-user-id',
        email: 'dev@example.com',
        name: 'Development User',
        subscriptions: [{
          status: 'active',
          plan: 'premium',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }]
      };
      
      // Add flag to indicate auth was skipped
      req.skipAuthCheck = true;
      return next();
    }

    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Missing or invalid Authorization header');
      return res.status(401).json({ error: 'Authentication required', message: 'Valid bearer token required' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      logger.warn('Empty token provided');
      return res.status(401).json({ error: 'Authentication required', message: 'Valid token required' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
      
      // Get user from database
      const user = await database.client.user.findUnique({
        where: { id: decoded.userId },
        include: {
          subscriptions: true
        }
      });

      if (!user) {
        logger.warn('User not found for token', { userId: decoded.userId });
        return res.status(401).json({ error: 'Authentication failed', message: 'User not found' });
      }

      // Add user to request
      req.user = user;
      next();
    } catch (tokenError) {
      logger.error('Token verification failed', { error: tokenError.message });
      
      if (tokenError.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired', message: 'Please login again' });
      }
      
      return res.status(401).json({ error: 'Invalid token', message: 'Authentication failed' });
    }
  } catch (error) {
    logger.error('Auth middleware error', { error: error.message, stack: error.stack });
    return res.status(500).json({ error: 'Server error', message: 'Authentication service unavailable' });
  }
};

// Helper function to create and attach a mock user for development
function useMockUser(req, next) {
  logger.info('Using mock user for development mode');
  
  // Create mock user with ID and basic fields
  req.user = {
    id: 'dev-user-id',
    email: 'dev@example.com',
    name: 'Development User',
    role: 'user',
    isActive: true
  };
  
  // Add mock subscription data if needed
  if (process.env.MOCK_SUBSCRIPTION_DATA === 'true') {
    req.user.subscriptions = [{
      id: 'mock-subscription-id',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }];
  }
  
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
  return authMiddleware(req, res, next);
};

module.exports = authMiddleware;
module.exports.authWithUser = authWithUser; 