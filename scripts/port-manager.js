/**
 * Port Manager
 * 
 * This module manages port allocation for various services in the application.
 * It ensures consistent port usage across restarts and prevents conflicts.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import net from 'net';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Port configuration file path
const PORT_CONFIG_FILE = path.join(rootDir, '.port-config.json');

// Default port ranges
const DEFAULT_PORTS = {
  backend: 3005,
  frontend: 5173
};

// Maximum number of retries when looking for an available port
const MAX_PORT_RETRIES = 20;

/**
 * Check if a port is in use
 * @param {number} port - Port to check
 * @returns {Promise<boolean>} - True if in use, false if available
 */
const isPortInUse = async (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true); // Port is in use
      } else {
        resolve(false);
      }
      server.close();
    });
    
    server.once('listening', () => {
      server.close(() => {
        resolve(false); // Port is available
      });
    });
    
    server.listen(port);
  });
};

/**
 * Load the port configuration from file
 * @returns {Object} - Port configuration
 */
const loadPortConfig = () => {
  try {
    if (fs.existsSync(PORT_CONFIG_FILE)) {
      const config = JSON.parse(fs.readFileSync(PORT_CONFIG_FILE, 'utf8'));
      return config;
    }
  } catch (error) {
    console.warn('Error loading port configuration, using defaults:', error.message);
  }
  
  // Return default configuration if file doesn't exist or is invalid
  return { services: {} };
};

/**
 * Save the port configuration to file
 * @param {Object} config - Port configuration
 */
const savePortConfig = (config) => {
  try {
    fs.writeFileSync(PORT_CONFIG_FILE, JSON.stringify(config, null, 2));
    console.log('Port configuration saved to', PORT_CONFIG_FILE);
  } catch (error) {
    console.error('Error saving port configuration:', error);
  }
};

/**
 * Find an available port starting from the given port
 * @param {number} startPort - Port to start checking from
 * @returns {Promise<number>} - Available port
 */
const findAvailablePort = async (startPort) => {
  let port = startPort;
  let attempts = 0;
  
  while (attempts < MAX_PORT_RETRIES) {
    if (!(await isPortInUse(port))) {
      return port;
    }
    
    port++;
    attempts++;
  }
  
  throw new Error(`Could not find an available port after ${MAX_PORT_RETRIES} attempts`);
};

/**
 * Get a port for a service
 * @param {string} serviceName - Name of the service
 * @param {number} [preferredPort] - Preferred port to use
 * @returns {Promise<number>} - Allocated port
 */
export const getServicePort = async (serviceName, preferredPort) => {
  // Load the port configuration
  const config = loadPortConfig();
  
  // Get the service configuration
  const serviceConfig = config.services[serviceName] || {};
  
  // Determine the port to use (with fallbacks)
  const defaultPort = DEFAULT_PORTS[serviceName] || (serviceName === 'backend' ? 3005 : 5173);
  let port = preferredPort || serviceConfig.port || defaultPort;
  
  // Check if the port is available
  if (await isPortInUse(port)) {
    // If not, find an available port
    port = await findAvailablePort(port);
  }
  
  // Update the configuration
  if (!config.services) {
    config.services = {};
  }
  
  config.services[serviceName] = {
    port,
    lastUsed: Date.now()
  };
  
  // Save the configuration
  savePortConfig(config);
  
  return port;
};

/**
 * Release a port for a service
 * @param {string} serviceName - Name of the service
 */
export const releasePort = (serviceName) => {
  // Load the port configuration
  const config = loadPortConfig();
  
  // Release the port by updating the lastUsed timestamp
  if (config.services && config.services[serviceName]) {
    config.services[serviceName].inUse = false;
    config.services[serviceName].lastReleased = Date.now();
  }
  
  // Save the configuration
  savePortConfig(config);
};

/**
 * Get all allocated ports
 * @returns {Object} - Map of service names to ports
 */
export const getAllocatedPorts = () => {
  // Load the port configuration
  const config = loadPortConfig();
  
  // Create a map of service names to ports
  const ports = {};
  
  if (config.services) {
    for (const [serviceName, serviceConfig] of Object.entries(config.services)) {
      ports[serviceName] = serviceConfig.port;
    }
  }
  
  return ports;
};

/**
 * Reset all port allocations
 */
export const resetAllPorts = () => {
  try {
    if (fs.existsSync(PORT_CONFIG_FILE)) {
      fs.unlinkSync(PORT_CONFIG_FILE);
      console.log('Port configuration reset');
    }
  } catch (error) {
    console.error('Error resetting port configuration:', error);
  }
};

// Export default object for ES modules and CommonJS compatibility
export default {
  getServicePort,
  releasePort,
  getAllocatedPorts,
  resetAllPorts
}; 