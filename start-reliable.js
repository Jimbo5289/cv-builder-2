#!/usr/bin/env node

import { execSync, exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import net from 'net';
import http from 'http';
import fetch from 'node-fetch';

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

// Make a health check to see if server is running
async function checkHealth(port) {
  return new Promise((resolve) => {
    const req = new URL(`http://localhost:${port}/health`);
    const options = {
      method: 'GET',
      timeout: 5000
    };
    
    const request = http.request(req, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const responseData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: responseData,
            error: null
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: null,
            error: 'Invalid JSON response'
          });
        }
      });
    });
    
    request.on('error', (error) => {
      resolve({
        status: null,
        data: null,
        error: error.message
      });
    });
    
    request.on('timeout', () => {
      request.destroy();
      resolve({
        status: null,
        data: null,
        error: 'Request timed out'
      });
    });
    
    request.end();
  });
}

// Clean up temporary files and cached data
function cleanupTemporaryFiles() {
  // Directories to clean
  const tempDirs = [
    path.join(__dirname, 'server', 'tmp'),
    path.join(__dirname, 'server', 'logs'),
    path.join(__dirname, 'node_modules', '.cache')
  ];

  console.log(`${colors.yellow}Cleaning up temporary files...${colors.reset}`);

  tempDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      try {
        // Don't delete the directory itself, just its contents
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const filePath = path.join(dir, file);
          if (fs.lstatSync(filePath).isDirectory()) {
            // Skip directories for safety
            return;
          }
          fs.unlinkSync(filePath);
        });
        console.log(`${colors.green}✓ Cleaned ${dir}${colors.reset}`);
      } catch (err) {
        console.error(`${colors.red}✗ Failed to clean ${dir}: ${err.message}${colors.reset}`);
      }
    }
  });
}

// Main function
async function main() {
  console.log(`${colors.blue}╔═════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║   CV Builder Safe Startup                  ║${colors.reset}`);
  console.log(`${colors.blue}╚═════════════════════════════════════════════╝${colors.reset}`);
  
  // Clean up any temporary files
  cleanupTemporaryFiles();
  
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
  
  // Start the backend server with increased memory limit and enable memory monitoring
  console.log(`${colors.yellow}Starting backend server...${colors.reset}`);
  const serverProcess = exec(
    `cd server && NODE_OPTIONS="--max-old-space-size=4096 --expose-gc" PORT=${backendPort} MEMORY_MONITOR_INTERVAL=300000 MOCK_SUBSCRIPTION_DATA=true SKIP_AUTH_CHECK=true node --require ./memory-monitor.js src/index.js`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`${colors.red}Backend server error: ${error.message}${colors.reset}`);
        return;
      }
      if (stderr) {
        console.error(`${colors.red}Backend stderr: ${stderr}${colors.reset}`);
      }
    }
  );
  
  // Set up auto-restart for the server process
  let serverRestarts = 0;
  const maxServerRestarts = 5;
  
  serverProcess.on('exit', (code) => {
    if (code !== 0 && serverRestarts < maxServerRestarts) {
      serverRestarts++;
      console.log(`${colors.yellow}Backend server exited with code ${code}. Restarting (${serverRestarts}/${maxServerRestarts})...${colors.reset}`);
      
      // Wait a moment before restarting
      setTimeout(() => {
        const restartProcess = exec(
          `cd server && NODE_OPTIONS="--max-old-space-size=4096 --expose-gc" PORT=${backendPort} MEMORY_MONITOR_INTERVAL=300000 MOCK_SUBSCRIPTION_DATA=true SKIP_AUTH_CHECK=true node --require ./memory-monitor.js src/index.js`
        );
        
        // Redirect output
        restartProcess.stdout.pipe(process.stdout);
        restartProcess.stderr.pipe(process.stderr);
      }, 5000);
    } else if (serverRestarts >= maxServerRestarts) {
      console.error(`${colors.red}Backend server failed to restart after ${maxServerRestarts} attempts.${colors.reset}`);
    }
  });
  
  // Wait for the server to start
  console.log(`${colors.yellow}Checking if backend started successfully...${colors.reset}`);
  let serverStarted = false;
  for (let i = 0; i < 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      const response = await fetch(`http://localhost:${backendPort}/health`);
      if (response.ok) {
        const data = await response.json();
        console.log(`${colors.green}Backend health check: ${JSON.stringify(data)}${colors.reset}`);
        serverStarted = true;
        break;
      }
    } catch (error) {
      // Continue trying
    }
  }
  
  if (!serverStarted) {
    console.log(`${colors.yellow}Backend health check failed, but continuing anyway...${colors.reset}`);
  }
  
  // Start the frontend
  console.log(`${colors.yellow}Starting frontend...${colors.reset}`);
  const frontendProcess = exec(
    `VITE_API_URL=http://localhost:${backendPort} npm run dev -- --port ${frontendPort} --host`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`${colors.red}Frontend error: ${error.message}${colors.reset}`);
        return;
      }
      if (stderr) {
        console.error(`${colors.red}Frontend stderr: ${stderr}${colors.reset}`);
      }
    }
  );
  
  // Print success message
  console.log(`${colors.green}Services started!${colors.reset}`);
  console.log(`${colors.green}Backend: http://localhost:${backendPort}${colors.reset}`);
  console.log(`${colors.green}Frontend: http://localhost:${frontendPort}${colors.reset}`);
  console.log(`${colors.green}Open http://localhost:${frontendPort} in your browser.${colors.reset}`);
  console.log(`${colors.yellow}Press Ctrl+C to stop all processes.${colors.reset}`);
  
  // Handle process exit
  process.on('SIGINT', () => {
    console.log(`${colors.yellow}Stopping processes...${colors.reset}`);
    killProcessesOnPorts([...backendPorts, ...frontendPorts]);
    process.exit(0);
  });
  
  // Redirect output from child processes to parent
  serverProcess.stdout.pipe(process.stdout);
  serverProcess.stderr.pipe(process.stderr);
  frontendProcess.stdout.pipe(process.stdout);
  frontendProcess.stderr.pipe(process.stderr);
}

// Run the main function
main().catch(error => {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
}); 