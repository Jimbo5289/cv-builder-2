#!/usr/bin/env node

/**
 * Server Connection Checker and Process Manager
 * 
 * This script checks for running server instances, checks connectivity,
 * and cleans up hung processes.
 */

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
const PORTS_TO_CHECK = [3005, 3006, 3007, 3008, 3009];
const FRONTEND_PORTS = [5173, 5174, 5175, 5176, 5177];
const CHECK_TIMEOUT = 2000; // 2 seconds

// Terminal colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
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

// Helper function to find processes using specific ports
function findProcessesOnPorts(ports) {
  try {
    const portList = ports.join(',');
    const cmd = process.platform === 'win32'
      ? `netstat -ano | findstr "LISTENING" | findstr "${portList.split(',').join('\\|')}"`
      : `lsof -i:${portList} -P -n | grep LISTEN`;
    
    const output = execSync(cmd, { encoding: 'utf8' });
    return output;
  } catch (error) {
    return '';
  }
}

// Helper function to find all node processes
function findNodeProcesses() {
  try {
    const cmd = process.platform === 'win32'
      ? 'tasklist /fi "imagename eq node.exe" /fo list'
      : 'ps aux | grep node | grep -v grep';
    
    const output = execSync(cmd, { encoding: 'utf8' });
    return output;
  } catch (error) {
    return '';
  }
}

// Kill processes using specific ports
function killProcessesOnPorts(ports) {
  try {
    let cmd;
    
    if (process.platform === 'win32') {
      cmd = `for /f "tokens=5" %a in ('netstat -ano ^| findstr "LISTENING" ^| findstr "${ports.join('\\|')}"') do taskkill /F /PID %a`;
    } else {
      cmd = `lsof -ti:${ports.join(',')} | xargs kill -9 2>/dev/null || true`;
    }
    
    execSync(cmd, { encoding: 'utf8' });
    console.log(`${colors.green}✓ Killed processes using ports ${ports.join(', ')}${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ Failed to kill processes: ${error.message}${colors.reset}`);
    return false;
  }
}

