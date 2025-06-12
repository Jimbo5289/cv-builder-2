/**
 * Initialize app with correct user data
 * This runs before the authentication system to ensure the user's name is correctly set
 */

// Import the API checker for debugging
import '../utils/apiChecker';

export function initializeAppData() {
  try {
    // Check if we have user data in localStorage
    const userData = localStorage.getItem('user');
    
    if (userData) {
      // Parse the existing user data
      const user = JSON.parse(userData);
      
      // If name is "Development User", update it
      if (user.name === 'Development User') {
        console.log('Fixing user name in localStorage');
        
        // Replace with correct name
        user.name = 'James Singleton';
        
        // Save back to localStorage
        localStorage.setItem('user', JSON.stringify(user));
      }
    }

    // Check for any error messages in localStorage
    const errorData = localStorage.getItem('api_error');
    if (errorData) {
      console.warn('Previous API error found:', errorData);
      // Clear the error data after displaying
      localStorage.removeItem('api_error');
    }
  } catch (error) {
    console.error('Error initializing app data:', error);
  }
}

// Initialize as soon as the file is imported
initializeAppData();

// Add a global handler for network errors
window.addEventListener('unhandledrejection', function(event) {
  const error = event.reason;
  
  // Check if it's a network error related to our API
  if (error && error.message && 
      (error.message.includes('timeout') || 
       error.message.includes('Network Error') ||
       error.message.includes('Failed to fetch'))) {
    
    console.error('API connection error:', error);
    
    // Store the error message for display
    try {
      localStorage.setItem('api_error', JSON.stringify({
        message: error.message,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {
      console.error('Error storing API error:', e);
    }
  }
});

export default initializeAppData; 