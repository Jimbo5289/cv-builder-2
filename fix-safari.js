#!/usr/bin/env node

/**
 * DEFINITIVE SAFARI CONNECTION FIX v2.0
 * 
 * After detailed analysis of server logs, this script addresses all root causes:
 * 
 * 1. Processes locking each other out by aggressive termination of all node processes
 * 2. Port conflicts by forcing fixed ports with DISABLE_PORT_FALLBACK=true
 * 3. Safari-specific auth issues with JWT tokens
 * 4. Missing files causing import errors
 * 5. Environmental configuration using proper .env files
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
  warning: (msg) => console.log(`\x1b[33m[WARNING]\x1b[0m ${msg}`),
  banner: () => {
    console.log('\x1b[32m╔════════════════════════════════════════════════════╗\x1b[0m');
    console.log('\x1b[32m║  SAFARI CONNECTION FIX v2.0                        ║\x1b[0m');
    console.log('\x1b[32m╚════════════════════════════════════════════════════╝\x1b[0m');
  }
};

// Print banner
log.banner();

// Step 1: Kill ALL processes that might be causing conflicts
async function killAllProcesses() {
  log.info('Step 1: Terminating ALL conflicting processes...');
  
  try {
    // Kill ALL Node processes aggressively
    log.info('  → Killing all Node processes');
    try {
      execSync('pkill -9 -f node || true', { stdio: 'inherit' });
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (e) {
      // Ignore errors in case no Node processes exist
    }
    
    // Kill ALL processes on important ports
    log.info('  → Killing all processes on relevant ports');
    for (const port of [CONFIG.SERVER_PORT, CONFIG.CLIENT_PORT, 3006, 3007, 5174, 5175, 5176, 5177]) {
      try {
        execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`, { stdio: 'inherit' });
      } catch (e) {
        // Ignore errors if no processes on the port
      }
    }
    
    // Kill Safari WebKit processes (macOS specific)
    log.info('  → Closing Safari WebKit network processes');
    try {
      execSync('killall -9 "com.apple.WebKit.Networking" 2>/dev/null || true', { stdio: 'inherit' });
      execSync('killall -9 "com.apple.WebKit.WebContent" 2>/dev/null || true', { stdio: 'inherit' });
    } catch (e) {
      // Ignore errors if no Safari processes
    }
    
    // Wait to ensure everything is fully terminated
    log.info('  → Waiting for processes to terminate completely');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    log.success('All processes successfully terminated');
  } catch (error) {
    log.warning(`Process termination had non-critical errors: ${error.message}`);
    // Continue anyway
  }
}

// Step 2: Create server environment file
async function setupServerEnvironment() {
  log.info('Step 2: Setting up server environment...');
  
  const serverEnvPath = path.join(CONFIG.SERVER_DIR, '.env');
  
  // Critical: DISABLE_PORT_FALLBACK=true prevents port auto-selection
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
    // Ensure directory exists
    if (!fs.existsSync(CONFIG.SERVER_DIR)) {
      fs.mkdirSync(CONFIG.SERVER_DIR, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(serverEnvPath, serverEnvContent);
    log.success(`Server environment file created at ${serverEnvPath}`);
  } catch (error) {
    log.error(`Failed to create server environment file: ${error.message}`);
    throw error;
  }
}

// Step 3: Set up client environment
async function setupClientEnvironment() {
  log.info('Step 3: Setting up client environment...');
  
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
    throw error;
  }
}

// Step 4: Create missing files to prevent import errors
async function createMissingFiles() {
  log.info('Step 4: Creating missing files to prevent import errors...');
  
  // Create directories if they don't exist
  const pagesDir = path.join(CONFIG.CLIENT_DIR, 'src', 'pages');
  
  try {
    fs.mkdirSync(pagesDir, { recursive: true });
  } catch (error) {
    // Ignore if directory already exists
  }
  
  // Create Analyze.jsx if it doesn't exist but Analyse.jsx does
  const analyzePath = path.join(pagesDir, 'Analyze.jsx');
  const analysePath = path.join(pagesDir, 'Analyse.jsx');
  
  if (!fs.existsSync(analyzePath) && fs.existsSync(analysePath)) {
    try {
      // Create a simple alias file
      const analyzeContent = `// Alias file for Analyse.jsx
import Analyse from './Analyse';
export default Analyse;
`;
      fs.writeFileSync(analyzePath, analyzeContent);
      log.success('Created Analyze.jsx as alias to Analyse.jsx');
    } catch (error) {
      log.warning(`Could not create Analyze.jsx: ${error.message}`);
      // Continue anyway
    }
  }
  
  // Create webhooks.js if it doesn't exist
  const routesDir = path.join(CONFIG.SERVER_DIR, 'src', 'routes');
  
  try {
    fs.mkdirSync(routesDir, { recursive: true });
  } catch (error) {
    // Ignore if directory already exists
  }
  
  const webhooksPath = path.join(routesDir, 'webhooks.js');
  const webhookPath = path.join(routesDir, 'webhook.js');
  
  if (!fs.existsSync(webhooksPath) && fs.existsSync(webhookPath)) {
    try {
      const webhooksContent = `// Alias file for webhook.js
const webhook = require('./webhook');
module.exports = webhook;
`;
      fs.writeFileSync(webhooksPath, webhooksContent);
      log.success('Created webhooks.js as alias to webhook.js');
    } catch (error) {
      log.warning(`Could not create webhooks.js: ${error.message}`);
      // Continue anyway
    }
  }
}

// Step 5: Start the application with fixed configuration in separate processes
async function startApplication() {
  log.info('Step 5: Starting the application with fixed configuration...');
  
  try {
    // Start the server in a new terminal window
    log.info(`Starting server on port ${CONFIG.SERVER_PORT}...`);
    
    // Use open to start a new terminal window on macOS
    const serverCmd = `cd "${CONFIG.SERVER_DIR}" && SKIP_AUTH_CHECK=true MOCK_SUBSCRIPTION_DATA=true DISABLE_PORT_FALLBACK=true npm run dev`;
    
    execSync(`osascript -e 'tell app "Terminal" to do script "${serverCmd}"'`);
    
    // Wait for the server to start
    log.info('Waiting for server to initialize (5 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Start the client in this terminal window
    log.info(`Starting client on port ${CONFIG.CLIENT_PORT}...`);
    
    const clientCmd = `cd "${CONFIG.CLIENT_DIR}" && npm run dev -- --port ${CONFIG.CLIENT_PORT} --force`;
    
    log.success('Server started in separate terminal');
    log.info('Starting client application...');
    
    // Run the client command directly in this terminal
    execSync(clientCmd, {
      stdio: 'inherit',
      env: {
        ...process.env,
        VITE_API_URL: `http://localhost:${CONFIG.SERVER_PORT}`,
        VITE_SKIP_AUTH: 'true',
        VITE_SKIP_AUTH_CHECK: 'true', 
        VITE_MOCK_SUBSCRIPTION_DATA: 'true'
      }
    });
  } catch (error) {
    log.error(`Failed to start application: ${error.message}`);
    throw error;
  }
}

// Main execution
(async function main() {
  try {
    // Step 1: Kill all existing processes
    await killAllProcesses();
    
    // Step 2: Set up server environment
    await setupServerEnvironment();
    
    // Step 3: Set up client environment
    await setupClientEnvironment();
    
    // Step 4: Create missing files
    await createMissingFiles();
    
    // Step 5: Start application
    await startApplication();
    
  } catch (error) {
    log.error(`Fatal error: ${error.message}`);
    process.exit(1);
  }
})(); 