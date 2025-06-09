#!/usr/bin/env node

/**
 * Code Documentation Script
 * 
 * This script helps add comprehensive documentation to the codebase
 * by adding comment templates to different types of files.
 * 
 * Usage:
 * 1. Make sure you have Node.js installed
 * 2. Run: chmod +x document-codebase.js
 * 3. Execute: ./document-codebase.js
 *    Or: node document-codebase.js
 * 
 * Options:
 * --help: Show this help message
 * --dry-run: Show what would be documented without making changes
 * --dir=path/to/dir: Document only the specified directory
 * --component: Document only component files
 * --page: Document only page files
 * 
 * Example:
 * node document-codebase.js --dir=src/components
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const SRC_DIR = path.join(__dirname, 'src');
const COMPONENT_DIR = path.join(SRC_DIR, 'components');
const PAGES_DIR = path.join(SRC_DIR, 'pages');
const CONTEXT_DIR = path.join(SRC_DIR, 'context');
const HOOKS_DIR = path.join(SRC_DIR, 'hooks');
const UTILS_DIR = path.join(SRC_DIR, 'utils');

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const showHelp = args.includes('--help');
const documentComponents = args.includes('--component');
const documentPages = args.includes('--page');
let targetDir = null;

// Check for directory argument
for (const arg of args) {
  if (arg.startsWith('--dir=')) {
    targetDir = arg.split('=')[1];
    break;
  }
}

// Show help text
if (showHelp) {
  console.log(`
Code Documentation Script

This script helps add comprehensive documentation to the codebase
by adding comment templates to different types of files.

Usage:
1. Make sure you have Node.js installed
2. Run: chmod +x document-codebase.js
3. Execute: ./document-codebase.js
   Or: node document-codebase.js

Options:
--help: Show this help message
--dry-run: Show what would be documented without making changes
--dir=path/to/dir: Document only the specified directory
--component: Document only component files
--page: Document only page files

Example:
node document-codebase.js --dir=src/components
  `);
  process.exit(0);
}

// Documentation templates
const COMPONENT_TEMPLATE = `/**
 * @component ComponentName
 * @description Detailed description of what this component does and its role in the application
 * 
 * @props {PropType} propName - Description of prop
 * [Add more props as needed]
 * 
 * @example
 * // Basic usage example
 * <ComponentName propName={value} />
 * 
 * @returns {JSX.Element} Description of what is rendered
 */
`;

const PAGE_TEMPLATE = `/**
 * @page PageName
 * @description Detailed description of this page, its purpose, and key features
 * 
 * @route /route-path - The route that renders this page
 * 
 * @param {ParamType} paramName - Description of route/query parameter
 * [Add more parameters as needed]
 * 
 * @context Lists contexts used by this page
 * @hooks Lists custom hooks used by this page
 * 
 * @returns {JSX.Element} The page component
 */
`;

const CONTEXT_TEMPLATE = `/**
 * @context ContextName
 * @description Detailed description of what this context provides and its purpose
 * 
 * @property {PropType} propertyName - Description of context property
 * [Add more properties as needed]
 * 
 * @function functionName - Description of context function
 * [Add more functions as needed]
 * 
 * @example
 * // Example of how to use this context
 * const { propertyName, functionName } = useContext(ContextName);
 */
`;

const HOOK_TEMPLATE = `/**
 * @hook useHookName
 * @description Detailed description of what this hook does, when to use it, and its purpose
 * 
 * @param {ParamType} paramName - Description of parameter
 * [Add more parameters as needed]
 * 
 * @returns {ReturnType} Description of what is returned
 * 
 * @example
 * // Example of how to use this hook
 * const result = useHookName(param);
 */
`;

const UTILITY_TEMPLATE = `/**
 * @utility UtilityName
 * @description Detailed description of what this utility does and its purpose
 * 
 * @param {ParamType} paramName - Description of parameter
 * [Add more parameters as needed]
 * 
 * @returns {ReturnType} Description of what is returned
 * 
 * @example
 * // Example of how to use this utility
 * const result = utilityName(param);
 */
