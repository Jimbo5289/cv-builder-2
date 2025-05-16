#!/usr/bin/env node

/**
 * CV Builder Fixed Port Startup Script
 * 
 * This script solves the port conflict issues between frontend and backend by:
 * 1. Killing any existing processes on required ports
 * 2. Setting a fixed port (3005) for the backend
 * 3. Creating proper environment files with consistent configuration
 * 4. Starting the backend first, then the frontend with the correct API URL
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BACKEND_PORT = 3005;
const FRONTEND_PORT = 5173;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Main function to orchestrate the startup process
 */
async function main() {
  printBanner();
  
  try {
    await killExistingProcesses();
    await setupEnvironment();
    await startBackend();
    await startFrontend();
    
    printSuccessMessage();
  } catch (error) {
    console.error(`${colors.red}${colors.bright}ERROR: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

/**
 * Kill all existing processes that might interfere
 */
async function killExistingProcesses() {
  console.log(`\n${colors.blue}📌 Step 1: Stopping all running processes${colors.reset}`);
  
  try {
    // Kill Node.js processes
    console.log('Terminating all Node.js processes...');
    execSync('pkill -f node || true');
    
    // Kill processes on specific ports
    console.log('Freeing required ports...');
    execSync('lsof -ti:3005,3006,3007,5173,5174,5175,5176,5177 | xargs kill -9 2>/dev/null || true');
    
    // Wait a moment for ports to be fully released
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`${colors.green}✅ All processes terminated and ports freed${colors.reset}`);
  } catch (error) {
    console.log(`${colors.yellow}⚠️ Warning: ${error.message}${colors.reset}`);
    // Continue execution even if there's an error here
  }
}

/**
 * Set up environment files for both frontend and backend
 */
async function setupEnvironment() {
  console.log(`\n${colors.blue}📌 Step 2: Setting up environment files${colors.reset}`);
  
  // Create or update server/.env
  const serverEnv = `NODE_ENV=development
PORT=${BACKEND_PORT}
DISABLE_PORT_FALLBACK=true
SKIP_AUTH_CHECK=true
MOCK_SUBSCRIPTION_DATA=true
FRONTEND_URL=http://localhost:${FRONTEND_PORT}
JWT_SECRET=dev-secret-key
JWT_EXPIRES_IN=86400
ALLOW_SAFARI_CONNECTIONS=true
DEBUG_CORS=true`;

  fs.writeFileSync(path.join(__dirname, 'server', '.env'), serverEnv);
  console.log(`${colors.green}✅ Server environment file created${colors.reset}`);

  // Create or update frontend .env.local
  const frontendEnv = `VITE_API_URL=${BACKEND_URL}
VITE_SKIP_AUTH=true
VITE_DISABLE_PORT_FALLBACK=true`;

  fs.writeFileSync(path.join(__dirname, '.env.local'), frontendEnv);
  console.log(`${colors.green}✅ Frontend environment file created${colors.reset}`);
  
  // Ensure webhook.js exists as it's referenced but might be missing
  const webhookPath = path.join(__dirname, 'server', 'src', 'routes', 'webhooks.js');
  if (!fs.existsSync(webhookPath)) {
    fs.copyFileSync(
      path.join(__dirname, 'server', 'src', 'routes', 'webhook.js'),
      webhookPath
    );
    console.log(`${colors.green}✅ Created webhooks.js alias${colors.reset}`);
  }
}

/**
 * Start the backend server and wait for it to be ready
 */
async function startBackend() {
  console.log(`\n${colors.blue}📌 Step 3: Starting backend server${colors.reset}`);
  
  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      SKIP_AUTH_CHECK: 'true',
      MOCK_SUBSCRIPTION_DATA: 'true',
      DISABLE_PORT_FALLBACK: 'true',
      PORT: BACKEND_PORT.toString(),
    };
    
    // Start the backend process
    const backendProcess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'server'),
      env,
      stdio: ['inherit', 'pipe', 'pipe'],
      detached: true,
    });
    
    // Store backend logs
    const backendLogs = [];
    
    // Create readline interfaces to process stdout and stderr line by line
    const stdoutReader = readline.createInterface({
      input: backendProcess.stdout,
      terminal: false,
    });
    
    const stderrReader = readline.createInterface({
      input: backendProcess.stderr,
      terminal: false,
    });
    
    // Process stdout
    stdoutReader.on('line', (line) => {
      // Store log for debugging
      backendLogs.push(line);
      
      // Show all server logs
      console.log(`${colors.dim}[Backend] ${line}${colors.reset}`);
      
      // Check if server is started successfully
      if (line.includes(`Server running on port ${BACKEND_PORT}`) || 
          line.includes(`Server started successfully`) ||
          line.includes(`🚀 Server running on port ${BACKEND_PORT}`)) {
        console.log(`${colors.green}✅ Backend server started successfully on port ${BACKEND_PORT}${colors.reset}`);
        
        // Wait a moment before considering server ready
        setTimeout(resolve, 1000);
      }
    });
    
    // Process stderr
    stderrReader.on('line', (line) => {
      // Store log for debugging
      backendLogs.push(`[ERROR] ${line}`);
      
      // Show error logs
      console.error(`${colors.red}[Backend Error] ${line}${colors.reset}`);
    });
    
    // Handle process errors
    backendProcess.on('error', (error) => {
      console.error(`${colors.red}Backend process error: ${error.message}${colors.reset}`);
      reject(new Error(`Failed to start backend: ${error.message}`));
    });
    
    // Set a timeout in case the server doesn't start
    const timeout = setTimeout(() => {
      if (backendLogs.some(log => log.includes('Server started successfully'))) {
        console.log(`${colors.green}✅ Backend appears to be running (timeout check passed)${colors.reset}`);
        resolve();
      } else {
        reject(new Error('Backend server startup timed out. Check the logs for errors.'));
      }
    }, 10000);
    
    // Make sure we don't leave orphaned process
    backendProcess.unref();
  });
}

/**
 * Start the frontend development server
 */
async function startFrontend() {
  console.log(`\n${colors.blue}📌 Step 4: Starting frontend${colors.reset}`);
  
  return new Promise((resolve, reject) => {
    const frontendProcess = spawn('npm', ['run', 'dev', '--', '--port', FRONTEND_PORT.toString(), '--strictPort'], {
      cwd: __dirname,
      stdio: ['inherit', 'pipe', 'pipe'],
      detached: true,
      env: {
        ...process.env,
        VITE_API_URL: BACKEND_URL,
        VITE_SKIP_AUTH: 'true',
        VITE_DISABLE_PORT_FALLBACK: 'true',
      },
    });
    
    // Create readline interfaces
    const stdoutReader = readline.createInterface({
      input: frontendProcess.stdout,
      terminal: false,
    });
    
    const stderrReader = readline.createInterface({
      input: frontendProcess.stderr,
      terminal: false,
    });
    
    // Process stdout
    stdoutReader.on('line', (line) => {
      console.log(`${colors.dim}[Frontend] ${line}${colors.reset}`);
      
      // Check if frontend is ready
      if (line.includes(`Local:`) && line.includes(`http://localhost:${FRONTEND_PORT}`)) {
        console.log(`${colors.green}✅ Frontend started successfully on port ${FRONTEND_PORT}${colors.reset}`);
        resolve();
      }
    });
    
    // Process stderr
    stderrReader.on('line', (line) => {
      console.error(`${colors.red}[Frontend Error] ${line}${colors.reset}`);
      
      // If we see port conflict, reject promise
      if (line.includes(`Port ${FRONTEND_PORT} is in use`)) {
        reject(new Error(`Port ${FRONTEND_PORT} is already in use. Please free it before trying again.`));
      }
    });
    
    // Handle process errors
    frontendProcess.on('error', (error) => {
      console.error(`${colors.red}Frontend process error: ${error.message}${colors.reset}`);
      reject(new Error(`Failed to start frontend: ${error.message}`));
    });
    
    // Set a timeout
    const timeout = setTimeout(() => {
      reject(new Error('Frontend server startup timed out. Check the logs for errors.'));
    }, 15000);
    
    // Make sure we don't leave orphaned process
    frontendProcess.unref();
  });
}

