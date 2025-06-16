/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';
import { FiSave, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ConsentPreferences = () => {
  const [preferences, setPreferences] = useState({
    marketingConsent: true,
    cookieConsent: 'accepted'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { user, getAuthHeader, isAuthenticated } = useAuth();
  const { apiUrl } = useServer();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadCurrentPreferences();
    }
  }, [isAuthenticated, user, apiUrl]);

  const loadCurrentPreferences = async () => {
    try {
      setLoading(true);
      
      // Get current marketing consent from user profile
      const profileResponse = await fetch(`${apiUrl}/api/user/profile`, {
        headers: getAuthHeader()
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        
        // Get cookie consent from localStorage
        const cookieConsent = localStorage.getItem('cookieConsent') || 'not-set';
        
        setPreferences({
          marketingConsent: profileData.user?.marketingConsent ?? true,
          cookieConsent: cookieConsent
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast.error('Failed to load your preferences');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      
      // Save to database via API
      const response = await fetch(`${apiUrl}/api/user/consent`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          marketingConsent: preferences.marketingConsent,
          cookieConsent: preferences.cookieConsent,
          consentTimestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      // Update localStorage for cookie consent
      localStorage.setItem('cookieConsent', preferences.cookieConsent);
      
      setHasChanges(false);
      toast.success('Your preferences have been saved successfully');
      
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save your preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetCookieBanner = () => {
    localStorage.removeItem('cookieConsent');
    setPreferences(prev => ({
      ...prev,
      cookieConsent: 'not-set'
    }));
    setHasChanges(true);
    toast.success('Cookie banner will show again on next page load');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Login Required
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Please log in to manage your consent preferences.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-center mt-4 text-gray-600 dark:text-gray-300">
              Loading your preferences...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Privacy & Consent Preferences
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your consent for cookies and marketing communications
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Marketing Consent Section */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <FiInfo className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Marketing Communications
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Receive emails about new features, CV tips, special offers, and product updates from CV Builder.
                  </p>
                  
                  <div className="mt-4 space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="marketingConsent"
                        checked={preferences.marketingConsent === true}
                        onChange={() => handlePreferenceChange('marketingConsent', true)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        <FiCheck className="inline h-4 w-4 text-green-500 mr-1" />
                        Yes, I want to receive marketing emails
                      </span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="marketingConsent"
                        checked={preferences.marketingConsent === false}
                        onChange={() => handlePreferenceChange('marketingConsent', false)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        <FiX className="inline h-4 w-4 text-red-500 mr-1" />
                        No, I don't want to receive marketing emails
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Cookie Consent Section */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <FiInfo className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Cookie Preferences
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Control how we use cookies on our website for analytics, personalization, and advertising.
                  </p>
                  
                  <div className="mt-4 space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="cookieConsent"
                        checked={preferences.cookieConsent === 'accepted'}
                        onChange={() => handlePreferenceChange('cookieConsent', 'accepted')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        <FiCheck className="inline h-4 w-4 text-green-500 mr-1" />
                        Accept all cookies
                      </span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="cookieConsent"
                        checked={preferences.cookieConsent === 'declined'}
                        onChange={() => handlePreferenceChange('cookieConsent', 'declined')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        <FiX className="inline h-4 w-4 text-red-500 mr-1" />
                        Decline non-essential cookies
                      </span>
                    </label>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={resetCookieBanner}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Reset cookie banner (show again on next visit)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Current Settings
              </h4>
              <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                <div>
                  Marketing emails: 
                  <span className={`ml-1 font-medium ${preferences.marketingConsent ? 'text-green-600' : 'text-red-600'}`}>
                    {preferences.marketingConsent ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div>
                  Cookies: 
                  <span className={`ml-1 font-medium ${
                    preferences.cookieConsent === 'accepted' ? 'text-green-600' : 
                    preferences.cookieConsent === 'declined' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {preferences.cookieConsent === 'accepted' ? 'Accepted' : 
                     preferences.cookieConsent === 'declined' ? 'Declined' : 'Not Set'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {hasChanges && '• You have unsaved changes'}
              </div>
              
              <button
                onClick={savePreferences}
                disabled={!hasChanges || saving}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                  hasChanges && !saving
                    ? 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                    : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2 h-4 w-4" />
                    Save Preferences
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentPreferences; 