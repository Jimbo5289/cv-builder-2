/**
 * API Connection Checker
 * This utility file helps diagnose connectivity issues between the frontend and backend
 */

import axios from 'axios';
import { API_BASE_URL } from './api';

/**
 * Test the API connection and log detailed information
 */
export const checkApiConnection = async () => {
  console.log('🔍 API Connection Check');
  console.log('========================');
  console.log('API Base URL:', API_BASE_URL);

  // Create a list of endpoints to check
  const endpoints = [
    '/health',
    '/api/health',
    '/cors-test',
    '/diagnostics'
  ];

  // Test each endpoint
  for (const endpoint of endpoints) {
    try {
      console.log(`\nTesting endpoint: ${endpoint}`);
      console.time('Request time');
      
      const url = `${API_BASE_URL}${endpoint}`;
      console.log('Full URL:', url);
      
      const response = await axios.get(url, {
        timeout: 10000, // 10 seconds timeout
        withCredentials: true
      });
      
      console.timeEnd('Request time');
      console.log('Status:', response.status);
      console.log('Response data:', response.data);
      
      console.log('✅ Connection successful');
      return true;
    } catch (error) {
      console.timeEnd('Request time');
      console.log('❌ Connection failed');
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Status:', error.response.status);
        console.log('Response data:', error.response.data);
        console.log('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log('No response received');
        console.log('Request details:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error message:', error.message);
      }
      
      console.log('Error config:', {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      });
    }
  }

  console.log('\n❌ All connection attempts failed');
  return false;
};

/**
 * Test specifically the auth endpoints
 */
export const testAuthEndpoints = async () => {
  console.log('🔑 Testing Auth Endpoints');
  console.log('========================');

  // Test registration endpoint with a mock user
  try {
    console.log('\nTesting /api/auth/register endpoint (without actually registering)');
    
    const url = `${API_BASE_URL}/api/auth/register`;
    console.log('Registration URL:', url);
    
    // Just check options to avoid actually creating a user
    const optionsResponse = await axios({
      method: 'OPTIONS',
      url,
      timeout: 5000,
      withCredentials: true
    });
    
    console.log('OPTIONS response status:', optionsResponse.status);
    console.log('OPTIONS response headers:', optionsResponse.headers);
    console.log('✅ Registration endpoint available');
  } catch (error) {
    console.log('❌ Registration endpoint check failed');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response headers:', error.response.headers);
    } else if (error.request) {
      console.log('No response received');
    } else {
      console.log('Error message:', error.message);
    }
  }
  
  // Test login endpoint with mock credentials
  try {
    console.log('\nTesting /api/auth/login endpoint (without actually logging in)');
    
    const url = `${API_BASE_URL}/api/auth/login`;
    console.log('Login URL:', url);
    
    // Just check options to avoid login attempts
    const optionsResponse = await axios({
      method: 'OPTIONS',
      url,
      timeout: 5000,
      withCredentials: true
    });
    
    console.log('OPTIONS response status:', optionsResponse.status);
    console.log('OPTIONS response headers:', optionsResponse.headers);
    console.log('✅ Login endpoint available');
  } catch (error) {
    console.log('❌ Login endpoint check failed');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response headers:', error.response.headers);
    } else if (error.request) {
      console.log('No response received');
    } else {
      console.log('Error message:', error.message);
    }
  }
};

/**
 * Run the connection test when this module is imported
 * in development mode
 */
if (import.meta.env.DEV) {
  console.log('Running API connection check in development mode...');
  setTimeout(() => {
    // Check general connection
    checkApiConnection().then(success => {
      console.log('API connection check complete:', success ? 'SUCCESSFUL' : 'FAILED');
      
      // Check auth endpoints only if general connection was successful
      if (success) {
        testAuthEndpoints().then(() => {
          console.log('Auth endpoints check complete');
        });
      }
    });
  }, 1000); // Wait 1 second to allow other initialization to complete
}

export default { checkApiConnection, testAuthEndpoints }; 