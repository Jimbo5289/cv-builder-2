#!/usr/bin/env node

/**
 * React Router Debug Script
 * A simple utility to diagnose and fix common React Router issues
 * 
 * Run with: node scripts/debug-router.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

// Print header
console.log(`${colors.blue}${colors.bold}====================================${colors.reset}`);
console.log(`${colors.blue}${colors.bold}    React Router Debug Utility     ${colors.reset}`);
console.log(`${colors.blue}${colors.bold}====================================${colors.reset}`);
console.log(`${colors.cyan}This tool helps diagnose and fix common React Router issues${colors.reset}\n`);

// Define paths to check
const filesToCheck = [
  'src/main.jsx',
  'src/App.jsx',
  'src/AppRoutes.jsx',
  'src/utils/routerConfig.js',
  'src/components/RouterOptimizer.jsx'
];

// Define common issues and their fixes
const knownIssues = [
  {
    name: 'Missing future flags',
    pattern: /<BrowserRouter future={/,
    targetFile: 'src/main.jsx',
    description: 'BrowserRouter should have future flags configured',
    fix: `Add future flags to BrowserRouter:
import { getRouterFutureConfig } from './utils/routerConfig';
const routerFutureConfig = getRouterFutureConfig();
<BrowserRouter future={routerFutureConfig}>`
  },
  {
    name: 'Missing RouterOptimizer',
    pattern: /<RouterOptimizer/,
    targetFile: 'src/AppRoutes.jsx',
    description: 'RouterOptimizer component should be used in AppRoutes',
    fix: `Add RouterOptimizer to AppRoutes:
import RouterOptimizer from './components/RouterOptimizer';
// Inside render:
<RouterOptimizer />`
  }
];

// Function to check a file
async function checkFile(filePath) {
  try {
    const fullPath = path.resolve(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`${colors.yellow}⚠️ File not found: ${filePath}${colors.reset}`);
      return { exists: false, issues: [] };
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const issues = [];
    
    // Check for known issues
    knownIssues.forEach(issue => {
      if (issue.targetFile === filePath) {
        const hasPattern = issue.pattern.test(content);
        if (!hasPattern) {
          issues.push(issue);
        }
      }
    });
    
    return { exists: true, issues };
  } catch (error) {
    console.error(`${colors.red}Error checking file ${filePath}:${colors.reset}`, error);
    return { exists: false, issues: [] };
  }
}

// Main function
async function main() {
  console.log(`${colors.cyan}Checking for common React Router issues...${colors.reset}\n`);
  
  let foundIssues = false;
  
  // Check each file
  for (const file of filesToCheck) {
    process.stdout.write(`Checking ${file}... `);
    const { exists, issues } = await checkFile(file);
    
    if (!exists) {
      console.log(`${colors.yellow}NOT FOUND${colors.reset}`);
      continue;
    }
    
    if (issues.length === 0) {
      console.log(`${colors.green}OK${colors.reset}`);
    } else {
      console.log(`${colors.red}${issues.length} issue(s) found${colors.reset}`);
      foundIssues = true;
      
      // Display issues
      issues.forEach((issue, index) => {
        console.log(`\n${colors.yellow}Issue #${index + 1}: ${issue.name}${colors.reset}`);
        console.log(`${colors.white}Description: ${issue.description}${colors.reset}`);
        console.log(`${colors.green}Fix: ${colors.reset}\n${issue.fix}\n`);
      });
    }
  }
  
  // Check for v7_startTransition flag in BrowserRouter
  const mainJsxPath = path.resolve(process.cwd(), 'src/main.jsx');
  if (fs.existsSync(mainJsxPath)) {
    const mainJsxContent = fs.readFileSync(mainJsxPath, 'utf8');
    if (!mainJsxContent.includes('v7_startTransition')) {
      console.log(`\n${colors.yellow}⚠️ Warning: v7_startTransition flag not found in BrowserRouter${colors.reset}`);
      console.log(`This flag is needed to prevent React Router Future Flag warnings.`);
      foundIssues = true;
    }
  }
  
  // Final summary
  console.log(`\n${colors.blue}${colors.bold}====================================${colors.reset}`);
  if (foundIssues) {
    console.log(`${colors.yellow}Some React Router issues were found.${colors.reset}`);
    console.log(`Follow the suggested fixes above to resolve them.`);
  } else {
    console.log(`${colors.green}No React Router issues found! Your setup looks good.${colors.reset}`);
  }
  console.log(`${colors.blue}${colors.bold}====================================${colors.reset}\n`);
  
  rl.close();
}

// Run the main function
main().catch(error => {
  console.error(`${colors.red}Error running debug script:${colors.reset}`, error);
  rl.close();
}); 