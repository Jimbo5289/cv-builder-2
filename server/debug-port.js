/**
 * Port debugging script for Render deployment
 * This script will help diagnose "No open HTTP ports detected" issues
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Get the PORT from environment or use default
const PORT = process.env.PORT || 3005;
console.log(`[DEBUG] Using PORT: ${PORT}`);

// Create a simple HTTP server that responds to health checks
const server = http.createServer((req, res) => {
  console.log(`[DEBUG] Received request: ${req.method} ${req.url}`);
  
  // Simple health check endpoints
  if (req.url === '/health' || req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      port: PORT,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      render: process.env.RENDER ? true : false
    }));
    return;
  }
  
  // Default response
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`Debug server running on port ${PORT}\n`);
});

// Create a log directory if it doesn't exist
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Log file for port information
const logFile = path.join(logDir, 'port-debug.log');

// Write initial information to log
fs.writeFileSync(
  logFile,
  JSON.stringify({
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV || 'unknown',
    render: process.env.RENDER ? true : false,
    env: process.env
  }, null, 2)
);

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  const message = `[DEBUG] Server listening on 0.0.0.0:${PORT}`;
  console.log(message);
  
  // Append to log file
  fs.appendFileSync(logFile, `\n${message}`);
  
  // Log again after a delay to help Render detect the port
  setTimeout(() => {
    const delayedMessage = `[DEBUG] Server still listening on 0.0.0.0:${PORT} (delayed log)`;
    console.log(delayedMessage);
    fs.appendFileSync(logFile, `\n${delayedMessage}`);
  }, 2000);
});

// Handle errors
server.on('error', (err) => {
  const errorMessage = `[ERROR] Server error: ${err.message}`;
  console.error(errorMessage);
  fs.appendFileSync(logFile, `\n${errorMessage}`);
  
  if (err.code === 'EADDRINUSE') {
    console.error(`[ERROR] Port ${PORT} is already in use`);
    fs.appendFileSync(logFile, `\n[ERROR] Port ${PORT} is already in use`);
  }
});

// Add a health check that's sent immediately and periodically
const checkHealth = () => {
  const options = {
    hostname: 'localhost',
    port: PORT,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    const status = `[DEBUG] Health check status: ${res.statusCode}`;
    console.log(status);
    fs.appendFileSync(logFile, `\n${status}`);
  });

  req.on('error', (e) => {
    const errorMsg = `[ERROR] Health check failed: ${e.message}`;
    console.error(errorMsg);
    fs.appendFileSync(logFile, `\n${errorMsg}`);
  });

  req.end();
};

// Run health check after server starts
setTimeout(checkHealth, 3000);
// Then run health check every 30 seconds
setInterval(checkHealth, 30000);

console.log(`[DEBUG] Debug information is being logged to ${logFile}`); 