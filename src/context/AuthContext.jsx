import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useServer } from './ServerContext';

// Create the context
const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  error: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  refreshUser: () => {},
  updateUserInfo: () => {},
  getAuthHeader: () => ({})
});

// Safe JSON parse function
const safeJsonParse = (str, defaultValue = null) => {
  if (!str) return defaultValue;
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error('JSON parse error:', e);
    return defaultValue;
  }
};

// Provider component
function AuthProvider({ children }) {
  const { serverUrl } = useServer();
  const [state, setState] = useState(() => {
    try {
      // Initialize state from localStorage with proper error handling
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = safeJsonParse(userStr);
      
      if (userStr && !user) {
        // If we had a string but couldn't parse it, clear it
        console.warn('Removing invalid user data from localStorage');
        localStorage.removeItem('user');
      }
      
      return {
        user,
        loading: true,
        isAuthenticated: !!token,
        error: null
      };
    } catch (e) {
      console.error('Error initializing auth state:', e);
      return {
        user: null,
        loading: true,
        isAuthenticated: false,
        error: null
      };
    }
  });

  const checkUserAuth = useCallback(async () => {
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
          const userStr = localStorage.getItem('user');
          const user = safeJsonParse(userStr);
          
          if (!user) {
            const mockUser = {
              id: 'dev-user-id',
              email: 'test@example.com',
              name: 'Test User',
              role: 'admin',
              isPremium: true,
              premiumTier: 'professional',
              subscription: {
                status: 'active',
                plan: 'professional',
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                features: ['cv-analysis', 'job-matching', 'ai-enhancement', 'unlimited-cvs', 'export-formats']
              },
              preferences: {
                theme: 'light',
                notifications: true,
                analytics: true
              },
              usage: {
                cvCount: 5,
                analyzeCount: 10,
                downloadCount: 15
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            localStorage.setItem('user', JSON.stringify(mockUser));
            localStorage.setItem('token', 'dev-token');
            
            setState(prev => ({
              ...prev,
              user: mockUser,
              loading: false,
              isAuthenticated: true,
              error: null
            }));
          } else {
            setState(prev => ({
              ...prev,
              user,
              loading: false,
              isAuthenticated: true,
              error: null
            }));
          }
          return;
        }
        
        // For dev mode with custom token
        if (token === 'dev-token') {
          const userStr = localStorage.getItem('user');
          const user = safeJsonParse(userStr);
          
          if (user) {
            setState(prev => ({
              ...prev,
              user,
              loading: false,
              isAuthenticated: true,
              error: null
            }));
            return;
          } else {
            // Create a new mock user
            const mockUser = {
              id: 'dev-user-id',
              email: 'dev@example.com',
              name: 'Development User',
              role: 'admin',
              isPremium: true,
              premiumTier: 'professional',
              subscription: {
                status: 'active',
                plan: 'professional',
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                features: ['cv-analysis', 'job-matching', 'ai-enhancement', 'unlimited-cvs', 'export-formats']
              },
              preferences: {
                theme: 'light',
                notifications: true,
                analytics: true
              },
              usage: {
                cvCount: 5,
                analyzeCount: 10,
                downloadCount: 15
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            localStorage.setItem('user', JSON.stringify(mockUser));
            
            setState(prev => ({
              ...prev,
              user: mockUser,
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
                name: 'Development User',
                role: 'admin',
                isPremium: true,
                premiumTier: 'professional',
                subscription: {
                  status: 'active',
                  plan: 'professional',
                  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                  features: ['cv-analysis', 'job-matching', 'ai-enhancement', 'unlimited-cvs', 'export-formats']
                },
                preferences: {
                  theme: 'light',
                  notifications: true,
                  analytics: true
                },
                usage: {
                  cvCount: 5,
                  analyzeCount: 10,
                  downloadCount: 15
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
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
        if (data && data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          
          setState({
            user: data.user,
            loading: false,
            isAuthenticated: true,
            error: null
          });
        } else {
          throw new Error('Invalid user data received');
        }
      } catch (error) {
        console.error('Authentication check error:', error);
        
        if (import.meta.env.DEV) {
          console.log('DEV MODE: Creating mock user after auth check error');
          // In development, we can create a mock user
          const mockUser = {
            id: 'mock-user-id',
            email: 'dev@example.com',
            name: 'Development User',
            role: 'admin',
            isPremium: true,
            premiumTier: 'professional',
            subscription: {
              status: 'active',
              plan: 'professional',
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
              features: ['cv-analysis', 'job-matching', 'ai-enhancement', 'unlimited-cvs', 'export-formats']
            },
            preferences: {
              theme: 'light',
              notifications: true,
              analytics: true
            },
            usage: {
              cvCount: 5,
              analyzeCount: 10,
              downloadCount: 15
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          localStorage.setItem('user', JSON.stringify(mockUser));
          localStorage.setItem('token', 'dev-token');
          
          setState({
            user: mockUser,
            loading: false,
            isAuthenticated: true,
            error: null
          });
        } else {
          setState(prev => ({
            ...prev,
            loading: false,
            isAuthenticated: false,
            error: error.message || 'Authentication failed'
          }));
        }
      }
    } catch (error) {
      console.error('Error in checkUserAuth:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        isAuthenticated: false,
        error: error.message
      }));
    }
  }, [serverUrl]);

  useEffect(() => {
    const checkAuth = async () => {
      await checkUserAuth();
    };
    checkAuth();
  }, [serverUrl, checkUserAuth]);

  async function login(email, password) {
    try {
      // Dev mode auto-login
      if (import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === 'true') {
        console.log('DEV MODE: Auto-login with mock credentials');
        const mockUser = {
          id: 'dev-user-id',
          email: email || 'dev@example.com',
          name: 'Development User',
          role: 'admin',
          isPremium: true,
          premiumTier: 'professional',
          subscription: {
            status: 'active',
            plan: 'professional',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            features: ['cv-analysis', 'job-matching', 'ai-enhancement', 'unlimited-cvs', 'export-formats']
          },
          preferences: {
            theme: 'light',
            notifications: true,
            analytics: true
          },
          usage: {
            cvCount: 5,
            analyzeCount: 10,
            downloadCount: 15
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', 'dev-token');
        
        setState({
          user: mockUser,
          loading: false,
          isAuthenticated: true,
          error: null
        });
        
        return { success: true };
      }
      
      // Special dev mode handling for 2FA test account
      if (import.meta.env.DEV && email === '2fa-test@example.com' && password === 'Test@123') {
        console.log('DEV MODE: 2FA test account login');
        
        // Check if 2FA is enabled in local storage
        if (localStorage.getItem('mock_2fa_enabled') === 'true') {
          console.log('DEV MODE: 2FA verification required');
          return {
            success: false,
            requiresTwoFactor: true,
            userId: 'mock-2fa-user-id'
          };
        } else {
          // If 2FA not enabled, auto-login
          const mockUser = {
            id: 'mock-2fa-user-id',
            email: email,
            name: '2FA Test User'
          };
          
          localStorage.setItem('user', JSON.stringify(mockUser));
          localStorage.setItem('token', 'dev-token');
          
          setState({
            user: mockUser,
            loading: false,
            isAuthenticated: true,
            error: null
          });
          
          return { success: true };
        }
      }
      
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch(`${serverUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Check if 2FA is required
      if (data.requiresTwoFactor) {
        return {
          success: false,
          requiresTwoFactor: true,
          userId: data.userId
        };
      }
      
      // Regular successful login
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setState({
        user: data.user,
        loading: false,
        isAuthenticated: true,
        error: null
      });
      
      toast.success('Login successful');
      return { success: true };
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setState(prev => ({
        ...prev,
        loading: false,
        isAuthenticated: false,
        error: error.message
      }));
      
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  }

  // Validate 2FA token during login
  async function validate2FA(userId, token) {
    try {
      // Dev mode handling for 2FA test account
      if (import.meta.env.DEV && userId === 'mock-2fa-user-id') {
        console.log('DEV MODE: Validating 2FA token');
        
        // In dev mode, any 6-digit code is valid
        if (token.length === 6) {
          const mockUser = {
            id: 'mock-2fa-user-id',
            email: '2fa-test@example.com',
            name: '2FA Test User'
          };
          
          localStorage.setItem('user', JSON.stringify(mockUser));
          localStorage.setItem('token', 'dev-token');
          
          setState({
            user: mockUser,
            loading: false,
            isAuthenticated: true,
            error: null
          });
          
          toast.success('Login successful');
          return { success: true };
        } else {
          throw new Error('Invalid verification code');
        }
      }
      
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch(`${serverUrl}/api/2fa/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid verification code');
      }
      
      // Fetch user data again after successful 2FA validation
      const userResponse = await fetch(`${serverUrl}/api/auth/user/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const userData = await userResponse.json();
      
      if (!userResponse.ok) {
        throw new Error(userData.error || 'Failed to fetch user data');
      }
      
      localStorage.setItem('token', userData.accessToken);
      localStorage.setItem('user', JSON.stringify(userData.user));
      
      setState({
        user: userData.user,
        loading: false,
        isAuthenticated: true,
        error: null
      });
      
      toast.success('Login successful');
      return { success: true };
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        isAuthenticated: false,
        error: error.message
      }));
      
      toast.error(error.message || 'Authentication failed');
      return { success: false, error: error.message };
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
    try {
      const token = localStorage.getItem('token');
      let headers = {};
      
      // For development mode, always provide a dev token
      if (import.meta.env.DEV) {
        console.log('DEV MODE: Using development token for API request');
        
        // Check if we have a valid token already
        if (token && token !== 'undefined' && token !== 'null') {
          headers['Authorization'] = `Bearer ${token}`;
        } else {
          // Create a new dev token if none exists
          const devToken = 'dev-token-' + Math.random().toString(36).substring(2, 15);
          console.log('DEV MODE: Created new development token');
          localStorage.setItem('token', devToken);
          headers['Authorization'] = `Bearer ${devToken}`;
        }
      } 
      // Production token handling
      else if (token && token !== 'undefined' && token !== 'null') {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Add Content-Type header unless skipped
      if (!skipContentType) {
        headers['Content-Type'] = 'application/json';
      }
      
      return headers;
    } catch (e) {
      console.error('Error in getAuthHeader:', e);
      // Provide sensible defaults even in error case
      return skipContentType ? {} : { 'Content-Type': 'application/json' };
    }
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
      
      try {
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch (e) {
        console.error('Failed to save user to localStorage:', e);
      }
      
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

  // Expose the context values
  return (
    <AuthContext.Provider value={{
      user: state.user,
      loading: state.loading,
      isAuthenticated: state.isAuthenticated,
      error: state.error,
      login,
      validate2FA,
      register,
      logout,
      refreshUser,
      updateUserInfo,
      getAuthHeader
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider as default, useAuth }; 