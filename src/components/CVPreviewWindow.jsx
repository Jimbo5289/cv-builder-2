import React, { useState } from 'react';
import { FiDownload, FiPrinter, FiSave, FiX, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';

const CVPreviewWindow = ({ cvContent, title, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { isAuthenticated, getAuthHeader } = useAuth();
  const { apiUrl } = useServer();

  // Function to download the CV as PDF
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Get authentication headers
      const headers = getAuthHeader();
      
      console.log('Starting CV download process');
      console.log('CV Content structure:', {
        hasPersonalInfo: !!cvContent.personalInfo,
        personalStatement: cvContent.personalStatement ? `${cvContent.personalStatement.substring(0, 20)}...` : 'none',
        skillsCount: cvContent.skills ? cvContent.skills.length : 0,
        experiencesCount: cvContent.experiences ? cvContent.experiences.length : 0,
        educationCount: cvContent.education ? cvContent.education.length : 0
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
      
      console.log('PDF generated successfully, downloading...');
      
      // Create a blob from the PDF data
      const blob = await response.blob();
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${title || 'CV'}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Error downloading CV:', error);
      window.alert(`Failed to download CV: ${error.message}. Please try again.`);
    } finally {
      setIsDownloading(false);
    }
  };

  // Function to print the CV
  const handlePrint = () => {
    setIsPrinting(true);
    
    // Create a new window with the CV content
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      window.alert('Please allow pop-ups to print the CV');
      setIsPrinting(false);
      return;
    }
    
    // Generate HTML content for printing
    const personalInfo = cvContent.personalInfo || {};
    const personalStatement = cvContent.personalStatement || '';
    const skills = cvContent.skills || [];
    const experiences = cvContent.experiences || [];
    const education = cvContent.education || [];
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title || 'CV'}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          h1, h2, h3 { color: #2a60c1; }
          .cv-header { text-align: center; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .section-title { border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .skill-list { display: flex; flex-wrap: wrap; gap: 10px; }
          .skill-item { background: #f0f4f8; padding: 5px 10px; border-radius: 5px; }
          .experience-item, .education-item { margin-bottom: 15px; }
          .job-title, .degree { font-weight: bold; }
          .company, .institution { color: #555; }
          .date-range { font-style: italic; color: #777; margin: 5px 0; }
          @media print {
            body { font-size: 12pt; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="cv-header">
          <h1>${personalInfo.name || 'CV'}</h1>
          <p>${personalInfo.email || ''} ${personalInfo.phone ? '| ' + personalInfo.phone : ''}</p>
          ${personalInfo.location ? `<p>${personalInfo.location}</p>` : ''}
        </div>
        
        ${personalStatement ? `
        <div class="section">
          <h2 class="section-title">Personal Statement</h2>
          <p>${personalStatement}</p>
        </div>
        ` : ''}
        
        ${skills.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skill-list">
            ${skills.map(s => `<div class="skill-item">${s.skill || s}</div>`).join('')}
          </div>
        </div>
        ` : ''}
        
        ${experiences.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Work Experience</h2>
          ${experiences.map(exp => `
            <div class="experience-item">
              <div class="job-title">${exp.position || exp.title || ''}</div>
              <div class="company">${exp.company || ''}</div>
              <div class="date-range">${exp.startDate || ''} - ${exp.endDate || 'Present'}</div>
              <p>${exp.description || ''}</p>
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${education.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Education</h2>
          ${education.map(edu => `
            <div class="education-item">
              <div class="degree">${edu.degree || edu.title || ''}</div>
              <div class="institution">${edu.institution || ''}</div>
              <div class="date-range">${edu.startDate || ''} - ${edu.endDate || 'Present'}</div>
              <p>${edu.description || ''}</p>
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        <div class="no-print" style="text-align: center; margin-top: 30px;">
          <button onclick="window.print()">Print</button>
          <button onclick="window.close()">Close</button>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Trigger the print once the content is loaded
    printWindow.onload = () => {
      printWindow.print();
      setIsPrinting(false);
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {title || 'Enhanced CV Preview'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <FiX size={24} />
          </button>
        </div>
        
        {/* CV Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Personal Info */}
          {cvContent.personalInfo && (
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {cvContent.personalInfo.name || 'Your Name'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {cvContent.personalInfo.email || 'your.email@example.com'}
                {cvContent.personalInfo.phone && ` • ${cvContent.personalInfo.phone}`}
              </p>
              {cvContent.personalInfo.location && (
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {cvContent.personalInfo.location}
                </p>
              )}
            </div>
          )}
          
          {/* Personal Statement */}
          {cvContent.personalStatement && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                Personal Statement
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {cvContent.personalStatement}
              </p>
            </div>
          )}
          
          {/* Skills */}
          {cvContent.skills && cvContent.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {cvContent.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
                    {skill.skill || skill.title || skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Work Experience */}
          {cvContent.experiences && cvContent.experiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                Work Experience
              </h2>
              <div className="space-y-4">
                {cvContent.experiences.map((exp, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      {exp.position || exp.title || 'Position'}
                    </h3>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">
                      {exp.company || 'Company'} • {exp.startDate || 'Start Date'} - {exp.endDate || 'Present'}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mt-2">
                      {exp.description || 'Description'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Education */}
          {cvContent.education && cvContent.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                Education
              </h2>
              <div className="space-y-4">
                {cvContent.education.map((edu, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      {edu.degree || edu.title || 'Degree'}
                    </h3>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">
                      {edu.institution || 'Institution'} • {edu.startDate || 'Start Date'} - {edu.endDate || 'Present'}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mt-2">
                      {edu.description || 'Description'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer with buttons */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FiPrinter />
            {isPrinting ? 'Printing...' : 'Print'}
          </button>
          
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isDownloading ? (
              <>
                <span className="animate-spin">⟳</span>
                Downloading...
              </>
            ) : success ? (
              <>
                <FiCheck />
                Downloaded
              </>
            ) : (
              <>
                <FiDownload />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVPreviewWindow; 