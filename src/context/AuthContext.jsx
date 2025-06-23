import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useServer } from './ServerContext';
import axios from 'axios';

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
  changePassword: () => {},
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

  // Automatic token refresh function
  const refreshToken = useCallback(async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (!refreshTokenValue) {
        console.warn('No refresh token available');
        return null;
      }

      console.log('Refreshing access token...');
      const response = await fetch(`${serverUrl}/api/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Token refresh failed:', errorData);
        
        // If refresh token is expired or invalid, clear tokens and redirect to login
        if (response.status === 401) {
          console.warn('Refresh token expired, clearing tokens');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setState({
            user: null,
            loading: false,
            isAuthenticated: false,
            error: 'Session expired. Please log in again.'
          });
          return null;
        }
        
        throw new Error(errorData.error || 'Failed to refresh token');
      }

      const data = await response.json();
      console.log('Token refreshed successfully');
      
      // Update the access token
      localStorage.setItem('token', data.accessToken);
      setAuthHeader(data.accessToken);
      
      return data.accessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // If refresh fails, clear tokens
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setState({
        user: null,
        loading: false,
        isAuthenticated: false,
        error: 'Authentication failed. Please log in again.'
      });
      return null;
    }
  }, [serverUrl]);

  // Setup axios interceptor for automatic token refresh
  useEffect(() => {
    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = (error, token = null) => {
      failedQueue.forEach(prom => {
        if (error) {
          prom.reject(error);
        } else {
          prom.resolve(token);
        }
      });
      
      failedQueue = [];
    };

    // Request interceptor to add auth header
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token && token !== 'undefined' && token !== 'null') {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token expiration
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log('Received 401 error, attempting token refresh...');
          
          if (isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axios(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const newToken = await refreshToken();
            if (newToken) {
              processQueue(null, newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axios(originalRequest);
            } else {
              processQueue(new Error('Failed to refresh token'), null);
              return Promise.reject(error);
            }
          } catch (refreshError) {
            processQueue(refreshError, null);
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshToken]);

  const checkUserAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setState(prev => ({ ...prev, loading: false, isAuthenticated: false }));
        return;
      }

      // Set the auth headers with the token
      setAuthHeader(token);

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
          }
        }
      }

      // Check if user data exists in localStorage first for faster initial load
      const userStr = localStorage.getItem('user');
      const cachedUser = safeJsonParse(userStr);
      
      if (cachedUser && token) {
        // Set authenticated state immediately with cached user data
        setState(prev => ({
          ...prev,
          user: cachedUser,
          loading: false,
          isAuthenticated: true,
          error: null
        }));
        
        // Then verify with server in background (don't block UI)
        // This prevents the redirect-to-login issue on refresh
        setTimeout(async () => {
          try {
            const response = await fetch(`${serverUrl}/api/auth/me`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });

            if (response.ok) {
              const data = await response.json();
              const user = data.user || data; // Handle both wrapped and direct user responses
              if (user && user.id) {
                localStorage.setItem('user', JSON.stringify(user));
                setState(prev => ({
                  ...prev,
                  user: user
                }));
              }
            } else if (response.status === 401) {
              // Only clear auth if server explicitly says unauthorized
              console.log('Background auth check failed - clearing authentication');
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              setState({
                user: null,
                loading: false,
                isAuthenticated: false,
                error: 'Session expired. Please log in again.'
              });
            }
          } catch (error) {
            console.log('Background auth check failed (network error):', error.message);
            // Don't clear auth on network errors - user might be offline
          }
        }, 100);
        
        return;
      }

      // Production authentication check with automatic retry on failure
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
            // Try to refresh token
            console.log('Auth check failed with 401, attempting token refresh...');
            const newToken = await refreshToken();
            
            if (newToken) {
              // Retry auth check with new token
              const retryResponse = await fetch(`${serverUrl}/api/auth/me`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${newToken}`
                }
              });
              
              if (retryResponse.ok) {
                const retryData = await retryResponse.json();
                const user = retryData.user || retryData; // Handle both wrapped and direct user responses
                if (user && user.id) {
                  localStorage.setItem('user', JSON.stringify(user));
                  
                  setState({
                    user: user,
                    loading: false,
                    isAuthenticated: true,
                    error: null
                  });
                  return;
                }
              }
            }
            
            // Clear invalid token
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
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
        const user = data.user || data; // Handle both wrapped and direct user responses
        if (user && user.id) {
          localStorage.setItem('user', JSON.stringify(user));
          
          setState({
            user: user,
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
  }, [serverUrl, refreshToken]);

  useEffect(() => {
    const checkAuth = async () => {
      await checkUserAuth();
    };
    checkAuth();
  }, [serverUrl, checkUserAuth]);

  async function login(email, password) {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // If we have a name from local storage, use it
      let userName = null;
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.name && parsedUser.name !== 'Development User') {
            userName = parsedUser.name;
            console.log('Using stored name from localStorage:', userName);
          }
        }
      } catch (e) {
        console.warn('Failed to parse user data from localStorage', e);
      }
      
      // Development mode with mock authentication
      if (import.meta.env.DEV && (email === 'dev@example.com' || import.meta.env.VITE_SKIP_AUTH === 'true')) {
        console.log('DEV MODE: Using mock login');
        
        // Use the real user name or a preferred name based on email
        let userDisplayName = userName;
        
        // If no stored name, use logic to determine a name
        if (!userDisplayName) {
          if (email === 'jamesingleton1971@gmail.com') {
            userDisplayName = 'James Singleton';
          } else if (email === 'test@example.com') {
            userDisplayName = 'Test User';
          } else {
            // Extract name from email or use default
            const emailName = email.split('@')[0];
            userDisplayName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
          }
        }
        
        // Create a mock user with the real name
        const mockUser = {
          id: 'dev-user-id',
          email: email || 'dev@example.com',
          name: userDisplayName,
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
        
        // Set auth headers with the token
        setAuthHeader('dev-token');
        
        setState(prev => ({
          ...prev,
          user: mockUser,
          loading: false,
          isAuthenticated: true,
          error: null
        }));
        
        return { success: true, user: mockUser, token: 'dev-token' };
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
      
      // Store refresh token if provided
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
        console.log('Refresh token stored for automatic token refresh');
      }
      
      // Set auth headers
      setAuthHeader(data.accessToken);
      
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

  async function register(userData) {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Allow mock registration in dev mode
      if (import.meta.env.DEV && import.meta.env.VITE_DEV_MODE === 'true') {
        const mockUser = {
          id: 'mock-user-id',
          email: userData.email,
          name: userData.firstName && userData.lastName 
            ? `${userData.firstName} ${userData.lastName}`
            : (userData.name || 'Development User')
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
      
      // Format the data to match the backend API
      let formattedData;
      
      // Handle case when userData might be individual parameters from older code
      if (arguments.length > 1) {
        const [name, email, password, phone] = arguments;
        formattedData = {
          name,
          email,
          password,
          phone
        };
      } else {
        // Handle standard object format
        formattedData = {
          name: userData.firstName && userData.lastName 
            ? `${userData.firstName} ${userData.lastName}`
            : userData.name,
          email: userData.email,
          password: userData.password,
          phone: userData.phone
        };
      }
      
      console.log('Attempting registration with server:', serverUrl);
      
      try {
        // Use the API utility instead of direct fetch
        const response = await fetch(`${serverUrl}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formattedData),
          credentials: 'include'
        });

        // Check for network errors before proceeding
        if (!response.ok) {
          const data = await response.json();
          console.error('Registration error response:', data);
          
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: data.error || data.message || 'Registration failed' 
          }));
          
          // Check for specific error types
          if (data.error === 'Database connection issue') {
            toast.error('Server database connection issue. Please try again later.');
          } else {
            toast.error(data.error || data.message || 'Registration failed');
          }
          
          return { 
            success: false, 
            error: data.error || 'Registration failed', 
            message: data.message || 'Could not complete registration' 
          };
        }

        const data = await response.json();
        
        // On success, store the user data and token
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
      } catch (networkErr) {
        console.error('Network error during registration:', networkErr);
        
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Network error connecting to the server' 
        }));
        
        toast.error('Connection error. Please check your internet and try again.');
        return { 
          success: false, 
          error: 'Network error', 
          message: 'Cannot connect to the server. Please check your internet connection.' 
        };
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      // For development, if server isn't available, allow registration with mock data
      if (import.meta.env.DEV && import.meta.env.VITE_DEV_MODE === 'true') {
        console.warn('DEV MODE: Server unreachable, using mock registration');
        const mockUser = {
          id: 'mock-user-id',
          email: userData.email,
          name: userData.firstName && userData.lastName 
            ? `${userData.firstName} ${userData.lastName}`
            : (userData.name || 'Development User')
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
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Clear auth headers
    setAuthHeader(null);
    
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
        return { success: false, error: 'No authentication token' };
      }
      
      // Set auth headers
      setAuthHeader(token);
      
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

      const userData = await response.json();
      console.log('RefreshUser API response:', userData);
      
      // The /api/auth/me endpoint returns the user directly, not wrapped in a data property
      const user = userData.user || userData; // Handle both wrapped and direct user responses
      
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.error('Failed to save user to localStorage:', e);
      }
      
      setState(prev => ({
        ...prev,
        user: user
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
        toast.error('Authentication required');
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
      
      // Log the request details in dev mode
      if (import.meta.env.DEV) {
        console.log('Making profile update API request:', {
          url: `${serverUrl}/api/users/profile`,
          method: 'PUT',
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
          },
          data: userData
        });
      }

      // Attempt to refreshUser first to ensure we have a valid token
      await refreshUser();
      
      // Get fresh headers after the refresh
      const headers = getAuthHeader();
      
      // In production, call the API
      const response = await fetch(`${serverUrl}/api/users/profile`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      // Log the response status in dev mode
      if (import.meta.env.DEV) {
        console.log('Profile update API response status:', response.status);
      }
      
      // Handle authentication errors
      if (response.status === 401 || response.status === 500) {
        console.log('Authentication error during profile update:', response.status);
        
        // For development mode, save data locally and succeed
        if (import.meta.env.DEV) {
          console.log('DEV MODE: Updating user profile locally after auth error');
          const updatedUser = {
            ...state.user,
            ...userData
          };
          
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          setState(prev => ({
            ...prev,
            user: updatedUser
          }));
          
          toast.success('Profile updated successfully in development mode!');
          return { success: true };
        }
        
        // For production, show appropriate error
        toast.error('Authentication error. Please log in again.');
        logout();
        throw new Error('Authentication failed. Please log in again.');
      }
      
      // Handle other error responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to update profile');
      }
      
      const data = await response.json();
      
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
      
      // For development mode, update locally despite error
      if (import.meta.env.DEV) {
        console.log('DEV MODE: Updating user profile locally after error');
        const updatedUser = {
          ...state.user,
          ...userData
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setState(prev => ({
          ...prev,
          user: updatedUser
        }));
        
        toast.success('Profile updated in development mode!');
        return { success: true };
      }
      
      toast.error(error.message || 'Failed to update profile');
      return { success: false, message: error.message || 'Failed to update profile' };
    }
  }

  async function changePassword(currentPassword, newPassword) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        throw new Error('Authentication required');
      }

      console.log('Changing password...');
      
      const response = await fetch(`${serverUrl}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      const data = await response.json();
      console.log('Password changed successfully');
      toast.success('Password changed successfully!');
      
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Change password error:', error);
      toast.error(error.message || 'Failed to change password');
      return { success: false, message: error.message || 'Failed to change password' };
    }
  }

  // Set auth token in API request headers
  function setAuthHeader(token) {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // In development mode, also add user data to headers for special development fallbacks
      if (import.meta.env.DEV) {
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            axios.defaults.headers.common['X-User-Data'] = userData;
          } catch (e) {
            console.warn('Failed to add user data to headers', e);
          }
        }
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['X-User-Data'];
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
      changePassword,
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