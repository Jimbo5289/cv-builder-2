/**
 * Authentication Persistence Utilities
 * Handles proper storage and retrieval of authentication state
 */

// Safe JSON parse function
const safeJsonParse = (str, defaultValue = null) => {
  if (!str) return defaultValue;
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error('JSON parse error:', e);
    return defaultValue;
  }
};

// Safe JSON stringify function
const safeJsonStringify = (obj, defaultValue = 'null') => {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    console.error('JSON stringify error:', e);
    return defaultValue;
  }
};

/**
 * Check if localStorage is available
 */
const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Get authentication token from storage
 */
export const getStoredToken = () => {
  if (!isStorageAvailable()) return null;
  
  try {
    return localStorage.getItem('token');
  } catch (e) {
    console.error('Error getting stored token:', e);
    return null;
  }
};

/**
 * Get user data from storage
 */
export const getStoredUser = () => {
  if (!isStorageAvailable()) return null;
  
  try {
    const userStr = localStorage.getItem('user');
    return safeJsonParse(userStr);
  } catch (e) {
    console.error('Error getting stored user:', e);
    return null;
  }
};

/**
 * Get refresh token from storage
 */
export const getStoredRefreshToken = () => {
  if (!isStorageAvailable()) return null;
  
  try {
    return localStorage.getItem('refreshToken');
  } catch (e) {
    console.error('Error getting stored refresh token:', e);
    return null;
  }
};

/**
 * Store authentication data
 */
export const storeAuthData = (token, user, refreshToken = null) => {
  if (!isStorageAvailable()) {
    console.warn('localStorage not available, auth data will not persist');
    return false;
  }
  
  try {
    if (token) localStorage.setItem('token', token);
    if (user) localStorage.setItem('user', safeJsonStringify(user));
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    return true;
  } catch (e) {
    console.error('Error storing auth data:', e);
    return false;
  }
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  if (!isStorageAvailable()) return;
  
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    console.log('Auth data cleared from storage');
  } catch (e) {
    console.error('Error clearing auth data:', e);
  }
};

/**
 * Check if user appears to be authenticated based on stored data
 */
export const hasStoredAuth = () => {
  const token = getStoredToken();
  const user = getStoredUser();
  
  return !!(token && user);
};

/**
 * Validate stored authentication data
 */
export const validateStoredAuth = () => {
  const token = getStoredToken();
  const user = getStoredUser();
  
  // Basic validation
  if (!token || !user) return false;
  
  // Check if token looks valid (basic format check)
  if (typeof token !== 'string' || token.length < 10) return false;
  
  // Check if user has required fields
  if (!user.id || !user.email) return false;
  
  return true;
};

/**
 * Get authentication headers for API requests
 */
export const getAuthHeaders = () => {
  const token = getStoredToken();
  
  if (!token) return {};
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Listen for storage changes (cross-tab authentication)
 */
export const onAuthStorageChange = (callback) => {
  if (!isStorageAvailable()) return () => {};
  
  const handleStorageChange = (event) => {
    if (event.key === 'token' || event.key === 'user' || event.key === 'refreshToken') {
      callback({
        key: event.key,
        oldValue: event.oldValue,
        newValue: event.newValue,
        hasAuth: hasStoredAuth()
      });
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};

export default {
  getStoredToken,
  getStoredUser,
  getStoredRefreshToken,
  storeAuthData,
  clearAuthData,
  hasStoredAuth,
  validateStoredAuth,
  getAuthHeaders,
  onAuthStorageChange
}; 