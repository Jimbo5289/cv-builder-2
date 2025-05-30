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
      const response = await fetch(`${serverUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: data.message || 'Login failed' 
        }));
        toast.error(data.message || 'Login failed');
        return { success: false, message: data.message };
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setState({
        user: data.user,
        loading: false,
        isAuthenticated: true,
        error: null
      });
      
      toast.success('Logged in successfully!');
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      
      // For development, if server isn't available, allow login with mock data
      if (import.meta.env.DEV && import.meta.env.VITE_DEV_MODE === 'true') {
        console.warn('DEV MODE: Server unreachable, using mock login');
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
        
        toast.success('Logged in successfully (dev mode)!');
        return { success: true };
      }
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: err.message || 'Login request failed' 
      }));
      toast.error('Login failed: Network error');
      return { success: false, message: 'Network error' };
    }
  }

  async function register(name, email, password) {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Allow mock registration in dev mode
      if (import.meta.env.DEV && import.meta.env.VITE_DEV_MODE === 'true') {
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
        
        toast.success('Registered successfully (dev mode)!');
        return { success: true };
      }
      
      const response = await fetch(`${serverUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: data.message || 'Registration failed' 
        }));
        toast.error(data.message || 'Registration failed');
        return { success: false, message: data.message };
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setState({
        user: data.user,
        loading: false,
        isAuthenticated: true,
        error: null
      });
      
      toast.success('Registered successfully!');
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      
      // For development, if server isn't available, allow registration with mock data
      if (import.meta.env.DEV && import.meta.env.VITE_DEV_MODE === 'true') {
        console.warn('DEV MODE: Server unreachable, using mock registration');
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
        
        toast.success('Registered successfully (dev mode)!');
        return { success: true };
      }
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: err.message || 'Registration request failed' 
      }));
      toast.error('Registration failed: Network error');
      return { success: false, message: 'Network error' };
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

      const response = await fetch(`${serverUrl}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to refresh user information');
      }

      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setState(prev => ({
        ...prev,
        user: data.user
      }));
      
      return true;
    } catch (error) {
      console.error('Refresh user error:', error);
      return false;
    }
  }

  async function updateUserInfo(userData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // For development mode, directly update the local user data
      if (import.meta.env.DEV && (token === 'dev-token' || import.meta.env.VITE_SKIP_AUTH === 'true')) {
        console.log('DEV MODE: Updating user profile directly');
        const updatedUser = {
          ...state.user,
          ...userData
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setState(prev => ({
          ...prev,
          user: updatedUser
        }));
        
        toast.success('Profile updated successfully!');
        return { success: true };
      }
      
      // In production, call the API
      const response = await fetch(`${serverUrl}/api/users/profile`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      // Update the user in state and localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setState(prev => ({
        ...prev,
        user: data.user
      }));
      
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    getAuthHeader,
    refreshUser,
    updateUserInfo
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