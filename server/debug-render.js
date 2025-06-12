/**
 * Debug script for Render port binding issues
 * This script explicitly binds to the PORT environment variable on 0.0.0.0
 * to test if Render can detect the service
 */

const http = require('http');
const net = require('net');
const { exec } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

// Get the PORT from environment or use default
const PORT = process.env.PORT || 3005;

// Create log directory if it doesn't exist
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Log file for debugging
const logFile = path.join(logDir, 'debug-render.log');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Helper to log to both console and file
function log(message) {
  const timestamp = new Date().toISOString();
  const formattedMessage = `${timestamp} - ${message}`;
  console.log(formattedMessage);
  logStream.write(formattedMessage + '\n');
}

// Log system information
log('=========== RENDER DEBUG SCRIPT ===========');
log(`Running on: ${os.hostname()}`);
log(`Platform: ${os.platform()} ${os.release()}`);
log(`Node version: ${process.version}`);
log(`PORT: ${PORT}`);
log(`Environment: ${process.env.NODE_ENV || 'not set'}`);
log(`Render: ${process.env.RENDER ? 'yes' : 'no'}`);

// Check network interfaces
log('Network Interfaces:');
const interfaces = os.networkInterfaces();
Object.keys(interfaces).forEach(ifname => {
  interfaces[ifname].forEach(iface => {
    if (iface.family === 'IPv4') {
      log(`  ${ifname}: ${iface.address}`);
    }
  });
});

// Create a simple server that responds on all routes
const server = http.createServer((req, res) => {
  log(`Received request: ${req.method} ${req.url}`);
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  
  // Return diagnostic information
  const response = {
    message: 'Render debug server is running',
    time: new Date().toISOString(),
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers
    },
    server: {
      port: PORT,
      hostname: os.hostname(),
      interfaces: interfaces
    },
    environment: {
      PORT: process.env.PORT,
      NODE_ENV: process.env.NODE_ENV,
      RENDER: process.env.RENDER
    }
  };
  
  res.end(JSON.stringify(response, null, 2));
});

// Test if the port is already in use
const testSocket = net.createServer()
  .once('error', err => {
    if (err.code === 'EADDRINUSE') {
      log(`❌ ERROR: Port ${PORT} is already in use!`);
      // Try to get info about what's using the port
      if (os.platform() !== 'win32') {
        try {
          log('Attempting to identify process using this port:');
          exec(`lsof -i :${PORT}`, (error, stdout) => {
            if (error) {
              log(`  Error running lsof: ${error.message}`);
            } else {
              log(`  ${stdout}`);
            }
            process.exit(1);
          });
        } catch (e) {
          log(`  Error checking port usage: ${e.message}`);
          process.exit(1);
        }
      } else {
        process.exit(1);
      }
    } else {
      log(`❌ ERROR: ${err.message}`);
      process.exit(1);
    }
  })
  .once('listening', () => {
    testSocket.close(() => {
      // Port is available, start our server
      server.listen(PORT, '0.0.0.0', () => {
        log(`✅ Server successfully bound to 0.0.0.0:${PORT}`);
        log('Try accessing the following URLs:');
        log(`  - http://localhost:${PORT}`);
        log(`  - http://127.0.0.1:${PORT}`);
        log(`  - http://0.0.0.0:${PORT}`);
        
        // Keep the server running for a while to test Render
        const TIMEOUT = 60 * 60 * 1000; // 1 hour
        log(`Server will remain running for up to ${TIMEOUT/1000/60} minutes for testing`);
        
        // Set up a periodic heartbeat to verify the server is still running
        const heartbeatInterval = setInterval(() => {
          const uptime = process.uptime();
          log(`❤️ Server heartbeat: running for ${Math.floor(uptime)} seconds`);
        }, 30000); // Every 30 seconds
        
        // Set a timeout to eventually shut down
        setTimeout(() => {
          log('Timeout reached, shutting down debug server');
          clearInterval(heartbeatInterval);
          server.close(() => {
            log('Server closed');
            process.exit(0);
          });
        }, TIMEOUT);
      });
    });
  })
  .listen(PORT); 