/* eslint-disable */
const jwt = require('jsonwebtoken');
const { logger } = require('../config/logger');

// JWT configuration constants
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  logger.error('JWT_SECRET is not set in environment variables - authentication will fail');
}

// Use longer access token life and even longer refresh token life
const JWT_EXPIRES_IN = process.env.JWT_EXPIRY || process.env.JWT_EXPIRES_IN || '4h'; // Longer lifetime for better user experience
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRY || process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

/**
 * Generate a JWT token
 * @param {Object} payload - The payload to encode in the token
 * @returns {string} The generated token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'HS256', // Explicitly set the algorithm
  });
};

/**
 * Generate a refresh token
 * @param {Object} payload - The payload to encode in the token
 * @returns {string} The generated refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    algorithm: 'HS256', // Explicitly set the algorithm
  });
};

/**
 * Verify a JWT token
 * @param {string} token - The token to verify
 * @returns {Object|null} The decoded token or null if verification fails
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    logger.warn('JWT verification failed:', { error: error.message });
    return null;
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  JWT_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN
}; 