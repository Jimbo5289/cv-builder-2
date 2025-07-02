/* eslint-disable */
// FORCE DEPLOY: Ensure Turnstile is deployed
// MANUAL DEPLOY: Force Vercel to deploy latest Turnstile version
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    marketingConsent: true // Default to true, but user must actively confirm
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#-])[A-Za-z\d@$!%*?&#-]{8,}$/;
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#-)';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    // Use the existing validateForm function
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone?.trim() || null,
        marketingConsent: formData.marketingConsent, // Include marketing consent
        turnstileToken: 'security-verification-disabled'
      };

      console.log('Submitting registration data...', { ...registrationData, password: '[REDACTED]' });
      const result = await register(registrationData);

      if (result.success) {
        console.log('Registration successful');
        navigate('/dashboard');
      } else {
        console.error('Registration failed:', result.error);
        setErrors({ submit: result.error || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
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

            {/* Marketing Consent Checkbox */}
            <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="marketingConsent"
                    name="marketingConsent"
                    type="checkbox"
                    checked={formData.marketingConsent}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#E78F81] focus:ring-[#E78F81] border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="marketingConsent" className="text-sm font-medium text-gray-700">
                    Marketing Communications
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    I agree to receive emails about CV tips, new features, special offers, and product updates from MyCVBuilder. 
                    You can unsubscribe at any time via your account preferences.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81] ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#E78F81] hover:bg-[#d36e62]'
              }`}
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
              <li>Contains at least one special character (@$!%*?&#-)</li>
            </ul>
          </div>
          
          <div className="mt-4 text-xs text-gray-500 border-t pt-3">
            <p>
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-[#E78F81] hover:text-[#d36e62] underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-[#E78F81] hover:text-[#d36e62] underline">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 