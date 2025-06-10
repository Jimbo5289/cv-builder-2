#!/usr/bin/env node

/**
 * Simple script to kill any process using ports 3005, 5173, or 5174
 */

import { execSync } from 'child_process';
import { platform } from 'os';

const PORTS = [3005, 5173, 5174];

function killProcessOnPort(port) {
  try {
    console.log(`Checking for processes on port ${port}...`);
    
    if (platform() === 'win32') {
      // Windows
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
    } else {
      // macOS/Linux
      try {
        const pid = execSync(`lsof -t -i :${port}`).toString().trim();
        if (pid) {
          console.log(`Killing process ${pid} using port ${port}`);
          execSync(`kill -9 ${pid}`);
        }
      } catch (err) {
        // No process found or command failed, which is fine
        console.log(`No process found using port ${port}`);
      }
    }
    
    console.log(`Port ${port} is now available`);
  } catch (error) {
    console.error(`Error handling port ${port}:`, error.message);
  }
}

// Kill processes on all specified ports
PORTS.forEach(port => killProcessOnPort(port));

console.log('All ports should now be available'); 