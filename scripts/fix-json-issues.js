/**
 * Script to fix duplicate keys in JSON files
 * This script will parse and clean JSON files, removing duplicate keys
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Files to check
const jsonFiles = [
  'package.json',
  'server/package.json',
  '.vscode/settings.json'
];

// Function to fix duplicate keys in JSON
const fixDuplicateKeys = (jsonPath) => {
  try {
    const fullPath = path.join(projectRoot, jsonPath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.log(`File ${fullPath} does not exist, skipping...`);
      return false;
    }
    
    // Read file content
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Use a custom parse function that handles duplicate keys by taking the last one
    const jsonObj = JSON.parse(content);
    
    // Stringify with proper formatting
    const cleanedJson = JSON.stringify(jsonObj, null, 2);
    
    // Write back to file only if changed
    if (cleanedJson !== content) {
      fs.writeFileSync(fullPath, cleanedJson, 'utf8');
      console.log(`✅ Fixed JSON structure in ${jsonPath}`);
      return true;
    } else {
      console.log(`⏭️ No duplicate keys found in ${jsonPath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${jsonPath}:`, error.message);
    return false;
  }
};

// Process each file
let fixedCount = 0;
jsonFiles.forEach(file => {
  if (fixDuplicateKeys(file)) {
    fixedCount++;
  }
});

console.log(`\n🎉 Fixed ${fixedCount} JSON files.`);
console.log('To run this script: node scripts/fix-json-issues.js'); 