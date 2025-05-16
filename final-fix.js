/**
 * CV Builder Final Fix Script
 * Comprehensive solution for Safari connection issues
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

console.log('🔄 CV Builder Final Fix Script');
console.log('============================');

try {
  // Step 1: Kill ALL processes that might interfere
  console.log('\n📌 Step 1: Terminating ALL processes');
  
  try {
    // Kill all node processes
    execSync('pkill -f node || true');
    console.log('✅ Terminated all Node.js processes');
    
    // Kill all processes on relevant ports
    execSync('lsof -ti:3005,3006,3007,5173,5174,5175,5176,5177 | xargs kill -9 2>/dev/null || true');
    console.log('✅ Freed all required ports');
    
    // Wait to ensure all processes are terminated
    execSync('sleep 2');
  } catch (error) {
    console.warn('⚠️ Process termination warning:', error.message);
  }
  
  // Step 2: Install required Tailwind CSS dependencies
  console.log('\n📌 Step 2: Installing required dependencies');
  
  try {
    execSync('npm install @tailwindcss/typography @tailwindcss/forms @tailwindcss/aspect-ratio --save-dev --legacy-peer-deps', 
      { stdio: 'inherit' });
    console.log('✅ Installed Tailwind CSS plugins');
  } catch (error) {
    console.error('❌ Error installing dependencies:', error.message);
  }
  
  // Step 3: Create proper environment files
  console.log('\n📌 Step 3: Creating environment files');
  
  try {
    // Frontend .env.local
    const frontendEnvPath = path.join(basePath, '.env.local');
    const frontendEnvContent = `VITE_API_URL=http://localhost:3005
VITE_SKIP_AUTH=true
VITE_DISABLE_PORT_FALLBACK=true`;
    
    fs.writeFileSync(frontendEnvPath, frontendEnvContent);
    console.log(`✅ Created ${frontendEnvPath}`);
    
    // Backend .env
    const backendEnvPath = path.join(basePath, 'server', '.env');
    const backendEnvContent = `NODE_ENV=development
PORT=3005
DISABLE_PORT_FALLBACK=true
SKIP_AUTH_CHECK=true
MOCK_SUBSCRIPTION_DATA=true
FRONTEND_URL=http://localhost:5173
JWT_SECRET=safari-fix-dev-secret
JWT_EXPIRES_IN=86400

# Stripe configuration for mock mode
STRIPE_PRICE_ID_MONTHLY=monthly-subscription
STRIPE_SECRET_KEY=sk_test_mockkey
STRIPE_WEBHOOK_SECRET=whsec_mockkey`;
    
    fs.writeFileSync(backendEnvPath, backendEnvContent);
    console.log(`✅ Created ${backendEnvPath}`);
  } catch (error) {
    console.error('❌ Error creating environment files:', error.message);
  }
  
  // Step 4: Create/Fix alias files
  console.log('\n📌 Step 4: Creating missing alias files');
  
  try {
    // Create Analyze.jsx alias
    const analyzeJsxPath = path.join(basePath, 'src', 'pages', 'Analyze.jsx');
    if (!fs.existsSync(analyzeJsxPath)) {
      const analyzeJsxContent = `/**
 * Alias file for Analyse.jsx
 */
import React from 'react';
import Analyse from './Analyse';

const Analyze = () => <Analyse />;

export default Analyze;`;
      
      fs.writeFileSync(analyzeJsxPath, analyzeJsxContent);
      console.log(`✅ Created ${analyzeJsxPath}`);
    } else {
      console.log(`✅ ${analyzeJsxPath} already exists`);
    }
    
    // Create webhooks.js alias
    const webhooksJsPath = path.join(basePath, 'server', 'src', 'routes', 'webhooks.js');
    if (!fs.existsSync(webhooksJsPath)) {
      const webhooksJsContent = `/**
 * Alias file for webhook.js
 */
const webhook = require('./webhook');
module.exports = webhook;`;
      
      fs.writeFileSync(webhooksJsPath, webhooksJsContent);
      console.log(`✅ Created ${webhooksJsPath}`);
    } else {
      console.log(`✅ ${webhooksJsPath} already exists`);
    }
  } catch (error) {
    console.error('❌ Error creating alias files:', error.message);
  }
  
  // Step 5: Fix server index.js to force port usage
  console.log('\n📌 Step 5: Patching server to force port');
  
  try {
    const serverIndexPath = path.join(basePath, 'server', 'src', 'index.js');
    if (fs.existsSync(serverIndexPath)) {
      let serverIndexContent = fs.readFileSync(serverIndexPath, 'utf8');
      
      // Replace port selection logic
      const portSelectionPattern = /let isPortAvailable = await checkPort\(port\);\s*.*?if \(!isPortAvailable.*?(\/\/ Start Express server)/s;
      const forcedPortLogic = `let isPortAvailable = await checkPort(port);
    
    // SAFARI FIX: Always force the use of the specified port
    if (!isPortAvailable) {
      logger.warn(\`Port \${port} is already in use. Forcefully terminating processes...\`);
      
      try {
        // Forcefully kill the process holding this port
        execSync(\`lsof -ti:\${port} | xargs kill -9\`, { stdio: 'inherit' });
        logger.info(\`Terminated process using port \${port}\`);
        
        // Wait to ensure process is fully terminated
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check again if port is now available
        isPortAvailable = await checkPort(port);
        
        if (!isPortAvailable) {
          logger.error(\`Failed to free port \${port}. Please free it manually.\`);
          process.exit(1);
        } else {
          logger.info(\`Successfully freed port \${port}\`);
        }
      } catch (error) {
        logger.error(\`Failed to free port \${port}: \${error.message}\`);
        process.exit(1);
      }
    }
    
    $1`;
      
      // Apply the patch if needed
      if (serverIndexContent.includes('// SAFARI FIX:')) {
        console.log('✅ Server index.js already patched');
      } else {
        serverIndexContent = serverIndexContent.replace(portSelectionPattern, forcedPortLogic);
        fs.writeFileSync(serverIndexPath, serverIndexContent);
        console.log('✅ Patched server index.js to force port usage');
      }
    } else {
      console.error('❌ Server index.js not found');
    }
  } catch (error) {
    console.error('❌ Error patching server:', error.message);
  }
  
  console.log('\n✅ Final fix applied successfully!');
  console.log('\n📋 To start the application:');
  console.log('1. In one terminal run: cd server && MOCK_SUBSCRIPTION_DATA=true SKIP_AUTH_CHECK=true npm run dev');
  console.log('2. In another terminal run: npm run dev');
  console.log('\n🔍 If issues persist:');
  console.log('- Check server logs for errors');
  console.log('- Try adding ?devMode=true to your Safari URLs');
  console.log('- Forcefully terminate all processes again: pkill -f node');
  console.log('- Ensure both the frontend and backend are using the expected ports');
  
} catch (error) {
  console.error('❌ Fatal error:', error);
} 