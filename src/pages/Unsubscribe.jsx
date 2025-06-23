import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';
import { FiMail, FiCheck, FiAlertCircle, FiUser, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { apiUrl } = useServer();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [preferences, setPreferences] = useState({
    marketingEmails: true,
    subscriptionUpdates: true,
    securityAlerts: true
  });

  const emailFromUrl = searchParams.get('email');
  const userFromUrl = searchParams.get('user');

  useEffect(() => {
    // Load current preferences if user is authenticated
    if (isAuthenticated && user) {
      fetchUserPreferences();
    }
  }, [isAuthenticated, user]);

  const fetchUserPreferences = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/users/preferences`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch (err) {
      console.error('Error fetching preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (emailType = 'marketing') => {
    try {
      setLoading(true);
      setError(null);

      // If user is authenticated, update their preferences directly
      if (isAuthenticated && user) {
        const response = await fetch(`${apiUrl}/api/users/preferences`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...preferences,
            marketingEmails: emailType === 'marketing' ? false : preferences.marketingEmails
          })
        });

        if (response.ok) {
          setSuccess(true);
          setPreferences(prev => ({ ...prev, marketingEmails: false }));
          toast.success('Your email preferences have been updated successfully!');
        } else {
          throw new Error('Failed to update preferences');
        }
      } 
      // If not authenticated but we have email/user from URL, use unsubscribe endpoint
      else if (emailFromUrl && userFromUrl) {
        const response = await fetch(`${apiUrl}/api/unsubscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: emailFromUrl,
            user: userFromUrl,
            type: emailType
          })
        });

        if (response.ok) {
          setSuccess(true);
          toast.success('You have been unsubscribed from marketing emails!');
        } else {
          throw new Error('Failed to unsubscribe');
        }
      } else {
        throw new Error('Unable to identify user. Please log in to manage your preferences.');
      }
    } catch (err) {
      console.error('Unsubscribe error:', err);
      setError(err.message || 'An error occurred while updating your preferences');
      toast.error(err.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (type, value) => {
    setPreferences(prev => ({ ...prev, [type]: value }));
  };

  const savePreferences = async () => {
    if (!isAuthenticated || !user) {
      setError('Please log in to save your preferences');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/users/preferences`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      });

      if (response.ok) {
        setSuccess(true);
        toast.success('Your preferences have been saved successfully!');
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (err) {
      console.error('Save preferences error:', err);
      setError(err.message || 'Failed to save preferences');
      toast.error(err.message || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <FiMail className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Email Preferences
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Manage your email subscription preferences
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-8">
            {/* Security Notice */}
            {emailFromUrl && !isAuthenticated && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex">
                  <FiShield className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Security Notice
                    </h3>
                    <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                      You can unsubscribe from marketing emails using this link, but for full preference management, 
                      please <Link to="/login" className="underline font-medium">log in to your account</Link>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex">
                  <FiCheck className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                      Preferences Updated
                    </h3>
                    <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                      Your email preferences have been successfully updated.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex">
                  <FiAlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Error
                    </h3>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Unsubscribe */}
            <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-750 rounded-lg">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Quick Unsubscribe
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                To stop receiving marketing emails immediately, click the button below.
              </p>
              <button
                onClick={() => handleUnsubscribe('marketing')}
                disabled={loading || success}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {loading ? 'Processing...' : 'Unsubscribe from Marketing Emails'}
              </button>
            </div>

            {/* Detailed Preferences (only for authenticated users) */}
            {isAuthenticated && user && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Detailed Email Preferences
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900 dark:text-white">
                        Marketing Emails
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Tips, guides, and promotional content
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.marketingEmails}
                      onChange={(e) => handlePreferenceChange('marketingEmails', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900 dark:text-white">
                        Subscription Updates
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Billing, renewals, and subscription changes
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.subscriptionUpdates}
                      onChange={(e) => handlePreferenceChange('subscriptionUpdates', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900 dark:text-white">
                        Security Alerts
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Account security and login notifications (recommended)
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.securityAlerts}
                      onChange={(e) => handlePreferenceChange('securityAlerts', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={savePreferences}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </button>
                  <Link
                    to="/profile"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Back to Profile
                  </Link>
                </div>
              </div>
            )}

            {/* Login prompt for unauthenticated users */}
            {!isAuthenticated && (
              <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center">
                  <FiUser className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Want full control over your email preferences?
                    </h3>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                      Log in to your account to manage all your email preferences in detail.
                    </p>
                    <div className="mt-3 space-x-3">
                      <Link
                        to="/login"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Log In
                      </Link>
                      <Link
                        to="/"
                        className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Back to Home
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 