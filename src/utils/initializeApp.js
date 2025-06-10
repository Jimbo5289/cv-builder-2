/**
 * Initialize app with correct user data
 * This runs before the authentication system to ensure the user's name is correctly set
 */

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
  } catch (error) {
    console.error('Error initializing app data:', error);
  }
}

// Initialize as soon as the file is imported
initializeAppData();

export default initializeAppData; 