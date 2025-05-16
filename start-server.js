#!/usr/bin/env node

import { execSync, exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define colors for console output
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
    // For macOS
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
  console.log(`\n${colors.yellow}Killing all Node.js processes...${colors.reset}`);
  try {
    execSync('pkill -f node || true', { encoding: 'utf8' });
    console.log(`${colors.green}✓ All Node.js processes killed${colors.reset}`);
  } catch (error) {
    console.log(`${colors.yellow}No Node.js processes were running${colors.reset}`);
  }
  
  // Ensure ports are free
  console.log(`\n${colors.yellow}Freeing up ports...${colors.reset}`);
  const ports = [3005, 3006, 3007, 3008, 3009, 5173, 5174, 5175, 5176, 5177];
  killProcessesOnPorts(ports);
  
  // Allow time for ports to be released
  console.log(`\n${colors.yellow}Waiting for ports to be released...${colors.reset}`);
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // Start backend server with development mode and mock subscription
    console.log(`\n${colors.yellow}Starting backend server...${colors.reset}`);
    const serverProcess = exec(
      'cd server && MOCK_SUBSCRIPTION_DATA=true SKIP_AUTH_CHECK=true node src/index.js',
      { 
        env: {
          ...process.env,
          MOCK_SUBSCRIPTION_DATA: 'true',
          SKIP_AUTH_CHECK: 'true',
          PORT: '3005'
        }
      }
    );
    
    // Wait a moment for backend to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Start frontend app
    console.log(`\n${colors.yellow}Starting frontend application...${colors.reset}`);
    const frontendProcess = exec(
      'VITE_MOCK_SUBSCRIPTION_DATA=true VITE_SKIP_AUTH_CHECK=true npm run dev',
      {
        env: {
          ...process.env,
          VITE_MOCK_SUBSCRIPTION_DATA: 'true',
          VITE_SKIP_AUTH_CHECK: 'true'
        }
      }
    );
    
    // Pipe stdout and stderr for both processes
    serverProcess.stdout.pipe(process.stdout);
    serverProcess.stderr.pipe(process.stderr);
    frontendProcess.stdout.pipe(process.stdout);
    frontendProcess.stderr.pipe(process.stderr);
    
    console.log(`\n${colors.green}Services started! Open http://localhost:5173 in your browser.${colors.reset}`);
    console.log(`${colors.green}Press Ctrl+C to stop all processes.${colors.reset}`);
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log(`\n${colors.yellow}Shutting down all processes...${colors.reset}`);
      killProcessesOnPorts(ports);
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