/**
 * Enhanced Authentication Utilities
 * 
 * Provides improved error handling and debugging for auth operations
 */
import api from './api';

/**
 * Register a new user with improved error handling
 * 
 * @param {Object} userData User registration data
 * @returns {Promise<Object>} Registration response
 */
export const registerUser = async (userData) => {
  console.log('Attempting to register user:', { ...userData, password: '[MASKED]' });
  
  try {
    // First verify the API is accessible
    console.log('Testing API connection before registration');
    await testApiConnection();
    
    // Then attempt registration
    console.log('Sending registration request to:', '/api/auth/register');
    const response = await api.post('/api/auth/register', userData, {
      withCredentials: true,
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Registration successful:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Registration failed:', error);
    
    // Enhanced error handling
    const errorDetails = {
      message: error.message || 'Unknown error',
      status: error.response?.status,
      data: error.response?.data,
      isNetworkError: error.message?.includes('Network Error') || !error.response,
      isTimeoutError: error.code === 'ECONNABORTED',
      isCorsError: error.message?.includes('CORS') || 
                  (error.response?.headers && 
                   !error.response.headers['access-control-allow-origin']),
      originalError: error,
    };
    
    console.error('Error details:', errorDetails);
    
    return {
      success: false,
      error: errorDetails
    };
  }
};

/**
 * Login a user with improved error handling
 * 
 * @param {Object} credentials User login credentials
 * @returns {Promise<Object>} Login response
 */
export const loginUser = async (credentials) => {
  console.log('Attempting to login user:', { ...credentials, password: '[MASKED]' });
  
  try {
    // First verify the API is accessible
    console.log('Testing API connection before login');
    await testApiConnection();
    
    // Then attempt login
    console.log('Sending login request to:', '/api/auth/login');
    const response = await api.post('/api/auth/login', credentials, {
      withCredentials: true,
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Login successful:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Login failed:', error);
    
    // Enhanced error handling
    const errorDetails = {
      message: error.message || 'Unknown error',
      status: error.response?.status,
      data: error.response?.data,
      isNetworkError: error.message?.includes('Network Error') || !error.response,
      isTimeoutError: error.code === 'ECONNABORTED',
      isCorsError: error.message?.includes('CORS') || 
                  (error.response?.headers && 
                   !error.response.headers['access-control-allow-origin']),
      originalError: error
    };
    
    console.error('Error details:', errorDetails);
    
    return {
      success: false,
      error: errorDetails
    };
  }
};

/**
 * Test API connection before auth operations
 * 
 * @returns {Promise<boolean>} True if connection is successful
 */
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection with health endpoint');
    const response = await api.get('/health', {
      timeout: 5000 // 5 seconds timeout
    });
    
    console.log('API connection test successful:', response.data);
    return true;
  } catch (error) {
    console.error('API connection test failed:', error.message);
    return false;
  }
};

export default {
  registerUser,
  loginUser,
  testApiConnection
}; 