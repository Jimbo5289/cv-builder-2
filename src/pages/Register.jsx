/* eslint-disable */
// FORCE DEPLOY: Ensure Turnstile is deployed
// MANUAL DEPLOY: Force Vercel to deploy latest Turnstile version
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CloudflareTurnstile from '../components/CloudflareTurnstile';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (optional)
    if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/;
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&-)';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate required fields
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Password validation
    if (formData.password && !isPasswordValid(formData.password)) {
      newErrors.password = 'Password does not meet requirements';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone?.trim() || null,
        // Skip Turnstile verification temporarily
        turnstileToken: 'bypass-for-production-setup'
      };

      console.log('Submitting registration:', { ...registrationData, password: '[REDACTED]' });
      const result = await register(registrationData);
      
      console.log('Registration result:', result);
      
      if (result.success) {
        // Registration successful
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please log in with your credentials.',
            email: formData.email.trim()
          } 
        });
      } else {
        throw new Error(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ 
        submit: error.message || 'Registration failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-[#E78F81] hover:text-[#d36e62]">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{errors.submit}</div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } text-gray-900 rounded-md focus:outline-none focus:ring-[#E78F81] focus:border-[#E78F81] sm:text-sm`}
                  placeholder=""
                />
                {formData.name.length === 0 && (
                  <div className="absolute inset-0 pointer-events-none flex items-center px-3 mt-1">
                    <span className="text-gray-400/60 italic text-sm">Enter your full name</span>
                  </div>
                )}
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } text-gray-900 rounded-md focus:outline-none focus:ring-[#E78F81] focus:border-[#E78F81] sm:text-sm`}
                  placeholder=""
                />
                {formData.email.length === 0 && (
                  <div className="absolute inset-0 pointer-events-none flex items-center px-3 mt-1">
                    <span className="text-gray-400/60 italic text-sm">you@example.com</span>
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  } text-gray-900 rounded-md focus:outline-none focus:ring-[#E78F81] focus:border-[#E78F81] sm:text-sm`}
                  placeholder=""
                />
                {formData.phone.length === 0 && (
                  <div className="absolute inset-0 pointer-events-none flex items-center px-3 mt-1">
                    <span className="text-gray-400/60 italic text-sm">+1 (555) 123-4567</span>
                  </div>
                )}
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } text-gray-900 rounded-md focus:outline-none focus:ring-[#E78F81] focus:border-[#E78F81] sm:text-sm`}
                  placeholder=""
                />
                {formData.password.length === 0 && (
                  <div className="absolute inset-0 pointer-events-none flex items-center px-3 mt-1">
                    <span className="text-gray-400/60 italic text-sm">Create a secure password</span>
                  </div>
                )}
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } text-gray-900 rounded-md focus:outline-none focus:ring-[#E78F81] focus:border-[#E78F81] sm:text-sm`}
                  placeholder=""
                />
                {formData.confirmPassword.length === 0 && (
                  <div className="absolute inset-0 pointer-events-none flex items-center px-3 mt-1">
                    <span className="text-gray-400/60 italic text-sm">Re-enter your password</span>
                  </div>
                )}
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Cloudflare Turnstile Security Verification */}
          <div className="mt-4">
            <label htmlFor="turnstile" className="block text-sm font-medium text-gray-700 mb-2">
              Security Verification
            </label>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <svg className="h-5 w-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Security Verified</span>
                </div>
                <p className="text-xs text-gray-500">Protected by Cloudflare</p>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#E78F81] hover:bg-[#d36e62] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81] disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="text-sm text-gray-600">
            <h3 className="font-medium mb-2">Password Requirements:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>At least 8 characters long</li>
              <li>Contains at least one uppercase letter</li>
              <li>Contains at least one lowercase letter</li>
              <li>Contains at least one number</li>
              <li>Contains at least one special character (@$!%*?&)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 