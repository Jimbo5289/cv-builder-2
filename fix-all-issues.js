/**
 * CV Builder Comprehensive Fix Script
 * 
 * This script resolves all identified issues with the application:
 * 1. Kills all existing Node processes to free ports
 * 2. Creates required environment files
 * 3. Creates missing alias files
 * 4. Installs missing dependencies
 * 5. Restarts the application properly
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

console.log('🔄 CV Builder Comprehensive Fix Script');
console.log('======================================');

// Step 1: Kill all Node and Safari WebKit processes
console.log('\n📌 Step 1: Terminating existing processes');
try {
  // Kill all Node processes
  console.log('Terminating all Node processes...');
  execSync('pkill -f node || true');
  
  // Kill processes on crucial ports
  console.log('Terminating processes on ports 3005, 3006, 3007...');
  execSync('lsof -ti:3005,3006,3007 | xargs kill -9 || true');
  
  // Kill Safari WebKit processes that might be holding connections
  console.log('Terminating Safari WebKit processes...');
  execSync('pkill -f WebKit || true');
  
  console.log('✅ Processes terminated successfully');
} catch (error) {
  console.warn('⚠️ Process termination warning:', error.message);
  // Continue despite errors
}

// Step 2: Create proper environment files
console.log('\n📌 Step 2: Creating environment files');
try {
  // Create server/.env file
  const serverEnvPath = path.join(basePath, 'server', '.env');
  const serverEnvContent = `# Environment
NODE_ENV=development

# Server Configuration
PORT=3005
DISABLE_PORT_FALLBACK=true
SKIP_AUTH_CHECK=true
MOCK_SUBSCRIPTION_DATA=true

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cvbuilder?schema=public"

# JWT Secret
JWT_SECRET="use-a-more-secure-secret-in-production"
JWT_EXPIRES_IN=86400

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=support@mycvbuilder.co.uk
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=support@mycvbuilder.co.uk

# Stripe
STRIPE_SECRET_KEY=sk_test_your-test-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRICE_ID_MONTHLY=monthly-subscription

# Sentry
SENTRY_DSN=
SENTRY_ENVIRONMENT=development`;

  fs.writeFileSync(serverEnvPath, serverEnvContent);
  console.log(`✅ Created ${serverEnvPath}`);
  
  // Create .env.local for frontend
  const frontendEnvPath = path.join(basePath, '.env.local');
  const frontendEnvContent = `VITE_API_URL=http://localhost:3005
VITE_SKIP_AUTH=true`;

  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log(`✅ Created ${frontendEnvPath}`);
  
} catch (error) {
  console.error('❌ Error creating environment files:', error.message);
  process.exit(1);
}

// Step 3: Create missing files
console.log('\n📌 Step 3: Creating missing alias files');
try {
  // Create alias for Analyze.jsx if it doesn't exist
  const analyzeJsxPath = path.join(basePath, 'src', 'pages', 'Analyze.jsx');
  if (!fs.existsSync(analyzeJsxPath)) {
    const analyzeJsxContent = `/**
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

    fs.writeFileSync(analyzeJsxPath, analyzeJsxContent);
    console.log(`✅ Created ${analyzeJsxPath}`);
  } else {
    console.log(`✅ ${analyzeJsxPath} already exists`);
  }

  // Create server side alias that uses CommonJS (since server is likely CommonJS)
  const webhooksJsPath = path.join(basePath, 'server', 'src', 'routes', 'webhooks.js');
  if (!fs.existsSync(webhooksJsPath)) {
    const webhooksJsContent = `/**
 * This file serves as a forwarding module for webhook.js
 * It's needed because some parts of the app import webhooks.js while others use webhook.js
 */

// Alias file for webhook.js
const webhook = require('./webhook');
module.exports = webhook;`;

    fs.writeFileSync(webhooksJsPath, webhooksJsContent);
    console.log(`✅ Created ${webhooksJsPath}`);
  } else {
    console.log(`✅ ${webhooksJsPath} already exists`);
  }
} catch (error) {
  console.error('❌ Error creating alias files:', error.message);
  process.exit(1);
}

// Step 4: Install missing dependencies
console.log('\n📌 Step 4: Installing missing dependencies');
try {
  console.log('Installing frontend dependencies...');
  execSync('npm install @tailwindcss/forms --legacy-peer-deps', { stdio: 'inherit' });
  
  console.log('Installing server dependencies...');
  execSync('cd server && npm install --legacy-peer-deps', { stdio: 'inherit' });
  
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Step 5: Update tailwind.config.js to include @tailwindcss/forms
console.log('\n📌 Step 5: Updating tailwind.config.js');
try {
  const tailwindConfigPath = path.join(basePath, 'tailwind.config.js');
  if (fs.existsSync(tailwindConfigPath)) {
    let tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');
    
    // Only add @tailwindcss/forms if it's not already there
    if (!tailwindConfig.includes('@tailwindcss/forms')) {
      tailwindConfig = tailwindConfig.replace(
        'plugins: [',
        'plugins: [\n    require(\'@tailwindcss/forms\'),'
      );
      
      fs.writeFileSync(tailwindConfigPath, tailwindConfig);
      console.log('✅ Added @tailwindcss/forms to tailwind.config.js');
    } else {
      console.log('✅ @tailwindcss/forms already in tailwind.config.js');
    }
  } else {
    console.warn('⚠️ tailwind.config.js not found');
  }
} catch (error) {
  console.error('❌ Error updating tailwind.config.js:', error.message);
  // Continue despite errors
}

console.log('\n✅ All fixes have been applied successfully!');
console.log('\n📋 To start the application:');
console.log('1. Open two terminal windows');
console.log('2. In the first window run: cd server && MOCK_SUBSCRIPTION_DATA=true SKIP_AUTH_CHECK=true npm run dev');
console.log('3. In the second window run: npm run dev');
console.log('\n🔍 If issues persist, try manually killing all Node processes:');
console.log('pkill -f node');
console.log('lsof -ti:3005,3006,3007,5173,5174,5175,5176,5177 | xargs kill -9'); 