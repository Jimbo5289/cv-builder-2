const jwt = require('jsonwebtoken');
const { logger } = require('../config/logger');

// Validate JWT_SECRET
if (!process.env.JWT_SECRET) {
  logger.error('JWT_SECRET is not defined in environment variables');
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

const generateToken = (userId) => {
  if (!userId) {
    logger.error('User ID is required to generate token');
    throw new Error('User ID is required');
  }

  try {
    return jwt.sign({ id: userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  } catch (error) {
    logger.error('Token generation failed:', error);
    throw new Error('Failed to generate authentication token');
  }
};

const verifyToken = (token) => {
  if (!token) {
    throw new Error('Token is required');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    logger.warn('Token verification failed:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    
    throw new Error('Invalid token');
  }
};

module.exports = {
  generateToken,
  verifyToken
}; 