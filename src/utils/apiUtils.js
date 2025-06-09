/**
 * Comprehensive API utilities for handling requests, responses, and errors
 */
import { formatError } from './errorHandler';

/**
 * Default fetch options for API requests
 */
const DEFAULT_OPTIONS = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  credentials: 'include',
  timeout: 10000 // 10 seconds
};

/**
 * Make a fetch request with proper error handling and development mocks
 * @param {string} url - The API URL to fetch
 * @param {Object} options - Fetch options
 * @param {Object} devMockData - Mock data to return in development mode when server is unavailable
 * @param {Object} config - Additional configuration options
 * @returns {Promise<Object>} - Response data
 */
export const safeFetch = async (url, options = {}, devMockData = null, config = {}) => {
  const {
    showLogs = import.meta.env.DEV,
    retries = 1,
    timeout = DEFAULT_OPTIONS.timeout,
    suppressErrors = false
  } = config;
  
  // Track retries
  let currentRetry = 0;
  
  // Set up request tracking for analytics
  const startTime = Date.now();
  let responseTime = 0;
  let success = false;
  
  try {
    // For development, we can return mock data if endpoint is not available
    if (import.meta.env.DEV && devMockData && shouldUseMock(url)) {
      if (showLogs) console.log(`DEV MODE: Using mock data for ${url}`);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return devMockData;
    }
    
    // Merge default options with provided options
    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      headers: {
        ...DEFAULT_OPTIONS.headers,
        ...options.headers
      }
    };
    
    // Function to make a single fetch attempt
    const attemptFetch = async () => {
      // Set up timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      try {
        if (showLogs) console.log(`Fetching ${url}...`);
        
        const response = await fetch(url, {
          ...mergedOptions,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        responseTime = Date.now() - startTime;
        
        // Handle common status codes
        if (response.status === 404) {
          if (showLogs) console.warn(`Resource not found: ${url}`);
          // Return null for 404s instead of throwing
          return null;
        }
        
        if (response.status === 401) {
          if (showLogs) console.warn(`Authentication required for: ${url}`);
          // Let caller handle auth errors
          throw new Error('Authentication required');
        }
        
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          let errorMessage;
          
          try {
            // Try to parse as JSON
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorJson.error || `API request failed with status ${response.status}`;
          } catch (e) {
            // If not JSON, use the text directly
            errorMessage = errorText || `API request failed with status ${response.status}`;
          }
          
          throw new Error(errorMessage);
        }
        
        // Parse JSON response
        const data = await response.json().catch(() => {
          // If response is not JSON, return an empty object
          return {};
        });
        
        success = true;
        return data;
      } finally {
        clearTimeout(timeoutId);
      }
    };
    
    // Retry logic
    while (currentRetry <= retries) {
      try {
        const result = await attemptFetch();
        return result;
      } catch (error) {
        currentRetry++;
        
        // If this was our last retry, rethrow the error
        if (currentRetry > retries) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, currentRetry - 1), 5000);
        if (showLogs) console.log(`Retrying in ${delay}ms (${currentRetry}/${retries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  } catch (error) {
    // Special handling for development mode
    if (import.meta.env.DEV && devMockData && (
      error.name === 'AbortError' || 
      error.message.includes('Failed to fetch') ||
      error.message.includes('Network Error')
    )) {
      if (showLogs) console.warn(`DEV MODE: Network error for ${url}, using mock data`);
      return devMockData;
    }
    
    // Log the error unless suppressed
    if (!suppressErrors) {
      console.error(`API error for ${url}:`, formatError(error));
    }
    
    // Track performance metrics
    if (responseTime === 0) {
      responseTime = Date.now() - startTime;
    }
    
    // Rethrow all other errors
    throw error;
  } finally {
    // Track API performance (if analytics is available)
    if (window.trackApiCall && !import.meta.env.DEV) {
      try {
        window.trackApiCall(url, options.method || 'GET', responseTime, success);
      } catch (e) {
        // Ignore analytics errors
      }
    }
  }
};

/**
 * Decide whether to use mock data for a particular endpoint
 * @param {string} url - The API URL
 * @returns {boolean} - Whether to use mock data
 */
const shouldUseMock = (url) => {
  // Extract the endpoint path
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    
    // Mock specific endpoints in development when likely to fail
    return (
      path.includes('/api/subscriptions') ||
      path.includes('/api/users/stats') ||
      path.includes('/api/cv/user/all') ||
      path.includes('/api/2fa/setup')
    );
  } catch (e) {
    // If URL parsing fails, don't use mock
    return false;
  }
};

/**
 * Common mock data for development
 */
export const mockResponses = {
  subscriptions: {
    id: 'mock-subscription-id',
    status: 'active',
    plan: 'premium',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
  },
  userStats: {
    totalCVs: 3,
    analyzedCVs: 2,
    cvDownloads: 5,
    lastActivity: new Date().toISOString()
  },
  cvList: [
    {
      id: 'mock-cv-1',
      title: 'Software Engineer CV',
      lastUpdated: new Date().toISOString(),
      status: 'published'
    },
    {
      id: 'mock-cv-2',
      title: 'Product Manager CV',
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'draft'
    }
  ],
  // Add more mock responses as needed
  user: {
    id: 'mock-user-id',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }
};

/**
 * Upload a file to the server
 * @param {string} url - The API URL
 * @param {File} file - The file to upload
 * @param {Object} authHeaders - Authentication headers
 * @param {Object} extraFormData - Additional form data to include
 * @returns {Promise<Object>} - Response data
 */
export const uploadFile = async (url, file, authHeaders = {}, extraFormData = {}) => {
  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  
  // Add any extra form data
  Object.entries(extraFormData).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  // Prepare headers (don't include Content-Type for multipart/form-data)
  const headers = { ...authHeaders };
  delete headers['Content-Type'];
  
  // Use safeFetch for consistent handling
  return safeFetch(url, {
    method: 'POST',
    headers,
    body: formData
  });
};

export default {
  safeFetch,
  mockResponses,
  uploadFile
}; 