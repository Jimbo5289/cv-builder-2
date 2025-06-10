/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { FiDownload, FiSave, FiCheck, FiLoader } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';
import { markUnused } from '../utils/lintUtils';

// Global objects that exist in browser environment
/* global FormData */

const CVPreviewResult = ({ analysisResults, cvContent, fileName }) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [cvTitle, _setCvTitle] = useState(fileName ? fileName.replace(/\.[^/.]+$/, '') : 'My CV');
  
  // Mark unused variables
  markUnused(cvContent);
  
  const { isAuthenticated, getAuthHeader } = useAuth();
  const { apiUrl } = useServer();

  // Generate CV preview content based on analysis results and extracted text
  const generatePreviewContent = () => {
    if (!analysisResults || !analysisResults.extractedInfo) return null;
    
    // Extract personal info if available
    const personalInfo = analysisResults.extractedInfo?.personalInfo || {};
    
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Header with name */}
        {personalInfo.fullName && (
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{personalInfo.fullName}</h2>
        )}
        
        {/* Contact info */}
        {(personalInfo.email || personalInfo.phone || personalInfo.location) && (
          <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600 dark:text-gray-300">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
          </div>
        )}
        
        {/* Personal statement if available */}
        {analysisResults.extractedInfo?.personalStatement && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Personal Statement</h3>
            <p className="text-gray-700 dark:text-gray-300">{analysisResults.extractedInfo.personalStatement}</p>
          </div>
        )}
        
        {/* Skills section */}
        {analysisResults.extractedInfo?.skills && analysisResults.extractedInfo.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {analysisResults.extractedInfo.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                  {skill.skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Work experience */}
        {analysisResults.extractedInfo?.experiences && analysisResults.extractedInfo.experiences.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Work Experience</h3>
            {analysisResults.extractedInfo.experiences.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">{exp.position}</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </div>
                </div>
                <div className="text-gray-700 dark:text-gray-300 mb-1">{exp.company}</div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{exp.description}</p>
              </div>
            ))}
          </div>
        )}
        
        {/* Education */}
        {analysisResults.extractedInfo?.education && analysisResults.extractedInfo.education.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Education</h3>
            {analysisResults.extractedInfo.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">{edu.degree}</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </div>
                </div>
                <div className="text-gray-700 dark:text-gray-300 mb-1">{edu.institution}</div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{edu.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleSaveCV = async () => {
    if (!isAuthenticated) {
      setError('Please login to save your CV');
      return;
    }
    
    try {
      setSaving(true);
      setError('');
      
      // Prepare CV data from analysis results
      const cvData = {
        title: cvTitle,
        content: {
          personalInfo: analysisResults.extractedInfo?.personalInfo || {},
          personalStatement: analysisResults.extractedInfo?.personalStatement || '',
          skills: analysisResults.extractedInfo?.skills || [],
          experiences: analysisResults.extractedInfo?.experiences || [],
          education: analysisResults.extractedInfo?.education || [],
          references: []
        }
      };
      
      const response = await fetch(`${apiUrl}/api/cv/save`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cvData)
      });
      
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save CV');
      }
    } catch (err) {
      console.error('Error saving CV:', err);
      setError(err.message || 'Failed to save your CV');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setError('');
      
      // Create form data with CV content for PDF generation
      const formData = new FormData();
      formData.append('cvData', JSON.stringify({
        personalInfo: analysisResults.extractedInfo?.personalInfo || {},
        personalStatement: analysisResults.extractedInfo?.personalStatement || '',
        skills: analysisResults.extractedInfo?.skills || [],
        experiences: analysisResults.extractedInfo?.experiences || [],
        education: analysisResults.extractedInfo?.education || [],
        references: []
      }));
      
      // Headers without Content-Type to let browser set it for form data
      const headers = getAuthHeader();
      delete headers['Content-Type'];
      
      const response = await fetch(`${apiUrl}/api/cv/generate-pdf`, {
        method: 'POST',
        headers,
        body: formData
      });
      
      if (response.ok) {
        // Get the blob from the response
        const blob = await response.blob();
        
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary link and trigger download
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${cvTitle}.pdf`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download CV');
      }
    } catch (err) {
      console.error('Error downloading CV:', err);
      setError(err.message || 'Failed to download your CV');
    }
  };

  if (!analysisResults || !analysisResults.extractedInfo) {
    return null;
  }

  return (
    <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">CV Preview & Download</h2>
        
        <div className="flex items-center mt-3 sm:mt-0 space-x-2">
          {error && <p className="text-red-600 text-sm mr-2">{error}</p>}
          
          {/* Save to account button */}
          <button
            onClick={handleSaveCV}
            disabled={saving || saved}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81] dark:focus:ring-offset-gray-900 ${
              saved
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-[#E78F81] hover:bg-[#d36e62] dark:bg-[#e07c6e] dark:hover:bg-[#c75d50] text-white'
            }`}
          >
            {saving ? (
              <>
                <FiLoader className="animate-spin mr-2 h-4 w-4" />
                Saving...
              </>
            ) : saved ? (
              <>
                <FiCheck className="mr-2 h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <FiSave className="mr-2 h-4 w-4" />
                Save to Account
              </>
            )}
          </button>
          
          {/* Download PDF button */}
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
          >
            <FiDownload className="mr-2 h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>
      
      {/* CV title input */}
      <div className="mb-4">
        <label htmlFor="cv-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          CV Title
        </label>
        <input
          type="text"
          id="cv-title"
          value={cvTitle}
          onChange={(e) => _setCvTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E78F81] focus:ring-[#E78F81] dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
          placeholder="Enter a title for your CV"
        />
      </div>
      
      {/* CV Preview */}
      <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        {generatePreviewContent()}
      </div>
    </div>
  );
};

export default CVPreviewResult; 