import axios from 'axios';

// Get the API URL from environment variables or fallback to default
// For production, this should be your Render backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                     (import.meta.env.PROD ? 
                      'https://cv-builder-backend.onrender.com' : 
                      'http://localhost:3005');

console.log('API Base URL:', API_BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enable cookies for authentication
  timeout: 15000 // Increased timeout for slower networks
});

// Make sure withCredentials is enabled for authentication
api.defaults.withCredentials = true;

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

// Export both the configured axios instance and the API endpoints
export default api;
export { apiConfig, API_BASE_URL }; 