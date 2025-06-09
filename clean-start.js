/**
 * Enhanced clean startup script
 * This script ensures all processes are properly killed and dependencies installed
 * before starting the application
 */
import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Helper function to log with colors
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Kill all processes on development ports
function killAllProcesses() {
  log('🔪 Killing all processes on development ports...', colors.yellow);
  try {
    execSync('lsof -ti:3005-3010,5173-5190 | xargs kill -9 2>/dev/null || true');
    // Additional cleanup for any zombie processes
    execSync('pkill -f "node.*start-.*\\.js" 2>/dev/null || true');
    execSync('pkill -f "vite" 2>/dev/null || true');
    execSync('pkill -f "nodemon" 2>/dev/null || true');
    log('✅ All processes killed successfully', colors.green);
  } catch (error) {
    log(`⚠️  Warning: ${error.message}`, colors.yellow);
  }
}

// Check and install dependencies
function checkAndInstallDependencies() {
  log('📦 Checking dependencies...', colors.blue);
  
  const requiredDeps = [
    '@stripe/stripe-js',
    'pdfmake'
  ];
  
  try {
    // Check for missing dependencies
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const missingDeps = requiredDeps.filter(dep => !dependencies[dep]);
    
    if (missingDeps.length > 0) {
      log(`⚠️  Missing dependencies: ${missingDeps.join(', ')}`, colors.yellow);
      log('📥 Installing missing dependencies...', colors.blue);
      execSync(`npm install ${missingDeps.join(' ')} --save`, { stdio: 'inherit' });
      log('✅ Dependencies installed successfully', colors.green);
    } else {
      log('✅ All dependencies are installed', colors.green);
    }
  } catch (error) {
    log(`❌ Error checking dependencies: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Start the backend server
function startBackend() {
  log('🚀 Starting backend server...', colors.magenta);
  const serverProcess = spawn('npm', ['run', 'server:dev'], {
    stdio: 'inherit',
    detached: false
  });
  
  return serverProcess;
}

// Start the frontend server
function startFrontend() {
  log('🌐 Starting frontend server...', colors.cyan);
  const frontendProcess = spawn('npm', ['run', 'frontend:dev'], {
    stdio: 'inherit',
    detached: false
  });
  
  return frontendProcess;
}

// Main function
async function main() {
  try {
    // Step 1: Kill all existing processes
    killAllProcesses();
    
    // Step 2: Check and install dependencies
    checkAndInstallDependencies();
    
    // Step 3: Start backend
    const serverProcess = startBackend();
    
    // Step 4: Wait for backend to initialize (3 seconds)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 5: Start frontend
    const frontendProcess = startFrontend();
    
    // Handle process termination
    process.on('SIGINT', () => {
      log('👋 Shutting down all processes...', colors.yellow);
      
      // Kill child processes
      if (serverProcess) {
        process.kill(-serverProcess.pid);
      }
      if (frontendProcess) {
        process.kill(-frontendProcess.pid);
      }
      
      // Extra cleanup
      killAllProcesses();
      
      process.exit(0);
    });
    
    log('✅ Development environment is running!', colors.green);
    log('Frontend: http://localhost:5173', colors.cyan);
    log('Backend: http://localhost:3005', colors.magenta);
    log('Press Ctrl+C to stop all servers', colors.yellow);
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Run the main function
main(); 