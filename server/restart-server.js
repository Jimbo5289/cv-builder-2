/**
 * Server restart utility
 * 
 * This script kills any existing Node.js server processes running on ports 3005-3009
 * and starts a fresh server instance.
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration
const PORTS_TO_CHECK = [3005, 3006, 3007, 3008, 3009];
const LOG_FILE = path.join(__dirname, 'logs', 'restart.log');

// Make sure logs directory exists
if (!fs.existsSync(path.join(__dirname, 'logs'))) {
  fs.mkdirSync(path.join(__dirname, 'logs'), { recursive: true });
}

// Create or append to log file
const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  
  console.log(message);
  
  try {
    fs.appendFileSync(LOG_FILE, logMessage);
  } catch (error) {
    console.error('Error writing to log file:', error);
  }
};

log('Starting server restart process...');

// Find and kill processes on target ports
const killProcessOnPort = (port) => {
  try {
    if (os.platform() === 'win32') {
      // Windows command
      log(`Checking for process on port ${port} (Windows)`);
      const output = execSync(`netstat -ano | findstr :${port}`).toString();
      
      // Extract PID from output if it exists
      const pidMatch = output.match(/(\d+)$/m);
      if (pidMatch && pidMatch[1]) {
        const pid = pidMatch[1];
        log(`Killing process ${pid} on port ${port}`);
        execSync(`taskkill /F /PID ${pid}`);
        return true;
      }
    } else {
      // Unix/Mac command
      log(`Checking for process on port ${port} (Unix/Mac)`);
      
      // Find PID using lsof
      try {
        const output = execSync(`lsof -i :${port} -t`).toString().trim();
        if (output) {
          const pids = output.split('\n');
          pids.forEach(pid => {
            log(`Killing process ${pid} on port ${port}`);
            execSync(`kill -9 ${pid}`);
          });
          return true;
        }
      } catch (e) {
        // lsof didn't find anything, that's fine
        log(`No process found on port ${port}`);
      }
    }
    return false;
  } catch (error) {
    log(`Error checking/killing process on port ${port}: ${error.message}`);
    return false;
  }
};

// Kill any processes using our ports
PORTS_TO_CHECK.forEach(port => {
  killProcessOnPort(port);
});

// Give some time for processes to fully terminate
log('Waiting for processes to terminate...');
setTimeout(() => {
  log('Starting new server instance...');
  
  // Start the server with development environment variables
  const serverProcess = spawn('node', ['src/index.js'], {
    cwd: __dirname,
    env: { 
      ...process.env,
      PORT: 3005,
      NODE_ENV: 'development',
      MOCK_SUBSCRIPTION_DATA: 'true',
      SKIP_AUTH_CHECK: 'true'
    },
    stdio: 'inherit' // Show server output in current terminal
  });
  
  serverProcess.on('error', (error) => {
    log(`Failed to start server: ${error.message}`);
  });
  
  log('Server restart script completed');
}, 2000); 