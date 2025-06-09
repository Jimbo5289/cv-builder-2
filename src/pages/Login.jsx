/* eslint-disable */
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';

export default function Login() {
  const { login, validate2FA, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [require2FA, setRequire2FA] = useState(false);
  const [userId, setUserId] = useState(null);
  
  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleVerificationChange = (e) => {
    // Only allow digits and limit to 6 characters
    const value = e.target.value.replace(/\D/g, '').substring(0, 6);
    setVerificationCode(value);
    
    // Clear error when user starts typing
    if (errors.verification) {
      setErrors(prev => ({
        ...prev,
        verification: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateVerificationCode = () => {
    const newErrors = {};
    
    if (!verificationCode || verificationCode.length !== 6) {
      newErrors.verification = 'A 6-digit code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (require2FA) {
      if (!validateVerificationCode()) return;
      
      setIsSubmitting(true);
      
      // Handle development mode
      if (isDevelopment && localStorage.getItem('mock_2fa_enabled') === 'true') {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Accept any 6-digit code in development mode
        if (verificationCode.length === 6) {
          // Redirect to intended destination or dashboard
          const from = location.state?.from?.pathname || '/';
          navigate(from);
          return;
        } else {
          setErrors({ verification: 'Invalid verification code' });
          setIsSubmitting(false);
          return;
        }
      }
      
      const result = await validate2FA(userId, verificationCode);
      setIsSubmitting(false);
      
      if (result.success) {
        // Redirect to intended destination or dashboard
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      } else {
        setErrors({ verification: result.error || 'Invalid verification code' });
      }
    } else {
      if (!validateForm()) return;
      
      setIsSubmitting(true);
      
      // Handle development mode
      if (isDevelopment && formData.email === '2fa-test@example.com') {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simulate 2FA requirement for test account
        setRequire2FA(true);
        setUserId('mock-user-id');
        setIsSubmitting(false);
        return;
      }
      
      const result = await login(formData.email, formData.password);
      setIsSubmitting(false);
      
      if (result.success) {
        // Redirect to intended destination or dashboard
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      } else if (result.requiresTwoFactor) {
        // Switch to 2FA verification mode
        setRequire2FA(true);
        setUserId(result.userId);
      } else {
        setErrors({ general: result.error || 'Login failed' });
      }
    }
  };

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
            {require2FA ? 'Enter Verification Code' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {require2FA 
              ? 'Please enter the 6-digit code from your authenticator app' 
              : 'Or '}
            {!require2FA && (
              <Link to="/register" className="font-medium text-[#E78F81] hover:text-[#d36e62] dark:text-blue-400 dark:hover:text-blue-300">
                create a new account
              </Link>
            )}
          </p>
        </div>
        
        {errors.general && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md flex items-start">
            <FiAlertCircle className="text-red-600 dark:text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-500">{errors.general}</p>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!require2FA ? (
            // Login form
            <>
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="relative">
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`appearance-none rounded-t-md relative block w-full px-3 py-2 pl-10 border ${
                      errors.email ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
                    } text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-[#E78F81] focus:border-[#E78F81] dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm`}
                    placeholder=""
                  />
                  {formData.email.length === 0 && (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-10 pointer-events-none">
                      <span className="text-gray-400/60 dark:text-gray-500/70 italic text-sm">Email address</span>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label htmlFor="password" className="sr-only">Password</label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none rounded-b-md relative block w-full px-3 py-2 pl-10 border ${
                      errors.password ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
                    } text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-[#E78F81] focus:border-[#E78F81] dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm`}
                    placeholder=""
                  />
                  {formData.password.length === 0 && (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-10 pointer-events-none">
                      <span className="text-gray-400/60 dark:text-gray-500/70 italic text-sm">Password</span>
                    </div>
                  )}
                </div>
              </div>
              
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-500">{errors.email}</p>
              )}
              
              {errors.password && (
                <p className="text-sm text-red-600 dark:text-red-500">{errors.password}</p>
              )}
  
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#E78F81] focus:ring-[#E78F81] dark:text-blue-600 dark:focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
  
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-[#E78F81] hover:text-[#d36e62] dark:text-blue-400 dark:hover:text-blue-300">
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </>
          ) : (
            // 2FA verification form
            <div className="space-y-4">
              <div>
                <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Verification Code
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="verification-code"
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    value={verificationCode}
                    onChange={handleVerificationChange}
                    className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border ${
                      errors.verification ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'
                    } text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-[#E78F81] focus:border-[#E78F81] dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm`}
                    placeholder=""
                  />
                  {verificationCode.length === 0 && (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-10 pointer-events-none">
                      <span className="text-gray-400/60 dark:text-gray-500/70 italic text-sm">6-digit code</span>
                    </div>
                  )}
                </div>
                {errors.verification && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.verification}</p>
                )}
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Enter the 6-digit verification code from your authenticator app
                </p>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#E78F81] hover:bg-[#d36e62] dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81] dark:focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : require2FA ? 'Verify' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}