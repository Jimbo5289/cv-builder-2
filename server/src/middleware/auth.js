const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { logger } = require('../config/logger');
const database = require('../config/database');

/**
 * Authentication middleware
 * Validates JWT token and attaches user data to the request
 * Optionally fetches user data from database if fetchUser = true
 */
const auth = async (req, res, next) => {
  try {
    // Check for token in Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      logger.warn('Authentication failed: No Authorization header');
      return res.status(401).json({ error: 'Please authenticate.' });
    }

    // Extract token
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    if (!token) {
      logger.warn('Authentication failed: No token provided');
      return res.status(401).json({ error: 'Please authenticate.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      logger.warn('Authentication failed: Invalid token payload');
      return res.status(401).json({ error: 'Please authenticate.' });
    }

    // Attach user ID to request by default
    req.user = { id: decoded.id };

    // Option to fetch complete user data (used by routes needing user details)
    if (req.fetchUser === true) {
      const prisma = database.client;
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true
        }
      });

      if (!user) {
        logger.warn('Authentication failed: User not found', { userId: decoded.id });
        return res.status(401).json({ error: 'User not found.' });
      }
      
      req.user = user;
    }

    logger.info('Authentication successful', { userId: decoded.id });
    next();
  } catch (error) {
    logger.error('Auth middleware error:', { 
      error: error.message, 
      stack: error.stack,
      type: error.name 
    });
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please login again.' });
    }

    res.status(401).json({ error: 'Please authenticate.' });
  }
};

// Create a middleware that also fetches user data
const authWithUser = (req, res, next) => {
  req.fetchUser = true;
  return auth(req, res, next);
};

module.exports = auth;
module.exports.authWithUser = authWithUser; 