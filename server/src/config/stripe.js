/* eslint-disable */
const dotenv = require('dotenv');
const Stripe = require('stripe');
const { logger } = require('./logger');

// Load environment variables
dotenv.config();

// Validate Stripe configuration
const validateStripeConfig = () => {
  const requiredVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    logger.warn(`Missing required Stripe environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  return true;
};

// Initialize Stripe configuration
const initializeStripe = () => {
  try {
    if (!validateStripeConfig()) {
      logger.error('Stripe configuration is incomplete. Payment functionality will be limited.');
      return null;
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      appInfo: {
        name: 'CV Builder',
        version: '1.0.0',
      },
      timeout: 20000, // 20 seconds
    });
    
    logger.info('Stripe service initialized successfully');
    return stripe;
  } catch (error) {
    logger.error('Failed to initialize Stripe:', error.message);
    return null;
  }
};

// Create singleton instance
const stripe = initializeStripe();

const verifyWebhookSignature = (rawBody, signature) => {
  try {
    if (!stripe) {
      throw new Error('Stripe is not initialized');
    }
    
    return stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    logger.error('⚠️ Webhook signature verification failed:', error.message);
    throw new Error('Invalid webhook signature');
  }
};

module.exports = {
  stripe,
  verifyWebhookSignature
}; 