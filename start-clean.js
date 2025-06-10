#!/usr/bin/env node

/**
 * Clean start script for development environment
 * This script kills any processes using dev ports, then starts the dev environment
 */

import { execSync, spawn } from 'child_process';
import { platform } from 'os';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration
const PORTS = [3005, 5173, 5174];

// Kill processes on specified ports
console.log('Cleaning up processes on development ports...');

// Platform-specific port cleanup
if (platform() === 'win32') {
  // Windows
  PORTS.forEach(port => {
    try {
      const output = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`).toString();
      if (output) {
        const pid = output.split(/\s+/).pop().trim();
        console.log(`Killing process ${pid} using port ${port}`);
        execSync(`taskkill /F /PID ${pid}`);
      }
    } catch (err) {
      // No process found or command failed, which is fine
      console.log(`No process found using port ${port}`);
    }
  });
} else {
  // macOS/Linux
  PORTS.forEach(port => {
    try {
      const output = execSync(`lsof -i:${port} -t`).toString();
      if (output) {
        output.split('\n').filter(Boolean).forEach(pid => {
          console.log(`Killing process ${pid} using port ${port}`);
          execSync(`kill -9 ${pid}`);
        });
      }
    } catch (err) {
      // No process found or command failed, which is fine
      console.log(`No process found using port ${port}`);
    }
  });
}

console.log('All ports should now be available');

// Start the development environment using start-dev.js
console.log('Starting development environment...');
const startDevProcess = spawn('node', ['start-dev.js'], {
  stdio: 'inherit',
  shell: true
});

startDevProcess.on('error', (err) => {
  console.error('Failed to start development environment:', err);
  process.exit(1);
}); 