/**
 * Reliable Server Starter
 * 
 * Ensures the server starts with a consistent, available port
 * and properly cleans up resources on shutdown.
 */
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import * as portManager from '../scripts/port-manager.js';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Capture process termination signals
const signals = ['SIGINT', 'SIGTERM', 'SIGHUP'];
let serverProcess = null;

/**
 * Start the server with the assigned port
 */
async function startServer() {
  try {
    // Get an available port for the backend
    const port = await portManager.getServicePort('backend');
    console.log(`\n🚀 Starting server on port ${port}...\n`);
    
    // Set environment variable for the server
    const env = { ...process.env, PORT: port.toString() };
    
    // Start the server as a child process
    serverProcess = spawn('node', ['src/index.js'], { 
      cwd: __dirname,
      stdio: 'inherit',
      env
    });
    
    // Handle server process events
    serverProcess.on('error', (err) => {
      console.error('Failed to start server:', err);
      cleanup();
      process.exit(1);
    });
    
    serverProcess.on('exit', (code) => {
      console.log(`Server process exited with code ${code}`);
      cleanup();
      process.exit(code || 0);
    });
    
  } catch (error) {
    console.error('Error starting server:', error);
    cleanup();
    process.exit(1);
  }
}

/**
 * Clean up resources and release port
 */
function cleanup() {
  console.log('\nCleaning up resources...');
  
  // Release the port
  portManager.releasePort('backend');
  
  // Kill the server process if it's running
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill();
  }
}

// Set up signal handlers for graceful shutdown
signals.forEach(signal => {
  process.on(signal, () => {
    console.log(`\nReceived ${signal}, shutting down...`);
    cleanup();
    process.exit(0);
  });
});

// Start the server
startServer().catch(err => {
  console.error('Unhandled error:', err);
  cleanup();
  process.exit(1);
}); 