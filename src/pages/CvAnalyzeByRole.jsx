/* eslint-disable */

// Import necessary React hooks and libraries
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';
import { INDUSTRIES, ROLES_BY_INDUSTRY } from '../data/jobRolesData';
import CvAnalysisNextSteps from '../components/CvAnalysisNextSteps';
import AnalysisProgressTracker from '../components/AnalysisProgressTracker';
import CourseRecommendations from '../components/CourseRecommendations';
import CVPreviewResult from '../components/CVPreviewResult';
import CareerPathway from '../components/CareerPathway';
import { findCourseRecommendationsWithPathway } from '../data/courseRecommendations';
import SubscriptionModal from '../components/SubscriptionModal';

// CvAnalyzeByRole component handles CV analysis based on selected industry and role
const CvAnalyzeByRole = () => {
  // State variables for managing file uploads, analysis results, and UI states
  const [file, setFile] = useState(null); // Uploaded CV file
  const [isDragging, setIsDragging] = useState(false); // Dragging state for CV file
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Analysis progress state
  const [error, setError] = useState(''); // Error message state
  const [analysisResults, setAnalysisResults] = useState(null); // Results of CV analysis
  const [selectedIndustry, setSelectedIndustry] = useState(''); // Selected industry for analysis
  const [selectedRole, setSelectedRole] = useState(''); // Selected role for analysis
  const [useGenericScope, setUseGenericScope] = useState(true); // Whether to use generic analysis scope
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false); // State for subscription modal visibility
  const [careerPathwayData, setCareerPathwayData] = useState(null); // Career pathway analysis

  // Add progress step state
  const [progressStep, setProgressStep] = useState(1); // Current step in analysis progress

  // Context hooks for authentication and server connection
  const { getAuthHeader, isAuthenticated } = useAuth();
  const { apiUrl, isConnected } = useServer();

  // React Router hooks for navigation and location
  const navigate = useNavigate();
  const location = useLocation();

  // Log the API URL on component mount
  useEffect(() => {
    console.log('CvAnalyzeByRole: Using API URL:', apiUrl);
  }, [apiUrl]);

  // Callback functions for drag-and-drop functionality
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  }, []);

  const handleFileInput = useCallback((e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  }, []);

  // Validate and set the uploaded file
  const validateAndSetFile = (file) => {
    setError('');
    setAnalysisResults(null);
    setCareerPathwayData(null);
    
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should not exceed 5MB');
      return;
    }

    setFile(file);
  };

  // Check if the user has an active subscription
  const checkSubscription = useCallback(async () => {
    // In development mode, always return true for testing
    if (import.meta.env.DEV) {
      console.log('Development mode, bypassing subscription check');
      return true;
    }
    
    try {
      // Check if server is connected
      if (!isConnected || !apiUrl) {
        console.error('Server not connected, cannot check subscription');
        setError('Server connection error. Please try again later.');
        return false;
      }
      
      const headers = getAuthHeader();
      console.log('Auth headers:', headers);
      
      const response = await fetch(`${apiUrl}/api/subscriptions/premium-status`, {
        method: 'GET',
        headers: headers
      });
      
      console.log('Premium status response:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Premium status data:', data);
        const hasAccess = data.hasPremiumAccess || data.hasAccess;
        console.log('Calculated hasAccess:', hasAccess);
        return hasAccess;
      } else {
        const errorData = await response.text();
        console.error('Premium status error:', response.status, errorData);
        console.error('Request URL:', `${apiUrl}/api/subscriptions/premium-status`);
      }
      
      return false;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  }, [apiUrl, isConnected, getAuthHeader, setError]);

  // Analyze the uploaded CV
  const analyzeCV = useCallback(async () => {
    if (!file) {
      setError('Please upload a CV file first');
      return;
    }
    
    // Check industry/role selection if not in generic mode
    if (!useGenericScope && (!selectedIndustry || !selectedRole)) {
      setError('Please select both industry and role');
      return;
    }
    
    // Check authentication first - but bypass in development mode
    if (!isAuthenticated && !import.meta.env.DEV) {
      navigate('/login', { state: { from: location } });
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
      // In development mode, we don't need to check subscription
      const hasSubscription = import.meta.env.DEV || await checkSubscription();
      
      if (!hasSubscription) {
        console.log('User does not have an active subscription');
        setShowSubscriptionModal(true);
        setIsAnalyzing(false);
        return;
      }
      
      // Prepare form data
      const formData = new FormData();
      formData.append('cv', file);
      
      if (!useGenericScope && selectedIndustry && selectedRole) {
        formData.append('industry', selectedIndustry);
        formData.append('role', selectedRole);
      } else {
        // Explicit flag for generic analysis
        formData.append('useGenericScope', 'true');
      }
      
      // Get auth headers but don't include Content-Type (browser will set it with boundary)
      const headers = getAuthHeader();
      delete headers['Content-Type'];
      
      // Check if browser is Safari
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      // Use the endpoint with special handling for Safari
      const apiEndpoint = `${apiUrl}/api/cv/analyze-by-role`;
      console.log(`Sending CV to ${apiEndpoint} from ${isSafari ? 'Safari' : 'non-Safari'} browser`);
      
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
          const data = await response.json();
          console.log('Analysis results:', data);
          setProgressStep(3); // Update to Results step
          setAnalysisResults(data);
          
          // Generate career pathway if we have role and education data
          if (!useGenericScope && selectedRole && data.extractedInfo?.education) {
            const pathwayResults = findCourseRecommendationsWithPathway(
              data.missingKeywords || data.keySkillGaps || data._keySkillGaps || [], 
              4,
              selectedIndustry,
              selectedRole,
              data.extractedInfo.education
            );
            setCareerPathwayData(pathwayResults.careerPathway);
          }
        } else {
          await handleResponseError(response);
        }
      } else {
        // For other browsers, use the standard approach
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers,
          body: formData
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Analysis results:', data);
          setProgressStep(3); // Update to Results step
          setAnalysisResults(data);
          
          // Generate career pathway if we have role and education data
          if (!useGenericScope && selectedRole && data.extractedInfo?.education) {
            const pathwayResults = findCourseRecommendationsWithPathway(
              data.missingKeywords || data.keySkillGaps || data._keySkillGaps || [], 
              4,
              selectedIndustry,
              selectedRole,
              data.extractedInfo.education
            );
            setCareerPathwayData(pathwayResults.careerPathway);
          }
        } else {
          await handleResponseError(response);
        }
      }
    } catch (error) {
      console.error('Error during analysis:', error);
      setError('Failed to analyze CV. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [
    file, 
    useGenericScope, 
    selectedIndustry, 
    selectedRole, 
    isAuthenticated, 
    navigate, 
    location, 
    isConnected, 
    apiUrl, 
    getAuthHeader, 
    checkSubscription,
    setShowSubscriptionModal,
    setIsAnalyzing,
    setError,
    setAnalysisResults,
    setProgressStep
  ]);
  
  // Helper function to handle response errors
  const handleResponseError = async (response) => {
    // Special handling for authentication errors
    if (response.status === 401) {
      console.error('Authentication error. Please log in again.');
      setError('Authentication error. Please log in again.');
      // Optionally force a logout here if you have that function
      // logout();
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error(`Analysis failed: ${response.status} ${response.statusText}`, errorData);
      setError(`Analysis failed: ${errorData.message || response.statusText}`);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  // Effect to update progress step to 4 after results are shown
  useEffect(() => {
    if (analysisResults) {
      const timer = setTimeout(() => {
        setProgressStep(4);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [analysisResults]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Title section */}
      <div className="container mx-auto px-4 max-w-4xl pt-20 pb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
          Role Related CV Analysis
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Get CV feedback tailored to your specific industry and role
        </p>
        
        {/* Add Progress Tracker */}
        <AnalysisProgressTracker currentStep={progressStep} isAnalyzing={isAnalyzing} />
      </div>
      
      <div className="max-w-4xl mx-auto px-4">
        {/* Subscription Modal */}
        {showSubscriptionModal && (
          <SubscriptionModal
            isOpen={showSubscriptionModal}
            closeModal={() => setShowSubscriptionModal(false)}
            navigateToSubscription={() => navigate('/subscription', { state: { redirectFrom: location.pathname } })}
          />
        )}

        {!analysisResults ? (
          <>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
              {/* File Upload Area */}
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
                      <svg className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8m36-12h-4m4 0H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-4 text-gray-900 dark:text-white font-medium">
                      Drag and drop your CV file here
                    </p>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
                      or{' '}
                      <label htmlFor="file-upload" className="text-[#E78F81] hover:text-[#d36e62] font-medium cursor-pointer">
                        browse
                      </label>{' '}
                      to select a file
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
              
              {/* Job Role Selection */}
              <div className="mt-6">
                <div className="flex items-center mb-4">
                  <input
                    id="generic-analysis"
                    name="analysis-type"
                    type="checkbox"
                    checked={useGenericScope}
                    onChange={() => setUseGenericScope(!useGenericScope)}
                    className="h-4 w-4 text-[#E78F81] focus:ring-[#E78F81] border-gray-300 rounded"
                  />
                  <label htmlFor="generic-analysis" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Use generic CV analysis (recommended for general feedback)
                  </label>
                </div>
                
                {!useGenericScope && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Industry
                      </label>
                      <select
                        id="industry"
                        value={selectedIndustry}
                        onChange={(e) => {
                          setSelectedIndustry(e.target.value);
                          setSelectedRole('');
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E78F81] focus:ring-[#E78F81] dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
                      >
                        <option value="">Select an industry</option>
                        {INDUSTRIES.map((industry) => (
                          <option key={industry.value} value={industry.value}>
                            {industry.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {selectedIndustry && (
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Job Role
                        </label>
                        <select
                          id="role"
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E78F81] focus:ring-[#E78F81] dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
                        >
                          <option value="">Select a job role</option>
                          {ROLES_BY_INDUSTRY[selectedIndustry]?.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Analyze Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={analyzeCV}
                  disabled={isAnalyzing || !file || (!useGenericScope && (!selectedIndustry || !selectedRole))}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#E78F81] hover:bg-[#d36e62] dark:bg-[#e07c6e] dark:hover:bg-[#c75d50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81] dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze CV'}
                </button>
              </div>
            </div>
          </>
        ) : (
          // Results display section
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {useGenericScope 
                    ? 'Analysis Results' 
                    : `Analysis Results for ${selectedRole} in ${selectedIndustry}`
                  }
                </h2>
                <button 
                  onClick={() => {
                    setAnalysisResults(null);
                    setCareerPathwayData(null);
                    setProgressStep(1);
                  }}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
                >
                  Analyze Another CV
                </button>
              </div>
              
              {/* Match Score */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {useGenericScope ? 'Overall Score' : 'Match Score'}
                  </h3>
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
                    {analysisResults.improvements && analysisResults.improvements.length > 0 ? (
                      analysisResults.improvements.map((improvement, index) => (
                        <li key={index}>{improvement}</li>
                      ))
                    ) : (
                      <li>No specific improvements identified at this time.</li>
                    )}
                  </ul>
                </div>
                
                {/* Matching Skills */}
                {analysisResults.matchingSkills && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Matching Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisResults.matchingSkills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Missing Skills */}
                {analysisResults.missingSkills && analysisResults.missingSkills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Skills to Add</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisResults.missingSkills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Course Recommendations based on missing skills */}
            {(analysisResults.recommendedCourses && analysisResults.recommendedCourses.length > 0) ? (
              <CourseRecommendations 
                courses={analysisResults.recommendedCourses}
                title={useGenericScope 
                  ? "Recommended Courses Based on Your CV" 
                  : `Recommended Courses for ${selectedRole} Roles`
                }
              />
            ) : (
              // Generate course recommendations from missingKeywords or keySkillGaps if recommendedCourses is not available
              (analysisResults.missingKeywords || analysisResults.keySkillGaps || analysisResults._keySkillGaps) && (
                <CourseRecommendations 
                  courses={findCourseRecommendationsWithPathway(
                    analysisResults.missingKeywords || analysisResults.keySkillGaps || analysisResults._keySkillGaps, 
                    4,
                    selectedIndustry,
                    selectedRole,
                    analysisResults.extractedInfo?.education
                  ).courses}
                  title={useGenericScope 
                    ? "Recommended Courses to Improve Your CV" 
                    : `Recommended Courses for ${selectedRole} in ${selectedIndustry}`
                  }
                />
              )
            )}
            
            {/* Career Pathway Analysis - Only for role-specific analysis */}
            {!useGenericScope && careerPathwayData && (
              <CareerPathway 
                careerPathway={careerPathwayData}
                role={selectedRole}
                industry={selectedIndustry}
              />
            )}
            
            {/* Preview and download/save CV component - Only for paid users */}
            {analysisResults.extractedInfo && (
              <CVPreviewResult 
                analysisResults={analysisResults} 
                cvContent={file} 
                fileName={file ? file.name : 'My CV'}
              />
            )}
            
            {/* Next Steps Guidance */}
            <CvAnalysisNextSteps 
              analysisType={useGenericScope ? "general" : "role-specific"}
              role={selectedRole}
              industry={selectedIndustry}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CvAnalyzeByRole;