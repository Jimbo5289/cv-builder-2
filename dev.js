/**
 * Simplified Development Starter
 * 
 * This script starts both the frontend and backend cleanly by:
 * 1. Killing any existing processes on the dev ports
 * 2. Starting the backend server
 * 3. Starting the frontend server
 */
import { spawn, exec } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Cleaning up any existing processes...');
exec('lsof -ti:3005-3010,5173-5190 | xargs kill -9 2>/dev/null || true', () => {
  // Wait a moment to ensure all processes are fully terminated
  setTimeout(() => {
    console.log('Starting backend server...');
    const backend = spawn('npm', ['run', 'server:dev'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: true
    });

    backend.on('error', (error) => {
      console.error('Failed to start backend server:', error);
    });

    // Wait a bit for the backend to initialize before starting frontend
    setTimeout(() => {
      console.log('Starting frontend server...');
      const frontend = spawn('npm', ['run', 'frontend:dev'], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true
      });

      frontend.on('error', (error) => {
        console.error('Failed to start frontend server:', error);
      });

      // Handle cleanup on process exit
      process.on('SIGINT', () => {
        console.log('Shutting down development servers...');
        backend.kill();
        frontend.kill();
        process.exit(0);
      });

    }, 3000); // Wait 3 seconds before starting frontend
  }, 1000); // Wait 1 second after killing processes
}); 