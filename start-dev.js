#!/usr/bin/env node

/**
 * Start script for development environment
 * This script launches both frontend and backend in parallel
 */

import { execSync, spawn } from 'child_process';
import { platform } from 'os';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration
const BACKEND_PORT = 3005;
const FRONTEND_PORT = 5173;

// Check for running processes on development ports
console.log('Checking for running processes on development ports...');
try {
  if (platform() === 'win32') {
    // Windows
    try {
      execSync(`netstat -ano | findstr :${BACKEND_PORT} | findstr LISTENING`);
      console.log(`Warning: Port ${BACKEND_PORT} is already in use.`);
    } catch (err) {
      // No process found, which is good
    }
    
    try {
      execSync(`netstat -ano | findstr :${FRONTEND_PORT} | findstr LISTENING`);
      console.log(`Warning: Port ${FRONTEND_PORT} is already in use.`);
    } catch (err) {
      // No process found, which is good
    }
  } else {
    // macOS/Linux
    try {
      execSync(`lsof -i:${BACKEND_PORT} -t`);
      console.log(`Warning: Port ${BACKEND_PORT} is already in use.`);
    } catch (err) {
      // No process found, which is good
    }
    
    try {
      execSync(`lsof -i:${FRONTEND_PORT} -t`);
      console.log(`Warning: Port ${FRONTEND_PORT} is already in use.`);
    } catch (err) {
      // No process found, which is good
    }
  }
} catch (err) {
  console.error('Error checking ports:', err.message);
}

// Start the development environment
console.log('🚀 Starting development environment...');

// Start backend
console.log(`🚀 Starting backend on port ${BACKEND_PORT}...`);
const serverProcess = spawn('npm', ['run', 'server:dev'], {
  stdio: 'inherit',
  shell: true
});

// Start frontend
console.log(`🌐 Starting frontend on port ${FRONTEND_PORT}...`);
const frontendProcess = spawn('npm', ['run', 'frontend:dev'], {
  stdio: 'inherit',
  shell: true
});

// Success message
console.log('✅ Development environment is running!');
console.log(`Frontend: http://localhost:${FRONTEND_PORT}`);
console.log(`Backend: http://localhost:${BACKEND_PORT}`);
console.log('Press Ctrl+C to stop all servers');

// Handle process termination
const cleanup = (code) => {
  console.log(`\nCleaning up resources (exit code: ${code})...`);
  
  if (serverProcess) {
    console.log('Backend process terminated');
    serverProcess.kill();
  }
  
  if (frontendProcess) {
    console.log('Frontend process terminated');
    frontendProcess.kill();
  }
  
  process.exit(code);
};

// Register cleanup on process termination
process.on('SIGINT', () => cleanup(0));
process.on('SIGTERM', () => cleanup(0));
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  cleanup(1);
}); 