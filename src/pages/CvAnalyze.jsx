/* eslint-disable */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

// Import necessary React hooks and libraries
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';
import { FiUpload, FiCheck, FiX, FiAlertCircle, FiFileText } from 'react-icons/fi';
import CvAnalysisNextSteps from '../components/CvAnalysisNextSteps';
import AnalysisProgressTracker from '../components/AnalysisProgressTracker';
import CourseRecommendations from '../components/CourseRecommendations';
import CVPreviewResult from '../components/CVPreviewResult';
import { findCourseRecommendations } from '../data/courseRecommendations';

// Global objects that exist in browser environment
/* global FormData, File */

// CvAnalyze component handles CV analysis functionality
const CvAnalyze = () => {
  // State variables for managing file uploads, analysis results, and UI states
  const [file, setFile] = useState(null); // Uploaded CV file
  const [isDragging, setIsDragging] = useState(false); // Dragging state for CV file
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Analysis progress state
  const [analysisResults, setAnalysisResults] = useState(null); // Results of CV analysis
  const [error, setError] = useState(''); // Error message state
  const [activeTab, setActiveTab] = useState('upload'); // Active tab for CV input ('upload' or 'paste')
  const [cvText, setCvText] = useState(''); // Text of CV for analysis

  // Context hooks for authentication and server connection
  const { isAuthenticated, user, getAuthHeader } = useAuth();
  const { apiUrl, isConnected } = useServer();

  // React Router hooks for navigation and location
  const navigate = useNavigate();
  const location = useLocation();

  // Add progress step state
  const [progressStep, setProgressStep] = useState(1); // Current step in analysis progress

  // Check if user navigated from the home page
  const comingFromHome = location.state?.fromHome;

  // Environment variables for feature toggles
  const mockSubscription = window.ENV_VITE_MOCK_SUBSCRIPTION_DATA === "true";
  const premiumEnabled = window.ENV_VITE_PREMIUM_FEATURES_ENABLED === "true";
  const devMode = window.ENV_VITE_DEV_MODE === "true";
  const bypassPayment = window.ENV_VITE_BYPASS_PAYMENT === "true";

  useEffect(() => {
    // Prompt user about premium features if coming from home page
    if (comingFromHome) {
      setTimeout(() => {
        checkSubscription();
      }, 500);
    }
  }, [comingFromHome]);

  // Function to check if the user has an active subscription
  const checkSubscription = async () => {
    try {
      // Always return true if any of these variables are enabled
      if (mockSubscription || premiumEnabled || bypassPayment || devMode) {
        console.log('Bypassing subscription check - testing mode enabled');
        return true;
      }

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

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Drag enter');
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Drag leave');
    // Only set dragging to false if we're leaving the drop zone itself, not a child element
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('File dropped', e.dataTransfer.files);
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileInput = (e) => {
    console.log('File input triggered', e.target.files);
    setError('');
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      console.log('File selected:', uploadedFile.name, uploadedFile.type, uploadedFile.size);
      validateAndSetFile(uploadedFile);
    }
  };

  const validateAndSetFile = (uploadedFile) => {
    console.log('Validating file:', uploadedFile);
    
    // Check file type (PDF, DOCX, etc.)
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(uploadedFile.type)) {
      console.log('Invalid file type:', uploadedFile.type);
      setError('Please upload a PDF or DOCX file');
      return;
    }
    
    // Check file size (max 5MB)
    if (uploadedFile.size > 5 * 1024 * 1024) {
      console.log('File too large:', uploadedFile.size);
      setError('File size should not exceed 5MB');
      return;
    }
    
    console.log('File validation passed, setting file');
    setFile(uploadedFile);
  };

  const analyzeCV = async () => {
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
      navigate('/login', { state: { from: '/cv-analyze' } });
      return;
    }

    // Check if server is connected
    if (!isConnected || !apiUrl) {
      setError('Server connection error. Please check your connection and try again.');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysisResults(null);
    setProgressStep(2); // Update progress to Analysis step
    
    try {
      // Check subscription status but allow through if in testing mode
      const hasSubscription = await checkSubscription();
      
      // If testing mode is enabled, bypass the subscription check
      if (!hasSubscription && !mockSubscription && !premiumEnabled && !bypassPayment && !devMode) {
        console.log('User does not have an active subscription');
        setIsAnalyzing(false);
        navigate('/subscription', { state: { redirectFrom: '/cv-analyze', upgrade: true } });
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
      
      console.log(`Submitting CV analysis request to ${apiUrl}/api/cv/analyze-only`);
      
      const response = await fetch(`${apiUrl}/api/cv/analyze-only`, {
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
      setIsAnalyzing(false);
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
    <div className="container mx-auto px-4 pt-20 pb-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Existing heading */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">CV Analysis</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Upload your CV for an AI-powered analysis and get actionable feedback
        </p>
        
        {/* Progress tracker component */}
        <AnalysisProgressTracker currentStep={progressStep} />
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {!analysisResults && (
          // Existing upload UI remains the same
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            {/* Existing upload tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'upload'
                    ? 'text-[#E78F81] border-b-2 border-[#E78F81]'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                onClick={() => setActiveTab('upload')}
              >
                Upload File
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'paste'
                    ? 'text-[#E78F81] border-b-2 border-[#E78F81]'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                onClick={() => setActiveTab('paste')}
              >
                Paste Text
              </button>
            </div>
            
            {/* Existing file upload area */}
            {activeTab === 'upload' && (
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isDragging ? 'border-[#E78F81] bg-[#E78F81]/10' : 'border-gray-300 dark:border-gray-700'
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="flex flex-col items-center">
                    <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900">
                      <FiCheck className="h-8 w-8 text-green-600 dark:text-green-300" />
                    </div>
                    <p className="text-gray-900 dark:text-white font-medium mb-1">
                      {file.name}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={analyzeCV}
                        disabled={isAnalyzing}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#E78F81] hover:bg-[#d36e62] dark:bg-[#e07c6e] dark:hover:bg-[#c75d50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81] dark:focus:ring-offset-gray-900"
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze CV'}
                      </button>
                      <button
                        onClick={() => setFile(null)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81] dark:focus:ring-offset-gray-900"
                      >
                        Change File
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-gray-900 dark:text-white font-medium">
                      Drag and drop your CV file here
                    </p>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
                      or <button 
                        type="button"
                        className="text-[#E78F81] hover:text-[#d36e62] font-medium focus:outline-none focus:underline"
                        onClick={() => document.getElementById('file-upload').click()}
                      >
                        browse
                      </button> to select a file
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileInput}
                      accept=".pdf,.docx"
                    />
                    <p className="mt-1 text-gray-500 dark:text-gray-400 text-xs">
                      PDF or DOCX up to 5MB
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Existing paste text area */}
            {activeTab === 'paste' && (
              <div className="space-y-4">
                <textarea
                  placeholder="Paste your CV text here..."
                  className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-[#E78F81] focus:border-[#E78F81] dark:bg-gray-700 dark:text-white"
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                />
                <div className="flex justify-end">
                  <button
                    onClick={analyzeCV}
                    disabled={isAnalyzing || !cvText.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#E78F81] hover:bg-[#d36e62] dark:bg-[#e07c6e] dark:hover:bg-[#c75d50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81] dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze CV'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Existing analysis results display */}
        {analysisResults && (
          <div className="space-y-6">
            {/* Analysis Results Section */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analysis Results</h2>
                <button 
                  onClick={resetAnalysis}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
                >
                  Analyze Another CV
                </button>
              </div>
              
              {/* Overall Score */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Overall Score</h3>
                  <span className={`text-2xl font-bold ${getScoreColor(analysisResults.score)}`}>
                    {analysisResults.score}/100 - {getScoreLabel(analysisResults.score)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${getScoreColor(analysisResults.score).replace('text-', 'bg-')}`}
                    style={{ width: `${analysisResults.score}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Feedback and Improvements */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Feedback</h3>
                  <p className="text-gray-600 dark:text-gray-300">{analysisResults.feedback}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Suggested Improvements</h3>
                  <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-300">
                    {analysisResults.improvements.map((improvement, index) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Course Recommendations */}
            {analysisResults.recommendedCourses && analysisResults.recommendedCourses.length > 0 && (
              <CourseRecommendations 
                courses={analysisResults.recommendedCourses} 
                title="Recommended Courses Based on Your CV"
              />
            )}
            
            {/* Preview and download/save CV component - Only for paid users */}
            {(isAuthenticated || premiumEnabled || bypassPayment || mockSubscription || devMode) && (
              <CVPreviewResult 
                analysisResults={analysisResults} 
                cvContent={activeTab === 'upload' ? file : cvText} 
                fileName={activeTab === 'upload' && file ? file.name : 'My CV'}
              />
            )}
            
            {/* Next Steps Guidance */}
            <CvAnalysisNextSteps 
              analysisResults={analysisResults}
              analysisType="general" 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CvAnalyze;