/* eslint-disable */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TwoFactorSetup from '../components/TwoFactorSetup';
import ThemeToggle from '../components/ThemeToggle';
import { FiSun, FiMoon, FiAlertCircle, FiCheck } from 'react-icons/fi';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('security');
  const { user, getAuthHeader, updateUserInfo } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  const tabs = [
    { id: 'security', name: 'Security' },
    { id: 'profile', name: 'Profile' },
    { id: 'appearance', name: 'Appearance' },
    { id: 'notifications', name: 'Notifications' },
  ];

  // Update profile form values when user data changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing again
    if (profileErrors[name]) {
      setProfileErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear success message when user makes changes
    if (profileSuccess) {
      setProfileSuccess(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingProfile(true);
    setProfileErrors({});
    
    const errors = {};
    
    // Basic validation
    if (!profileData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!profileData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(profileData.email)) {
      errors.email = 'Invalid email format';
    }
    
    // Phone validation (optional field)
    if (profileData.phone && !/^[+\d\s()-]{7,20}$/.test(profileData.phone)) {
      errors.phone = 'Please enter a valid phone number format';
    }
    
    // If there are errors, stop submission
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      setIsSubmittingProfile(false);
      return;
    }
    
    try {
      // Call the updateUserInfo function from AuthContext
      const result = await updateUserInfo(profileData);
      
      if (result.success) {
        setProfileSuccess(true);
      } else {
        throw new Error(result.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      
      // Handle authentication errors specifically
      if (error.message?.toLowerCase().includes('auth') || 
          error.message?.toLowerCase().includes('token') ||
          error.message?.toLowerCase().includes('unauthorized')) {
        setProfileErrors({
          general: 'Authentication error. Please log out and log back in to update your profile.'
        });
      } else {
        setProfileErrors({
          general: error.message || 'Failed to update profile. Please try again.'
        });
      }
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing again
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear success message when user makes changes
    if (passwordSuccess) {
      setPasswordSuccess(false);
    }
  };

  const validatePassword = (password) => {
    const errors = {};
    
    if (password.length < 8) {
      errors.length = 'Password must be at least 8 characters';
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = 'Password must contain an uppercase letter';
    }
    
    if (!/[a-z]/.test(password)) {
      errors.lowercase = 'Password must contain a lowercase letter';
    }
    
    if (!/[0-9]/.test(password)) {
      errors.number = 'Password must contain a number';
    }
    
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.special = 'Password must contain a special character';
    }
    
    return errors;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPasswordErrors({});
    
    const errors = {};
    
    // Validate current password is not empty
    if (!passwordData.currentPassword.trim()) {
      errors.currentPassword = 'Current password is required';
    }
    
    // Validate new password
    const passwordValidationErrors = validatePassword(passwordData.newPassword);
    if (Object.keys(passwordValidationErrors).length > 0) {
      errors.newPassword = 'Password does not meet requirements';
    }
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // If there are errors, stop submission
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Here you would integrate with your password update API
      // For now, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and show success message
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordSuccess(true);
    } catch (error) {
      setPasswordErrors({
        general: 'Failed to update password. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check password strength
  const getPasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength, 5); // Max strength of 5
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);
  const passwordStrengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const passwordStrengthColor = [
    'bg-red-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-yellow-300',
    'bg-green-400',
    'bg-green-500'
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 pt-4">
            Account Settings
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">v2</span>
          </h1>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-[#E78F81] text-[#E78F81] dark:border-blue-400 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                    }
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Panels */}
          <div className="mt-8">
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Two-Factor Authentication
                  </h3>
                  <TwoFactorSetup />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Change Password
                  </h3>
                  {passwordSuccess && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-md flex items-center text-green-700 dark:text-green-400">
                      <FiCheck className="h-5 w-5 mr-2 flex-shrink-0" />
                      <p className="text-sm">Your password has been updated successfully.</p>
                    </div>
                  )}
                  <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={`mt-1 block w-full border ${passwordErrors.currentPassword ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:ring-[#E78F81] focus:border-[#E78F81] dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm h-10`}
                      />
                      {passwordErrors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-500 flex items-center">
                          <FiAlertCircle className="h-4 w-4 mr-1" />
                          {passwordErrors.currentPassword}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={`mt-1 block w-full border ${passwordErrors.newPassword ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:ring-[#E78F81] focus:border-[#E78F81] dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm h-10`}
                      />
                      
                      {passwordData.newPassword && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Password strength:</span>
                            <span className="text-xs font-medium" style={{ color: passwordStrengthColor[passwordStrength].replace('bg-', 'text-') }}>
                              {passwordStrengthText[passwordStrength]}
                            </span>
                          </div>
                          <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${passwordStrengthColor[passwordStrength]} transition-all duration-300 ease-in-out`} 
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            ></div>
                          </div>
                          
                          {/* Simplified requirement display based on NIST */}
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <div className="flex items-center">
                              <span className={`inline-block w-3 h-3 mr-2 rounded-full ${passwordData.newPassword.length >= 12 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">12+ characters</span>
                            </div>
                            <div className="flex items-center">
                              <span className={`inline-block w-3 h-3 mr-2 rounded-full ${/[A-Z]/.test(passwordData.newPassword) && /[a-z]/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">Mixed case</span>
                            </div>
                            <div className="flex items-center">
                              <span className={`inline-block w-3 h-3 mr-2 rounded-full ${/[0-9]/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">Numbers</span>
                            </div>
                            <div className="flex items-center">
                              <span className={`inline-block w-3 h-3 mr-2 rounded-full ${!/^[a-zA-Z0-9]+$/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">Not just alphanumeric</span>
                            </div>
                          </div>
                          
                          {/* Common password warning - simulated check */}
                          {passwordData.newPassword.length > 0 && ['password', 'qwerty', '123456', 'admin'].includes(passwordData.newPassword.toLowerCase()) && (
                            <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded text-xs text-yellow-700 dark:text-yellow-500">
                              This password appears in data breaches. Please choose a more unique password.
                            </div>
                          )}
                        </div>
                      )}
                      
                      {passwordErrors.newPassword && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-500 flex items-center">
                          <FiAlertCircle className="h-4 w-4 mr-1" />
                          {passwordErrors.newPassword}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`mt-1 block w-full border ${passwordErrors.confirmPassword ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:ring-[#E78F81] focus:border-[#E78F81] dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm h-10`}
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-500 flex items-center">
                          <FiAlertCircle className="h-4 w-4 mr-1" />
                          {passwordErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                    {passwordErrors.general && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md">
                        <p className="text-sm text-red-600 dark:text-red-500">{passwordErrors.general}</p>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E78F81] hover:bg-[#d36e62] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81] dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Profile Information
                  </h3>
                  {profileSuccess && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-md flex items-center text-green-700 dark:text-green-400">
                      <FiCheck className="h-5 w-5 mr-2 flex-shrink-0" />
                      <p className="text-sm">Your profile has been updated successfully.</p>
                    </div>
                  )}
                  <form className="space-y-4" onSubmit={handleProfileSubmit}>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className={`mt-1 block w-full border ${profileErrors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:ring-[#E78F81] focus:border-[#E78F81] dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm h-10`}
                      />
                      {profileErrors.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-500 flex items-center">
                          <FiAlertCircle className="h-4 w-4 mr-1" />
                          {profileErrors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className={`mt-1 block w-full border ${profileErrors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:ring-[#E78F81] focus:border-[#E78F81] dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm h-10`}
                      />
                      {profileErrors.email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-500 flex items-center">
                          <FiAlertCircle className="h-4 w-4 mr-1" />
                          {profileErrors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number <span className="text-gray-400 text-xs">(optional)</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className={`mt-1 block w-full border ${profileErrors.phone ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:ring-[#E78F81] focus:border-[#E78F81] dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm h-10`}
                        placeholder="+1 (555) 123-4567"
                      />
                      {profileErrors.phone && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-500 flex items-center">
                          <FiAlertCircle className="h-4 w-4 mr-1" />
                          {profileErrors.phone}
                        </p>
                      )}
                    </div>
                    {profileErrors.general && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md">
                        <p className="text-sm text-red-600 dark:text-red-500">{profileErrors.general}</p>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmittingProfile}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E78F81] hover:bg-[#d36e62] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81] dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingProfile ? 'Updating...' : 'Update Profile'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Theme Settings
                  </h3>
                  <div className="bg-white dark:bg-gray-800 p-6 shadow-sm rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium text-gray-900 dark:text-white">Application Theme</h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Choose how CV Builder looks to you. Select a light or dark theme, or match your system preferences.
                        </p>
                      </div>
                      <ThemeToggle />
                    </div>
                    
                    <div className="mt-8 grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-6">
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                        <div className="flex items-center mb-3">
                          <FiSun className="h-5 w-5 text-yellow-500 mr-2" />
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white">Light Mode</h5>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Standard bright theme with light backgrounds and dark text.
                        </p>
                      </div>
                      
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-900">
                        <div className="flex items-center mb-3">
                          <FiMoon className="h-5 w-5 text-blue-400 mr-2" />
                          <h5 className="text-sm font-medium text-white">Dark Mode</h5>
                        </div>
                        <p className="text-xs text-gray-400">
                          Dark theme to reduce eye strain in low-light environments.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Email Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="security"
                          name="security"
                          type="checkbox"
                          className="focus:ring-[#E78F81] dark:focus:ring-blue-500 h-4 w-4 text-[#E78F81] dark:text-blue-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="security" className="font-medium text-gray-700 dark:text-gray-300">Security alerts</label>
                        <p className="text-gray-500 dark:text-gray-400">Get notified when there are login attempts from new devices.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="updates"
                          name="updates"
                          type="checkbox"
                          className="focus:ring-[#E78F81] dark:focus:ring-blue-500 h-4 w-4 text-[#E78F81] dark:text-blue-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="updates" className="font-medium text-gray-700 dark:text-gray-300">Product updates</label>
                        <p className="text-gray-500 dark:text-gray-400">Receive updates about new features and improvements.</p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E78F81] hover:bg-[#d36e62] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81] dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 