import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';
import { usePaymentVerification } from '../components/PayPerCvProtectedRoute';
import { FiCheck, FiX, FiAlertCircle, FiFileText, FiLinkedin } from 'react-icons/fi';
import CvAnalysisNextSteps from '../components/CvAnalysisNextSteps';
import AnalysisProgressTracker from '../components/AnalysisProgressTracker';
import CourseRecommendations from '../components/CourseRecommendations';
import { findCourseRecommendations } from '../data/courseRecommendations';

const LinkedInReview = () => {
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [profileText, setProfileText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('url'); // 'url' or 'paste'
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  const { isAuthenticated, user, getAuthHeader } = useAuth();
  const { apiUrl, isConnected } = useServer();
  const { verifyPayment, isVerifying } = usePaymentVerification();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Add progress step state
  const [progressStep, setProgressStep] = useState(1);
  
  // Check if coming from home page
  const comingFromHome = location.state?.fromHome;
  
  // Check if user is coming from premium upgrade flow
  const fromPremiumUpgrade = location.state?.fromPremiumUpgrade;
  
  useEffect(() => {
    // Check if user is coming from home page and prompt about premium feature
    if (comingFromHome) {
      setTimeout(() => {
        checkSubscription();
      }, 500);
    }
  }, [comingFromHome]);

  // Function to check if the user has an active subscription
  const checkSubscription = async () => {
    try {
      // Skip check if not authenticated
      if (!isAuthenticated) {
        console.log('User not authenticated, showing subscription prompt');
        setShowSubscriptionModal(true);
        return false;
      }
      
      // Check if server is connected
      if (!isConnected || !apiUrl) {
        console.error('Server not connected, cannot check subscription');
        setError('Server connection error. Please try again later.');
        return false;
      }
      
      // Get auth headers
      const headers = getAuthHeader();
      if (!headers.Authorization) {
        console.log('No auth token available, showing subscription prompt');
        setShowSubscriptionModal(true);
        return false;
      }
      
      console.log(`Checking subscription at ${apiUrl}/api/subscriptions/status`);
      const response = await fetch(`${apiUrl}/api/subscriptions/status`, {
        headers
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Subscription check result:', data);
        
        if (!data.hasActiveSubscription) {
          setShowSubscriptionModal(true);
        }
        
        return data.hasActiveSubscription;
      } else {
        console.error('Subscription check failed:', response.status);
        setShowSubscriptionModal(true);
        return false;
      }
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      setShowSubscriptionModal(true);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!linkedInUrl && activeTab === 'url') {
      setError('Please enter your LinkedIn profile URL');
      return;
    }

    if (!profileText && activeTab === 'paste') {
      setError('Please paste your LinkedIn profile text');
      return;
    }

    // Validate LinkedIn URL format
    if (activeTab === 'url' && !linkedInUrl.includes('linkedin.com/in/')) {
      setError('Please enter a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username)');
      return;
    }

    // Check authentication first
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/linkedin-review' } });
      return;
    }

    // Check if server is connected
    if (!isConnected || !apiUrl) {
      setError('Server connection error. Please check your connection and try again.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResults(null);
    setProgressStep(2); // Analysis in progress
    
    try {
      // Verify payment before proceeding
      const paymentVerified = await verifyPayment();
      
      if (!paymentVerified) {
        setIsLoading(false);
        return;
      }
      
      // Make API request to analyze LinkedIn profile
      const response = await fetch(`${apiUrl}/api/cv/linkedin-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({
          profileUrl: activeTab === 'url' ? linkedInUrl : null,
          profileText: activeTab === 'paste' ? profileText : null,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setProgressStep(3); // Results ready
        setResults(data);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        setError(`Analysis failed: ${errorData.message || response.statusText}`);
      }
    } catch (err) {
      console.error('LinkedIn analysis error:', err);
      setError('Failed to analyze LinkedIn profile. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSubscriptionModal(false);
  };

  const handleSubscribe = () => {
    navigate('/pricing', { state: { premium: true, feature: 'LinkedIn profile review' } });
  };

  const resetAnalysis = () => {
    setResults(null);
    setError('');
    if (activeTab === 'url') {
      setLinkedInUrl('');
    } else {
      setProfileText('');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  // If results exist, update useEffect to set final step
  useEffect(() => {
    if (results) {
      setProgressStep(3);
    }
  }, [results]);

  // If server is disconnected, show appropriate message
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Server connection is unavailable. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <FiLinkedin className="mr-2 text-blue-600" />
          LinkedIn Profile Review
        </h1>
        
        {!results ? (
          <>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Optimize your LinkedIn profile</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Our AI-powered tool will analyze your LinkedIn profile and provide personalized recommendations to make it stand out to recruiters and hiring managers.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="text"
                    value={linkedInUrl}
                    onChange={(e) => setLinkedInUrl(e.target.value)}
                    placeholder="https://www.linkedin.com/in/yourprofile"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">OR</span>
                  </div>
                  
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Paste Your LinkedIn Profile Text
                  </label>
                  <textarea
                    value={profileText}
                    onChange={(e) => setProfileText(e.target.value)}
                    placeholder="Copy and paste the content of your LinkedIn profile here..."
                    rows="6"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  ></textarea>
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze Profile'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Why optimize your LinkedIn profile?</h2>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <FiCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Over 95% of recruiters use LinkedIn to find candidates</span>
                </li>
                <li className="flex items-start">
                  <FiCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Profiles with professional photos get 14x more views</span>
                </li>
                <li className="flex items-start">
                  <FiCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Completing your profile makes you 40x more likely to receive opportunities</span>
                </li>
                <li className="flex items-start">
                  <FiCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Users with 5+ skills listed receive up to 17x more profile views</span>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Analysis Results</h2>
              
              {/* Score Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Overall Score</h3>
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{results.overallScore}%</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Profile Visibility</h3>
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{results.profileVisibilityScore}%</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Content Quality</h3>
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{results.contentQualityScore}%</div>
                </div>
              </div>
              
              {/* Strengths */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Profile Strengths</h3>
                <ul className="space-y-2">
                  {results.profileStrengths && results.profileStrengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <FiCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Improvement Recommendations */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Recommendations for Improvement</h3>
                <ul className="space-y-2">
                  {results.improvementRecommendations && results.improvementRecommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <FiAlertCircle className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Section Feedback */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Section-by-Section Feedback</h3>
                <div className="space-y-4">
                  {results.sectionFeedback && Object.entries(results.sectionFeedback).map(([section, feedback]) => (
                    <div key={section} className="border-l-4 border-blue-500 pl-4 py-1">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 capitalize mb-1">{section}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{feedback}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Course Recommendations section - prioritizing keySkillGaps over missingKeywords */}
            {results.keySkillGaps && results.keySkillGaps.length > 0 ? (
              <CourseRecommendations 
                courses={findCourseRecommendations(results.keySkillGaps, 4)} 
                title="Recommended Professional Certifications & Courses"
              />
            ) : results.missingKeywords && results.missingKeywords.length > 0 ? (
              <CourseRecommendations 
                courses={findCourseRecommendations(results.missingKeywords, 4)} 
                title="Recommended Professional Certifications & Courses"
              />
            ) : null}
            
            {/* Action buttons */}
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
              <button
                onClick={() => setResults(null)}
                className="w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Analyze Another Profile
              </button>
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Results as PDF
              </button>
            </div>
          </>
        )}
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900">
                  <FiLinkedin className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Premium Feature</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      LinkedIn Profile Review is a premium feature. Subscribe to unlock this feature and get valuable insights to optimize your LinkedIn presence.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 dark:bg-blue-700 text-base font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900 sm:col-start-2 sm:text-sm"
                  onClick={handleSubscribe}
                >
                  View Plans
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedInReview; 