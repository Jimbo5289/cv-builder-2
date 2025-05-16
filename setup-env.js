import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

// Kill all running processes
console.log('Terminating existing processes...');
try {
  execSync('pkill -f node || true');
  execSync('lsof -ti:3005,3006,3007,5173,5174,5175,5176,5177 | xargs kill -9 2>/dev/null || true');
  console.log('✅ All processes terminated');
} catch (err) {
  console.log('⚠️ Could not terminate all processes', err.message);
}

// Create server environment file
console.log('Creating server environment file...');
const serverEnvContent = `NODE_ENV=development
PORT=3005
DISABLE_PORT_FALLBACK=true
SKIP_AUTH_CHECK=true
MOCK_SUBSCRIPTION_DATA=true
FRONTEND_URL=http://localhost:5173
JWT_SECRET=use-a-more-secure-secret-in-production
JWT_EXPIRES_IN=86400
ALLOW_SAFARI_CONNECTIONS=true
DEBUG_CORS=true`;

try {
  writeFileSync('./server/.env', serverEnvContent);
  console.log('✅ Server environment file created');
} catch (err) {
  console.log('⚠️ Could not create server environment file', err.message);
}

// Create frontend environment file
console.log('Creating frontend environment file...');
const frontendEnvContent = `VITE_API_URL=http://localhost:3005
VITE_DEV_MODE=true`;

try {
  writeFileSync('./.env.local', frontendEnvContent);
  console.log('✅ Frontend environment file created');
} catch (err) {
  console.log('⚠️ Could not create frontend environment file', err.message);
}

// Ensure all needed modules are installed
console.log('Installing necessary modules...');
try {
  execSync('npm install react-hot-toast --save --legacy-peer-deps', { stdio: 'inherit' });
  console.log('✅ react-hot-toast installed');
} catch (err) {
  console.log('⚠️ Could not install react-hot-toast', err.message);
}

// Ensure the Analyze.jsx file exists (as an alias for Analyse.jsx)
console.log('Ensuring all required files exist...');
const analyzeContent = `/**
 * This file serves as an alias for Analyse.jsx to fix import path inconsistencies
 * Some components reference Analyze.jsx while the actual implementation is in Analyse.jsx
 */

import React from 'react';
import Analyse from './Analyse';

// This component is an alias for Analyse.jsx to prevent import errors
const Analyze = () => {
  return <Analyse />;
};

export default Analyze;`;

try {
  writeFileSync('./src/pages/Analyze.jsx', analyzeContent);
  console.log('✅ Analyze.jsx alias created');
} catch (err) {
  console.log('⚠️ Could not create Analyze.jsx', err.message);
}

// Make sure webhooks.js exists if it's referenced but missing
const webhooksContent = `/**
 * This file serves as an alias for webhook.js to fix import path inconsistencies
 */

// Import the actual webhook handler
const webhook = require('./webhook');

// Export it directly
module.exports = webhook;`;

try {
  // Check if webhook.js exists first
  if (existsSync('./server/src/routes/webhook.js') && !existsSync('./server/src/routes/webhooks.js')) {
    writeFileSync('./server/src/routes/webhooks.js', webhooksContent);
    console.log('✅ webhooks.js alias created');
  }
} catch (err) {
  console.log('⚠️ Could not create webhooks.js', err.message);
}

console.log('\n🎉 Setup complete! You can now start the application:');
console.log('- Start server: cd server && npm run dev');
console.log('- Start frontend: npm run dev'); 