import axios from 'axios';

// 1. Use VITE_API_BASE_URL properly in code
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enable cookies for authentication
  timeout: 10000
});

// 2. Make sure withCredentials is enabled for authentication
api.defaults.withCredentials = true;

// 3. Centralize config as shown in the screenshots
// Example centralized configuration for API calls
const apiConfig = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    logout: '/auth/logout'
  },
  cv: {
    create: '/cv',
    getAll: '/cv/user/all',
    getById: (id) => `/cv/${id}`,
    update: (id) => `/cv/${id}`,
    delete: (id) => `/cv/${id}`
  }
};

// 4. CORS headers are handled by the backend

// Export both the configured axios instance and the API endpoints
export default api;
export { apiConfig, API_BASE_URL }; 