/**
 * Print a nice banner to the console
 */
function printBanner() {
  console.log(`
${colors.bright}${colors.cyan}╔══════════════════════════════════════════════════════╗
║                                                      ║
║     CV Builder Fixed Port Startup                    ║
║     ----------------------------                     ║
║                                                      ║
║     Backend: http://localhost:${BACKEND_PORT}                  ║
║     Frontend: http://localhost:${FRONTEND_PORT}                 ║
║                                                      ║
╚══════════════════════════════════════════════════════╝${colors.reset}
`);
}

/**
 * Print success message
 */
function printSuccessMessage() {
  console.log(`
${colors.bright}${colors.green}╔══════════════════════════════════════════════════════╗
║                                                      ║
║     CV Builder is now running!                       ║
║     ----------------------------                     ║
║                                                      ║
║     Backend API: ${colors.cyan}http://localhost:${BACKEND_PORT}${colors.green}                  ║
║     Frontend UI: ${colors.cyan}http://localhost:${FRONTEND_PORT}${colors.green}                 ║
║                                                      ║
║     Press Ctrl+C to stop both servers.               ║
║                                                      ║
╚══════════════════════════════════════════════════════╝${colors.reset}
`);

  // Keep process running
  process.stdin.resume();

  // Handle Ctrl+C
  process.on('SIGINT', () => {
    console.log(`\n${colors.yellow}Stopping CV Builder...${colors.reset}`);
    execSync('pkill -f node || true');
    process.exit(0);
  });
}

// Start the main function
main().catch(error => {
  console.error(`${colors.red}${colors.bright}FATAL ERROR: ${error.message}${colors.reset}`);
  process.exit(1);
}); 