/**
 * Simple client-side logger utility
 * 
 * This provides logging with different levels and timestamps.
 */

const logger = {
  /**
   * Log an info message
   * @param {...any} args - Arguments to log
   */
  info: (...args) => {
    if (import.meta.env.DEV) {
      console.log(`[INFO] ${new Date().toISOString()}:`, ...args);
    }
  },
  
  /**
   * Log a warning message
   * @param {...any} args - Arguments to log
   */
  warn: (...args) => {
    if (import.meta.env.DEV) {
      console.warn(`[WARN] ${new Date().toISOString()}:`, ...args);
    }
  },
  
  /**
   * Log an error message
   * @param {...any} args - Arguments to log
   */
  error: (...args) => {
    console.error(`[ERROR] ${new Date().toISOString()}:`, ...args);
  },
  
  /**
   * Log a debug message (only in development)
   * @param {...any} args - Arguments to log
   */
  debug: (...args) => {
    if (import.meta.env.DEV) {
      console.debug(`[DEBUG] ${new Date().toISOString()}:`, ...args);
    }
  }
};

export default logger; 