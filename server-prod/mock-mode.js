/**
 * Simple development server with mock data
 * 
 * This script starts the server in a development mode with:
 * - Mock subscription data enabled
 * - Authentication checks bypassed
 * - Better error handling
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting development server with mock data...');

// Environment variables for development mode
const env = {
  ...process.env,
  NODE_ENV: 'development',
  PORT: 3005,
  MOCK_SUBSCRIPTION_DATA: 'true',
  SKIP_AUTH_CHECK: 'true',
  DEBUG: 'true'
};

// Start the server process
const serverProcess = spawn('node', ['src/index.js'], {
  cwd: __dirname,
  env,
  stdio: 'inherit' // Show output in the current terminal
});

// Handle errors
serverProcess.on('error', (error) => {
  console.error(`Failed to start server: ${error.message}`);
  process.exit(1);
});

// Handle clean exit
process.on('SIGINT', () => {
  console.log('\nGracefully shutting down server...');
  serverProcess.kill('SIGTERM');
  
  // Give the server a moment to shut down gracefully
  setTimeout(() => {
    console.log('Server shutdown complete');
    process.exit(0);
  }, 2000);
});

console.log(`
Server starting in DEVELOPMENT mode with:
- Mock subscription data enabled
- Authentication checks bypassed
- Server running on port 3005

Press Ctrl+C to stop the server
`); 