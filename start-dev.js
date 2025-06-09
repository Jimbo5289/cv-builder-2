/**
 * Development Environment Starter
 * 
 * This script ensures a clean development environment by:
 * 1. Killing any existing processes on development ports
 * 2. Starting the backend and frontend servers in sequence
 * 3. Handling proper process cleanup on exit
 */
import { spawn, exec } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store child processes
let backendProcess = null;
let frontendProcess = null;

// Handle process exit and cleanup
const handleExit = (exitCode) => {
  console.log(`\nCleaning up resources (exit code: ${exitCode})...`);
  
  if (backendProcess) {
    try {
      process.kill(-backendProcess.pid);
      console.log('Backend process terminated');
    } catch (err) {
      // Process might already be gone
    }
  }
  
  if (frontendProcess) {
    try {
      process.kill(-frontendProcess.pid);
      console.log('Frontend process terminated');
    } catch (err) {
      // Process might already be gone
    }
  }
  
  // Kill any remaining processes on development ports
  try {
    exec('lsof -ti:3005-3010,5173-5190 | xargs kill -9 2>/dev/null || true');
  } catch (err) {
    // Ignore errors
  }
  
  process.exit(exitCode);
};

// Set up process handlers
process.on('SIGINT', () => handleExit(0));
process.on('SIGTERM', () => handleExit(0));
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  handleExit(1);
});

// Kill any existing processes on development ports
console.log('Checking for running processes on development ports...');
exec('lsof -ti:3005-3010,5173-5190 | xargs kill -9 2>/dev/null || true', (error) => {
  // Wait a bit for ports to be released
  setTimeout(() => {
    console.log('🚀 Starting development environment...');
    
    // Start backend
    console.log('🚀 Starting backend on port 3005...');
    backendProcess = spawn('npm', ['run', 'server:dev'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: true,
      detached: true
    });
    
    backendProcess.on('error', (error) => {
      console.error('Backend process error:', error);
    });
    
    // Start frontend after a short delay to ensure backend is running
    setTimeout(() => {
      console.log('🌐 Starting frontend on port 5173...');
      frontendProcess = spawn('npm', ['run', 'frontend:dev'], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true,
        detached: true
      });
      
      frontendProcess.on('error', (error) => {
        console.error('Frontend process error:', error);
      });
      
      console.log('✅ Development environment is running!');
      console.log('Frontend: http://localhost:5173');
      console.log('Backend: http://localhost:3005');
      console.log('Press Ctrl+C to stop all servers');
    }, 3000); // Wait 3 seconds before starting frontend
  }, 1000); // Wait 1 second after killing processes
}); 