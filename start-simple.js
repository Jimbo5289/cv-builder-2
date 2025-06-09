/**
 * Simple Development Environment Starter
 * 
 * This script starts both the frontend and backend separately to avoid port conflicts
 */
import { spawn, exec } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store child processes
let frontendProcess = null;
let backendProcess = null;

// Kill any existing processes on development ports
console.log('Cleaning up any existing processes...');
exec('lsof -ti:3005-3010,5173-5190 | xargs kill -9 2>/dev/null || true', () => {
  // Start backend
  console.log('Starting backend server...');
  backendProcess = spawn('npm', ['run', 'server:dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });
  
  // Start frontend after a short delay
  setTimeout(() => {
    console.log('Starting frontend server...');
    frontendProcess = spawn('npm', ['run', 'frontend:dev'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: true
    });
  }, 2000);
});

// Handle cleanup on process exit
process.on('SIGINT', () => {
  console.log('Shutting down...');
  if (frontendProcess) frontendProcess.kill();
  if (backendProcess) backendProcess.kill();
  process.exit(0);
}); 