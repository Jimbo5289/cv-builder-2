const { logger } = require('../config/logger');
const database = require('../config/database');

/**
 * Middleware to check if user has an active subscription
 */
const requireSubscription = async (req, res, next) => {
  // Skip subscription check in development mode if configured
  if (req.skipAuthCheck || req.mockSubscription) {
    logger.info('Subscription check skipped in development mode');
    // Add a mock subscription to the request
    req.subscription = {
      status: 'active',
      planType: 'premium',
      features: ['all_templates', 'unlimited_cvs', 'ai_assistance']
    };
    return next();
  }
  
  try {
    // Get user ID from the authenticated request
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required for this resource' });
    }
    
    // Look up the user's subscription
    const subscription = await database.client.subscription.findFirst({
      where: { userId }
    });
    
    if (!subscription || subscription.status !== 'active') {
      return res.status(403).json({ 
        error: 'Subscription required', 
        message: 'This feature requires an active subscription',
        code: 'SUBSCRIPTION_REQUIRED'
      });
    }
    
    // Add subscription data to the request
    req.subscription = subscription;
    next();
  } catch (error) {
    logger.error('Error checking subscription:', error);
    res.status(500).json({ error: 'Internal server error checking subscription status' });
  }
};

/**
 * Middleware to inject subscription status into request without blocking
 */
const injectSubscriptionStatus = async (req, res, next) => {
  // Skip in development mode if configured
  if (req.skipAuthCheck || req.mockSubscription) {
    req.subscription = {
      status: 'active',
      planType: 'premium',
      features: ['all_templates', 'unlimited_cvs', 'ai_assistance']
    };
    return next();
  }
  
  try {
    // Get user ID from the authenticated request
    const userId = req.user?.id;
    
    if (userId) {
      // Look up the user's subscription
      const subscription = await database.client.subscription.findFirst({
        where: { userId }
      });
      
      // Add subscription data to the request (or null if not found)
      req.subscription = subscription || { status: 'none' };
    }
    
    next();
  } catch (error) {
    logger.error('Error retrieving subscription:', error);
    // Don't block the request, just continue
    req.subscription = { status: 'error', error: error.message };
    next();
  }
};

module.exports = {
  requireSubscription,
  injectSubscriptionStatus
}; 