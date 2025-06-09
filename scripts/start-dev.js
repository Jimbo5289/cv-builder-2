/**
 * Development Environment Script Helper
 * 
 * Provides utility functions for starting and managing the development environment.
 * This script is used by the main start-dev.js in the root directory.
 */
import { getServicePort, releasePort } from './port-manager.js';

/**
 * Determine if a port is in use
 * @param {number} port - The port to check
 * @returns {Promise<boolean>} - True if the port is in use
 */
export const isPortInUse = async (port) => {
  try {
    const net = await import('net');
    return new Promise((resolve) => {
      const server = net.createServer();
      
      server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          resolve(true); // Port is in use
        } else {
          resolve(false);
        }
      });
      
      server.once('listening', () => {
        server.close();
        resolve(false); // Port is free
      });
      
      server.listen(port);
    });
  } catch (error) {
    console.error(`Error checking if port ${port} is in use:`, error);
    return false;
  }
};

/**
 * Helper function to get service ports for development
 */
export const getDevPorts = async () => {
  const frontendPort = await getServicePort('frontend');
  const backendPort = await getServicePort('backend');
  
  return {
    frontend: frontendPort,
    backend: backendPort
  };
};

/**
 * Helper function to release service ports after shutdown
 */
export const releaseDevPorts = () => {
  releasePort('frontend');
  releasePort('backend');
  console.log('Development ports released');
};

export default {
  isPortInUse,
  getDevPorts,
  releaseDevPorts
}; 