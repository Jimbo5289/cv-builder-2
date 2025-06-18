import axios from 'axios';

// Get the API URL from environment variables or fallback to default
// For production, this should be your Render backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     (import.meta.env.PROD ? 
                      'https://cv-builder-backend-zjax.onrender.com' : 
                      'http://localhost:3005');

// Log the API URL for debugging
console.log('API Base URL:', API_BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enable cookies for authentication
  timeout: 30000, // Increased timeout for slower networks (30 seconds)
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Log every request in development
if (import.meta.env.DEV) {
  api.interceptors.request.use(request => {
    console.log('API Request:', {
      method: request.method?.toUpperCase(),
      url: request.url,
      data: request.data ? (
        typeof request.data === 'object' ? 
          { ...request.data, password: request.data.password ? '[MASKED]' : undefined } : 
          'string data'
      ) : undefined,
      headers: {
        ...request.headers,
        Authorization: request.headers.Authorization ? '[MASKED]' : undefined
      }
    });
    return request;
  });
}

// Add response interceptor for debugging timeouts and other issues
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    // Enhanced error logging
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out:', error.config.url);
    } else if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: {
          'access-control-allow-origin': error.response.headers['access-control-allow-origin'],
          'access-control-allow-credentials': error.response.headers['access-control-allow-credentials'],
          'content-type': error.response.headers['content-type']
        }
      });
    } else if (error.request) {
      console.error('No response received:', {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout
      });
    } else {
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Centralized configuration for API calls
const apiConfig = {
  auth: {
    login: '/api/auth/login',
    signup: '/api/auth/register',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    logout: '/api/auth/logout'
  },
  cv: {
    create: '/api/cv',
    getAll: '/api/cv/user/all',
    getById: (id) => `/api/cv/${id}`,
    update: (id) => `/api/cv/${id}`,
    delete: (id) => `/api/cv/${id}`
  }
};

// Diagnostic functions
export const testApiConnection = async () => {
  try {
    const endpoints = ['/health', '/api/health', '/cors-test'];
    
    for (const endpoint of endpoints) {
      try {
        const response = await api.get(endpoint, { 
          timeout: 5000,
          headers: {
            'Accept': 'application/json'
          }
        });
        console.log(`API Connection to ${endpoint} successful:`, response.status);
        return true;
      } catch (err) {
        console.log(`API Connection to ${endpoint} failed:`, err.message);
      }
    }
    
    console.error('All API connection tests failed');
    return false;
  } catch (err) {
    console.error('API connection test error:', err);
    return false;
  }
};

// Export both the configured axios instance and the API endpoints
export default api;
export { apiConfig, API_BASE_URL }; 