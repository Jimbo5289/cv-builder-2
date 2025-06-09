/**
 * Development Authentication Setup
 * This script sets up a mock user and authentication token for development testing
 */

// Mock user data
const mockUser = {
  id: 'dev-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  subscription: {
    status: 'active',
    plan: 'premium',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
  }
};

// Mock token
const mockToken = 'dev-token';

// Set up localStorage items
localStorage.setItem('user', JSON.stringify(mockUser));
localStorage.setItem('token', mockToken);

// Log success
console.log('Development authentication setup complete');
console.log('User:', mockUser);
console.log('Token:', mockToken);

// You can run this script in the browser console when testing 