import axios from 'axios';

// Get the API URL from environment variables or fallback to default
// For production, this should be your Render backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                     (import.meta.env.PROD ? 
                      'https://cv-builder-backend-2jax.onrender.com' : 
                      'http://localhost:3005');

// Log the API URL for debugging
console.log('API Base URL:', API_BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enable cookies for authentication
  timeout: 30000 // Increased timeout for slower networks (30 seconds)
});

// Make sure withCredentials is enabled for authentication
api.defaults.withCredentials = true;

// Add additional headers for CORS and Content-Type
api.defaults.headers.common['Accept'] = 'application/json';
api.defaults.headers.post['Content-Type'] = 'application/json';

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

// Add request interceptor for debugging in development
if (import.meta.env.DEV) {
  api.interceptors.request.use(request => {
    console.log('API Request:', request.method, request.url);
    return request;
  });
}

// Add response interceptor for debugging timeouts and other issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out:', error.config.url);
    } else if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Export both the configured axios instance and the API endpoints
export default api;
export { apiConfig, API_BASE_URL }; 