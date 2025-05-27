import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';
import { usePaymentVerification } from '../components/PayPerCvProtectedRoute';
import { INDUSTRIES, ROLES_BY_INDUSTRY } from '../data/jobRolesData';
import CvAnalysisNextSteps from '../components/CvAnalysisNextSteps';
import AnalysisProgressTracker from '../components/AnalysisProgressTracker';
import CourseRecommendations from '../components/CourseRecommendations';
import { findCourseRecommendations } from '../data/courseRecommendations';

const CvAnalyseByRole = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [error, setError] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [useGenericScope, setUseGenericScope] = useState(true);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  // Add progress step state
  const [progressStep, setProgressStep] = useState(1);
  
  const { getAuthHeader, isAuthenticated } = useAuth();
  const { apiUrl, isConnected } = useServer();
  const { verifyPayment, isVerifying, hasValidPayment } = usePaymentVerification();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Log the API URL on component mount
  useEffect(() => {
    console.log('CvAnalyseByRole: Using API URL:', apiUrl);
  }, [apiUrl]);

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

  const validateAndSetFile = (file) => {
    setError('');
    setAnalysisResults(null);
    
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

  const analyseCV = async () => {
    if (!file) {
      setError('Please upload a CV file first');
      return;
    }
    
    // Check industry/role selection if not in generic mode
    if (!useGenericScope && (!selectedIndustry || !selectedRole)) {
      setError('Please select both industry and role');
      return;
    }
    
    // Check authentication first
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
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
      // Verify payment instead of checking subscription
      const paymentVerified = await verifyPayment();
      
      if (!paymentVerified) {
        setIsAnalysing(false);
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
      
      const response = await fetch(`${apiUrl}/api/cv/analyse-by-role`, {
        method: 'POST',
        headers,
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        setProgressStep(3); // Update to Results step
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

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      {/* Title section */}
      <div className="container mx-auto px-4 max-w-4xl mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
          Industry-Focused CV Analysis
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Get CV feedback tailored to your specific industry and role
        </p>
        
        {/* Add Progress Tracker */}
        <AnalysisProgressTracker currentStep={progressStep} isAnalyzing={isAnalysing} />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-[#2c3e50] dark:text-white mb-6">CV Analysis Tool</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Upload your CV for an AI analysis of its effectiveness. Get personalized feedback to improve your CV's impact for any job application.
        </p>

        {/* Subscription Modal */}
        {showSubscriptionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full shadow-xl">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m10-7l-3 4m0 0l-3-4m3 4V9m-7 6a6 6 0 110-12 6 6 0 010 12z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Premium Feature</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  CV analysis is a premium feature. Upgrade now to unlock this feature and many more!
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate('/subscription')}
                    className="flex-1 bg-[#3498db] hover:bg-[#2980b9] dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-2 px-4 rounded transition"
                  >
                    Upgrade
                  </button>
                  <button
                    onClick={() => setShowSubscriptionModal(false)}
                    className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!analysisResults ? (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#2c3e50] dark:text-white mb-4">1. Upload Your CV</h2>
              <div 
                className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer mb-6 ${
                  isDragging ? 'border-[#3498db] bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-[#3498db] dark:hover:border-[#3498db]'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('cv-file').click()}
              >
                <input
                  type="file"
                  id="cv-file"
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={handleFileInput}
                />
                
                <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                
                <p className="text-lg font-medium mb-1 text-gray-700 dark:text-gray-200">
                  {file ? file.name : 'Drag and drop your CV here'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'or click to browse (PDF or DOCX, max 5MB)'}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#2c3e50] dark:text-white mb-4">2. Choose Analysis Scope</h2>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
                <div className="flex items-center mb-4">
                  <input
                    id="generic-scope"
                    type="radio"
                    checked={useGenericScope}
                    onChange={() => setUseGenericScope(true)}
                    className="h-4 w-4 text-[#3498db] dark:text-blue-600 focus:ring-[#3498db] dark:focus:ring-blue-600 border-gray-300 dark:border-gray-600"
                  />
                  <label htmlFor="generic-scope" className="ml-2 block text-base font-medium text-gray-700 dark:text-gray-200">
                    Generic Analysis (Recommended)
                  </label>
                </div>
                
                <div className="ml-6 mb-6 text-gray-600 dark:text-gray-400 text-sm">
                  Evaluate your CV against general best practices applicable to any industry or role.
                </div>
                
                <div className="flex items-center mb-4">
                  <input
                    id="role-specific"
                    type="radio"
                    checked={!useGenericScope}
                    onChange={() => setUseGenericScope(false)}
                    className="h-4 w-4 text-[#3498db] dark:text-blue-600 focus:ring-[#3498db] dark:focus:ring-blue-600 border-gray-300 dark:border-gray-600"
                  />
                  <label htmlFor="role-specific" className="ml-2 block text-base font-medium text-gray-700 dark:text-gray-200">
                    Role-Specific Analysis
                  </label>
                </div>
                
                {!useGenericScope && (
                  <div className="ml-6 space-y-4">
                    <div>
                      <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Select Industry
                      </label>
                      <select
                        id="industry"
                        value={selectedIndustry}
                        onChange={(e) => {
                          setSelectedIndustry(e.target.value);
                          setSelectedRole(''); // Reset role when industry changes
                        }}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-[#3498db] dark:focus:ring-blue-600 focus:border-[#3498db] dark:focus:border-blue-600"
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
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Select Role
                        </label>
                        <select
                          id="role"
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-[#3498db] dark:focus:ring-blue-600 focus:border-[#3498db] dark:focus:border-blue-600"
                        >
                          <option value="">Select a role</option>
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
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <button
              onClick={analyseCV}
              disabled={!file || (!useGenericScope && !selectedIndustry) || isAnalysing}
              className={`w-full py-3 rounded-md font-medium text-white ${
                !file || (!useGenericScope && !selectedIndustry) || isAnalysing
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-[#3498db] hover:bg-[#2980b9] dark:bg-blue-600 dark:hover:bg-blue-700'
              } transition-colors duration-200`}
            >
              {isAnalysing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analysing CV...
                </span>
              ) : (
                'Analyse CV'
              )}
            </button>
          </>
        ) : (
          // Results display section
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-[#2c3e50] dark:text-white mb-2">Analysis Results</h2>
              
              <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8 mt-6">
                <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4 w-full md:w-auto">
                  <div className="text-gray-600 dark:text-gray-300 mb-1 font-medium">Overall Score</div>
                  <div className={`text-5xl font-bold ${getScoreColor(analysisResults.score)}`}>
                    {analysisResults.score}%
                  </div>
                </div>
                
                <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4 w-full md:w-auto">
                  <div className="text-gray-600 dark:text-gray-300 mb-1 font-medium">Format Score</div>
                  <div className={`text-3xl font-bold ${getScoreColor(analysisResults.formatScore)}`}>
                    {analysisResults.formatScore}%
                  </div>
                </div>
                
                <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4 w-full md:w-auto">
                  <div className="text-gray-600 dark:text-gray-300 mb-1 font-medium">Content Score</div>
                  <div className={`text-3xl font-bold ${getScoreColor(analysisResults.contentScore)}`}>
                    {analysisResults.contentScore}%
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-100 dark:border-green-800/30 h-full">
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {analysisResults.strengths.map((strength, index) => (
                    <li key={`strength-${index}`} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-200">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-100 dark:border-yellow-800/30 h-full">
                <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-300 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {analysisResults.recommendations.map((recommendation, index) => (
                    <li key={`recommendation-${index}`} className="flex items-start">
                      <svg className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-200">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 mb-8">
              <h3 className="text-xl font-semibold text-[#2c3e50] dark:text-white mb-4">Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {analysisResults.missingKeywords.map((keyword, index) => (
                  <span 
                    key={`keyword-${index}`} 
                    className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full px-3 py-1 text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 h-full">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Content Improvements</h3>
                <p className="text-gray-700 dark:text-gray-200">{analysisResults.improvementSuggestions.content}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 h-full">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Format Improvements</h3>
                <p className="text-gray-700 dark:text-gray-200">{analysisResults.improvementSuggestions.format}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 h-full">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Structure Improvements</h3>
                <p className="text-gray-700 dark:text-gray-200">{analysisResults.improvementSuggestions.structure}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 h-full">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Keyword Improvements</h3>
                <p className="text-gray-700 dark:text-gray-200">{analysisResults.improvementSuggestions.keywords}</p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => {
                  setFile(null);
                  setAnalysisResults(null);
                  setError('');
                }}
                className="bg-[#3498db] dark:bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-[#2980b9] dark:hover:bg-blue-700 transition"
              >
                Analyse Another CV
              </button>
            </div>
            
            <CvAnalysisNextSteps 
              score={analysisResults.score} 
              analysisType="industry" 
            />
            
            {/* Course Recommendations section */}
            {analysisResults.keySkillGaps && analysisResults.keySkillGaps.length > 0 && (
              <CourseRecommendations 
                courses={findCourseRecommendations([
                  ...analysisResults.keySkillGaps,
                  ...(selectedIndustry ? [selectedIndustry] : [])
                ])} 
                title="Recommended Courses to Close Skills Gaps"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CvAnalyseByRole; 