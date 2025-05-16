#!/usr/bin/env node

import { execSync, exec } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const SERVER_PORTS = [3005, 3006, 3007, 3008, 3009];
const FRONTEND_PORTS = [5173, 5174, 5175, 5176, 5177];
const CHECK_TIMEOUT = 2000; // 2 seconds

// Terminal colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m'
};

// Helper function to check if a port is in use
function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get({
      hostname: 'localhost',
      port: port,
      path: '/health',
      timeout: CHECK_TIMEOUT
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          port,
          status: res.statusCode,
          data: data || null,
          active: res.statusCode === 200
        });
      });
    });

    req.on('error', () => {
      resolve({
        port,
        status: null,
        data: null,
        active: false
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        port,
        status: 'timeout',
        data: null,
        active: false
      });
    });
  });
}

// Kill processes using specific ports
function killProcessesOnPorts(ports) {
  try {
    // For MacOS/Linux
    execSync(`lsof -ti:${ports.join(',')} | xargs kill -9 2>/dev/null || true`, { encoding: 'utf8' });
    console.log(`${colors.green}✓ Killed processes using ports ${ports.join(', ')}${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ Failed to kill processes: ${error.message}${colors.reset}`);
    return false;
  }
}

// Main function
async function main() {
  console.log(`${colors.blue}╔═════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║   CV Builder Server Launcher                ║${colors.reset}`);
  console.log(`${colors.blue}╚═════════════════════════════════════════════╝${colors.reset}`);
  
  // Kill all existing processes on our ports
  console.log(`\n${colors.yellow}Cleaning up existing server processes...${colors.reset}`);
  killProcessesOnPorts([...SERVER_PORTS, ...FRONTEND_PORTS]);
  
  // Allow ports to be released
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Start server with proper environment variables
  console.log(`\n${colors.yellow}Starting server in development mode...${colors.reset}`);
  const serverProcess = exec(
    `cd server && MOCK_SUBSCRIPTION_DATA=true SKIP_AUTH_CHECK=true npm run dev`,
    { detached: false }
  );
  
  // Give the server time to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Start frontend in parallel
  console.log(`\n${colors.yellow}Starting frontend...${colors.reset}`);
  const frontendProcess = exec(
    `VITE_MOCK_SUBSCRIPTION_DATA=true npm run dev`,
    { detached: false }
  );
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log(`\n${colors.yellow}Shutting down processes...${colors.reset}`);
    killProcessesOnPorts([...SERVER_PORTS, ...FRONTEND_PORTS]);
    process.exit(0);
  });
  
  // Output process information
  serverProcess.stdout.pipe(process.stdout);
  serverProcess.stderr.pipe(process.stderr);
  frontendProcess.stdout.pipe(process.stdout);
  frontendProcess.stderr.pipe(process.stderr);
  
  console.log(`\n${colors.green}Services started! Press Ctrl+C to stop all processes.${colors.reset}`);
}

// Run the main function
main().catch(error => {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
}); 