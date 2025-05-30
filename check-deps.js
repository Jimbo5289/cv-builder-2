#!/usr/bin/env node

// This script checks for and installs missing dependencies

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define required packages that might not be in package.json
const REQUIRED_PACKAGES = [
  'chalk@4.1.2',
  'cross-env@7.0.3'
];

console.log('🔍 Checking for missing dependencies...');

// Read package.json
const packageJsonPath = path.join(__dirname, 'package.json');
let packageJson;

try {
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  packageJson = JSON.parse(packageJsonContent);
} catch (error) {
  console.error(`❌ Error reading package.json: ${error.message}`);
  process.exit(1);
}

// Combine dependencies and devDependencies
const allDependencies = {
  ...(packageJson.dependencies || {}),
  ...(packageJson.devDependencies || {})
};

// Check which required packages are missing
const missingPackages = REQUIRED_PACKAGES.filter(pkg => {
  const packageName = pkg.split('@')[0];
  return !allDependencies[packageName];
});

if (missingPackages.length === 0) {
  console.log('✅ All required dependencies are installed.');
  process.exit(0);
}

// Install missing packages
console.log(`Installing missing dependencies: ${missingPackages.join(', ')}`);

try {
  execSync(`npm install --save-dev ${missingPackages.join(' ')}`, {
    stdio: 'inherit'
  });
  console.log('✅ Successfully installed missing dependencies.');
} catch (error) {
  console.error(`❌ Error installing dependencies: ${error.message}`);
  process.exit(1);
} 