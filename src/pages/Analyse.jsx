import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';

const Analyse = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isJobDescDragging, setIsJobDescDragging] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState('');
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'paste'
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  const { isAuthenticated, user, getAuthHeader } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { apiUrl } = useServer();
  
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

  const analyseCV = async () => {
    if (!file) {
      setError('Please upload a CV file first');
      return;
    }

    if (!hasJobDescription()) {
      setError('Please provide a job description for better analysis');
      return;
    }
    
    // Check authentication first
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    setIsAnalysing(true);
    setError('');
    setAnalysisResults(null);
    
    try {
      // Check subscription status
      const hasSubscription = await checkSubscription();
      
      if (!hasSubscription) {
        console.log('User does not have an active subscription');
        setShowSubscriptionModal(true);
        setIsAnalysing(false);
        return;
      }
      
      console.log('User has active subscription, proceeding with analysis');
      
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
      
      // Use fixed API URL instead of dynamically checking multiple ports
      console.log(`Submitting CV for analysis to ${apiUrl}/api/cv/analyse`);
      
      // Get auth headers but remove Content-Type header which interferes with form data
      const headers = getAuthHeader();
      delete headers['Content-Type']; // This is crucial for multipart/form-data to work properly
      
      const response = await fetch(`${apiUrl}/api/cv/analyse`, {
        method: 'POST',
        headers: headers,
        body: formData
      });
      
      // Handle successful response
      if (response.ok) {
        const result = await response.json();
        console.log('Analysis complete:', result);
        setAnalysisResults(result);
      } else {
        // Handle error response
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Analysis failed:', response.status, errorData);
        setError(errorData.error || `Analysis failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError(`Analysis error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsAnalysing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#2c3e50] dark:text-white mb-6">CV Analysis Tool</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Upload your CV and job description for targeted AI analysis. Get personalised recommendations to tailor your CV to specific job requirements.
      </p>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m10-7l-3 4m0 0l-3-4m3 4V9m-7 6a6 6 0 110-12 6 6 0 010 12z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Premium Feature</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                CV analysis with job matching requires a premium subscription. Upgrade now to unlock this feature and many more!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate('/pricing', { state: { premium: true, from: location.pathname, feature: 'CV Analysis' } })}
                  className="bg-blue-600 dark:bg-blue-700 text-white py-2 px-6 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 font-medium"
                >
                  View Plans
                </button>
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-6 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
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
            <h2 className="text-xl font-semibold text-[#2c3e50] dark:text-white mb-4">2. Add Job Description & Person Specification</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  className={`py-3 px-4 font-medium text-sm flex-1 ${
                    activeTab === 'upload' 
                      ? 'text-[#3498db] dark:text-blue-400 border-b-2 border-[#3498db] dark:border-blue-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setActiveTab('upload')}
                >
                  Upload File
                </button>
                <button
                  className={`py-3 px-4 font-medium text-sm flex-1 ${
                    activeTab === 'paste' 
                      ? 'text-[#3498db] dark:text-blue-400 border-b-2 border-[#3498db] dark:border-blue-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setActiveTab('paste')}
                >
                  Copy & Paste
                </button>
              </div>

              {activeTab === 'upload' ? (
                <div 
                  className={`p-6 flex flex-col items-center justify-center cursor-pointer ${
                    isJobDescDragging ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsJobDescDragging(true);
                  }}
                  onDragLeave={() => setIsJobDescDragging(false)}
                  onDrop={handleJobDescFileDrop}
                  onClick={() => document.getElementById('job-desc-file').click()}
                >
                  <input
                    type="file"
                    id="job-desc-file"
                    className="hidden"
                    accept=".pdf,.docx,.txt"
                    onChange={handleJobDescFileSelect}
                  />
                  
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  
                  <p className="text-base font-medium mb-1 text-gray-700 dark:text-gray-200">
                    {jobDescriptionFile ? jobDescriptionFile.name : 'Drag and drop job description here'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {jobDescriptionFile 
                      ? `${(jobDescriptionFile.size / 1024 / 1024).toFixed(2)} MB` 
                      : 'or click to browse (PDF, DOCX, or TXT, max 5MB)'}
                  </p>
                </div>
              ) : (
                <div className="p-6">
                  <textarea
                    value={jobDescriptionText}
                    onChange={(e) => {
                      setJobDescriptionText(e.target.value);
                      setJobDescriptionFile(null); // Clear file when text is entered
                    }}
                    placeholder="Paste the job description and person specification here..."
                    className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-[#3498db] focus:border-[#3498db] dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  ></textarea>
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
            disabled={!file || !hasJobDescription() || isAnalysing}
            className={`w-full py-3 rounded-md font-medium text-white ${
              !file || !hasJobDescription() || isAnalysing
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
                Analysing...
              </span>
            ) : (
              'Analyse CV Against Job Description'
            )}
          </button>
        </>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#2c3e50] dark:text-white">Analysis Results</h2>
            <div className="flex items-center mt-4 md:mt-0 space-x-4">
              <div className="flex flex-col items-center">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">CV Score</div>
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-4 border-blue-100 dark:border-blue-900">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{analysisResults.score}%</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Job Match</div>
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-4 border-green-100 dark:border-green-900">
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">{analysisResults.jobMatch}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-blue-800">
                <span className="font-medium">Note:</span> Analysis scores will remain consistent whether you upload or paste your job description. The same CV and job description will always generate the same score.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-[#2c3e50] dark:text-white mb-4">Job-Specific Recommendations</h3>

          <div className="mb-6">
            <div className="bg-green-50 rounded-md p-4 border border-green-100 mb-6">
              <h4 className="font-medium text-green-800 mb-2">Keywords To Include</h4>
              <div className="flex flex-wrap gap-2">
                {analysisResults.keywordsMissing.map((keyword, index) => (
                  <span key={`keyword-${index}`} className="bg-white text-green-700 text-sm px-3 py-1 rounded-full border border-green-200">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {analysisResults.jobMatchSuggestions.map((suggestion, index) => (
                <li key={`job-suggestion-${index}`}>{suggestion}</li>
              ))}
            </ul>
          </div>

          {/* Course Recommendations Section */}
          {analysisResults.courseRecommendations && analysisResults.courseRecommendations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#2c3e50] dark:text-white mb-4">Recommended Courses</h3>
              <div className="bg-yellow-50 rounded-md p-4 border border-yellow-100 mb-4">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">Skill Up:</span> Based on the skills gaps in your CV, we recommend the following courses from Alison.com to help improve your match for this role.
                </p>
              </div>
              
              <div className="space-y-4">
                {analysisResults.courseRecommendations.map((recommendation, index) => (
                  <div key={`course-recommendation-${index}`} className="bg-white rounded-md p-4 border border-gray-200">
                    <h4 className="text-lg font-semibold text-[#2c3e50] dark:text-white mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                      {recommendation.skill.charAt(0).toUpperCase() + recommendation.skill.slice(1)}
                    </h4>
                    
                    <div className="ml-7 space-y-2">
                      {recommendation.courses.map((course, courseIndex) => (
                        <a 
                          key={`course-${index}-${courseIndex}`}
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start hover:bg-blue-50 p-2 rounded transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span className="text-blue-600 hover:text-blue-800 hover:underline">{course.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">Strengths</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {analysisResults.strengths.map((strength, index) => (
                  <li key={`strength-${index}`}>{strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-2">Areas to Improve</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {analysisResults.weaknesses.map((weakness, index) => (
                  <li key={`weakness-${index}`}>{weakness}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#2c3e50] dark:text-white mb-2">General Suggestions</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {analysisResults.suggestions.map((suggestion, index) => (
                <li key={`suggestion-${index}`}>{suggestion}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => {
                setFile(null);
                setJobDescriptionFile(null);
                setJobDescriptionText('');
                setAnalysisResults(null);
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
            >
              Try Another Analysis
            </button>
            <button
              onClick={() => window.location.href = '/create'}
              className="px-6 py-2 bg-[#3498db] text-white rounded-md hover:bg-[#2980b9] font-medium"
            >
              Create New CV
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyse; 