// Create a simple interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Main function
async function main() {
  console.log(`${colors.blue}╔═════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║   CV Builder Server Connection Checker      ║${colors.reset}`);
  console.log(`${colors.blue}╚═════════════════════════════════════════════╝${colors.reset}`);
  
  // Check all backend server ports
  console.log(`\n${colors.yellow}Checking backend server ports...${colors.reset}`);
  const results = await Promise.all(PORTS_TO_CHECK.map(port => checkPort(port)));
  
  let hasActiveServer = false;
  for (const result of results) {
    if (result.active) {
      console.log(`${colors.green}✓ Port ${result.port}: ACTIVE${colors.reset}`);
      hasActiveServer = true;
    } else {
      console.log(`${colors.gray}✗ Port ${result.port}: ${result.status === 'timeout' ? 'TIMEOUT' : 'INACTIVE'}${colors.reset}`);
    }
  }
  
  // Display processes using these ports
  console.log(`\n${colors.yellow}Processes using server ports:${colors.reset}`);
  const portProcesses = findProcessesOnPorts(PORTS_TO_CHECK);
  if (portProcesses.trim()) {
    console.log(portProcesses);
  } else {
    console.log(`${colors.gray}No processes found using ports ${PORTS_TO_CHECK.join(', ')}${colors.reset}`);
  }
  
  // Check Node.js processes
  console.log(`\n${colors.yellow}Current Node.js processes:${colors.reset}`);
  const nodeProcesses = findNodeProcesses();
  console.log(nodeProcesses || `${colors.gray}No Node.js processes found${colors.reset}`);
  
  // Offer options
  console.log(`\n${colors.blue}╔═════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║   Available Actions:                         ║${colors.reset}`);
  console.log(`${colors.blue}╠═════════════════════════════════════════════╣${colors.reset}`);
  console.log(`${colors.blue}║   ${colors.reset}1. Kill all server processes               ${colors.blue}║${colors.reset}`);
  console.log(`${colors.blue}║   ${colors.reset}2. Kill all Node.js processes              ${colors.blue}║${colors.reset}`);
  console.log(`${colors.blue}║   ${colors.reset}3. Start clean server                      ${colors.blue}║${colors.reset}`);
  console.log(`${colors.blue}║   ${colors.reset}4. Start server in development mode        ${colors.blue}║${colors.reset}`);
  console.log(`${colors.blue}║   ${colors.reset}5. Exit                                    ${colors.blue}║${colors.reset}`);
  console.log(`${colors.blue}╚═════════════════════════════════════════════╝${colors.reset}`);
  
  rl.question(`\n${colors.cyan}Enter your choice (1-5):${colors.reset} `, (answer) => {
    switch (answer.trim()) {
      case '1':
        killProcessesOnPorts([...PORTS_TO_CHECK, ...FRONTEND_PORTS]);
        rl.close();
        break;
      case '2':
        try {
          const killCmd = process.platform === 'win32'
            ? 'taskkill /F /IM node.exe'
            : "killall -9 node";
          execSync(killCmd, { encoding: 'utf8' });
          console.log(`${colors.green}✓ All Node.js processes killed${colors.reset}`);
        } catch (error) {
          console.error(`${colors.red}✗ Failed to kill Node.js processes: ${error.message}${colors.reset}`);
        }
        rl.close();
        break;
      case '3':
        try {
          killProcessesOnPorts([...PORTS_TO_CHECK, ...FRONTEND_PORTS]);
          console.log(`${colors.yellow}Starting clean server...${colors.reset}`);
          
          const serverScript = path.join(process.cwd(), 'server/src/index.js');
          const frontendCmd = 'npm run dev';
          
          if (fs.existsSync(serverScript)) {
            exec(`cd server && MOCK_SUBSCRIPTION_DATA=true SKIP_AUTH_CHECK=true node src/index.js`, 
              { detached: true, stdio: 'ignore' });
            console.log(`${colors.green}✓ Backend server started${colors.reset}`);
            
            exec(frontendCmd, { detached: true, stdio: 'ignore' });
            console.log(`${colors.green}✓ Frontend development server started${colors.reset}`);
            console.log(`${colors.blue}Open http://localhost:5173 in your browser${colors.reset}`);
          } else {
            console.error(`${colors.red}✗ Server script not found at ${serverScript}${colors.reset}`);
          }
        } catch (error) {
          console.error(`${colors.red}✗ Failed to start server: ${error.message}${colors.reset}`);
        }
        rl.close();
        break;
      case '4':
        try {
          killProcessesOnPorts([...PORTS_TO_CHECK, ...FRONTEND_PORTS]);
          console.log(`${colors.yellow}Starting server in development mode...${colors.reset}`);
          
          exec(`cd server && MOCK_SUBSCRIPTION_DATA=true SKIP_AUTH_CHECK=true npm run dev`, 
            { detached: true, stdio: 'ignore' });
          console.log(`${colors.green}✓ Backend server started in development mode${colors.reset}`);
          
          exec(`VITE_MOCK_SUBSCRIPTION_DATA=true npm run dev`, 
            { detached: true, stdio: 'ignore' });
          console.log(`${colors.green}✓ Frontend development server started${colors.reset}`);
          console.log(`${colors.blue}Open http://localhost:5173 in your browser${colors.reset}`);
        } catch (error) {
          console.error(`${colors.red}✗ Failed to start server: ${error.message}${colors.reset}`);
        }
        rl.close();
        break;
      case '5':
        console.log(`${colors.blue}Exiting...${colors.reset}`);
        rl.close();
        break;
      default:
        console.log(`${colors.red}Invalid choice. Exiting.${colors.reset}`);
        rl.close();
    }
  });
}

// Run the main function
main().catch(error => {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
}); 