`;

/**
 * Adds documentation to a file
 * @param {string} filePath - Path to the file
 * @param {string} template - Documentation template to add
 */
function documentFile(filePath, template) {
  try {
    // Read the current file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already documented
    if (content.includes('@component') || 
        content.includes('@page') || 
        content.includes('@context') || 
        content.includes('@hook') || 
        content.includes('@utility')) {
      console.log(`File already documented: ${filePath}`);
      return;
    }
    
    // Get component/file name from path
    const fileName = path.basename(filePath, path.extname(filePath));
    
    // Replace placeholders in template
    let customizedTemplate = template;
    if (template.includes('ComponentName')) {
      customizedTemplate = template.replace(/ComponentName/g, fileName);
    } else if (template.includes('PageName')) {
      customizedTemplate = template.replace(/PageName/g, fileName);
    } else if (template.includes('ContextName')) {
      customizedTemplate = template.replace(/ContextName/g, fileName);
    } else if (template.includes('useHookName')) {
      customizedTemplate = template.replace(/useHookName/g, `use${fileName}`);
    } else if (template.includes('UtilityName')) {
      customizedTemplate = template.replace(/UtilityName/g, fileName);
    }
    
    if (isDryRun) {
      console.log(`Would document file: ${filePath} (dry run)`);
      return;
    }
    
    // Add documentation to the beginning of the file
    // Preserve any existing eslint comments
    if (content.startsWith('/* eslint')) {
      const eslintEndIndex = content.indexOf('*/') + 2;
      const eslintComment = content.substring(0, eslintEndIndex);
      const restOfFile = content.substring(eslintEndIndex).trim();
      
      fs.writeFileSync(filePath, `${eslintComment}\n\n${customizedTemplate}\n${restOfFile}`, 'utf8');
    } else {
      fs.writeFileSync(filePath, `${customizedTemplate}\n${content}`, 'utf8');
    }
    
    console.log(`Documentation added to: ${filePath}`);
  } catch (error) {
    console.error(`Error documenting file ${filePath}:`, error);
  }
}

/**
 * Processes files in a directory recursively
 * @param {string} dir - Directory to process
 * @param {string} template - Template to use
 * @param {RegExp} filePattern - Pattern to match files
 */
function processDirectory(dir, template, filePattern) {
  try {
    // Get all files in the directory
    const files = fs.readdirSync(dir);
    
    // Process each file
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        // Recursively process subdirectories
        processDirectory(filePath, template, filePattern);
      } else if (filePattern.test(file)) {
        // Document the file if it matches the pattern
        documentFile(filePath, template);
      }
    });
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error);
  }
}

/**
 * Main function to document the codebase
 */
function documentCodebase() {
  console.log(`Starting documentation process...${isDryRun ? ' (DRY RUN)' : ''}`);
  
  // If a specific directory is provided, only document that
  if (targetDir) {
    const fullPath = path.resolve(targetDir);
    console.log(`Targeting specific directory: ${fullPath}`);
    
    // Determine template based on directory name
    let template = COMPONENT_TEMPLATE;
    if (fullPath.includes('/components') || documentComponents) {
      template = COMPONENT_TEMPLATE;
    } else if (fullPath.includes('/pages') || documentPages) {
      template = PAGE_TEMPLATE;
    } else if (fullPath.includes('/context')) {
      template = CONTEXT_TEMPLATE;
    } else if (fullPath.includes('/hooks')) {
      template = HOOK_TEMPLATE;
    } else if (fullPath.includes('/utils')) {
      template = UTILITY_TEMPLATE;
    }
    
    processDirectory(fullPath, template, /\.jsx?$/);
    console.log(`Documentation complete for ${fullPath}`);
    return;
  }
  
  // Document specific types based on flags or document all
  if (documentComponents) {
    processDirectory(COMPONENT_DIR, COMPONENT_TEMPLATE, /\.jsx?$/);
  } else if (documentPages) {
    processDirectory(PAGES_DIR, PAGE_TEMPLATE, /\.jsx?$/);
  } else {
    // Document all directories
    processDirectory(COMPONENT_DIR, COMPONENT_TEMPLATE, /\.jsx?$/);
    processDirectory(PAGES_DIR, PAGE_TEMPLATE, /\.jsx?$/);
    processDirectory(CONTEXT_DIR, CONTEXT_TEMPLATE, /\.jsx?$/);
    processDirectory(HOOKS_DIR, HOOK_TEMPLATE, /\.jsx?$/);
    processDirectory(UTILS_DIR, UTILITY_TEMPLATE, /\.jsx?$/);
  }
  
  console.log('Documentation process completed!');
}

// Execute the main function
documentCodebase(); 