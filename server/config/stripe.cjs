/**
 * Stripe Configuration (CommonJS version)
 * 
 * This module initializes and exports the Stripe client for payment processing.
 */

const dotenv = require('dotenv');
const Stripe = require('stripe');

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
    throw new Error(
      `Missing required Stripe environment variables: ${missingVars.join(', ')}`
    );
  }
};

// Initialize Stripe configuration
const initializeStripe = () => {
  try {
    validateStripeConfig();
    
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      typescript: true,
      appInfo: {
        name: 'CV Builder',
        version: '1.0.0',
      },
      timeout: 20000, // 20 seconds
    });
  } catch (error) {
    console.error('Failed to initialize Stripe:', error.message);
    return null;
  }
};

// Create singleton instance
const stripe = initializeStripe();

// Verify webhook signature
const verifyWebhookSignature = (rawBody, signature) => {
  try {
    return stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('⚠️ Webhook signature verification failed:', error.message);
    throw new Error('Invalid webhook signature');
  }
};

module.exports = {
  stripe,
  verifyWebhookSignature
}; 