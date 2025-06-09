/**
 * Comprehensive localStorage management utilities
 */

/**
 * Clean up potentially corrupted localStorage data
 * @param {boolean} deepClean - Whether to perform a deep cleaning (checking all values)
 * @returns {number} Number of cleaned items
 */
export const cleanupLocalStorage = (deepClean = false) => {
  try {
    let cleanedItems = 0;
    
    // First check if localStorage is accessible
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return 0;
    }
    
    // List of critical localStorage keys that should contain valid JSON
    const criticalJsonKeys = [
      'user',
      'theme',
      'settings',
      'profile',
      'cv',
      'premium_bundle'
    ];
    
    // Get all keys
    const allKeys = getAllLocalStorageKeys();
    
    // Check critical keys first
    criticalJsonKeys.forEach(key => {
      if (cleanJsonKey(key)) cleanedItems++;
    });
    
    // If deep clean requested, check all keys
    if (deepClean) {
      // Find potential JSON keys not already checked
      const potentialJsonKeys = allKeys.filter(key => 
        !criticalJsonKeys.includes(key) && (
          key.includes('json') || 
          key.startsWith('user') || 
          key.startsWith('cv') || 
          key.startsWith('theme') ||
          key.startsWith('premium') ||
          key.startsWith('profile') ||
          key.startsWith('settings')
        )
      );
      
      // Check each key for valid JSON
      potentialJsonKeys.forEach(key => {
        if (cleanJsonKey(key)) cleanedItems++;
      });
    }
    
    // Check for legacy or deprecated keys and remove them
    const deprecatedKeys = [
      'temp_cv', 
      'draft_data',
      'old_settings',
      'debug_data',
      'preview_data'
    ];
    
    deprecatedKeys.forEach(key => {
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
        cleanedItems++;
        console.log(`Removed deprecated item: ${key}`);
      }
    });
    
    return cleanedItems;
  } catch (e) {
    console.error('Error in cleanupLocalStorage:', e);
    return 0;
  }
};

/**
 * Clean a specific localStorage key that should contain JSON
 * @param {string} key - The key to clean
 * @returns {boolean} Whether the key was cleaned
 */
export const cleanJsonKey = (key) => {
  try {
    const value = localStorage.getItem(key);
    if (value === null || value === undefined) return false;
    
    // Skip empty values
    if (value === '' || value === 'null' || value === 'undefined') return false;
    
    // Try to parse the value
    try {
      // If the value contains problematic patterns, it's corrupted
      if (value.includes('undefined') || 
          value.includes('NaN,') || 
          value.includes('[object Object]')) {
        throw new Error('Contains invalid data patterns');
      }
      
      // Try to parse as JSON
      JSON.parse(value);
      return false; // No cleaning needed
    } catch (e) {
      console.warn(`Removing corrupted localStorage item: ${key}`, value);
      localStorage.removeItem(key);
      return true; // Cleaned
    }
  } catch (e) {
    console.error(`Error processing localStorage key ${key}:`, e);
    return false;
  }
};

/**
 * Check if localStorage is available and functioning
 * @returns {boolean} Whether localStorage is available
 */
export const isLocalStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    const result = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    return result === testKey;
  } catch (e) {
    return false;
  }
};

/**
 * Get all keys in localStorage
 * @returns {string[]} Array of localStorage keys
 */
export const getAllLocalStorageKeys = () => {
  try {
    return Object.keys(localStorage);
  } catch (e) {
    console.error('Error getting localStorage keys:', e);
    return [];
  }
};

/**
 * Force reset all localStorage data with selective preservation
 * @param {string[]} preserveKeys - Optional array of keys to preserve
 * @returns {boolean} Success status
 */
export const resetLocalStorage = (preserveKeys = ['theme']) => {
  try {
    // Save values for keys to preserve
    const preserved = {};
    preserveKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value !== null) {
          preserved[key] = value;
        }
      } catch (e) {
        console.error(`Error preserving ${key}:`, e);
      }
    });
    
    // Clear all localStorage data
    localStorage.clear();
    console.log('All localStorage data cleared');
    
    // Restore preserved values
    Object.entries(preserved).forEach(([key, value]) => {
      try {
        if (key === 'theme') {
          // Verify it's a valid theme value
          if (['light', 'dark', 'auto'].includes(value)) {
            localStorage.setItem(key, value);
            console.log(`${key} preference restored:`, value);
          }
        } else {
          localStorage.setItem(key, value);
          console.log(`${key} preference restored`);
        }
      } catch (e) {
        console.error(`Error restoring ${key}:`, e);
      }
    });
    
    return true;
  } catch (e) {
    console.error('Error resetting localStorage:', e);
    return false;
  }
};

/**
 * Get estimated localStorage usage
 * @returns {Object} Usage statistics
 */
export const getStorageUsage = () => {
  try {
    if (!isLocalStorageAvailable()) {
      return { available: false, usage: 0, items: 0, quota: 0 };
    }
    
    const keys = getAllLocalStorageKeys();
    let totalSize = 0;
    
    keys.forEach(key => {
      try {
        const value = localStorage.getItem(key) || '';
        // Calculate size in bytes (2 bytes per character in UTF-16)
        const size = (key.length + value.length) * 2;
        totalSize += size;
      } catch (e) {
        console.error(`Error calculating size for ${key}:`, e);
      }
    });
    
    // Most browsers have a 5MB quota for localStorage
    const estimatedQuota = 5 * 1024 * 1024;
    
    return {
      available: true,
      usage: totalSize,
      items: keys.length,
      quota: estimatedQuota,
      percentUsed: (totalSize / estimatedQuota) * 100
    };
  } catch (e) {
    console.error('Error calculating storage usage:', e);
    return { available: false, usage: 0, items: 0, quota: 0 };
  }
};

/**
 * Safe JSON parse with fallback
 * @param {string} str - String to parse
 * @param {any} defaultValue - Default value if parsing fails
 * @returns {any} Parsed object or default value
 */
export const safeJsonParse = (str, defaultValue = null) => {
  if (!str) return defaultValue;
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error('JSON parse error:', e);
    return defaultValue;
  }
};

export default {
  cleanupLocalStorage,
  resetLocalStorage: (preserveKeys) => resetLocalStorage(preserveKeys),
  resetAllLocalStorage: () => resetLocalStorage([]),
  isLocalStorageAvailable,
  getStorageUsage,
  safeJsonParse
}; 