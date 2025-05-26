#!/usr/bin/env node

/**
 * Check Memory Usage Script
 * 
 * This script checks the memory usage of running Node.js processes
 * and provides a summary of system resources.
 */

import { execSync } from 'child_process';
import os from 'os';
import { fileURLToPath } from 'url';
import path from 'path';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

/**
 * Format bytes to human-readable string
 * @param {number} bytes - Number of bytes
 * @returns {string} Human-readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check memory usage of Node.js processes
 */
function checkNodeProcesses() {
  console.log(`${colors.blue}╔═════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║   Node.js Process Memory Usage              ║${colors.reset}`);
  console.log(`${colors.blue}╚═════════════════════════════════════════════╝${colors.reset}`);
  
  try {
    // Get process information
    const platform = os.platform();
    let command;
    
    if (platform === 'darwin') {
      // For macOS - simplified format for easier parsing
      command = 'ps -eo pid,%cpu,%mem,rss,command | grep -i node | grep -v grep';
    } else if (platform === 'linux') {
      // For Linux
      command = 'ps -eo pid,ppid,cmd,%cpu,%mem,rss | grep -i node | grep -v grep';
    } else if (platform === 'win32') {
      // For Windows
      command = 'wmic process where "caption like \'%node%\'" get processid,parentprocessid,commandline,caption,workingsetsize /format:csv';
    } else {
      console.error(`${colors.red}Unsupported platform: ${platform}${colors.reset}`);
      return;
    }
    
    const output = execSync(command, { encoding: 'utf8' });
    
    if (!output.trim()) {
      console.log(`${colors.yellow}No Node.js processes found${colors.reset}`);
      return;
    }
    
    // Parse and display results
    console.log(`${colors.cyan}Running Node.js Processes:${colors.reset}`);
    
    if (platform === 'darwin' || platform === 'linux') {
      // Header for Unix-like systems
      console.log(`${colors.bold}PID     %CPU   %MEM   RSS      COMMAND${colors.reset}`);
      
      // Parse each line
      const lines = output.trim().split('\n');
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        
        // Different parsing for macOS
        if (platform === 'darwin') {
          if (parts.length < 5) return;
          
          const pid = parts[0];
          const cpu = parts[1];
          const mem = parts[2];
          const rss = parseInt(parts[3], 10) * 1024; // Convert KB to bytes
          const cmd = parts.slice(4).join(' ');
          
          // Color code based on memory usage
          let colorCode = colors.green;
          if (parseFloat(mem) > 5) {
            colorCode = colors.red;
          } else if (parseFloat(mem) > 2) {
            colorCode = colors.yellow;
          }
          
          console.log(`${colorCode}${pid.padEnd(8)} ${cpu.padEnd(6)} ${mem.padEnd(6)} ${formatBytes(rss).padEnd(8)} ${cmd.substring(0, 60)}${colors.reset}`);
        } else {
          // Linux parsing
          if (parts.length < 6) return;
          
          const pid = parts[0];
          const cpu = parts[3];
          const mem = parts[4];
          const rss = parseInt(parts[5], 10) * 1024; // Convert KB to bytes
          const cmd = parts.slice(6).join(' ');
          
          // Color code based on memory usage
          let colorCode = colors.green;
          if (parseFloat(mem) > 5) {
            colorCode = colors.red;
          } else if (parseFloat(mem) > 2) {
            colorCode = colors.yellow;
          }
          
          console.log(`${colorCode}${pid.padEnd(8)} ${cpu.padEnd(6)} ${mem.padEnd(6)} ${formatBytes(rss).padEnd(8)} ${cmd.substring(0, 60)}${colors.reset}`);
        }
      });
    } else {
      // For Windows, parsing is different
      console.log(output);
    }
  } catch (error) {
    console.error(`${colors.red}Error checking Node.js processes: ${error.message}${colors.reset}`);
  }
}

/**
 * Check system memory usage
 */
function checkSystemMemory() {
  console.log(`\n${colors.blue}╔═════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║   System Memory Usage                       ║${colors.reset}`);
  console.log(`${colors.blue}╚═════════════════════════════════════════════╝${colors.reset}`);
  
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  
  const usedMemPercentage = (usedMem / totalMem * 100).toFixed(2);
  const freeMemPercentage = (freeMem / totalMem * 100).toFixed(2);
  
  // Color code based on memory usage
  let colorCode = colors.green;
  if (usedMemPercentage > 85) {
    colorCode = colors.red;
  } else if (usedMemPercentage > 70) {
    colorCode = colors.yellow;
  }
  
  console.log(`${colors.cyan}Total Memory:   ${formatBytes(totalMem)}${colors.reset}`);
  console.log(`${colorCode}Used Memory:    ${formatBytes(usedMem)} (${usedMemPercentage}%)${colors.reset}`);
  console.log(`${colors.green}Free Memory:    ${formatBytes(freeMem)} (${freeMemPercentage}%)${colors.reset}`);
  
  // Additional information for macOS
  if (os.platform() === 'darwin') {
    try {
      const vmStatOutput = execSync('vm_stat', { encoding: 'utf8' });
      console.log(`\n${colors.cyan}Detailed macOS Memory Information:${colors.reset}`);
      
      // Extract page size
      const pageSizeMatch = vmStatOutput.match(/page size of (\d+) bytes/);
      const pageSize = pageSizeMatch ? parseInt(pageSizeMatch[1], 10) : 4096;
      
      // Extract values
      const freePages = extractVmStat(vmStatOutput, 'Pages free');
      const activePages = extractVmStat(vmStatOutput, 'Pages active');
      const inactivePages = extractVmStat(vmStatOutput, 'Pages inactive');
      const wiredPages = extractVmStat(vmStatOutput, 'Pages wired down');
      
      // Convert to bytes
      const freeBytes = freePages * pageSize;
      const activeBytes = activePages * pageSize;
      const inactiveBytes = inactivePages * pageSize;
      const wiredBytes = wiredPages * pageSize;
      
      console.log(`${colors.green}Free:     ${formatBytes(freeBytes)}${colors.reset}`);
      console.log(`${colors.yellow}Active:   ${formatBytes(activeBytes)}${colors.reset}`);
      console.log(`${colors.yellow}Inactive: ${formatBytes(inactiveBytes)}${colors.reset}`);
      console.log(`${colors.red}Wired:    ${formatBytes(wiredBytes)}${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}Error getting detailed memory info: ${error.message}${colors.reset}`);
    }
  }
}

/**
 * Extract numeric value from vm_stat output
 * @param {string} output - vm_stat output
 * @param {string} label - Label to find
 * @returns {number} Extracted value
 */
function extractVmStat(output, label) {
  const regex = new RegExp(`${label}:\\s+(\\d+)\\.`);
  const match = output.match(regex);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Main function
 */
function main() {
  console.log(`${colors.bold}Memory Usage Check - ${new Date().toISOString()}${colors.reset}\n`);
  
  checkSystemMemory();
  console.log();
  checkNodeProcesses();
  
  console.log(`\n${colors.yellow}To free up memory, run: sudo ./server/clear-memory.sh${colors.reset}`);
}

// Run the main function
main(); 