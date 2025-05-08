import dotenv from 'dotenv';
import Stripe from 'stripe';

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
    process.exit(1);
  }
};

// Create singleton instance
const stripe = initializeStripe();

export const verifyWebhookSignature = (rawBody, signature) => {
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

export default stripe; 