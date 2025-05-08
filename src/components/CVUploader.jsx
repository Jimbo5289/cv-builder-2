import { useState, useCallback } from 'react';
import { FiUpload, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const CVUploader = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const { getAuthHeader } = useAuth();
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

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
    setResults(null);
    
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit');
      return;
    }

    setFile(file);
  };

  const analyzeCV = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setError('');
    setResults(null);
    
    try {
      // Create form data to send the file
      const formData = new FormData();
      formData.append('cv', file);
      
      // In development mode, use mock data after a delay
      if (import.meta.env.DEV && !API_URL.includes('localhost')) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResults({
          score: 85,
          recommendations: [
            'Add more quantifiable achievements',
            'Include relevant certifications',
            'Strengthen technical skills section'
          ],
          missingKeywords: ['leadership', 'project management', 'agile']
        });
      } else {
        // Make real API call in production
        const response = await fetch(`${API_URL}/api/cv/analyze`, {
          method: 'POST',
          headers: {
            ...getAuthHeader(),
            // Don't set Content-Type with FormData, browser will set it with boundary
          },
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to analyze CV');
        }
        
        const data = await response.json();
        setResults(data);
      }
    } catch (err) {
      console.error('CV analysis error:', err);
      setError(err.message || 'Failed to analyze CV. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const resetUpload = () => {
    setFile(null);
    setError('');
    setResults(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {!results && (
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
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center gap-2">
          <FiAlertCircle className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!results && (
        <button
          onClick={analyzeCV}
          disabled={!file || isAnalyzing}
          className={`mt-6 w-full py-3 px-4 rounded-md text-white font-medium ${
            !file || isAnalyzing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze CV'}
        </button>
      )}

      {results && (
        <div className="mt-8 space-y-6">
          <div className="text-center">
            <h4 className="text-lg font-medium mb-2">ATS Compatibility Score</h4>
            <span className={`text-4xl font-bold ${getScoreColor(results.score)}`}>
              {results.score}%
            </span>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-3">Recommendations</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {results.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-3">Missing Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {results.missingKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          
          <button
            onClick={resetUpload}
            className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Upload Another CV
          </button>
        </div>
      )}
    </div>
  );
};

export default CVUploader; 