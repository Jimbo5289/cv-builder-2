/**
 * Simplified Database Initialization for Development
 * 
 * This module provides a basic implementation for development database setup
 * without any external dependencies to avoid circular references.
 */

// Custom logger to avoid circular dependency with logger module
const logger = {
  info: (...args) => console.log('[info] :', ...args),
  warn: (...args) => console.warn('[warn] :', ...args),
  error: (...args) => console.error('[error] :', ...args)
};

/**
 * Simple function to ensure a development user exists
 * This is a mock implementation that returns a fake user ID
 */
async function ensureDevUser() {
  logger.info('Using simplified development database initialization');
  
  // In a real implementation, this would create or verify a user
  // For now, we'll just return a mock user ID
  const mockUserId = process.env.DEV_USER_ID || 'cmbf77t3q00007oc968e068ws';
  
  logger.info(`Development user ID: ${mockUserId}`);
  
  return {
    id: mockUserId,
    email: 'dev@example.com',
    role: 'USER'
  };
}

// Export the function for use in other modules
module.exports = { ensureDevUser }; 