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

      // For development mode with mock token
      if (import.meta.env.DEV && token === 'dev-token') {
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

      const response = await fetch(`${serverUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setState(prev => ({
          ...prev,
          user: userData,
          loading: false,
          isAuthenticated: true,
          error: null
        }));
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setState(prev => ({
          ...prev,
          user: null,
          loading: false,
          isAuthenticated: false,
          error: 'Session expired'
        }));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
        isAuthenticated: false,
        error: error.message
      }));
    }
  }

  async function login(email, password) {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const response = await fetch(`${serverUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      const userData = {
        ...data.user,
        token: data.token
      };

      setState(prev => ({
        ...prev,
        user: userData,
        isAuthenticated: true,
        error: null
      }));
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      toast.success('Logged in successfully');
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      setState(prev => ({ ...prev, error: error.message }));
      toast.error(error.message || 'Failed to login');
      throw error;
    }
  }

  async function register(email, password, name) {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const response = await fetch(`${serverUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }

      const data = await response.json();
      const userData = {
        ...data.user,
        token: data.token
      };

      setState(prev => ({
        ...prev,
        user: userData,
        isAuthenticated: true,
        error: null
      }));
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      toast.success('Registered successfully');
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      setState(prev => ({ ...prev, error: error.message }));
      toast.error(error.message || 'Failed to register');
      throw error;
    }
  }

  function logout() {
    setState(prev => ({
      ...prev,
      user: null,
      isAuthenticated: false,
      error: null
    }));
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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