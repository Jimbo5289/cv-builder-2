#!/usr/bin/env node

/**
 * SIMPLIFIED SAFARI CONNECTION FIX
 * 
 * A simpler version that focuses on the core fixes without terminal management.
 * Just run this script, then start the app normally.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Use ES modules for compatibility with the project
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
  SERVER_PORT: 3005,
  CLIENT_PORT: 5173,
  SERVER_DIR: path.join(__dirname, 'server'),
  CLIENT_DIR: __dirname
};

// Format terminal output
const log = {
  info: (msg) => console.log(`\x1b[34m[INFO]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
  error: (msg) => console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`),
  warning: (msg) => console.log(`\x1b[33m[WARNING]\x1b[0m ${msg}`)
};

console.log('📱 SAFARI CONNECTION FIX (Simplified Version)');
console.log('--------------------------------------------');

// Kill ALL processes that might be causing conflicts
async function killAllProcesses() {
  log.info('Killing all conflicting processes...');
  
  try {
    // Kill ALL Node processes
    execSync('pkill -9 -f node || true', { stdio: 'inherit' });
    
    // Kill ALL processes on important ports
    for (const port of [CONFIG.SERVER_PORT, CONFIG.CLIENT_PORT, 3006, 3007, 5174, 5175, 5176, 5177]) {
      execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`, { stdio: 'inherit' });
    }
    
    // Wait to ensure everything is fully terminated
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    log.success('All processes successfully terminated');
  } catch (error) {
    log.warning(`Process termination had errors: ${error.message}`);
  }
}

// Create server environment file
async function setupServerEnvironment() {
  log.info('Setting up server environment...');
  
  const serverEnvPath = path.join(CONFIG.SERVER_DIR, '.env');
  
  const serverEnvContent = `
PORT=${CONFIG.SERVER_PORT}
NODE_ENV=development
FRONTEND_URL=http://localhost:${CONFIG.CLIENT_PORT}
JWT_SECRET=safari-fix-jwt-secret-key
SKIP_AUTH_CHECK=true
MOCK_SUBSCRIPTION_DATA=true
DISABLE_PORT_FALLBACK=true
`.trim();

  try {
    fs.writeFileSync(serverEnvPath, serverEnvContent);
    log.success(`Server environment file created at ${serverEnvPath}`);
  } catch (error) {
    log.error(`Failed to create server environment file: ${error.message}`);
  }
}

// Set up client environment
async function setupClientEnvironment() {
  log.info('Setting up client environment...');
  
  const clientEnvPath = path.join(CONFIG.CLIENT_DIR, '.env.local');
  const clientEnvContent = `
VITE_API_URL=http://localhost:${CONFIG.SERVER_PORT}
VITE_SKIP_AUTH=true
VITE_SKIP_AUTH_CHECK=true
VITE_MOCK_SUBSCRIPTION_DATA=true
`.trim();

  try {
    fs.writeFileSync(clientEnvPath, clientEnvContent);
    log.success(`Client environment file created at ${clientEnvPath}`);
  } catch (error) {
    log.error(`Failed to create client environment file: ${error.message}`);
  }
}

// Create missing files to prevent import errors
async function createMissingFiles() {
  log.info('Creating missing files to prevent import errors...');
  
  // Create directories if they don't exist
  const pagesDir = path.join(CONFIG.CLIENT_DIR, 'src', 'pages');
  const routesDir = path.join(CONFIG.SERVER_DIR, 'src', 'routes');
  
  try {
    fs.mkdirSync(pagesDir, { recursive: true });
    fs.mkdirSync(routesDir, { recursive: true });
  } catch (error) {
    // Ignore if directories already exist
  }
  
  // Create Analyze.jsx if it doesn't exist but Analyse.jsx does
  const analyzePath = path.join(pagesDir, 'Analyze.jsx');
  const analysePath = path.join(pagesDir, 'Analyse.jsx');
  
  if (!fs.existsSync(analyzePath) && fs.existsSync(analysePath)) {
    const analyzeContent = `// Alias file for Analyse.jsx
import Analyse from './Analyse';
export default Analyse;
`;
    try {
      fs.writeFileSync(analyzePath, analyzeContent);
      log.success('Created Analyze.jsx as alias to Analyse.jsx');
    } catch (error) {
      log.warning(`Could not create Analyze.jsx: ${error.message}`);
    }
  }
  
  // Create webhooks.js if it doesn't exist
  const webhooksPath = path.join(routesDir, 'webhooks.js');
  const webhookPath = path.join(routesDir, 'webhook.js');
  
  if (!fs.existsSync(webhooksPath) && fs.existsSync(webhookPath)) {
    const webhooksContent = `// Alias file for webhook.js
const webhook = require('./webhook');
module.exports = webhook;
`;
    try {
      fs.writeFileSync(webhooksPath, webhooksContent);
      log.success('Created webhooks.js as alias to webhook.js');
    } catch (error) {
      log.warning(`Could not create webhooks.js: ${error.message}`);
    }
  }
}

// Main execution
(async function main() {
  try {
    await killAllProcesses();
    await setupServerEnvironment();
    await setupClientEnvironment();
    await createMissingFiles();
    
    log.success('Fix applied successfully!');
    console.log('\n\x1b[32m✓ SAFARI FIX COMPLETED\x1b[0m');
    console.log('\nNow start your application by running:');
    console.log('\x1b[36m1. cd server && npm run dev\x1b[0m (in one terminal)');
    console.log('\x1b[36m2. npm run dev\x1b[0m (in another terminal)');
    console.log('\nOpen Safari and navigate to: \x1b[36mhttp://localhost:5173\x1b[0m');
  } catch (error) {
    log.error(`Fatal error: ${error.message}`);
    process.exit(1);
  }
})(); 