#!/usr/bin/env node

// This script verifies that all necessary files are present in the build output
// Run this after 'npm run build' and before deploying to Vercel

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Configuration
const BUILD_DIR = path.join(decodeURIComponent(path.dirname(__filename)), 'dist');
const PUBLIC_DIR = path.join(decodeURIComponent(path.dirname(__filename)), 'public');
const REQUIRED_FILES = [
  'index.html',
  'favicon.png',
  'debug.js',
  'debug-bundle.js',
  'test.html',
  'fallback.html',
  'fallback-app.jsx',
  'fallback-react.html'
];
const REQUIRED_DIRS = [
  'assets'
];

console.log(chalk.blue('🔍 Verifying build output...'));

// Check if build directory exists
if (!fs.existsSync(BUILD_DIR)) {
  console.error(chalk.red(`❌ Build directory "${BUILD_DIR}" does not exist. Run npm run build first.`));
  process.exit(1);
}

// Check required files
const missingFiles = [];
for (const file of REQUIRED_FILES) {
  const filePath = path.join(BUILD_DIR, file);
  if (!fs.existsSync(filePath)) {
    missingFiles.push(file);
  }
}

// Check required directories
const missingDirs = [];
for (const dir of REQUIRED_DIRS) {
  const dirPath = path.join(BUILD_DIR, dir);
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    missingDirs.push(dir);
  }
}

// Check if main.jsx file is included in assets
const assetsDir = path.join(BUILD_DIR, 'assets');
let mainJsFound = false;
let reactVendorFound = false;

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  mainJsFound = files.some(file => file.includes('main') && (file.endsWith('.js') || file.endsWith('.jsx')));
  reactVendorFound = files.some(file => (file.includes('react-vendor') || file.includes('vendor')) && file.endsWith('.js'));
  
  console.log(chalk.blue(`Found ${files.length} files in assets directory:`));
  files.forEach(file => {
    console.log(`  - ${file}`);
  });
}

// Report results
if (missingFiles.length > 0) {
  console.error(chalk.red(`❌ Missing required files: ${missingFiles.join(', ')}`));
} else {
  console.log(chalk.green('✅ All required static files are present'));
}

if (missingDirs.length > 0) {
  console.error(chalk.red(`❌ Missing required directories: ${missingDirs.join(', ')}`));
} else {
  console.log(chalk.green('✅ All required directories are present'));
}

if (!mainJsFound) {
  console.error(chalk.red('❌ No main JavaScript file found in assets directory'));
} else {
  console.log(chalk.green('✅ Main JavaScript file found'));
}

if (!reactVendorFound) {
  console.warn(chalk.yellow('⚠️ No React vendor bundle found in assets directory'));
} else {
  console.log(chalk.green('✅ React vendor bundle found'));
}

// Check index.html for script references
const indexPath = path.join(BUILD_DIR, 'index.html');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Check for script tags
  const scriptTags = indexContent.match(/<script[^>]*src="[^"]*"[^>]*>/g) || [];
  console.log(chalk.blue(`Found ${scriptTags.length} script tags in index.html:`));
  scriptTags.forEach(tag => {
    console.log(`  - ${tag}`);
  });
  
  // Check for module script tags
  const moduleScripts = scriptTags.filter(tag => tag.includes('type="module"')).length;
  if (moduleScripts === 0) {
    console.warn(chalk.yellow('⚠️ No ES module script tags found in index.html'));
  } else {
    console.log(chalk.green(`✅ Found ${moduleScripts} ES module script tags`));
  }
  
  // Check for preload links
  const preloadLinks = indexContent.match(/<link[^>]*rel="preload"[^>]*>/g) || [];
  console.log(chalk.blue(`Found ${preloadLinks.length} preload links in index.html`));
}

// Copy any missing files from public
if (fs.existsSync(PUBLIC_DIR)) {
  console.log(chalk.blue('Checking for files to copy from public directory...'));
  for (const file of missingFiles) {
    const sourcePath = path.join(PUBLIC_DIR, file);
    const destPath = path.join(BUILD_DIR, file);
    
    if (fs.existsSync(sourcePath)) {
      console.log(chalk.yellow(`Copying missing file ${file} from public directory`));
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log(chalk.green(`✅ Copied ${file}`));
      } catch (err) {
        console.error(chalk.red(`❌ Failed to copy ${file}: ${err.message}`));
      }
    }
  }
}

// Final summary
if (missingFiles.length > 0 || missingDirs.length > 0 || !mainJsFound) {
  console.error(chalk.red('❌ Build verification failed. Some required files are missing.'));
  process.exit(1);
} else {
  console.log(chalk.green('✅ Build verification passed. All required files are present.'));
  process.exit(0);
}