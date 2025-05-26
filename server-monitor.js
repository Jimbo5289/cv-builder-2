#!/usr/bin/env node

/**
 * Server Monitor Script
 * 
 * This script monitors the CV Builder server and automatically restarts it
 * if it crashes or uses too much memory.
 */

import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import http from 'http';

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
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

// Configuration
const CONFIG = {
  checkInterval: 10000, // 10 seconds
  memoryThreshold: 2000, // 2GB in MB
  maxRestarts: 5, // Maximum number of restarts before giving up
  healthCheckUrl: 'http://localhost:3005/health',
  healthCheckTimeout: 5000, // 5 seconds
  serverPort: process.env.PORT || 3005,
  logFile: path.join(__dirname, 'server-monitor.log')
};

// Server process
let serverProcess = null;
let restartCount = 0;
let lastRestartTime = 0;

/**
 * Log a message to console and file
 * @param {string} message - Message to log
 * @param {string} level - Log level
 */
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  let colorCode = colors.reset;
  
  switch (level) {
    case 'error':
      colorCode = colors.red;
      break;
    case 'warn':
      colorCode = colors.yellow;
      break;
    case 'success':
      colorCode = colors.green;
      break;
    case 'info':
    default:
      colorCode = colors.reset;
  }
  
  const consoleMessage = `${colorCode}[${timestamp}] [${level.toUpperCase()}] ${message}${colors.reset}`;
  const fileMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  
  console.log(consoleMessage);
  fs.appendFileSync(CONFIG.logFile, fileMessage);
}

/**
 * Check if a port is in use
 * @param {number} port - Port to check
 * @returns {Promise<boolean>} True if port is in use
 */
async function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    
    server.listen(port);
  });
}

/**
 * Check server health
 * @returns {Promise<boolean>} True if server is healthy
 */
async function checkServerHealth() {
  return new Promise((resolve) => {
    const request = http.get(CONFIG.healthCheckUrl, {
      timeout: CONFIG.healthCheckTimeout
    }, (response) => {
      if (response.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    request.on('error', () => {
      resolve(false);
    });
    
    request.on('timeout', () => {
      request.destroy();
      resolve(false);
    });
  });
}

/**
 * Get memory usage of a process
 * @param {number} pid - Process ID
 * @returns {number} Memory usage in MB
 */
function getProcessMemoryUsage(pid) {
  try {
    const cmd = process.platform === 'darwin' 
      ? `ps -o rss= -p ${pid}` 
      : `ps -o rss= -p ${pid}`;
    
    const output = execSync(cmd, { encoding: 'utf8' }).trim();
    const memory = parseInt(output, 10) / 1024; // Convert KB to MB
    return memory;
  } catch (error) {
    log(`Error getting memory usage: ${error.message}`, 'error');
    return 0;
  }
}

/**
 * Start server
 */
function startServer() {
  try {
    // Check if server is already running
    if (serverProcess !== null) {
      return;
    }
    
    log('Starting server...', 'info');
    
    // Use start-reliable.js to start the server
    serverProcess = spawn('node', [
      '--max-old-space-size=4096',
      '--expose-gc',
      path.join(__dirname, 'start-reliable.js')
    ], {
      detached: false,
      stdio: 'pipe'
    });
    
    // Forward server output to console
    serverProcess.stdout.on('data', (data) => {
      process.stdout.write(data);
    });
    
    serverProcess.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
    
    // Handle server exit
    serverProcess.on('exit', (code) => {
      log(`Server exited with code ${code}`, 'error');
      serverProcess = null;
      
      // Restart server if it crashed
      if (code !== 0) {
        restartServer();
      }
    });
    
    log(`Server started with PID ${serverProcess.pid}`, 'success');
  } catch (error) {
    log(`Error starting server: ${error.message}`, 'error');
    serverProcess = null;
  }
}

/**
 * Restart server
 */
function restartServer() {
  // Check if we've restarted too many times
  const now = Date.now();
  const timeSinceLastRestart = now - lastRestartTime;
  
  // Reset restart count if it's been more than 1 hour since the last restart
  if (timeSinceLastRestart > 3600000) {
    restartCount = 0;
  }
  
  // Check if we've restarted too many times
  if (restartCount >= CONFIG.maxRestarts) {
    log(`Too many restarts (${restartCount}). Giving up.`, 'error');
    return;
  }
  
  // Update restart count and time
  restartCount++;
  lastRestartTime = now;
  
  log(`Restarting server (attempt ${restartCount}/${CONFIG.maxRestarts})...`, 'warn');
  
  // Kill any existing server processes
  try {
    execSync('lsof -ti:3005,3006,3007,3008,3009 | xargs kill -9 2>/dev/null || true', { encoding: 'utf8' });
  } catch (error) {
    // Ignore errors
  }
  
  // Wait a moment before restarting
  setTimeout(() => {
    startServer();
  }, 5000);
}

/**
 * Check server status
 */
async function checkServer() {
  // Skip if server is not running
  if (serverProcess === null) {
    log('Server is not running. Starting server...', 'warn');
    startServer();
    return;
  }
  
  // Check if process is still alive
  try {
    process.kill(serverProcess.pid, 0);
  } catch (error) {
    log('Server process is not responding. Restarting...', 'warn');
    serverProcess = null;
    restartServer();
    return;
  }
  
  // Check memory usage
  const memoryUsage = getProcessMemoryUsage(serverProcess.pid);
  log(`Server memory usage: ${memoryUsage.toFixed(2)} MB`, 'info');
  
  // Restart if memory usage is too high
  if (memoryUsage > CONFIG.memoryThreshold) {
    log(`Server memory usage is too high (${memoryUsage.toFixed(2)} MB > ${CONFIG.memoryThreshold} MB). Restarting...`, 'warn');
    
    // Kill server
    try {
      serverProcess.kill('SIGTERM');
    } catch (error) {
      log(`Error killing server: ${error.message}`, 'error');
    }
    
    serverProcess = null;
    restartServer();
    return;
  }
  
  // Check server health
  const isHealthy = await checkServerHealth();
  
  if (!isHealthy) {
    log('Server health check failed. Restarting...', 'warn');
    
    // Kill server
    try {
      serverProcess.kill('SIGTERM');
    } catch (error) {
      log(`Error killing server: ${error.message}`, 'error');
    }
    
    serverProcess = null;
    restartServer();
  }
}

/**
 * Main function
 */
async function main() {
  log('Starting server monitor...', 'info');
  
  // Check if server is already running
  const portInUse = await isPortInUse(CONFIG.serverPort);
  
  if (portInUse) {
    log(`Server is already running on port ${CONFIG.serverPort}. Monitoring...`, 'info');
  } else {
    log(`Server is not running on port ${CONFIG.serverPort}. Starting...`, 'info');
    startServer();
  }
  
  // Set up interval to check server status
  setInterval(checkServer, CONFIG.checkInterval);
  
  // Handle process exit
  process.on('SIGINT', () => {
    log('Received SIGINT. Shutting down...', 'info');
    
    if (serverProcess !== null) {
      serverProcess.kill('SIGTERM');
    }
    
    process.exit(0);
  });
}

// Run the main function
main().catch((error) => {
  log(`Unhandled error: ${error.message}`, 'error');
  process.exit(1);
}); 