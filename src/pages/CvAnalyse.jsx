import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';
import { FiUpload, FiCheck, FiX, FiAlertCircle, FiFileText } from 'react-icons/fi';
import CvAnalysisNextSteps from '../components/CvAnalysisNextSteps';
import AnalysisProgressTracker from '../components/AnalysisProgressTracker';
import CourseRecommendations from '../components/CourseRecommendations';
import { findCourseRecommendations } from '../data/courseRecommendations';

const CvAnalyse = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'paste'
  const [cvText, setCvText] = useState('');

  const { isAuthenticated, user, getAuthHeader } = useAuth();
  const { apiUrl, isConnected } = useServer();
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
        return false;
      }

      console.log(`Checking subscription at ${apiUrl}/api/subscriptions/status`);
      const response = await fetch(`${apiUrl}/api/subscriptions/status`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Subscription check result:', data);

        return data.hasActiveSubscription;
      } else {
        console.error('Subscription check failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Failed to check subscription status:', error);
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
    if (!isConnected || !apiUrl) {
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
      setProgressStep(3);
    }
  }, [analysisResults]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      {/* Title section */}
      <div className="container mx-auto px-4 max-w-4xl mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
          CV Analysis
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Upload your CV for a comprehensive analysis of its effectiveness. Get personalized feedback to improve your CV's impact for any job application.
        </p>
        
        {/* Add Progress Tracker */}
        <AnalysisProgressTracker currentStep={progressStep} isAnalyzing={isAnalysing} />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-4 rounded-md mb-4 flex items-start">
              <FiAlertCircle className="mt-1 mr-2 flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}
          
          {!analysisResults && (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-4">
              <div className="flex border-b dark:border-gray-700 mb-6">
                <button
                  className={`py-3 mr-8 border-b-2 ${activeTab === 'upload' ? 'text-[#2c3e50] dark:text-white border-[#2c3e50] dark:border-blue-500 font-medium' : 'text-gray-500 border-transparent'}`}
                  onClick={() => setActiveTab('upload')}
                >
                  Upload File
                </button>
                <button
                  className={`py-3 border-b-2 ${activeTab === 'paste' ? 'text-[#2c3e50] dark:text-white border-[#2c3e50] dark:border-blue-500 font-medium' : 'text-gray-500 border-transparent'}`}
                  onClick={() => setActiveTab('paste')}
                >
                  Paste Text
                </button>
              </div>
              
              {activeTab === 'upload' ? (
                <div>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload').click()}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx"
                      onChange={handleFileInput}
                    />
                    <div className="mb-4">
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                      {file ? file.name : 'Drag & Drop your CV file here'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'PDF or DOCX (max 5MB)'}
                    </p>
                    {file && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="mt-4 inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <FiX className="mr-1.5" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="cv-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Paste your CV text below
                  </label>
                  <textarea
                    id="cv-text"
                    rows={10}
                    className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] dark:focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    placeholder="Copy and paste the content of your CV here..."
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                  ></textarea>
                </div>
              )}
              
              <div className="mt-6 flex justify-end">
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#2c3e50] hover:bg-[#1e2a37] dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2c3e50] dark:focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50"
                  onClick={analyseCV}
                  disabled={isAnalysing || (activeTab === 'upload' && !file) || (activeTab === 'paste' && !cvText.trim())}
                >
                  {isAnalysing ? 'Analysing...' : 'Analyse CV'}
                </button>
              </div>
            </div>
          )}
          
          {analysisResults && (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis Results</h2>
                <button
                  onClick={resetAnalysis}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Analyse Another CV
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                {analysisResults.score !== undefined && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg text-center border border-gray-100 dark:border-gray-600 shadow-sm">
                    <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium uppercase tracking-wide mb-2">Overall Score</h3>
                    <div className={`text-4xl font-bold ${getScoreColor(analysisResults.score)}`}>
                      {analysisResults.score}%
                    </div>
                    <p className={`text-sm font-medium mt-1 ${getScoreColor(analysisResults.score)}`}>
                      {getScoreLabel(analysisResults.score)}
                    </p>
                  </div>
                )}
                
                {analysisResults.contentScore !== undefined && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg text-center border border-gray-100 dark:border-gray-600 shadow-sm">
                    <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium uppercase tracking-wide mb-2">Content Score</h3>
                    <div className={`text-4xl font-bold ${getScoreColor(analysisResults.contentScore)}`}>
                      {analysisResults.contentScore}%
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-100 dark:border-green-800/30">
                  <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-4">Strengths</h3>
                  <ul className="space-y-3">
                    {analysisResults.strengths && analysisResults.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <FiCheck className="mt-1 mr-3 text-green-500 dark:text-green-400 flex-shrink-0" />
                        <span className="text-gray-800 dark:text-gray-200">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-100 dark:border-yellow-800/30">
                  <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-4">Recommendations</h3>
                  <ul className="space-y-3">
                    {analysisResults.recommendations && analysisResults.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <FiAlertCircle className="mt-1 mr-3 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
                        <span className="text-gray-800 dark:text-gray-200">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600 mb-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResults.missingKeywords && analysisResults.missingKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {analysisResults.suggestedImprovements && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Detailed Improvement Suggestions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(analysisResults.suggestedImprovements).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border border-gray-200 dark:border-gray-600">
                        <h4 className="font-medium text-gray-900 dark:text-white capitalize mb-2">{key}</h4>
                        <p className="text-gray-600 dark:text-gray-300">{value}</p>
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
              
              {/* Course Recommendations section */}
              {analysisResults.missingKeywords && analysisResults.missingKeywords.length > 0 && (
                <CourseRecommendations 
                  courses={findCourseRecommendations(analysisResults.missingKeywords)} 
                  title="Recommended Courses to Improve Your Skills"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CvAnalyse;