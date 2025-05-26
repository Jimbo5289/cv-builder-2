#!/usr/bin/env node

/**
 * Memory Monitor Script
 * 
 * This script monitors memory usage of the Node.js process and logs information
 * about potential memory issues. It can be included in the main server or run as
 * a standalone process.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const LOG_INTERVAL = process.env.MEMORY_MONITOR_INTERVAL || 60000; // 1 minute
const MEMORY_THRESHOLD = process.env.MEMORY_THRESHOLD || 0.8; // 80% of max memory
const LOG_DIR = process.env.LOG_DIR || path.join(__dirname, 'logs');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Log file path
const LOG_FILE = path.join(LOG_DIR, 'memory-usage.log');

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
 * Log memory usage
 */
function logMemoryUsage() {
  // Get memory usage
  const memoryUsage = process.memoryUsage();
  
  // Calculate usage percentage
  const heapUsed = memoryUsage.heapUsed;
  const heapTotal = memoryUsage.heapTotal;
  const rss = memoryUsage.rss;
  const heapUsagePercentage = (heapUsed / heapTotal * 100).toFixed(2);
  
  // Format timestamp
  const timestamp = new Date().toISOString();
  
  // Create log message
  const logMessage = `[${timestamp}] Memory Usage:
    RSS: ${formatBytes(rss)}
    Heap Total: ${formatBytes(heapTotal)}
    Heap Used: ${formatBytes(heapUsed)} (${heapUsagePercentage}%)
    External: ${formatBytes(memoryUsage.external)}
    Array Buffers: ${formatBytes(memoryUsage.arrayBuffers)}
  `;
  
  // Check if memory usage is above threshold
  const isAboveThreshold = heapUsed / heapTotal > MEMORY_THRESHOLD;
  
  // Log to console
  if (isAboveThreshold) {
    console.warn(`⚠️ HIGH MEMORY USAGE: ${logMessage}`);
  } else {
    console.log(logMessage);
  }
  
  // Append to log file
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
  
  // Force garbage collection if available and above threshold
  if (isAboveThreshold && global.gc) {
    console.log('Forcing garbage collection...');
    global.gc();
    
    // Log memory usage after garbage collection
    const afterGC = process.memoryUsage();
    const afterGCMessage = `[${timestamp}] After GC:
      RSS: ${formatBytes(afterGC.rss)}
      Heap Total: ${formatBytes(afterGC.heapTotal)}
      Heap Used: ${formatBytes(afterGC.heapUsed)} (${(afterGC.heapUsed / afterGC.heapTotal * 100).toFixed(2)}%)
    `;
    
    console.log(afterGCMessage);
    fs.appendFileSync(LOG_FILE, afterGCMessage + '\n');
  }
}

/**
 * Start memory monitoring
 */
function startMonitoring() {
  console.log(`Starting memory monitoring (interval: ${LOG_INTERVAL}ms, log file: ${LOG_FILE})`);
  
  // Log initial memory usage
  logMemoryUsage();
  
  // Set up interval for regular logging
  setInterval(logMemoryUsage, LOG_INTERVAL);
}

// Start monitoring if this file is run directly
if (require.main === module) {
  startMonitoring();
} else {
  // Export for use in other files
  module.exports = {
    startMonitoring,
    logMemoryUsage
  };
} 