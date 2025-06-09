/**
 * Enhanced frontend startup script
 * This script ensures all dependencies are installed and properly loaded before starting the frontend
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📋 Checking frontend dependencies...');

// Define required dependencies
const requiredDeps = [
  '@stripe/stripe-js',
  'pdfmake'
];

// Function to check if a module is installed and accessible
function isModuleAccessible(moduleName) {
  try {
    const resolvedPath = require.resolve(moduleName, { paths: [process.cwd()] });
    return !!resolvedPath;
  } catch (err) {
    return false;
  }
}

// Check and install missing dependencies
const missingDeps = requiredDeps.filter(dep => !isModuleAccessible(dep));
if (missingDeps.length > 0) {
  console.log(`⚠️  Missing dependencies: ${missingDeps.join(', ')}`);
  console.log('📦 Installing missing dependencies...');
  try {
    execSync(`npm install ${missingDeps.join(' ')}`, { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (err) {
    console.error('❌ Failed to install dependencies:', err.message);
    process.exit(1);
  }
}

// Fix pdfmake/vfs_fonts path issues if needed
const pdfmakeBuildDir = path.join(process.cwd(), 'node_modules/pdfmake/build');
if (fs.existsSync(pdfmakeBuildDir)) {
  if (!fs.existsSync(path.join(pdfmakeBuildDir, 'vfs_fonts.js'))) {
    console.log('⚠️  pdfmake/build/vfs_fonts.js not found, attempting to fix...');
    try {
      // Copy from examples if available
      if (fs.existsSync(path.join(process.cwd(), 'node_modules/pdfmake/examples/fonts/vfs_fonts.js'))) {
        fs.copyFileSync(
          path.join(process.cwd(), 'node_modules/pdfmake/examples/fonts/vfs_fonts.js'),
          path.join(pdfmakeBuildDir, 'vfs_fonts.js')
        );
        console.log('✅ vfs_fonts.js fixed successfully');
      } else {
        console.warn('⚠️  Could not find vfs_fonts.js to copy, frontend may have issues with PDF generation');
      }
    } catch (err) {
      console.error('❌ Failed to fix vfs_fonts.js:', err.message);
    }
  }
}

// Start the frontend
console.log('🚀 Starting frontend on port 5173...');
try {
  execSync('npm run frontend:dev', { stdio: 'inherit' });
} catch (err) {
  console.error('❌ Frontend startup failed:', err.message);
  process.exit(1);
} 