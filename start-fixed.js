#!/usr/bin/env node
/**
 * Fixed startup script for CV Builder that properly handles paths with spaces
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting CV Builder application...');

// First, create necessary environment files if they don't exist
const serverEnvPath = resolve(__dirname, 'server', '.env');
const frontendEnvPath = resolve(__dirname, '.env.local');

if (!fs.existsSync(serverEnvPath)) {
  console.log('⚠️ Server .env file not found, creating it...');
  
  const serverEnvContent = `NODE_ENV=development
PORT=3005
DISABLE_PORT_FALLBACK=true
SKIP_AUTH_CHECK=true
MOCK_SUBSCRIPTION_DATA=true
FRONTEND_URL=http://localhost:5173
JWT_SECRET=use-a-more-secure-secret-in-production
JWT_EXPIRES_IN=86400
ALLOW_SAFARI_CONNECTIONS=true
DEBUG_CORS=true
MOCK_DATABASE=true
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cvbuilder?schema=public"`;

  fs.writeFileSync(serverEnvPath, serverEnvContent);
  console.log('✅ Server .env file created');
}

if (!fs.existsSync(frontendEnvPath)) {
  console.log('⚠️ Frontend .env.local file not found, creating it...');
  
  const frontendEnvContent = `VITE_API_URL=http://localhost:3005
VITE_DEV_MODE=true
VITE_SKIP_AUTH=true`;

  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log('✅ Frontend .env.local file created');
}

// Start the backend server
console.log('Starting backend server...');
const serverProcess = spawn('node', ['src/index.js'], {
  cwd: resolve(__dirname, 'server'),
  stdio: 'inherit',
  env: {
    ...process.env,
    MOCK_DATABASE: 'true',
    SKIP_AUTH_CHECK: 'true'
  }
});

// Start the frontend Vite dev server
console.log('Starting frontend application...');
const frontendProcess = spawn('npx', ['vite'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_API_URL: 'http://localhost:3005',
    VITE_DEV_MODE: 'true'
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  serverProcess.kill();
  frontendProcess.kill();
  
  setTimeout(() => {
    console.log('✅ All processes terminated');
    process.exit(0);
  }, 1000);
});

// Log messages
console.log('\n✨ Application started successfully!');
console.log('📡 Backend running at: http://localhost:3005');
console.log('🌐 Frontend running at: http://localhost:5173');
console.log('\nPress Ctrl+C to stop all processes');
