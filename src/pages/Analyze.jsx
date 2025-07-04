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
import AnalysisResultsCard from '../components/AnalysisResultsCard';
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
  const [originalCvContent, setOriginalCvContent] = useState(''); // Store original CV content

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
      
      // Use the enhanced analysis endpoint
      const apiEndpoint = `${apiUrl}/api/analysis/analyze-enhanced`;
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
          
          // Store original CV content from response
          if (data.cvText) {
            setOriginalCvContent(data.cvText);
          }
          
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
          
          // Store original CV content from response
          if (data.cvText) {
            setOriginalCvContent(data.cvText);
          }
          
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950 dark:to-gray-900">
      {/* Title section */}
      <div className="container mx-auto px-4 max-w-4xl pt-20 pb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
          CV Analysis Against Job Description
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Upload your CV and job description to get targeted optimization advice
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

      <div className="max-w-4xl mx-auto px-4 py-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md border border-blue-100 dark:border-blue-900/30">
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
          <AnalysisResultsCard 
            analysisResults={analysisResults}
            onNewAnalysis={resetAnalysis}
          />
        )}

        {/* Next Steps Guidance and Detailed Improvements */}
        <CvAnalysisNextSteps 
          analysisResults={analysisResults}
          analysisType="job"
          originalCvText={originalCvContent}
        />
      </div>
    </div>
  );
};

export default Analyze;