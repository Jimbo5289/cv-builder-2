import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';
import { FiUpload, FiCheck, FiX, FiAlertCircle, FiFileText } from 'react-icons/fi';
import CvAnalysisNextSteps from '../components/CvAnalysisNextSteps';
import AnalysisProgressTracker from '../components/AnalysisProgressTracker';

const CvAnalyse = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'paste'
  const [cvText, setCvText] = useState('');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  const { isAuthenticated, user, getAuthHeader } = useAuth();
  const { apiUrl, status: serverStatus } = useServer();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Add progress step state
  const [progressStep, setProgressStep] = useState(1);
  
  // Check if coming from home page
  const comingFromHome = location.state?.fromHome;
  
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
      if (serverStatus !== 'connected' || !apiUrl) {
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileInput = (e) => {
    setError('');
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      validateAndSetFile(uploadedFile);
    }
  };

  const validateAndSetFile = (uploadedFile) => {
    // Check file type (PDF, DOCX, etc.)
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(uploadedFile.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }
    
    // Check file size (max 5MB)
    if (uploadedFile.size > 5 * 1024 * 1024) {
      setError('File size should not exceed 5MB');
      return;
    }
    
    setFile(uploadedFile);
  };

  const analyseCV = async () => {
    if (activeTab === 'upload' && !file) {
      setError('Please upload a CV file first');
      return;
    }

    if (activeTab === 'paste' && !cvText.trim()) {
      setError('Please paste your CV text');
      return;
    }
    
    // Check authentication first
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cv-analyse' } });
      return;
    }

    // Check if server is connected
    if (serverStatus !== 'connected' || !apiUrl) {
      setError('Server connection error. Please check your connection and try again.');
      return;
    }

    setIsAnalysing(true);
    setError('');
    setAnalysisResults(null);
    setProgressStep(2); // Update progress to Analysis step
    
    try {
      // Check subscription status
      const hasSubscription = await checkSubscription();
      
      if (!hasSubscription && !import.meta.env.DEV) {
        console.log('User does not have an active subscription');
        setShowSubscriptionModal(true);
        setIsAnalysing(false);
        return;
      }
      
      console.log('Proceeding with analysis');
      
      // Create form data to send the file or text
      const formData = new FormData();
      
      if (activeTab === 'upload' && file) {
        // Explicitly log file information for debugging
        console.log(`Appending file to form: ${file.name}, size: ${file.size}, type: ${file.type}`);
        formData.append('cv', file);
      } else if (activeTab === 'paste' && cvText) {
        formData.append('cvText', cvText);
      }
      
      // Log all form data contents for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`Form contains: ${key} => ${value instanceof File ? value.name : value}`);
      }
      
      // Get auth headers but remove Content-Type header which interferes with form data
      const headers = getAuthHeader();
      delete headers['Content-Type']; // This is crucial for multipart/form-data to work properly
      
      console.log(`Submitting CV analysis request to ${apiUrl}/api/cv/analyse-only`);
      
      const response = await fetch(`${apiUrl}/api/cv/analyse-only`, {
        method: 'POST',
        headers: headers,
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Analysis results:', data);
        setProgressStep(3); // Update progress to Results step
        setAnalysisResults(data);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        setError(`Analysis failed: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error during analysis:', error);
      setError('Failed to analyze CV. Please try again later.');
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleCloseModal = () => {
    setShowSubscriptionModal(false);
  };

  const handleSubscribe = () => {
    navigate('/pricing', { state: { premium: true, feature: 'CV analysis' } });
  };

  const resetAnalysis = () => {
    setAnalysisResults(null);
    setError('');
    if (activeTab === 'upload') {
      setFile(null);
    } else {
      setCvText('');
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
    if (analysisResults) {
      // Set step to 4 after results are shown for a brief moment
      const timer = setTimeout(() => {
        setProgressStep(4);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [analysisResults]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Header and title section */}
      <div className="container mx-auto px-4 max-w-4xl mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          CV Analysis
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Get AI-powered feedback on your CV without comparison to a specific job
        </p>
        
        {/* Add Progress Tracker */}
        <AnalysisProgressTracker currentStep={progressStep} isAnalyzing={isAnalysing} />
      </div>
      
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            CV Analysis
          </h1>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Get instant feedback on your CV with our AI-powered analysis
          </p>
        </div>

        {/* Tab selection */}
        {!analysisResults && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`${
                    activeTab === 'upload'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:text-base mr-8`}
                >
                  Upload CV
                </button>
                <button
                  onClick={() => setActiveTab('paste')}
                  className={`${
                    activeTab === 'paste'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:text-base`}
                >
                  Paste CV Text
                </button>
              </nav>
            </div>

            {activeTab === 'upload' ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Drag and drop your CV here
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  or click to select a file (PDF or DOCX)
                </p>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileInput}
                  className="hidden"
                  id="cv-upload"
                />
                <label
                  htmlFor="cv-upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                  Select File
                </label>
                {file && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                    <FiCheck className="text-green-500" />
                    {file.name}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label htmlFor="cv-text" className="sr-only">
                  Paste your CV text
                </label>
                <textarea
                  id="cv-text"
                  name="cv-text"
                  rows={10}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Paste the full text of your CV here..."
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                ></textarea>
                <p className="mt-2 text-sm text-gray-500">
                  Please include all sections: contact details, work experience, education, skills, etc.
                </p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center gap-2">
                <FiAlertCircle className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={analyseCV}
              disabled={isAnalysing || (activeTab === 'upload' && !file) || (activeTab === 'paste' && !cvText.trim())}
              className={`mt-6 w-full py-3 px-4 rounded-md text-white font-medium ${
                isAnalysing || (activeTab === 'upload' && !file) || (activeTab === 'paste' && !cvText.trim())
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isAnalysing ? 'Analysing...' : 'Analyse CV'}
            </button>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResults && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
              <button
                onClick={resetAnalysis}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiX className="mr-2 -ml-1" />
                Start Over
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-5 rounded-lg text-center border border-gray-100 shadow-sm">
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-2">Overall Score</h3>
                <div className={`text-4xl font-bold ${getScoreColor(analysisResults.score)}`}>
                  {analysisResults.score}%
                </div>
                <p className="mt-1 text-sm font-medium">{getScoreLabel(analysisResults.score)}</p>
              </div>
              
              {analysisResults.formattingScore && (
                <div className="bg-gray-50 p-5 rounded-lg text-center border border-gray-100 shadow-sm">
                  <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-2">Format Score</h3>
                  <div className={`text-4xl font-bold ${getScoreColor(analysisResults.formattingScore)}`}>
                    {analysisResults.formattingScore}%
                  </div>
                </div>
              )}
              
              {analysisResults.contentScore && (
                <div className="bg-gray-50 p-5 rounded-lg text-center border border-gray-100 shadow-sm">
                  <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-2">Content Score</h3>
                  <div className={`text-4xl font-bold ${getScoreColor(analysisResults.contentScore)}`}>
                    {analysisResults.contentScore}%
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                <h3 className="text-lg font-medium text-green-800 mb-4">Strengths</h3>
                <ul className="space-y-3">
                  {analysisResults.strengths && analysisResults.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <FiCheck className="mt-1 mr-3 text-green-500 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
                <h3 className="text-lg font-medium text-yellow-800 mb-4">Recommendations</h3>
                <ul className="space-y-3">
                  {analysisResults.recommendations && analysisResults.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <FiAlertCircle className="mt-1 mr-3 text-yellow-500 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {analysisResults.missingKeywords && analysisResults.missingKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {analysisResults.suggestedImprovements && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Improvement Suggestions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(analysisResults.suggestedImprovements).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 capitalize mb-2">{key}</h4>
                      <p className="text-gray-600">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Next Steps component */}
            <CvAnalysisNextSteps 
              score={analysisResults.score} 
              analysisType="general" 
            />
          </div>
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                  <FiFileText className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Premium Feature</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      CV Analysis is a premium feature. Subscribe to unlock this feature and get valuable insights into your CV quality.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                  onClick={handleSubscribe}
                >
                  Subscribe Now
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
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

export default CvAnalyse; 