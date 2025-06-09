/* eslint-disable */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiCalendar, FiCreditCard, FiClock, FiEdit, FiBarChart2, FiFileText, FiDownload, FiPrinter, FiEye } from 'react-icons/fi';
import { safeFetch, mockResponses } from '../utils/apiUtils';

export default function Profile() {
  const { user, getAuthHeader } = useAuth();
  const { apiUrl, status: serverStatus } = useServer();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedCVs, setSavedCVs] = useState([]);
  const [usageStats, setUsageStats] = useState({
    cvsCreated: 0,
    analyzesRun: 0,
    lastActive: null
  });
  const [showAllCVs, setShowAllCVs] = useState(false);
  
  // Calculate days until subscription expires
  const getDaysUntilExpiration = () => {
    if (!subscription || !subscription.currentPeriodEnd) return null;
    
    const endDate = new Date(subscription.currentPeriodEnd);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  // Format date to a readable string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Get background color based on days remaining
  const getExpirationColor = () => {
    const days = getDaysUntilExpiration();
    if (days === null) return 'bg-gray-100';
    if (days <= 3) return 'bg-red-100 text-red-800';
    if (days <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };
  
  // Get subscription status text
  const getSubscriptionStatus = () => {
    if (!subscription) return 'No Active Subscription';
    if (subscription.status === 'active' && subscription.cancelAtPeriodEnd) {
      return 'Canceling at period end';
    }
    return subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1);
  };

  // Download CV handler
  const handleDownload = async (cvId) => {
    try {
      window.open(`${apiUrl}/api/cv/download/${cvId}`, '_blank');
    } catch (err) {
      console.error('Error downloading CV:', err);
      alert('Failed to download CV. Please try again.');
    }
  };

  // Print CV handler
  const handlePrint = async (cvId) => {
    try {
      // Create a hidden iframe to load the PDF for printing
      const printFrame = document.createElement('iframe');
      printFrame.style.display = 'none';
      document.body.appendChild(printFrame);
      
      // Set the src to the PDF download endpoint
      printFrame.src = `${apiUrl}/api/cv/download/${cvId}`;
      
      // Once loaded, print the iframe content
      printFrame.onload = () => {
        try {
          printFrame.contentWindow.print();
          // Remove the iframe after printing
          setTimeout(() => {
            document.body.removeChild(printFrame);
          }, 1000);
        } catch (err) {
          console.error('Error during print:', err);
          alert('Failed to print CV. Please try downloading instead.');
          document.body.removeChild(printFrame);
        }
      };
    } catch (err) {
      console.error('Error setting up print:', err);
      alert('Failed to prepare CV for printing. Please try downloading instead.');
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user || serverStatus !== 'connected' || !apiUrl) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch subscription information
        const subData = await safeFetch(
          `${apiUrl}/api/subscriptions`, 
          { headers: getAuthHeader() },
          mockResponses.subscriptions
        );
        
        if (subData) {
          setSubscription(subData);
        }
        
        // Fetch usage statistics
        const statsData = await safeFetch(
          `${apiUrl}/api/users/stats`, 
          { headers: getAuthHeader() },
          mockResponses.userStats
        );
        
        if (statsData) {
          setUsageStats(statsData);
        }
        
        // Fetch saved CVs
        const cvsData = await safeFetch(
          `${apiUrl}/api/cv/user/all`, 
          { headers: getAuthHeader() },
          mockResponses.cvList
        );
        
        if (cvsData) {
          setSavedCVs(cvsData);
        }
        
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load some profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user, apiUrl, serverStatus, getAuthHeader]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {/* Profile Header */}
          <div className="px-4 py-5 sm:px-6 bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold leading-6 text-gray-900 dark:text-white">Profile</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Personal details and subscription information</p>
              </div>
              <Link to="/settings" className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800">
                <FiEdit className="mr-2 -ml-0.5 h-4 w-4" />
                Settings
              </Link>
            </div>
          </div>
          
          {/* User Information */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <div className="flex items-center">
                  <FiUser className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Full name</dt>
                </div>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white ml-7">{user?.name || 'Not provided'}</dd>
              </div>
              
              <div className="sm:col-span-2">
                <div className="flex items-center">
                  <FiMail className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email address</dt>
                </div>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white ml-7">{user?.email || 'Not provided'}</dd>
              </div>
              
              <div className="sm:col-span-2">
                <div className="flex items-center">
                  <FiCalendar className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Member since</dt>
                </div>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white ml-7">{formatDate(user?.createdAt) || 'Unknown'}</dd>
              </div>
            </dl>
          </div>
          
          {/* Subscription Information */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6 bg-gray-50 dark:bg-gray-850">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Subscription Details</h4>
            
            {!subscription ? (
              <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiCreditCard className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">No Active Subscription</h3>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                      <p>You are currently on the free plan. Upgrade to access premium features.</p>
                    </div>
                    <div className="mt-4">
                      <Link to="/pricing" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800">
                        View Plans
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <div className="flex items-center">
                      <FiCreditCard className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Plan</dt>
                    </div>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white ml-7">{subscription.planId || 'Premium'}</dd>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <FiClock className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                    </div>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white ml-7 flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subscription.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                        {getSubscriptionStatus()}
                      </span>
                    </dd>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <FiCalendar className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Period</dt>
                    </div>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white ml-7">
                      {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                    </dd>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <FiClock className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Days Remaining</dt>
                    </div>
                    <dd className="mt-1 text-sm ml-7">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getExpirationColor()} dark:bg-opacity-30`}>
                        {getDaysUntilExpiration() !== null ? `${getDaysUntilExpiration()} days` : 'N/A'}
                      </span>
                    </dd>
                  </div>
                </dl>
                
                <div className="mt-6">
                  <Link to="/subscription" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800">
                    Manage Subscription
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Saved CVs Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <FiFileText className="mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                Your CVs
              </h4>
              <Link to="/create" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800">
                Create New CV
              </Link>
            </div>
            
            {savedCVs.length === 0 ? (
              <div className="text-center py-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                <p className="text-sm text-gray-600 dark:text-gray-300">You haven't created any CVs yet.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {(showAllCVs ? savedCVs : savedCVs.slice(0, 5)).map((cv) => (
                    <li key={cv.id} className="px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{cv.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Last updated: {formatDate(cv.updatedAt)}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDownload(cv.id)}
                            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="Download CV"
                          >
                            <FiDownload className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handlePrint(cv.id)}
                            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="Print CV"
                          >
                            <FiPrinter className="h-4 w-4" />
                          </button>
                          
                          <Link
                            to={`/preview/${cv.id}`}
                            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="Preview CV"
                          >
                            <FiEye className="h-4 w-4" />
                          </Link>
                          
                          <Link
                            to={`/edit/${cv.id}`}
                            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="Edit CV"
                          >
                            <FiEdit className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                
                {savedCVs.length > 5 && (
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 text-center">
                    <button
                      onClick={() => setShowAllCVs(!showAllCVs)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      {showAllCVs ? 'Show Less' : `Show All (${savedCVs.length})`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Usage Statistics */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <FiBarChart2 className="mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              Usage Statistics
            </h4>
            
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">CVs Created</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{usageStats.cvsCreated}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Analyzes Run</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{usageStats.analyzesRun}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Activity</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(usageStats.lastActive) || 'N/A'}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 