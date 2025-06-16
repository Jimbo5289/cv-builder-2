/* eslint-disable */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiCalendar, FiCreditCard, FiClock, FiEdit, FiBarChart2, FiFileText, FiDownload, FiPrinter, FiEye, FiPhone, FiTrash2, FiShield } from 'react-icons/fi';
import { safeFetch, mockResponses } from '../utils/apiUtils';
import ExpirationNotifications from '../components/ExpirationNotifications';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, getAuthHeader } = useAuth();
  const { apiUrl, status: serverStatus } = useServer();
  const [subscription, setSubscription] = useState(null);
  const [premiumAccess, setPremiumAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedCVs, setSavedCVs] = useState([]);
  const [usageStats, setUsageStats] = useState({
    cvsCreated: 0,
    analyzesRun: 0,
    lastActive: null
  });
  const [showAllCVs, setShowAllCVs] = useState(false);
  const [deletingCVs, setDeletingCVs] = useState(new Set());
  const [recentlyDeleted, setRecentlyDeleted] = useState(null);
  const [selectedCVs, setSelectedCVs] = useState(new Set());
  
  // Calculate days until access expires
  const getDaysUntilExpiration = () => {
    if (!premiumAccess || !premiumAccess.hasAccess) return null;
    
    let endDate;
    if (premiumAccess.accessType === 'subscription' && premiumAccess.subscriptionData) {
      endDate = new Date(premiumAccess.subscriptionData.currentPeriodEnd);
    } else if (premiumAccess.accessType === 'temporary' && premiumAccess.temporaryAccess) {
      endDate = new Date(premiumAccess.temporaryAccess.endTime);
    } else {
      return null;
    }
    
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
  
  // Get access status text
  const getAccessStatus = () => {
    if (!premiumAccess || !premiumAccess.hasAccess) return 'No Active Access';
    
    if (premiumAccess.accessType === 'subscription') {
      const sub = premiumAccess.subscriptionData;
      if (sub.status === 'active' && sub.cancelAtPeriodEnd) {
        return 'Canceling at period end';
      }
      return sub.status.charAt(0).toUpperCase() + sub.status.slice(1);
    } else if (premiumAccess.accessType === 'temporary') {
      return '30-Day Access Pass';
    }
    
    return 'Unknown';
  };

  // Handle individual CV selection
  const handleCVSelection = (cvId) => {
    setSelectedCVs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cvId)) {
        newSet.delete(cvId);
      } else {
        newSet.add(cvId);
      }
      return newSet;
    });
  };

  // Handle select all/none
  const handleSelectAll = () => {
    const displayedCVs = showAllCVs ? savedCVs : savedCVs.slice(0, 5);
    const allDisplayedSelected = displayedCVs.every(cv => selectedCVs.has(cv.id));
    
    if (allDisplayedSelected) {
      // Deselect all displayed CVs
      setSelectedCVs(prev => {
        const newSet = new Set(prev);
        displayedCVs.forEach(cv => newSet.delete(cv.id));
        return newSet;
      });
    } else {
      // Select all displayed CVs
      setSelectedCVs(prev => {
        const newSet = new Set(prev);
        displayedCVs.forEach(cv => newSet.add(cv.id));
        return newSet;
      });
    }
  };

  // Handle edit selected CV (only works for single selection)
  const handleEditSelectedCV = () => {
    if (selectedCVs.size === 1) {
      const cvId = Array.from(selectedCVs)[0];
      window.location.href = `/edit/${cvId}`;
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedCVs.size === 0) return;
    
    const confirmMessage = `Are you sure you want to delete ${selectedCVs.size} CV${selectedCVs.size > 1 ? 's' : ''}? This action cannot be undone.`;
    if (!confirm(confirmMessage)) return;

    const selectedCVData = savedCVs.filter(cv => selectedCVs.has(cv.id));
    
    for (const cv of selectedCVData) {
      await handleDelete(cv);
    }
    
    setSelectedCVs(new Set());
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

  // Delete CV handler with immediate deletion and undo functionality
  const handleDelete = async (cv) => {
    try {
      // Add to deleting set to show loading state
      setDeletingCVs(prev => new Set([...prev, cv.id]));
      
      // Delete from database immediately
      const response = await fetch(`${apiUrl}/api/cv/${cv.id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader()
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to delete CV');
      }

      // Remove from the UI after successful deletion
      setSavedCVs(prevCVs => prevCVs.filter(savedCV => savedCV.id !== cv.id));
      
      // Store the deleted CV data for potential undo
      setRecentlyDeleted({
        cv,
        timestamp: Date.now()
      });

      // Remove from deleting set
      setDeletingCVs(prev => {
        const newSet = new Set(prev);
        newSet.delete(cv.id);
        return newSet;
      });

      // Show undo toast notification for 10 seconds
      const undoToastId = toast((t) => (
        <div className="flex items-center justify-between w-full">
          <span>CV "{cv.title}" deleted</span>
          <button
            onClick={() => {
              handleUndo(cv);
              toast.dismiss(t.id);
            }}
            className="ml-3 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Undo
          </button>
        </div>
      ), {
        duration: 10000, // 10 seconds for undo
        style: {
          background: '#ef4444',
          color: '#white',
          maxWidth: '400px'
        },
        onClose: () => {
          // Clear recently deleted when toast closes
          if (recentlyDeleted && recentlyDeleted.cv.id === cv.id) {
            setRecentlyDeleted(null);
          }
        }
      });

      // Clear recently deleted after 10 seconds
      setTimeout(() => {
        if (recentlyDeleted && recentlyDeleted.cv.id === cv.id) {
          setRecentlyDeleted(null);
          toast.dismiss(undoToastId);
        }
      }, 10000);

      console.log('CV deleted successfully from database');

    } catch (err) {
      console.error('Error during delete process:', err);
      toast.error('Failed to delete CV. Please try again.');
      // Remove from deleting set on error
      setDeletingCVs(prev => {
        const newSet = new Set(prev);
        newSet.delete(cv.id);
        return newSet;
      });
      // Don't restore to UI since deletion may have partially succeeded
    }
  };

  // Undo delete handler - recreates CV in database
  const handleUndo = async (cv) => {
    try {
      // First restore to UI immediately for responsive feedback
      setSavedCVs(prevCVs => {
        const updatedCVs = [...prevCVs, cv];
        return updatedCVs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });

      // Recreate the CV in the database
      const response = await fetch(`${apiUrl}/api/cv/restore`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cvId: cv.id,
          title: cv.title,
          content: cv.content || cv,
          originalCreatedAt: cv.createdAt,
          originalUpdatedAt: cv.updatedAt
        })
      });

      if (!response.ok) {
        // If restoration fails, try creating a new CV with the same data
        const fallbackResponse = await fetch(`${apiUrl}/api/cv/save`, {
          method: 'POST',
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: cv.title,
            content: cv.content || cv
          })
        });

        if (!fallbackResponse.ok) {
          throw new Error('Failed to restore CV');
        }

        const restoredCV = await fallbackResponse.json();
        
        // Update the CV in the state with the new ID
        setSavedCVs(prevCVs => 
          prevCVs.map(savedCV => 
            savedCV.id === cv.id 
              ? { ...restoredCV.cv, title: cv.title }
              : savedCV
          )
        );
      }
      
      // Clear recently deleted
      setRecentlyDeleted(null);
      
      toast.success(`CV "${cv.title}" restored`);
      
    } catch (err) {
      console.error('Error restoring CV:', err);
      
      // Remove from UI again since restoration failed
      setSavedCVs(prevCVs => prevCVs.filter(savedCV => savedCV.id !== cv.id));
      
      toast.error('Failed to restore CV. The deletion cannot be undone.');
    }
  };



  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user || serverStatus !== 'connected' || !apiUrl) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch premium access information (subscriptions + temporary access)
        const premiumData = await safeFetch(
          `${apiUrl}/api/subscriptions/premium-status`, 
          { headers: getAuthHeader() },
          mockResponses.subscriptions
        );
        
        if (premiumData) {
          setPremiumAccess(premiumData);
          // For backward compatibility, set subscription if it exists
          if (premiumData.subscriptionData) {
            setSubscription(premiumData.subscriptionData);
          }
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
        {/* Expiration Notifications */}
        <ExpirationNotifications />
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {/* Profile Header */}
          <div className="px-4 py-5 sm:px-6 bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold leading-6 text-gray-900 dark:text-white">Profile</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Personal details and subscription information</p>
              </div>
              <div className="flex space-x-2">
                <Link to="/consent-preferences" className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800">
                  <FiShield className="mr-2 -ml-0.5 h-4 w-4" />
                  Privacy
                </Link>
                <Link to="/settings" className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800">
                  <FiEdit className="mr-2 -ml-0.5 h-4 w-4" />
                  Settings
                </Link>
              </div>
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
                  <FiPhone className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone number</dt>
                </div>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white ml-7">{user?.phone || 'Not provided'}</dd>
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
          
          {/* Premium Access Information */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6 bg-gray-50 dark:bg-gray-850">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Premium Access Details</h4>
            
            {!premiumAccess || !premiumAccess.hasAccess ? (
              <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiCreditCard className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">No Active Premium Access</h3>
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
                {premiumAccess.accessType === 'temporary' ? (
                  // 30-Day Access Pass Display
                  <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiClock className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800 dark:text-green-300">30-Day Access Pass Active</h3>
                        <div className="mt-2 text-sm text-green-700 dark:text-green-400">
                          <p>You have full access to all premium features until {formatDate(premiumAccess.temporaryAccess.endTime)}.</p>
                          <p className="mt-1">Purchased on {formatDate(premiumAccess.temporaryAccess.createdAt)} for £19.99</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <div className="flex items-center">
                      <FiCreditCard className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Access Type</dt>
                    </div>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white ml-7">
                      {premiumAccess.accessType === 'subscription' 
                        ? (premiumAccess.subscriptionData?.planId || 'Premium Subscription')
                        : '30-Day Access Pass'
                      }
                    </dd>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <FiClock className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                    </div>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white ml-7 flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        (premiumAccess.accessType === 'subscription' && premiumAccess.subscriptionData?.status === 'active') || 
                        premiumAccess.accessType === 'temporary'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {getAccessStatus()}
                      </span>
                    </dd>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <FiCalendar className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {premiumAccess.accessType === 'subscription' ? 'Current Period' : 'Access Period'}
                      </dt>
                    </div>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white ml-7">
                      {premiumAccess.accessType === 'subscription' 
                        ? `${formatDate(premiumAccess.subscriptionData?.currentPeriodStart)} - ${formatDate(premiumAccess.subscriptionData?.currentPeriodEnd)}`
                        : `${formatDate(premiumAccess.temporaryAccess?.createdAt)} - ${formatDate(premiumAccess.temporaryAccess?.endTime)}`
                      }
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
                {selectedCVs.size > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {selectedCVs.size} selected
                  </span>
                )}
              </h4>
              <div className="flex space-x-2">
                {selectedCVs.size > 0 && (
                  <>
                    {selectedCVs.size === 1 && (
                      <button
                        onClick={handleEditSelectedCV}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <FiEdit className="mr-1 h-4 w-4" />
                        Edit Selected CV
                      </button>
                    )}
                    <button
                      onClick={handleBulkDelete}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FiTrash2 className="mr-1 h-4 w-4" />
                      Delete Selected ({selectedCVs.size})
                    </button>
                  </>
                )}
                <Link to="/create" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800">
                  Create New CV
                </Link>
              </div>
            </div>
            
            {savedCVs.length === 0 ? (
              <div className="text-center py-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                <p className="text-sm text-gray-600 dark:text-gray-300">You haven't created any CVs yet.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                {savedCVs.length > 0 && (
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={(() => {
                          const displayedCVs = showAllCVs ? savedCVs : savedCVs.slice(0, 5);
                          return displayedCVs.length > 0 && displayedCVs.every(cv => selectedCVs.has(cv.id));
                        })()}
                        onChange={handleSelectAll}
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Select All Displayed
                      </span>
                    </label>
                  </div>
                )}
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {(showAllCVs ? savedCVs : savedCVs.slice(0, 5)).map((cv) => (
                    <li key={cv.id} className="px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 min-w-0">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                            checked={selectedCVs.has(cv.id)}
                            onChange={() => handleCVSelection(cv.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{cv.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Last updated: {formatDate(cv.updatedAt)}</p>
                          </div>
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
                          
                          <button
                            onClick={() => handleDelete(cv)}
                            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Delete CV"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
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