/**
 * Local Storage Management Utilities
 * 
 * Provides helper functions for working with localStorage
 * with error handling and cleanup capabilities.
 */

/**
 * Set an item in localStorage with proper error handling
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 * @returns {boolean} - True if successful, false if failed
 */
export const setItem = (key, value) => {
  try {
    if (!key) throw new Error('Key is required');
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage item [${key}]:`, error);
    return false;
  }
};

/**
 * Get an item from localStorage with proper error handling
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if item doesn't exist or errors
 * @returns {any} - Parsed value or defaultValue
 */
export const getItem = (key, defaultValue = null) => {
  try {
    if (!key) throw new Error('Key is required');
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
      return JSON.parse(item);
  } catch (error) {
    console.error(`Error getting localStorage item [${key}]:`, error);
    return defaultValue;
  }
};

/**
 * Remove an item from localStorage with proper error handling
 * @param {string} key - Storage key
 * @returns {boolean} - True if successful, false if failed
 */
export const removeItem = (key) => {
  try {
    if (!key) throw new Error('Key is required');
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage item [${key}]:`, error);
    return false;
  }
};

/**
 * Check if localStorage is available
 * @returns {boolean} - True if available, false otherwise
 */
export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Clear all items from localStorage with proper error handling
 * @returns {boolean} - True if successful, false if failed
 */
export const clearStorage = () => {
  try {
      localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Clean up localStorage by removing potentially corrupted items
 * @param {boolean} [preserveSession=false] - Whether to preserve session-related items
 * @returns {object} - Stats about the cleanup operation
 */
export const cleanupLocalStorage = (preserveSession = false) => {
  const stats = {
    processed: 0,
    removed: 0,
    preserved: 0,
    errors: 0
  };
  
  try {
    // First check if localStorage is available
    if (!isStorageAvailable()) {
      console.warn('localStorage is not available');
      return stats;
    }
    
    // Keys to always preserve if preserveSession is true
    const preserveKeys = [
      'authToken',
      'user',
      'session',
      'sessionId',
      'refreshToken',
      'userPreferences'
    ];
    
    // Iterate all keys
    for (let i = 0; i < localStorage.length; i++) {
      try {
        stats.processed++;
        const key = localStorage.key(i);
        
        // Skip preserved keys
        if (preserveSession && preserveKeys.some(pk => key.includes(pk))) {
          stats.preserved++;
          continue;
        }
        
        // Try to parse the value
      try {
          const item = localStorage.getItem(key);
          JSON.parse(item);
          // If parse succeeds, keep the item
          stats.preserved++;
        } catch (parseError) {
          // If parse fails, remove the item
          localStorage.removeItem(key);
          stats.removed++;
          console.warn(`Removed corrupted localStorage item: ${key}`);
        }
      } catch (itemError) {
        stats.errors++;
        console.error('Error processing localStorage item:', itemError);
      }
    }
    
    return stats;
  } catch (error) {
    stats.errors++;
    console.error('Error cleaning up localStorage:', error);
    return stats;
  }
};

/**
 * Reset all localStorage data
 * @returns {boolean} - True if successful, false if failed
 */
export const resetAllLocalStorage = () => {
  try {
    localStorage.clear();
    console.info('All localStorage data has been reset');
    return true;
  } catch (error) {
    console.error('Error resetting localStorage:', error);
    return false;
  }
};

/**
 * Get all localStorage keys
 * @returns {Array<string>} - Array of localStorage keys
 */
export const getAllKeys = () => {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      keys.push(localStorage.key(i));
    }
    return keys;
  } catch (error) {
    console.error('Error getting localStorage keys:', error);
    return [];
  }
};

export default {
  setItem,
  getItem,
  removeItem,
  clearStorage,
  isStorageAvailable,
  cleanupLocalStorage,
  resetAllLocalStorage,
  getAllKeys
}; 