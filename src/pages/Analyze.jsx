/* eslint-disable */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

// Import necessary React hooks and libraries
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';
import SubscriptionModal from '../components/SubscriptionModal';
import CourseRecommendations from '../components/CourseRecommendations';
import { findCourseRecommendations } from '../data/courseRecommendations';
import './Analyze.css';
import { FiUpload, FiCheck, FiX, FiAlertCircle, FiFileText } from 'react-icons/fi';
import CvAnalysisNextSteps from '../components/CvAnalysisNextSteps';
import AnalysisProgressTracker from '../components/AnalysisProgressTracker';
import CVPreviewWindow from '../components/CVPreviewWindow';

// Global objects that exist in browser environment
/* global FormData, File */

// Analyze component handles CV analysis functionality
const Analyze = () => {
  // State variables for managing file uploads, analysis results, and UI states
  const [file, setFile] = useState(null); // Uploaded CV file
  const [isDragging, setIsDragging] = useState(false); // Dragging state for CV file
  const [isJobDescDragging, setIsJobDescDragging] = useState(false); // Dragging state for job description file
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Analysis progress state
  const [analysisResults, setAnalysisResults] = useState(null); // Results of CV analysis
  const [error, setError] = useState(''); // Error message state
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null); // Uploaded job description file
  const [jobDescriptionText, setJobDescriptionText] = useState(''); // Text of job description
  const [activeTab, setActiveTab] = useState('upload'); // Active tab for job description input ('upload' or 'paste')
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false); // State for subscription modal visibility
  const [showPreview, setShowPreview] = useState(false); // State for CV preview visibility
  const [previewData, setPreviewData] = useState(null); // Data for CV preview
  const [analysisProgress, setAnalysisProgress] = useState(0); // Progress percentage
  const [analysisStage, setAnalysisStage] = useState(''); // Current stage description
  const [enhancedCV, setEnhancedCV] = useState(null);
  const [extractedCVContent, setExtractedCVContent] = useState(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Context hooks for authentication and server connection
  const { isAuthenticated, user, getAuthHeader } = useAuth();
  const { apiUrl, isConnected } = useServer();

  // React Router hooks for navigation and location
  const navigate = useNavigate();
  const location = useLocation();

  // Environment variables for feature toggles
  const mockSubscription = window.ENV_VITE_MOCK_SUBSCRIPTION_DATA === "true";
  const premiumEnabled = window.ENV_VITE_PREMIUM_FEATURES_ENABLED === "true";
  const devMode = window.ENV_VITE_DEV_MODE === "true";
  const bypassPayment = window.ENV_VITE_BYPASS_PAYMENT === "true";

  // Check if user navigated from the home page
  const comingFromHome = location.state?.fromHome;

  useEffect(() => {
    // Prompt user about premium features if coming from home page
    if (comingFromHome) {
      setTimeout(() => {
        checkSubscription();
      }, 1000);
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

  const handleJobDescFileDrop = (e) => {
    e.preventDefault();
    setIsJobDescDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const uploadedFile = e.dataTransfer.files[0];
      validateAndSetJobDescFile(uploadedFile);
    }
  };

  const handleJobDescFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      validateAndSetJobDescFile(uploadedFile);
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

  const validateAndSetJobDescFile = (uploadedFile) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    
    if (!validTypes.includes(uploadedFile.type)) {
      setError('Please upload a PDF, DOCX, or TXT file for the job description');
      return;
    }
    
    if (uploadedFile.size > 5 * 1024 * 1024) {
      setError('Job description file size should not exceed 5MB');
      return;
    }
    
    setJobDescriptionFile(uploadedFile);
    setJobDescriptionText(''); // Clear text input when file is uploaded
  };

  const hasJobDescription = () => {
    return jobDescriptionFile || jobDescriptionText.trim().length > 0;
  };

  const analyzeCV = async () => {
    if (!file) {
      setError('Please upload a CV file first');
      return;
    }

    if (!hasJobDescription()) {
      setError('Please add a job description (upload a file or paste text)');
      return;
    }
    
    // Check authentication first - but bypass in development mode
    if (!isAuthenticated && !import.meta.env.DEV) {
      navigate('/login', { state: { from: '/analyze' } });
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
    setAnalysisProgress(0);
    setAnalysisStage('Initializing analysis...');
    
    // Simulate progress updates with delays for better UX
    const updateProgress = (progress, stage) => {
      setAnalysisProgress(progress);
      setAnalysisStage(stage);
    };

    // Add realistic delays between progress updates
    const delayedProgress = async (progress, stage, delay = 500) => {
      updateProgress(progress, stage);
      await new Promise(resolve => setTimeout(resolve, delay));
    };
    
    try {
      // Check subscription status with delay
      await delayedProgress(10, 'Verifying subscription...', 300);
      const hasSubscription = import.meta.env.DEV || await checkSubscription();
      
      // If testing mode is enabled, bypass the subscription check
      if (!hasSubscription && !mockSubscription && !premiumEnabled && !bypassPayment && !devMode) {
        console.log('User does not have an active subscription');
        setShowSubscriptionModal(true);
        setIsAnalyzing(false);
        return;
      }
      
      console.log('User has active subscription, proceeding with analysis');
      
      await delayedProgress(20, 'Preparing CV for analysis...', 400);
      
      // Create form data to send the file
      const formData = new FormData();
      formData.append('cv', file);
      
      if (jobDescriptionFile) {
        formData.append('jobDescription', jobDescriptionFile);
        console.log('Added job description file:', jobDescriptionFile.name);
      } else if (jobDescriptionText) {
        formData.append('jobDescriptionText', jobDescriptionText);
        console.log('Added job description text, length:', jobDescriptionText.length);
      }
      
      // Get auth headers but don't include Content-Type (browser will set it with boundary)
      const headers = getAuthHeader();
      delete headers['Content-Type'];
      
      // Check if browser is Safari
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      await delayedProgress(30, 'Extracting CV content...', 600);
      
      // Use the endpoint with special handling for Safari
      const apiEndpoint = `${apiUrl}/api/cv/analyze`;
      console.log(`Sending CV to ${apiEndpoint} from ${isSafari ? 'Safari' : 'non-Safari'} browser`);
      
      await delayedProgress(50, 'Analyzing CV content...', 300);
      
      // Safari sometimes has issues with complex fetch requests, use a more basic approach
      if (isSafari) {
        // For Safari, use a simpler approach with fewer headers
        const safariHeaders = {
          'Accept': 'application/json'
        };
        
        if (headers.Authorization) {
          safariHeaders.Authorization = headers.Authorization;
        }
        
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: safariHeaders,
          body: formData,
          mode: 'cors',
          credentials: 'same-origin'
        });
        
        if (response.ok) {
          updateProgress(80, 'Processing analysis results...');
          const data = await response.json();
          console.log('Analysis results:', data);
          updateProgress(100, 'Analysis complete!');
          setAnalysisResults(data);
        } else {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          setError(`Analysis failed: ${errorData.message || response.statusText}`);
        }
      } else {
        // For other browsers, use the standard approach
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers,
          body: formData
        });
        
        if (response.ok) {
          updateProgress(80, 'Processing analysis results...');
          const data = await response.json();
          console.log('Analysis results:', data);
          updateProgress(100, 'Analysis complete!');
          setAnalysisResults(data);
        } else {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          setError(`Analysis failed: ${errorData.message || response.statusText}`);
        }
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
    setFile(null);
    setJobDescriptionFile(null);
    setJobDescriptionText('');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleAIEnhance = async () => {
    if (!analysisResults) return;
    
    try {
      setIsEnhancing(true);
      
      // Prepare data for the enhance request
      // Use extracted content from analysis results instead of raw file
      const enhanceData = {
        cvFile: analysisResults.extractedContent || null,
        jobDescription: jobDescriptionText || null,
        analysisResults: analysisResults
      };
      
      // Get auth headers
      const headers = getAuthHeader();
      
      // Make API call to enhance the CV
      const response = await fetch(`${apiUrl}/api/cv/enhance`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(enhanceData)
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Enhanced CV data:', data);
        
        // Store enhanced CV data
        setEnhancedCV(data.enhancedCV);
        
        // Store the extracted CV content for later use
        if (data.extractedContent) {
          setExtractedCVContent(data.extractedContent);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to enhance CV');
      }
    } catch (error) {
      console.error('Error enhancing CV:', error);
      alert(error.message || 'Failed to enhance your CV. Please try again later.');
    } finally {
      setIsEnhancing(false);
    }
  };

  // New function to handle applying CV changes
  const handleApplyChanges = async () => {
    if (!enhancedCV) return;
    
    try {
      setIsEnhancing(true);
      
      // Get authentication headers
      const headers = getAuthHeader();
      
      // Prepare the data for saving to the user's CV
      const enhancedData = {
        personalStatement: enhancedCV.enhancedSections.personalStatement,
        workExperience: enhancedCV.enhancedSections.workExperience,
        skills: enhancedCV.enhancedSections.skills
      };
      
      // Make API call to save the enhanced CV data
      const response = await fetch(`${apiUrl}/api/cv/apply-enhancements`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cvContent: extractedCVContent,
          enhancedData,
          jobDescription: jobDescriptionText || ''
        })
      });
      
      if (response.ok) {
        // Get the response data
        const data = await response.json();
        
        // Set the preview data and show the preview window
        setPreviewData({
          title: data.title || 'Enhanced CV',
          cvContent: data.cvContent || {
            personalInfo: extractedCVContent?.personalInfo || {},
            personalStatement: enhancedData.personalStatement,
            skills: enhancedData.skills.map(skill => ({
              skill: skill.title,
              level: 'Advanced'
            })),
            experiences: extractedCVContent?.experiences || [],
            education: extractedCVContent?.education || []
          },
          cvId: data.cvId
        });
        
        setShowPreview(true);
      } else {
        throw new Error('Failed to apply changes. Please try again.');
      }
    } catch (error) {
      console.error('Error applying changes:', error);
      alert(error.message || 'Failed to apply changes. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  // Add function to directly download the enhanced CV
  const handleDirectDownload = async () => {
    if (!enhancedCV) return;
    
    try {
      setIsEnhancing(true);
      
      // Prepare CV content for download
      const cvContent = {
        personalInfo: extractedCVContent?.personalInfo || {},
        personalStatement: enhancedCV.enhancedSections.personalStatement,
        skills: enhancedCV.enhancedSections.skills.map(skill => ({
          skill: skill.title,
          level: 'Advanced'
        })),
        experiences: extractedCVContent?.experiences || [],
        education: extractedCVContent?.education || []
      };
      
      // Get auth headers
      const headers = getAuthHeader();
      
      console.log('Starting direct CV download');
      console.log('CV structure:', {
        hasPersonalInfo: !!cvContent.personalInfo,
        personalStatement: cvContent.personalStatement ? cvContent.personalStatement.substring(0, 20) + '...' : 'none',
        skillsCount: cvContent.skills.length
      });
      
      // Call the API to generate a PDF
      const response = await fetch(`${apiUrl}/api/cv/generate-pdf`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cvData: JSON.stringify(cvContent)
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to generate PDF:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        throw new Error(`Failed to generate PDF: ${response.status} ${response.statusText}`);
      }
      
      // Create a blob from the PDF data
      const blob = await response.blob();
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Enhanced CV - ${new Date().toLocaleDateString()}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('CV downloaded successfully!');
    } catch (error) {
      console.error('Error downloading CV:', error);
      alert(`Failed to download CV: ${error.message}`);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      {/* Title section */}
      <div className="container mx-auto px-4 max-w-4xl mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
          CV Analysis with Job Description Matching
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Upload your CV and a job description to see how well they match. Get personalized recommendations to improve your chances of landing an interview.
        </p>
      </div>

      {/* Show CV Preview Window if active */}
      {showPreview && previewData && (
        <CVPreviewWindow 
          cvContent={previewData.cvContent}
          title={previewData.title}
          onClose={() => {
            setShowPreview(false);
            // Redirect to saved CVs after closing if we have a CV ID
            if (previewData.cvId) {
              navigate(`/saved-cvs`);
            }
          }}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {/* Subscription Modal */}
        {showSubscriptionModal && (
          <SubscriptionModal
            isOpen={showSubscriptionModal}
            onClose={() => setShowSubscriptionModal(false)}
          />
        )}

        {isAnalyzing ? (
          // Analysis Loading Screen
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mx-4 max-w-md w-full shadow-2xl">
              <div className="text-center">
                {/* Animated CV Icon */}
                <div className="relative mx-auto w-16 h-20 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg cv-icon-glow"></div>
                  <div className="absolute inset-1 bg-white dark:bg-gray-800 rounded-md flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-500 cv-icon-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  {/* Scanning lines animation */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-75"
                         style={{
                           animation: 'scan 2s linear infinite',
                           top: `${Math.min(analysisProgress, 90)}%`
                         }}>
                    </div>
                  </div>
                  {/* Additional animated elements */}
                  <div className="absolute -top-2 -right-2 w-4 h-4">
                    <div className="w-full h-full bg-green-500 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 w-full h-full bg-green-500 rounded-full opacity-75"></div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Analyzing Your CV
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6 min-h-[1.5rem]">
                  {analysisStage}
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out progress-shimmer"
                    style={{ width: `${analysisProgress}%` }}
                  >
                  </div>
                </div>

                {/* Progress Percentage */}
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  {analysisProgress}% Complete
                </div>

                {/* Stage Indicators */}
                <div className="flex justify-center space-x-2 mb-6">
                  {['Extracting', 'Analyzing', 'Processing', 'Complete'].map((stage, index) => {
                    const stageProgress = (index + 1) * 25;
                    const isActive = analysisProgress >= stageProgress;
                    const isCurrent = analysisProgress >= (index * 25) && analysisProgress < stageProgress;
                    
                    return (
                      <div key={stage} className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          isActive 
                            ? 'bg-green-500 scale-110' 
                            : isCurrent 
                              ? 'bg-blue-500 animate-pulse scale-110' 
                              : 'bg-gray-300 dark:bg-gray-600'
                        }`}></div>
                        <span className={`text-xs mt-1 transition-colors duration-300 ${
                          isActive 
                            ? 'text-green-600 dark:text-green-400 font-medium' 
                            : isCurrent 
                              ? 'text-blue-600 dark:text-blue-400 font-medium' 
                              : 'text-gray-400'
                        }`}>
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Fun Facts */}
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                  {analysisProgress < 25 && "💡 Did you know? Our AI analyzes over 50 different CV criteria to give you the most accurate feedback possible."}
                  {analysisProgress >= 25 && analysisProgress < 50 && "🎯 We're matching your skills against industry requirements and ATS systems."}
                  {analysisProgress >= 50 && analysisProgress < 75 && "📊 Our algorithm evaluates your CV's formatting, content quality, and keyword optimization."}
                  {analysisProgress >= 75 && analysisProgress < 100 && "✨ Almost done! We're generating personalized recommendations just for you."}
                  {analysisProgress >= 100 && "🎉 Analysis complete! Preparing your detailed feedback..."}
                </div>
              </div>
            </div>
          </div>
        ) : !analysisResults ? (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Step 1: Upload Your CV</h2>
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isDragging ? 'border-[#E78F81] bg-[#E78F81]/10' : 'border-gray-300 dark:border-gray-700'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="flex flex-col items-center">
                    <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900">
                      <svg className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-900 dark:text-white font-medium mb-1">
                      {file.name}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                    <button
                      onClick={() => setFile(null)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81] dark:focus:ring-offset-gray-900"
                    >
                      Change File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-4 text-gray-900 dark:text-white font-medium">
                      Drag and drop your CV file here
                    </p>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
                      or <button 
                        type="button"
                        className="text-[#E78F81] hover:text-[#d36e62] font-medium focus:outline-none focus:underline"
                        onClick={() => document.getElementById('cv-file').click()}
                      >
                        browse
                      </button> to select a file
                    </p>
                    <input
                      type="file"
                      id="cv-file"
                      className="hidden"
                      accept=".pdf,.docx"
                      onChange={handleFileInput}
                    />
                    <p className="mt-1 text-gray-500 dark:text-gray-400 text-xs">
                      PDF or DOCX up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Step 2: Add Job Description</h2>
              
              <div className="flex mb-4 border-b dark:border-gray-700">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'upload'
                      ? 'border-b-2 border-[#E78F81] text-[#E78F81]'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                  onClick={() => setActiveTab('upload')}
                >
                  Upload File
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'paste'
                      ? 'border-b-2 border-[#E78F81] text-[#E78F81]'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                  onClick={() => setActiveTab('paste')}
                >
                  Paste Text
                </button>
              </div>
              
              {activeTab === 'upload' ? (
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    isJobDescDragging ? 'border-[#E78F81] bg-[#E78F81]/10' : 'border-gray-300 dark:border-gray-700'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsJobDescDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsJobDescDragging(false);
                  }}
                  onDrop={handleJobDescFileDrop}
                >
                  {jobDescriptionFile ? (
                    <div className="flex flex-col items-center">
                      <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900">
                        <svg className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-900 dark:text-white font-medium mb-1">
                        {jobDescriptionFile.name}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                        {(jobDescriptionFile.size / 1024).toFixed(2)} KB
                      </p>
                      <button
                        onClick={() => setJobDescriptionFile(null)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81] dark:focus:ring-offset-gray-900"
                      >
                        Change File
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mt-4 text-gray-900 dark:text-white font-medium">
                        Drag and drop job description here
                      </p>
                      <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
                        or <button 
                          type="button"
                          className="text-[#E78F81] hover:text-[#d36e62] font-medium focus:outline-none focus:underline"
                          onClick={() => document.getElementById('job-desc-file').click()}
                        >
                          browse
                        </button> to select a file
                      </p>
                      <input
                        type="file"
                        id="job-desc-file"
                        className="hidden"
                        accept=".pdf,.docx,.txt"
                        onChange={handleJobDescFileSelect}
                      />
                      <p className="mt-1 text-gray-500 dark:text-gray-400 text-xs">
                        PDF, DOCX, or TXT up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-6">
                  <div className="relative">
                    <textarea
                      className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder=""
                      value={jobDescriptionText}
                      onChange={(e) => setJobDescriptionText(e.target.value)}
                    ></textarea>
                    {jobDescriptionText.length === 0 && (
                      <div className="absolute inset-0 pointer-events-none flex items-start pt-4 px-4">
                        <span className="text-gray-400/60 dark:text-gray-500/70 text-sm italic">
                          Paste job description here...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
                <p>{error}</p>
              </div>
            )}

            <div className="flex justify-center">
              <button
                className={`px-8 py-3 rounded-lg font-medium text-white ${
                  isAnalyzing
                    ? 'bg-gray-500 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-[#E78F81] hover:bg-[#d36e62] dark:bg-[#e07c6e] dark:hover:bg-[#c75d50]'
                }`}
                onClick={analyzeCV}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze CV'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Analysis Results</h2>
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={resetAnalysis}
              >
                New Analysis
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Overall Score</h3>
                <div className={`text-4xl font-bold ${getScoreColor(analysisResults.score)}`}>
                  {analysisResults.score}%
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Format & Structure</h3>
                <div className={`text-4xl font-bold ${getScoreColor(analysisResults.formatScore)}`}>
                  {analysisResults.formatScore}%
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Content Quality</h3>
                <div className={`text-4xl font-bold ${getScoreColor(analysisResults.contentScore)}`}>
                  {analysisResults.contentScore}%
                </div>
              </div>
              
              {analysisResults.jobFitScore !== undefined && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 md:col-span-3">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Job Match Score</h3>
                  <div className={`text-4xl font-bold ${getScoreColor(analysisResults.jobFitScore)}`}>
                    {analysisResults.jobFitScore}%
                  </div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    This score indicates how well your CV matches the job description.
                  </p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">CV Strengths</h3>
                <ul className="space-y-2">
                  {(analysisResults.strengths && Array.isArray(analysisResults.strengths) ? analysisResults.strengths : ['Professional presentation', 'Relevant experience', 'Clear communication']).map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Improvement Areas</h3>
                <ul className="space-y-2">
                  {(analysisResults.recommendations && Array.isArray(analysisResults.recommendations) ? analysisResults.recommendations : ['Add measurable achievements', 'Include relevant keywords', 'Improve formatting consistency']).map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {(analysisResults.missingKeywords && Array.isArray(analysisResults.missingKeywords) ? analysisResults.missingKeywords : ['leadership', 'project management', 'communication', 'teamwork']).map((keyword, index) => (
                  <span 
                    key={index}
                    className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-3 py-1 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Detailed Suggestions</h3>
              
              <div className="space-y-6">
                {analysisResults.improvementSuggestions ? (
                  <>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white mb-2">Content Improvements</h4>
                      <p className="text-gray-700 dark:text-gray-300">{analysisResults.improvementSuggestions.content || 'No specific content improvements identified.'}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white mb-2">Format & Structure</h4>
                      <p className="text-gray-700 dark:text-gray-300">{analysisResults.improvementSuggestions.format || 'No specific format improvements identified.'}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white mb-2">Keyword Optimization</h4>
                      <p className="text-gray-700 dark:text-gray-300">{analysisResults.improvementSuggestions.keywords || 'No specific keyword improvements identified.'}</p>
                    </div>
                  </>
                ) : analysisResults.improvements && Array.isArray(analysisResults.improvements) ? (
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2">Improvement Suggestions</h4>
                    <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300">
                      {analysisResults.improvements.map((improvement, index) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2">General Improvements</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Based on the analysis, consider focusing on quantifiable achievements, 
                      relevant keywords for your target industry, and clear formatting.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* AI Enhancement Button */}
            <div className="mt-8 mb-8 flex justify-center">
              <button 
                onClick={handleAIEnhance}
                disabled={isEnhancing}
                className={`flex items-center gap-2 ${
                  isEnhancing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                } text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200`}
              >
                {isEnhancing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AI is Enhancing Your CV...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                    Ask AI to Enhance My CV
                  </>
                )}
              </button>
            </div>
            
            {/* Enhanced CV Results */}
            {enhancedCV && (
              <div className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300">
                    AI Enhanced CV Suggestions
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">New Score:</span>
                    <span className={`text-lg font-bold ${getScoreColor(enhancedCV.newScore)}`}>
                      {enhancedCV.newScore}%
                    </span>
                    {enhancedCV.newScore > analysisResults.score && (
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full">
                        +{Math.round(enhancedCV.newScore - analysisResults.score)}%
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Personal Statement */}
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-3">Enhanced Personal Statement</h4>
                    <p className="text-gray-700 dark:text-gray-300 italic bg-blue-50 dark:bg-blue-900/10 p-4 rounded border-l-4 border-blue-500">
                      "{enhancedCV.enhancedSections.personalStatement}"
                    </p>
                  </div>
                  
                  {/* Work Experience */}
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-3">Work Experience Optimization</h4>
                    <div className="space-y-3">
                      {enhancedCV.enhancedSections.workExperience.map((item, index) => (
                        <div key={index} className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-1">{item.title}</h5>
                          <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Skills */}
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-3">Skills Enhancement</h4>
                    <div className="space-y-3">
                      {enhancedCV.enhancedSections.skills.map((item, index) => (
                        <div key={index} className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-1">{item.title}</h5>
                          <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Apply Changes Button */}
                <div className="mt-6 flex justify-center gap-4">
                  <button 
                    onClick={handleDirectDownload}
                    disabled={isEnhancing}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {isEnhancing ? 'Processing...' : 'Download Enhanced CV'}
                  </button>
                  
                  <button 
                    onClick={handleApplyChanges}
                    disabled={isEnhancing}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEnhancing ? 'Applying Changes...' : 'Apply All Changes to My CV'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Course Recommendations section */}
            {analysisResults.keySkillGaps && analysisResults.keySkillGaps.length > 0 ? (
              <CourseRecommendations 
                courses={findCourseRecommendations(analysisResults.keySkillGaps, 4)} 
                title="Recommended Courses to Match Job Requirements"
              />
            ) : analysisResults.missingKeywords && analysisResults.missingKeywords.length > 0 && (
              <CourseRecommendations 
                courses={findCourseRecommendations(analysisResults.missingKeywords, 4)} 
                title="Recommended Courses Based on Missing Keywords"
              />
            )}
            
            {/* Next Steps Guidance */}
            <CvAnalysisNextSteps 
              analysisResults={analysisResults}
              analysisType="job-specific" 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;