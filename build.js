import { execSync } from 'child_process';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure we're running from the project root
console.log('Starting build process...');

try {
  // Clean previous build if exists
  if (fs.existsSync(path.join(__dirname, 'dist'))) {
    console.log('Cleaning existing dist directory...');
    fs.rmSync(path.join(__dirname, 'dist'), { recursive: true, force: true });
  }

  // Run the build
  console.log('Running build command...');
  execSync('npm run build', { stdio: 'inherit' });

  // Verify the build output
  console.log('Verifying build output...');
  if (!fs.existsSync(path.join(__dirname, 'dist'))) {
    throw new Error('Build failed to generate dist directory');
  }

  // Create a verification file
  fs.writeFileSync(path.join(__dirname, 'dist', 'vercel-build-verification.txt'), 
    `Build completed successfully at ${new Date().toISOString()}`);

  console.log('Build completed successfully!');
  console.log('Dist directory contents:');
  const distContents = fs.readdirSync(path.join(__dirname, 'dist'));
  console.log(distContents);
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 