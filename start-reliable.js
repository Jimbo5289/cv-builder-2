#!/usr/bin/env node

import { execSync, exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import net from 'net';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m'
};

// Kill processes using specific ports
function killProcessesOnPorts(ports) {
  try {
    console.log(`${colors.yellow}Killing processes on ports: ${ports.join(', ')}${colors.reset}`);
    // For macOS/Linux
    execSync(`lsof -ti:${ports.join(',')} | xargs kill -9 2>/dev/null || true`, { encoding: 'utf8' });
    // Also kill all Node processes for good measure
    try {
      execSync('pkill -9 -f node || true', { encoding: 'utf8' });
    } catch (err) {
      // Ignore errors here, as there might not be any Node processes
    }
    console.log(`${colors.green}✓ Killed processes using ports ${ports.join(', ')}${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ Failed to kill processes: ${error.message}${colors.reset}`);
    return false;
  }
}

// Check if a port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
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

// Main function
async function main() {
  console.log(`${colors.blue}╔═════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║   CV Builder Safe Startup                  ║${colors.reset}`);
  console.log(`${colors.blue}╚═════════════════════════════════════════════╝${colors.reset}`);
  
  // Kill all processes on relevant ports
  const backendPorts = [3005, 3006, 3007, 3008, 3009];
  const frontendPorts = [5173, 5174, 5175, 5176, 5177];
  killProcessesOnPorts([...backendPorts, ...frontendPorts]);
  
  // Allow time for ports to be released
  console.log(`${colors.yellow}Waiting for ports to be released...${colors.reset}`);
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Find available ports
  console.log(`${colors.yellow}Finding available ports...${colors.reset}`);
  const backendPort = await findAvailablePort(3005, 3009);
  const frontendPort = await findAvailablePort(5173, 5177);
  
  if (!backendPort) {
    console.error(`${colors.red}No available backend port found!${colors.reset}`);
    process.exit(1);
  }
  
  if (!frontendPort) {
    console.error(`${colors.red}No available frontend port found!${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`${colors.green}Using backend port: ${backendPort}${colors.reset}`);
  console.log(`${colors.green}Using frontend port: ${frontendPort}${colors.reset}`);
  
  try {
    // Start backend server with explicit port and environment variables
    console.log(`\n${colors.yellow}Starting backend server...${colors.reset}`);
    const serverProcess = exec(
      `cd server && PORT=${backendPort} MOCK_SUBSCRIPTION_DATA=true SKIP_AUTH_CHECK=true node src/index.js`,
      { 
        env: {
          ...process.env,
          PORT: backendPort.toString(),
          MOCK_SUBSCRIPTION_DATA: 'true',
          SKIP_AUTH_CHECK: 'true'
        }
      }
    );
    
    // Wait for backend to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if backend is actually running
    console.log(`${colors.yellow}Checking if backend started successfully...${colors.reset}`);
    try {
      const response = execSync(`curl -s http://localhost:${backendPort}/health`, { encoding: 'utf8' });
      console.log(`${colors.green}Backend health check: ${response}${colors.reset}`);
    } catch (error) {
      console.log(`${colors.yellow}Backend health check failed, but continuing anyway...${colors.reset}`);
    }
    
    // Start frontend with proper environment variables
    console.log(`\n${colors.yellow}Starting frontend...${colors.reset}`);
    const frontendProcess = exec(
      `VITE_API_URL=http://localhost:${backendPort} VITE_MOCK_SUBSCRIPTION_DATA=true VITE_SKIP_AUTH_CHECK=true npm run dev -- --port ${frontendPort} --host`,
      {
        env: {
          ...process.env,
          VITE_API_URL: `http://localhost:${backendPort}`,
          VITE_MOCK_SUBSCRIPTION_DATA: 'true',
          VITE_SKIP_AUTH_CHECK: 'true'
        }
      }
    );
    
    // Pipe stdout and stderr
    serverProcess.stdout.pipe(process.stdout);
    serverProcess.stderr.pipe(process.stderr);
    frontendProcess.stdout.pipe(process.stdout);
    frontendProcess.stderr.pipe(process.stderr);
    
    console.log(`\n${colors.green}Services started!${colors.reset}`);
    console.log(`${colors.green}Backend: http://localhost:${backendPort}${colors.reset}`);
    console.log(`${colors.green}Frontend: http://localhost:${frontendPort}${colors.reset}`);
    console.log(`${colors.green}Open http://localhost:${frontendPort} in your browser.${colors.reset}`);
    console.log(`${colors.green}Press Ctrl+C to stop all processes.${colors.reset}`);
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log(`\n${colors.yellow}Shutting down all processes...${colors.reset}`);
      killProcessesOnPorts([...backendPorts, ...frontendPorts]);
      process.exit(0);
    });
  } catch (error) {
    console.error(`${colors.red}Error starting services: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
}); 