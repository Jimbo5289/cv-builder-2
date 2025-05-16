#!/usr/bin/env node

import { execSync, exec, spawn } from 'child_process';
import { createInterface } from 'readline';
import { createServer } from 'net';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Terminal colors for better output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

console.log(`${colors.blue}╔════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.blue}║   CV Builder - Clean Startup                       ║${colors.reset}`);
console.log(`${colors.blue}╚════════════════════════════════════════════════════╝${colors.reset}`);

// List of ports to check
const backendPorts = [3005, 3006, 3007, 3008, 3009];
const frontendPorts = [5173, 5174, 5175, 5176, 5177];
const allPorts = [...backendPorts, ...frontendPorts];

// Function to check if a port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = createServer();
    
    server.once('error', () => {
      resolve(false);
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    
    server.listen(port);
  });
}

// Function to find an available port in a range
async function findAvailablePort(start, end) {
  for (let port = start; port <= end; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  return null;
}

// Kill all processes using specific ports
function killProcessesOnPorts() {
  console.log(`${colors.yellow}Killing all processes on ports ${allPorts.join(', ')}...${colors.reset}`);
  
  try {
    // For macOS/Linux
    execSync(`lsof -ti:${allPorts.join(',')} | xargs kill -9 2>/dev/null || true`, {
      stdio: 'inherit'
    });
    console.log(`${colors.green}✓ Successfully killed processes on ports${colors.reset}`);
  } catch (err) {
    console.log(`${colors.yellow}No processes found on those ports${colors.reset}`);
  }
  
  // Also kill all node processes for good measure
  try {
    execSync('pkill -f node || true', { stdio: 'inherit' });
    console.log(`${colors.green}✓ Successfully killed Node.js processes${colors.reset}`);
  } catch (err) {
    console.log(`${colors.yellow}No Node.js processes found${colors.reset}`);
  }
}

// Main function
async function main() {
  try {
    // Step 1: Kill any existing processes
    killProcessesOnPorts();
    
    // Step 2: Wait a moment for ports to be released
    console.log(`${colors.yellow}Waiting for ports to be released...${colors.reset}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 3: Find available ports
    console.log(`${colors.yellow}Finding available ports...${colors.reset}`);
    const backendPort = await findAvailablePort(3005, 3009);
    
    if (!backendPort) {
      throw new Error('No available backend port found. Please check running processes.');
    }
    
    const frontendPort = await findAvailablePort(5173, 5177);
    
    if (!frontendPort) {
      throw new Error('No available frontend port found. Please check running processes.');
    }
    
    console.log(`${colors.green}Using backend port: ${backendPort}${colors.reset}`);
    console.log(`${colors.green}Using frontend port: ${frontendPort}${colors.reset}`);
    
    // Step 4: Start the backend server
    console.log(`${colors.yellow}Starting backend server...${colors.reset}`);
    const serverProcess = spawn('node', ['src/index.js'], {
      cwd: join(__dirname, 'server'),
      env: {
        ...process.env,
        PORT: backendPort.toString(),
        MOCK_SUBSCRIPTION_DATA: 'true',
        SKIP_AUTH_CHECK: 'true'
      },
      stdio: 'inherit'
    });
    
    serverProcess.on('error', (err) => {
      console.error(`${colors.red}Failed to start backend server: ${err.message}${colors.reset}`);
    });
    
    // Step 5: Wait for server to start before launching frontend
    console.log(`${colors.yellow}Waiting for backend to be ready...${colors.reset}`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 6: Start the frontend
    console.log(`${colors.yellow}Starting frontend application...${colors.reset}`);
    const frontendProcess = spawn('npx', ['vite', '--port', frontendPort.toString()], {
      cwd: __dirname,
      env: {
        ...process.env,
        VITE_API_URL: `http://localhost:${backendPort}`,
        VITE_MOCK_SUBSCRIPTION_DATA: 'true',
        VITE_SKIP_AUTH_CHECK: 'true'
      },
      stdio: 'inherit'
    });
    
    frontendProcess.on('error', (err) => {
      console.error(`${colors.red}Failed to start frontend: ${err.message}${colors.reset}`);
    });
    
    console.log(`${colors.green}╔════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.green}║   Application started successfully!                ║${colors.reset}`);
    console.log(`${colors.green}║   Backend: http://localhost:${backendPort}${' '.repeat(28 - backendPort.toString().length)}║${colors.reset}`);
    console.log(`${colors.green}║   Frontend: http://localhost:${frontendPort}${' '.repeat(27 - frontendPort.toString().length)}║${colors.reset}`);
    console.log(`${colors.green}║                                                    ║${colors.reset}`);
    console.log(`${colors.green}║   Press Ctrl+C to stop all processes               ║${colors.reset}`);
    console.log(`${colors.green}╚════════════════════════════════════════════════════╝${colors.reset}`);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log(`\n${colors.yellow}Shutting down all processes...${colors.reset}`);
      
      serverProcess.kill('SIGTERM');
      frontendProcess.kill('SIGTERM');
      
      setTimeout(() => {
        console.log(`${colors.green}All processes stopped${colors.reset}`);
        process.exit(0);
      }, 1000);
    });
    
  } catch (error) {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run the main function
main().catch(err => {
  console.error(`${colors.red}Unhandled error: ${err.message}${colors.reset}`);
  process.exit(1);
}); 