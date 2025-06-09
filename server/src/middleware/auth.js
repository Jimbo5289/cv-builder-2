const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { logger } = require('../config/logger');
const database = require('../config/database');
const { verifyToken } = require('../utils/jwt');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const isDevelopment = process.env.NODE_ENV !== 'production';

// Read the development.env file to get the DEV_USER_ID value
let devUserId = null;
if (isDevelopment) {
  try {
    const devEnvPath = path.join(__dirname, '../../development.env');
    if (fs.existsSync(devEnvPath)) {
      const devEnvContent = fs.readFileSync(devEnvPath, 'utf8');
      const devUserIdMatch = devEnvContent.match(/DEV_USER_ID=(.+)/);
      if (devUserIdMatch && devUserIdMatch[1]) {
        devUserId = devUserIdMatch[1].trim();
        logger.info(`Development user ID loaded from environment: ${devUserId}`);
      }
    }
  } catch (error) {
    logger.error('Failed to read development.env file:', error.message);
  }
}

/**
 * Authentication middleware
 * Verifies the JWT token and adds the user object to the request
 * In development mode with SKIP_AUTH_CHECK=true, it will use a mock user
 */
const authMiddleware = async (req, res, next) => {
  try {
    // For CV analysis routes, always bypass auth check in development
    if (isDevelopment && (
      req.path.includes('/analyze-only') || 
      req.path.includes('/analyze') ||
      process.env.SKIP_AUTH_CHECK === 'true'
    )) {
      logger.info(`Auth check bypassed in development mode for path: ${req.path}`);
      
      // Use the dev user ID from the environment file or generate a consistent one
      const userId = devUserId || 'dev-user-id';
      
      // Add a mock user object to the request with subscription
      req.user = {
        id: userId,
        email: 'dev@example.com',
        firstName: 'Development',
        lastName: 'User',
        role: 'USER',
        subscription: {
          status: 'active',
          plan: 'premium',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        }
      };
      
      // Log that we're using a mock user
      logger.info('Using mock user for development:', { userId });
      
      return next();
    }

    // Get token from header
    const token = req.headers.authorization?.split(' ')[1] || '';
    
    if (!token) {
      logger.warn('No token provided for path:', req.path);
      return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
      // Verify token
      const decoded = await verifyToken(token);
      
      if (!decoded || !decoded.id) {
        logger.warn('Invalid token payload:', { decoded });
        return res.status(401).json({ error: 'Invalid token' });
      }
      
      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        include: {
          subscription: true
        }
      });
      
      if (!user) {
        logger.warn('User not found for token with ID:', decoded.id);
        return res.status(401).json({ error: 'User not found' });
      }
      
      // Add user to request
      req.user = user;
      next();
    } catch (error) {
      logger.error('Token verification error:', error.message);
      return res.status(401).json({ error: 'Invalid token', details: error.message });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error.message);
    return res.status(500).json({ error: 'Authentication error', details: error.message });
  }
};

// Helper function to create and attach a mock user for development
function useMockUser(req, next) {
  logger.info('Using mock user for development mode');
  
  // Create mock user with ID and basic fields
  req.user = {
    id: 'cltest1234567890123456789', // Use a CUID-like format for compatibility
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