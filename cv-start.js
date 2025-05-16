#!/usr/bin/env node

import { execSync, spawn } from 'child_process';
import { createServer } from 'net';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
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

// Print banner
console.log(`${colors.blue}╔═══════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.blue}║   CV Builder - Safari Connection Fix              ║${colors.reset}`);
console.log(`${colors.blue}╚═══════════════════════════════════════════════════╝${colors.reset}`);

// Kill all processes
function killAllProcesses() {
  console.log(`${colors.yellow}Killing all Node.js processes...${colors.reset}`);
  
  try {
    // Force kill all Node processes
    execSync('pkill -9 -f node || true', { stdio: 'inherit' });
    console.log(`${colors.green}✓ Node.js processes killed${colors.reset}`);
    
    // Kill any processes on our ports
    const ports = [3005, 3006, 3007, 3008, 3009, 5173, 5174, 5175, 5176, 5177];
    execSync(`lsof -ti:${ports.join(',')} | xargs kill -9 2>/dev/null || true`, { stdio: 'inherit' });
    console.log(`${colors.green}✓ Port processes killed${colors.reset}`);
    
    // Wait for ports to be released
    console.log(`${colors.yellow}Waiting for ports to be released...${colors.reset}`);
    return new Promise(resolve => setTimeout(resolve, 2000));
  } catch (error) {
    console.log(`${colors.yellow}No processes to kill${colors.reset}`);
    return Promise.resolve();
  }
}

// Check if a port is available
function isPortAvailable(port) {
  return new Promise(resolve => {
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

// Find an available port
async function findAvailablePort(startPort, endPort) {
  for (let port = startPort; port <= endPort; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  return null;
}

// Start the server and client with the given ports
async function startServices(backendPort, frontendPort) {
  // Create a .env file for the server with correct port
  const envPath = join(__dirname, 'server', '.env');
  const envContent = `PORT=${backendPort}\nSKIP_AUTH_CHECK=true\nMOCK_SUBSCRIPTION_DATA=true\n`;
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log(`${colors.green}✓ Created .env file with PORT=${backendPort}${colors.reset}`);
  } catch (err) {
    console.log(`${colors.yellow}! Could not create .env file: ${err.message}${colors.reset}`);
  }
  
  // Start the backend server
  console.log(`${colors.blue}Starting backend server on port ${backendPort}...${colors.reset}`);
  const serverProcess = spawn('node', ['src/index.js'], {
    cwd: join(__dirname, 'server'),
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: backendPort.toString(),
      SKIP_AUTH_CHECK: 'true',
      MOCK_SUBSCRIPTION_DATA: 'true'
    }
  });
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Start the frontend
  console.log(`${colors.blue}Starting frontend on port ${frontendPort}...${colors.reset}`);
  const frontendProcess = spawn('npx', ['vite', '--port', frontendPort.toString(), '--host'], {
    cwd: __dirname,
    stdio: 'inherit',
    env: {
      ...process.env,
      VITE_API_URL: `http://localhost:${backendPort}`,
      VITE_SKIP_AUTH_CHECK: 'true',
      VITE_MOCK_SUBSCRIPTION_DATA: 'true'
    }
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log(`\n${colors.yellow}Shutting down processes...${colors.reset}`);
    serverProcess.kill();
    frontendProcess.kill();
    
    // Also make sure to kill any other processes
    killAllProcesses().then(() => {
      console.log(`${colors.green}All processes terminated${colors.reset}`);
      process.exit(0);
    });
  });
  
  // Log successful startup
  console.log(`\n${colors.green}✅ Services started successfully:${colors.reset}`);
  console.log(`${colors.green}Backend: http://localhost:${backendPort}${colors.reset}`);
  console.log(`${colors.green}Frontend: http://localhost:${frontendPort}${colors.reset}`);
  console.log(`${colors.green}Open in Safari: http://localhost:${frontendPort}${colors.reset}`);
  console.log(`\n${colors.yellow}Press Ctrl+C to stop all processes${colors.reset}`);
}

// Main function
async function main() {
  try {
    // Step 1: Kill all existing processes
    await killAllProcesses();
    
    // Step 2: Find available ports
    console.log(`${colors.yellow}Finding available ports...${colors.reset}`);
    const backendPort = await findAvailablePort(3005, 3009);
    if (!backendPort) {
      throw new Error('No available backend port found');
    }
    
    const frontendPort = await findAvailablePort(5173, 5177);
    if (!frontendPort) {
      throw new Error('No available frontend port found');
    }
    
    console.log(`${colors.green}Using backend port: ${backendPort}${colors.reset}`);
    console.log(`${colors.green}Using frontend port: ${frontendPort}${colors.reset}`);
    
    // Step 3: Start services
    await startServices(backendPort, frontendPort);
  } catch (error) {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run the script
main(); 