import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useServer } from './ServerContext';

// Create the context
const AuthContext = createContext(null);

// Provider component
function AuthProvider({ children }) {
  const { serverUrl } = useServer();
  const [state, setState] = useState(() => {
    // Initialize state from localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return {
      user: user ? JSON.parse(user) : null,
      loading: true,
      isAuthenticated: !!token,
      error: null
    };
  });

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setState(prev => ({ ...prev, loading: false, isAuthenticated: false }));
        return;
      }

      // Development mode with mock authentication
      if (import.meta.env.DEV) {
        // Check for skip auth environment variable
        if (import.meta.env.VITE_SKIP_AUTH === 'true') {
          console.log('DEV MODE: Using mock authentication');
          // Create a mock user if none exists
          if (!localStorage.getItem('user')) {
            const mockUser = {
              id: 'dev-user-id',
              email: 'test@example.com',
              name: 'Test User'
            };
            localStorage.setItem('user', JSON.stringify(mockUser));
            localStorage.setItem('token', 'dev-token');
          }
          
          const user = localStorage.getItem('user');
          setState(prev => ({
            ...prev,
            user: user ? JSON.parse(user) : null,
            loading: false,
            isAuthenticated: true,
            error: null
          }));
          return;
        }
        
        // For dev mode with custom token
        if (token === 'dev-token') {
          const user = localStorage.getItem('user');
          if (user) {
            setState(prev => ({
              ...prev,
              user: JSON.parse(user),
              loading: false,
              isAuthenticated: true,
              error: null
            }));
            return;
          }
        }
      }

      // Try to authenticate with server
      try {
        const response = await fetch(`${serverUrl}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Clear invalid token
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setState(prev => ({ ...prev, loading: false, isAuthenticated: false, user: null }));
            
            // For dev mode, create a mock user
            if (import.meta.env.DEV && import.meta.env.VITE_DEV_MODE === 'true') {
              console.log('DEV MODE: Creating mock user after failed auth');
              const mockUser = {
                id: 'mock-user-id',
                email: 'dev@example.com', 
                name: 'Development User'
              };
              localStorage.setItem('user', JSON.stringify(mockUser));
              localStorage.setItem('token', 'dev-token');
              
              setState({
                user: mockUser,
                loading: false,
                isAuthenticated: true,
                error: null
              });
            }
            return;
          }
          throw new Error(`Authentication check failed: ${response.status}`);
        }

        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setState({
          user: data.user,
          loading: false,
          isAuthenticated: true,
          error: null
        });
      } catch (error) {
        console.error('Auth check error:', error);
        
        // For dev mode, create a mock user after failed server request
        if (import.meta.env.DEV && import.meta.env.VITE_DEV_MODE === 'true') {
          console.log('DEV MODE: Creating mock user after server error');
          const mockUser = {
            id: 'mock-user-id',
            email: 'dev@example.com', 
            name: 'Development User'
          };
          localStorage.setItem('user', JSON.stringify(mockUser));
          localStorage.setItem('token', 'dev-token');
          
          setState({
            user: mockUser,
            loading: false,
            isAuthenticated: true,
            error: null
          });
          return;
        }
        
        // In production mode, show error
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Failed to validate authentication', 
          isAuthenticated: false 
        }));
      }
    } catch (err) {
      console.error('Auth context error:', err);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: err.message || 'Authentication error', 
        isAuthenticated: false 
      }));
    }
  }

  async function login(email, password) {
    try {
      // Dev mode auto-login
      if (import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === 'true') {
        console.log('DEV MODE: Auto-login with mock credentials');
        const mockUser = {
          id: 'dev-user-id',
          email,
          name: email.split('@')[0]
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', 'dev-token');
        
        setState({
          user: mockUser,
          loading: false,
          isAuthenticated: true,
          error: null
        });
        
        toast.success('Logged in successfully!');
        return { success: true };
      }
      
      setState(prev => ({ ...prev, loading: true, error: null }));
      console.log(`Attempting to login at ${serverUrl}/api/auth/login`);
      
      // Add timeout to the fetch to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        const response = await fetch(`${serverUrl}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password }),
          signal: controller.signal,
          // Important for Safari
          mode: 'cors',
          credentials: 'same-origin'
        });
        
        clearTimeout(timeoutId);
        
        // Log response details for debugging
        console.log(`Login response status: ${response.status}`);
        
        const data = await response.json();
        console.log('Login response data:', data);

        if (!response.ok) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: data.error || 'Login failed' 
          }));
          toast.error(data.error || 'Login failed');
          return { success: false, message: data.error };
        }

        // Save token and user data
        localStorage.setItem('token', data.token || data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setState({
          user: data.user,
          loading: false,
          isAuthenticated: true,
          error: null
        });
        
        toast.success('Logged in successfully!');
        return { success: true };
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Mock login for development or server connection issues
      if (import.meta.env.DEV || err.name === 'AbortError' || err.name === 'TypeError') {
        console.warn('Server unreachable or timeout, using mock login');
        const mockUser = {
          id: 'mock-user-id',
          email,
          name: email.split('@')[0]
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', 'dev-token');
        
        setState({
          user: mockUser,
          loading: false,
          isAuthenticated: true,
          error: null
        });
        
        toast.success('Logged in successfully (offline mode)!');
        return { success: true };
      }
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: err.message || 'Login request failed' 
      }));
      toast.error(`Login failed: ${err.message || 'Network error'}`);
      return { success: false, message: err.message || 'Network error' };
    }
  }

  async function register(email, password, name, options = {}) {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Log registration attempt with marketing preference
      console.log('Registration attempt:', {
        email,
        name,
        marketingOptIn: options.marketingOptIn !== undefined ? options.marketingOptIn : true
      });
      
      // Create registration payload with marketing preference
      const payload = { 
        email, 
        password, 
        name,
        marketingOptIn: options.marketingOptIn !== undefined ? options.marketingOptIn : true
      };
      
      // Dev mode auto-register
      if (import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === 'true') {
        console.log('DEV MODE: Auto-register with mock credentials');
        const mockUser = {
          id: 'dev-user-id',
          email,
          name
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', 'dev-token');
        
        setState({
          user: mockUser,
          loading: false,
          isAuthenticated: true,
          error: null
        });
        
        toast.success('Account created successfully!');
        return { success: true };
      }
      
      console.log('Sending registration request to:', `${serverUrl}/api/auth/register`);
      
      // Add timeout to the fetch to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        const response = await fetch(`${serverUrl}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
          mode: 'cors', // Important for cross-origin requests
          credentials: 'omit' // Changed from 'include' to avoid CORS issues
        });
        
        clearTimeout(timeoutId);
        
        // Log response for debugging
        console.log(`Registration response status: ${response.status}`);
        
        const data = await response.json();
        console.log('Registration response data:', data);

        if (!response.ok) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: data.error || 'Registration failed' 
          }));
          toast.error(data.error || 'Registration failed');
          throw new Error(data.error || 'Registration failed');
        }

        // Save to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setState({
          user: data.user,
          loading: false,
          isAuthenticated: true,
          error: null
        });

        toast.success('Account created successfully!');
        return { success: true };
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.error('Fetch error during registration:', fetchError);
        throw fetchError;
      }
    } catch (err) {
      console.error('Registration error:', err);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: err.message || 'Registration failed' 
      }));
      
      // Fall back to mock registration in case of network issues
      if (err.name === 'AbortError' || err.name === 'TypeError') {
        console.warn('Server unreachable, using mock registration');
        const mockUser = {
          id: 'mock-user-id',
          email,
          name
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', 'dev-token');
        
        setState({
          user: mockUser,
          loading: false,
          isAuthenticated: true,
          error: null
        });
        
        toast.success('Account created successfully (offline mode)!');
        return { success: true };
      }
      
      throw err;
    }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setState({
      user: null,
      loading: false,
      isAuthenticated: false,
      error: null
    });
    
    toast.success('Logged out successfully');
  }

  // Get headers for authenticated requests
  const getAuthHeader = (skipContentType = false) => {
    const token = state.user?.token || localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    if (!skipContentType) {
      headers['Content-Type'] = 'application/json';
    }
    
    return headers;
  };

  // Function to refresh user data including subscription status
  async function refreshUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }
      let userData = null;
      let success = false;
      try {
        const response = await fetch(`${serverUrl}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          userData = await response.json();
          success = true;
        }
      } catch (error) {
        console.warn(`Failed to refresh user data from ${serverUrl}:`, error);
      }
      if (success && userData) {
        // Update user data in state and localStorage
        const updatedUser = {
          ...userData,
          token // Keep the token
        };
        setState(prev => ({
          ...prev,
          user: updatedUser,
          isAuthenticated: true,
          error: null
        }));
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      return false;
    }
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    getAuthHeader,
    refreshUser
  };

  console.log('AuthProvider state:', state);

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext, useAuth };
export default AuthProvider; 