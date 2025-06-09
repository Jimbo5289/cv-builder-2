/**
 * Ultimate Development Environment Startup Script
 * 
 * This script ensures a clean development environment by:
 * 1. Killing all existing processes on development ports
 * 2. Installing missing dependencies
 * 3. Starting the backend and frontend in the correct order
 * 4. Providing proper error handling and cleanup
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Configuration
const config = {
  backendPort: 3005,
  frontendPort: 5173,
  requiredDeps: ['@stripe/stripe-js', 'pdfmake'],
  killPorts: '3005-3010,5173-5190',
};

// Collection of child processes to manage
const processes = {
  backend: null,
  frontend: null,
};

// Track if we're shutting down to prevent duplicate cleanup
let isShuttingDown = false;

/**
 * Log a formatted message to the console
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Kills all processes on development ports
 */
function killAllProcesses() {
  log('🔪 Killing all processes on development ports...', colors.yellow);
  try {
    execSync(`lsof -ti:${config.killPorts} | xargs kill -9 2>/dev/null || true`);
    log('✅ All development processes killed', colors.green);
  } catch (error) {
    log(`⚠️  Warning: Couldn't kill all processes: ${error.message}`, colors.yellow);
  }
}

/**
 * Checks if required dependencies are installed
 */
function checkDependencies() {
  log('📦 Checking required dependencies...', colors.blue);
  let missingDeps = [];

  for (const dep of config.requiredDeps) {
    try {
      require.resolve(dep, { paths: [process.cwd()] });
    } catch (error) {
      missingDeps.push(dep);
    }
  }

  if (missingDeps.length > 0) {
    log(`⚠️  Missing dependencies: ${missingDeps.join(', ')}`, colors.yellow);
    log('📦 Installing missing dependencies...', colors.blue);
    
    try {
      execSync(`npm install ${missingDeps.join(' ')} --save`, { stdio: 'inherit' });
      log('✅ Dependencies installed successfully', colors.green);
    } catch (error) {
      log(`❌ Failed to install dependencies: ${error.message}`, colors.red);
      process.exit(1);
    }
  } else {
    log('✅ All dependencies are installed', colors.green);
  }
}

/**
 * Starts the backend server
 */
function startBackend() {
  log('🚀 Starting backend server...', colors.magenta);
  
  processes.backend = spawn('npm', ['run', 'server:dev'], {
    stdio: 'inherit',
    shell: true,
  });
  
  processes.backend.on('error', (error) => {
    log(`❌ Backend process error: ${error.message}`, colors.red);
  });
  
  processes.backend.on('close', (code) => {
    if (!isShuttingDown) {
      log(`⚠️  Backend process exited with code ${code}`, colors.yellow);
    }
  });
  
  // Wait for backend to initialize before starting frontend
  return new Promise((resolve) => {
    setTimeout(() => {
      log('✅ Backend server started', colors.green);
      resolve();
    }, 3000);
  });
}

/**
 * Starts the frontend server
 */
function startFrontend() {
  log('🌐 Starting frontend server...', colors.cyan);
  
  processes.frontend = spawn('npm', ['run', 'frontend:dev'], {
    stdio: 'inherit',
    shell: true,
  });
  
  processes.frontend.on('error', (error) => {
    log(`❌ Frontend process error: ${error.message}`, colors.red);
  });
  
  processes.frontend.on('close', (code) => {
    if (!isShuttingDown) {
      log(`⚠️  Frontend process exited with code ${code}`, colors.yellow);
    }
  });
  
  log('✅ Development environment is running!', colors.green);
  log(`Frontend: http://localhost:${config.frontendPort}`, colors.bright);
  log(`Backend: http://localhost:${config.backendPort}`, colors.bright);
  log('\nPress Ctrl+C to stop all servers', colors.yellow);
}

/**
 * Gracefully shuts down all processes
 */
function cleanup(exitCode = 0) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  log('\n🛑 Shutting down development environment...', colors.yellow);
  
  // Kill all processes again to ensure clean exit
  killAllProcesses();
  
  // Additional cleanup if needed
  log('✅ Development environment shut down', colors.green);
  
  // Exit with appropriate code
  process.exit(exitCode);
}

/**
 * Main function to run the startup script
 */
async function main() {
  try {
    log('🧹 Cleaning up development environment...', colors.blue);
    killAllProcesses();
    
    checkDependencies();
    
    await startBackend();
    startFrontend();
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, colors.red);
    cleanup(1);
  }
}

// Handle termination signals
process.on('SIGINT', () => cleanup());
process.on('SIGTERM', () => cleanup());
process.on('uncaughtException', (error) => {
  log(`❌ Uncaught Exception: ${error.message}`, colors.red);
  cleanup(1);
});

// Start the development environment
main(); 