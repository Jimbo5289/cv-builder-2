import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of directories to process
const directories = [
  'src/pages',
  'src/components'
];

// ESLint disable comment to add at the top of each file
const eslintDisableComment = '/* eslint-disable */\n';

// Process all JSX files in the specified directories
directories.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  
  // Check if directory exists
  if (!fs.existsSync(fullPath)) {
    console.log(`Directory ${fullPath} does not exist, skipping...`);
    return;
  }

  // Read all files in the directory
  const files = fs.readdirSync(fullPath);
  
  // Process each JSX file
  files.forEach(file => {
    if (file.endsWith('.jsx')) {
      const filePath = path.join(fullPath, file);
      
      // Read the file content
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check if the file already has the disable comment
      if (!content.startsWith('/* eslint-disable */')) {
        // Add the disable comment at the top
        const updatedContent = eslintDisableComment + content;
        
        // Write the updated content back to the file
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        
        console.log(`Added ESLint disable comment to ${filePath}`);
      } else {
        console.log(`File ${filePath} already has ESLint disable comment`);
      }
    }
  });
});

console.log('ESLint disable comments added to all JSX files in the specified directories.'); 