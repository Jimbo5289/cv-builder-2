/**
 * Render Setup Script
 * This script sets up the environment for the application on Render.
 * It checks if required environment variables are set and provides defaults if needed.
 */

const fs = require('fs');
const path = require('path');
const { logger } = require('./src/config/logger');

// Path to the environment file
const envFile = path.join(__dirname, '.env');

// Check if .env file exists
if (!fs.existsSync(envFile)) {
  logger.info('Creating .env file for Render deployment');
  
  // Set default environment variables
  const envContent = `NODE_ENV=production
PORT=3005
MOCK_DATABASE=true
JWT_SECRET=${process.env.JWT_SECRET || 'secure_jwt_secret_for_production'}
JWT_REFRESH_SECRET=${process.env.JWT_REFRESH_SECRET || 'secure_refresh_token_secret_for_production'}
STRIPE_PUBLISHABLE_KEY=${process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_mock_key'}
STRIPE_SECRET_KEY=${process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key'}
STRIPE_PRICE_MONTHLY=${process.env.STRIPE_PRICE_MONTHLY || 'price_monthly'}
STRIPE_PRICE_ANNUAL=${process.env.STRIPE_PRICE_ANNUAL || 'price_annual'}
STRIPE_PRICE_PAY_PER_CV=${process.env.STRIPE_PRICE_PAY_PER_CV || 'price_pay_per_cv'}
STRIPE_PRICE_24HOUR_ACCESS=${process.env.STRIPE_PRICE_24HOUR_ACCESS || 'price_24hour_access'}
STRIPE_WEBHOOK_SECRET=${process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock_key'}
FRONTEND_URL=${process.env.FRONTEND_URL || 'https://cv-builder-2-git-main-jimbo5289s-projects.vercel.app'}
`;

  try {
    fs.writeFileSync(envFile, envContent);
    logger.info('.env file created successfully');
  } catch (err) {
    logger.error('Error creating .env file:', err);
  }
} else {
  logger.info('.env file already exists');
}

// Continue with the main application
require('./src/index.js'); 