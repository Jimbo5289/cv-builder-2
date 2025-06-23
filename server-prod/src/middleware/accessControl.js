const { PrismaClient } = require('@prisma/client');
const { logger } = require('../config/logger');
const { sendError } = require('../utils/responseHandler');

const prisma = new PrismaClient();

/**
 * Middleware to check if user has access to premium features
 * @param {Array} requiredFeatures - Array of features required ['ai-analysis', 'premium-templates', etc]
 * @returns {Function} Express middleware
 */
const requirePremiumAccess = (requiredFeatures = []) => {
  return async (req, res, next) => {
    try {
      // Skip checks in development mode if enabled
      if (process.env.NODE_ENV === 'development' && process.env.SKIP_AUTH_CHECK === 'true') {
        logger.info('Development mode: Skipping premium access check');
        return next();
      }

      const userId = req.user?.id;
      if (!userId) {
        return sendError(res, 'Authentication required', 401);
      }

      // Find user with their subscription, temporary access, and purchases
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          subscriptions: true,
          temporaryAccess: {
            where: {
              status: 'active',
              endTime: { gt: new Date() }
            }
          },
          purchases: {
            where: {
              status: 'completed',
              remainingDownloads: { gt: 0 }
            }
          }
        }
      });

      if (!user) {
        return sendError(res, 'User not found', 404);
      }

      // Check different access types - fix subscription access to use array
      const activeSubscription = user.subscriptions?.find(sub => 
        sub.status === 'active' && new Date(sub.currentPeriodEnd) > new Date()
      );
      const hasActiveSubscription = !!activeSubscription;
      const hasTemporaryAccess = user.temporaryAccess && user.temporaryAccess.length > 0;
      const hasValidPurchase = user.purchases && user.purchases.length > 0;

      // Determine feature access based on plan type
      let hasAccess = false;

      // Check subscription access first
      if (hasActiveSubscription) {
        // Subscriptions have access to all features
        hasAccess = true;
      }
      // Check 1-month access pass
      else if (hasTemporaryAccess) {
        const tempAccess = user.temporaryAccess[0];
        if (tempAccess.type === '30day-access') {
                      // 30-day access pass has access to most premium features
          hasAccess = true;
          
          // Special case: if the feature is 'priority-support', only full subscriptions have access
          if (requiredFeatures.includes('priority-support')) {
            hasAccess = false;
          }
        }
      }
      // Check pay-per-cv purchase
      else if (hasValidPurchase) {
        const purchase = user.purchases[0];
        if (purchase.type === 'one-time' && purchase.productName === 'Pay-Per-CV') {
          // Pay-per-CV has limited feature access
          const payPerCvFeatures = ['basic-ats-analysis', 'basic-ats-check', 'standard-templates', 'pdf-export', 'cv-builder'];
          
          // Check if all required features are available in pay-per-cv
          hasAccess = requiredFeatures.every(feature => 
            payPerCvFeatures.includes(feature)
          );
        }
      }

      if (!hasAccess) {
        return sendError(res, 'Premium subscription required for this feature', 403);
      }

      next();
    } catch (error) {
      logger.error('Access control error:', error);
      return sendError(res, 'Error checking feature access', 500);
    }
  };
};

module.exports = {
  requirePremiumAccess
}; 