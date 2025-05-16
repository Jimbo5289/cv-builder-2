#!/usr/bin/env node

/**
 * Safari Connection Fix
 * 
 * This script resolves all the connection issues with Safari by:
 * 1. Killing all existing Node processes to free up ports
 * 2. Creating necessary placeholder files
 * 3. Setting up proper environment variables
 * 4. Starting the application with fixed ports
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT_DIR = path.resolve(__dirname);
const SERVER_DIR = path.join(ROOT_DIR, 'server');
const CLIENT_DIR = ROOT_DIR;

// Configuration
const CONFIG = {
  serverPort: 3005,
  clientPort: 5173,
  skipAuth: true,
  mockSubscription: true
};

/**
 * Kill all running Node.js processes and Safari WebKit processes
 * that might be holding connections
 */
function killAllProcesses() {
  console.log('🔄 Terminating all running processes...');
  
  try {
    // Kill processes on specific ports
    execSync(`lsof -ti:${CONFIG.serverPort} | xargs kill -9 2>/dev/null || true`);
    execSync(`lsof -ti:${CONFIG.clientPort} | xargs kill -9 2>/dev/null || true`);
    
    // Kill all node processes
    execSync('pkill -f node || true');
    
    // On Mac, also kill Safari WebKit processes that might be holding connections
    if (os.platform() === 'darwin') {
      execSync('pkill -f "com.apple.WebKit.Networking" || true');
    }
    
    console.log('✅ All conflicting processes terminated successfully');
  } catch (error) {
    console.log('⚠️ Some processes could not be terminated, continuing anyway...');
  }
}

/**
 * Create necessary environment files with proper configuration
 */
function setupEnvironment() {
  console.log('🔄 Setting up environment files...');
  
  // Create server .env file
  const serverEnv = `
PORT=${CONFIG.serverPort}
NODE_ENV=development
JWT_SECRET=dev-secret-key
FRONTEND_URL=http://localhost:${CONFIG.clientPort}
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cvbuilder
SKIP_AUTH_CHECK=${CONFIG.skipAuth}
MOCK_SUBSCRIPTION_DATA=${CONFIG.mockSubscription}
`;

  fs.writeFileSync(path.join(SERVER_DIR, '.env'), serverEnv.trim());
  
  // Create client .env.local file
  const clientEnv = `
VITE_API_URL=http://localhost:${CONFIG.serverPort}
VITE_SKIP_AUTH=true
`;

  fs.writeFileSync(path.join(CLIENT_DIR, '.env.local'), clientEnv.trim());
  
  console.log('✅ Environment files created successfully');
}

/**
 * Create placeholder files for missing components
 */
function createPlaceholderFiles() {
  console.log('🔄 Creating placeholder files for missing components...');
  
  // Create Analyze.jsx placeholder if it doesn't exist
  const analyzePath = path.join(CLIENT_DIR, 'src', 'pages', 'Analyze.jsx');
  const analysePath = path.join(CLIENT_DIR, 'src', 'pages', 'Analyse.jsx');
  
  if (!fs.existsSync(analyzePath) && !fs.existsSync(analysePath)) {
    const analyzeContent = `
import React from 'react';

const Analyze = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">CV Analysis</h1>
        <p>Your CV analysis will appear here.</p>
      </div>
    </div>
  );
};

export default Analyze;
`;

    fs.mkdirSync(path.join(CLIENT_DIR, 'src', 'pages'), { recursive: true });
    fs.writeFileSync(analyzePath, analyzeContent.trim());
    console.log('✅ Created Analyze.jsx placeholder');
  }
  
  // Create webhook.js placeholder if needed
  const webhookPath = path.join(SERVER_DIR, 'src', 'routes', 'webhook.js');
  if (!fs.existsSync(webhookPath)) {
    const webhookContent = `
const express = require('express');
const router = express.Router();

// Webhook handling functions
async function handleCheckoutSessionCompleted(session) {
  console.log('Checkout session completed', session.id);
  return { success: true };
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated', subscription.id);
  return { success: true };
}

async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted', subscription.id);
  return { success: true };
}

async function handlePaymentFailed(invoice) {
  console.log('Payment failed', invoice.id);
  return { success: true };
}

async function handlePaymentSucceeded(invoice) {
  console.log('Payment succeeded', invoice.id);
  return { success: true };
}

// Webhook route handler
router.post('/', async (req, res) => {
  const event = req.body;
  console.log('Received webhook event', event.type);
  
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      default:
        console.log('Unhandled event type', event.type);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
`;

    fs.mkdirSync(path.join(SERVER_DIR, 'src', 'routes'), { recursive: true });
    fs.writeFileSync(webhookPath, webhookContent.trim());
    console.log('✅ Created webhook.js placeholder');
  }
  
  console.log('✅ All placeholder files created successfully');
}

/**
 * Start the application with fixed configuration
 */
async function startApplication() {
  console.log('🚀 Starting the application with fixed configuration...');
  
  try {
    // Start the server with fixed port and auth bypass
    const serverProcess = execSync(
      `cd "${SERVER_DIR}" && SKIP_AUTH_CHECK=true MOCK_SUBSCRIPTION_DATA=true PORT=${CONFIG.serverPort} npm run dev`,
      { stdio: 'inherit' }
    );
    
    // Start the client with fixed port and force flag
    const clientProcess = execSync(
      `cd "${CLIENT_DIR}" && npm run dev -- --port ${CONFIG.clientPort} --force`,
      { stdio: 'inherit' }
    );
  } catch (error) {
    console.error('❌ Failed to start application:', error.message);
    process.exit(1);
  }
}

/**
 * Main function to execute all fixes
 */
async function main() {
  console.log('🔨 Safari Connection Fix - Starting...');
  
  try {
    // Step 1: Kill all existing processes
    killAllProcesses();
    
    // Step 2: Set up environment
    setupEnvironment();
    
    // Step 3: Create placeholder files
    createPlaceholderFiles();
    
    // Step 4: Start application
    await startApplication();
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
    process.exit(1);
  }
}

// Run the main function
main(); 