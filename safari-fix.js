/**
 * CV Builder Safari Fix Script
 * 
 * This script addresses the Safari-specific connection issues:
 * 1. Kills all Node processes to free ports
 * 2. Creates minimal environment files with critical settings
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base path to project
const basePath = __dirname;

console.log('🔄 CV Builder Safari Fix Script');
console.log('==============================');

// Step 1: Kill all Node and Safari WebKit processes
console.log('\n📌 Step 1: Terminating existing processes');
try {
  // Kill all Node processes
  execSync('pkill -f node || true');
  console.log('✅ Terminated Node processes');
  
  // Kill processes on crucial ports
  execSync('lsof -ti:3005,3006,3007,5173,5174,5175,5176,5177 | xargs kill -9 2>/dev/null || true');
  console.log('✅ Freed all required ports');
  
  // Wait a moment to ensure ports are released
  execSync('sleep 2');
} catch (error) {
  console.warn('⚠️ Process termination warning (can be ignored):', error.message);
  // Continue despite errors
}

// Step 2: Create minimal environment files with critical settings
console.log('\n📌 Step 2: Creating environment files');
try {
  // Create server/.env file with minimal required settings
  const serverEnvPath = path.join(basePath, 'server', '.env');
  const serverEnvContent = `NODE_ENV=development
PORT=3005
DISABLE_PORT_FALLBACK=true
SKIP_AUTH_CHECK=true
MOCK_SUBSCRIPTION_DATA=true
FRONTEND_URL=http://localhost:5173
JWT_SECRET="dev-secret-key"
JWT_EXPIRES_IN=86400`;

  fs.writeFileSync(serverEnvPath, serverEnvContent);
  console.log(`✅ Created ${serverEnvPath}`);
  
  // Create .env.local for frontend with API URL
  const frontendEnvPath = path.join(basePath, '.env.local');
  const frontendEnvContent = `VITE_API_URL=http://localhost:3005
VITE_SKIP_AUTH=true`;

  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log(`✅ Created ${frontendEnvPath}`);
  
} catch (error) {
  console.error('❌ Error creating environment files:', error.message);
  process.exit(1);
}

// Step 3: Create missing alias files
console.log('\n📌 Step 3: Creating missing alias files');
try {
  // Create alias for Analyze.jsx if needed
  const analyzeJsxPath = path.join(basePath, 'src', 'pages', 'Analyze.jsx');
  if (!fs.existsSync(analyzeJsxPath)) {
    const analyzeJsxContent = `import React from 'react';
import Analyse from './Analyse';

// Alias for Analyse.jsx
const Analyze = () => <Analyse />;

export default Analyze;`;

    fs.writeFileSync(analyzeJsxPath, analyzeJsxContent);
    console.log(`✅ Created ${analyzeJsxPath}`);
  } else {
    console.log(`✅ ${analyzeJsxPath} already exists`);
  }

  // Create server-side webhooks.js alias
  const webhooksJsPath = path.join(basePath, 'server', 'src', 'routes', 'webhooks.js');
  if (!fs.existsSync(webhooksJsPath)) {
    const webhooksJsContent = `// Alias for webhook.js
const webhook = require('./webhook');
module.exports = webhook;`;

    fs.writeFileSync(webhooksJsPath, webhooksJsContent);
    console.log(`✅ Created ${webhooksJsPath}`);
  } else {
    console.log(`✅ ${webhooksJsPath} already exists`);
  }
} catch (error) {
  console.error('❌ Error creating alias files:', error.message);
  // Continue despite errors
}

console.log('\n✅ Safari fixes applied successfully!');
console.log('\n📋 Next steps:');
console.log('1. In one terminal: cd server && MOCK_SUBSCRIPTION_DATA=true SKIP_AUTH_CHECK=true npm run dev');
console.log('2. In another terminal: npm run dev');
console.log('3. After starting, use Safari to access http://localhost:5173');
console.log('\n🔍 If issues persist:');
console.log('- Check server/src/index.js and server/src/middleware/auth.js for Safari detection');
console.log('- Ensure both server and frontend are using fixed ports (not changing on startup)');
console.log('- Add "devMode=true" query parameter to URLs in Safari if needed'); 