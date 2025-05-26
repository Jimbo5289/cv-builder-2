import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import html2canvas from 'html2canvas';
import { useServer } from '../context/ServerContext';
import { QUALIFICATION_LEVELS } from '../data/educationData';
import { getTemplateById } from '../templates';

// Initialize pdfMake with fonts
try {
  pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;
} catch (error) {
  console.error('Error initializing pdfMake:', error);
}

// Helper function to get qualification label from value
const getQualificationLabel = (value) => {
  if (!value) return '';
  const qualification = QUALIFICATION_LEVELS.find(qual => qual.value === value);
  return qualification ? qualification.label : value;
};

function Preview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cv, setCV] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [error, setError] = useState('');
  const [completionStatus, setCompletionStatus] = useState({
    personalInfo: false,
    personalStatement: false,
    skills: false,
    experiences: false,
    education: false,
    references: false
  });
  const { serverUrl } = useServer();
  const cvContentRef = useRef(null);

  useEffect(() => {
    const fetchCV = async () => {
      try {
        setIsLoading(true);
        setError('');

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please log in to view your CV');
        }

        if (!id) {
          throw new Error('No CV ID provided');
        }

        console.log('Fetching CV with ID:', id);
        console.log('Using token:', token ? 'Token present' : 'No token');
        
        const response = await fetch(`${serverUrl}/api/cv/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error response:', errorData);
          throw new Error(errorData.error || errorData.details || `Failed to fetch CV: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received CV data:', data);

        if (!data) {
          throw new Error('No CV data received');
        }

        // Validate the structure of received data
        if (!data.personalInfo || typeof data.personalInfo !== 'object') {
          console.error('Invalid personal info structure:', data.personalInfo);
          throw new Error('Invalid CV data structure: missing personal information');
        }

        // Log the structure of the received data
        console.log('CV Data structure:', {
          hasPersonalInfo: Boolean(data.personalInfo),
          personalInfoFields: data.personalInfo ? Object.keys(data.personalInfo) : [],
          hasPersonalStatement: Boolean(data.personalStatement),
          skillsCount: Array.isArray(data.skills) ? data.skills.length : 'not an array',
          experiencesCount: Array.isArray(data.experiences) ? data.experiences.length : 'not an array',
          educationCount: Array.isArray(data.education) ? data.education.length : 'not an array',
          referencesCount: Array.isArray(data.references) ? data.references.length : 'not an array',
          referencesOnRequest: Boolean(data.referencesOnRequest),
          templateId: data.templateId || '1' // Default to template 1 if not specified
        });

        // Ensure all required sections are present with proper default values
        const normalizedData = {
          ...data,
          personalInfo: {
            fullName: data.personalInfo?.fullName || '',
            email: data.personalInfo?.email || '',
            phone: data.personalInfo?.phone || '',
            location: data.personalInfo?.location || ''
          },
          personalStatement: data.personalStatement || '',
          skills: Array.isArray(data.skills) ? data.skills.map(skill => ({
            skill: skill.skill || '',
            level: skill.level || ''
          })) : [],
          experiences: Array.isArray(data.experiences) ? data.experiences.map(exp => ({
            position: exp.position || '',
            company: exp.company || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            description: exp.description || ''
          })) : [],
          education: Array.isArray(data.education) ? data.education.map(edu => ({
            institution: edu.institution || '',
            degree: edu.degree || '',
            field: edu.field || '',
            startDate: edu.startDate || '',
            endDate: edu.endDate || '',
            description: edu.description || ''
          })) : [],
          references: Array.isArray(data.references) ? data.references.map(ref => ({
            name: ref.name || '',
            position: ref.position || '',
            company: ref.company || '',
            email: ref.email || '',
            phone: ref.phone || ''
          })) : [],
          referencesOnRequest: Boolean(data.referencesOnRequest),
          templateId: data.templateId || '1' // Default to template 1 if not specified
        };

        console.log('Normalized CV data:', normalizedData);
        setCV(normalizedData);
        updateCompletionStatus(normalizedData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'An error occurred while fetching your CV');
        
        if (err.message.includes('log in')) {
          navigate(`/login?redirect=/preview/${id}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCV();
  }, [id, navigate, serverUrl]);

  const updateCompletionStatus = (cvData) => {
    setCompletionStatus({
      personalInfo: validatePersonalInfo(cvData.personalInfo),
      personalStatement: Boolean(cvData.personalStatement?.trim()),
      skills: Array.isArray(cvData.skills) && cvData.skills.length > 0,
      experiences: Array.isArray(cvData.experiences) && cvData.experiences.length > 0,
      education: Array.isArray(cvData.education) && cvData.education.length > 0,
      references: (Array.isArray(cvData.references) && cvData.references.length > 0) || Boolean(cvData.referencesOnRequest)
    });
  };

  const validatePersonalInfo = (info) => {
    if (!info) return false;
    return Boolean(
      info.fullName?.trim() &&
      info.email?.trim() &&
      info.phone?.trim() &&
      info.location?.trim()
    );
  };

  const getCompletionPercentage = () => {
    if (!completionStatus) return 0;
    const completed = Object.values(completionStatus).filter(Boolean).length;
    return Math.round((completed / Object.keys(completionStatus).length) * 100);
  };

  const handleDownload = async () => {
    try {
      setIsGeneratingPDF(true);
      setError('');

      // Try using html2canvas to capture the template
      if (cvContentRef.current) {
        try {
          console.log('Using html2canvas to capture template');
          const canvas = await html2canvas(cvContentRef.current, {
            scale: 2,
            useCORS: true,
            logging: false
          });
          
          const imgData = canvas.toDataURL('image/png');
          const pdf = new window.jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });
          
          const imgWidth = 210; // A4 width in mm
          const imgHeight = canvas.height * imgWidth / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          pdf.save('my-cv.pdf');
          
          return; // Exit if PDF generation successful
        } catch (err) {
          console.error('html2canvas error:', err);
          // Fall through to link download method
        }
      }
      
      // Final fallback method
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob(['Could not generate PDF. Please try printing instead.'], {type: 'text/plain'}));
      link.download = 'cv-download-error.txt';
      link.click();
      
    } catch (err) {
      console.error('Download error:', err);
      setError(err.message || 'An error occurred while generating your CV. Please try printing instead.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your CV...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 max-w-lg mx-auto bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 max-w-lg mx-auto bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No CV Found</h2>
          <p className="text-gray-700 mb-6">
            We couldn't find your CV. Please make sure you have created one.
          </p>
          <button
            onClick={() => navigate('/create')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Create New CV
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering CV preview with data:', cv);
  
  // Get the appropriate template component based on templateId
  const TemplateComponent = getTemplateById(cv.templateId);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8 print:hidden">
          <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">
            CV Preview
          </h1>
          <p className="text-gray-600">
            Review your CV before downloading or printing
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 print:hidden">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">CV Completion</h2>
            <span className="text-lg font-bold text-[#2c3e50]">{getCompletionPercentage()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-[#2c3e50] h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
          {/* Section Status */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            {completionStatus && Object.entries(completionStatus).map(([section, isComplete]) => (
              <div key={section} className="flex items-center">
                <span className={`w-4 h-4 rounded-full mr-2 ${isComplete ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="capitalize">{section.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Template Selection */}
        <div className="mb-8 print:hidden">
          <h2 className="text-lg font-semibold mb-2">Selected Template</h2>
          <div className="p-2 border border-gray-300 rounded-md inline-block">
            <span className="font-medium">
              {cv.templateId === '1' ? 'Professional' : 
               cv.templateId === '2' ? 'Creative' : 
               cv.templateId === '3' ? 'Executive' : 
               cv.templateId === '4' ? 'Academic' : 'Custom'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            To change the template, go back to the Templates page.
          </p>
        </div>

        {/* CV Content with the selected template */}
        <div ref={cvContentRef} id="cv-printable-content" className="border border-gray-200 p-6 rounded-lg print:border-0 print:p-0 print:shadow-none bg-white print:w-full print:max-w-none">
          <div className="max-w-4xl mx-auto print:mx-0 print:max-w-none print:w-full print:p-0">
            <TemplateComponent cv={cv} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col mt-12 mb-4 space-y-4 print:hidden">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <button
              onClick={() => navigate(`/edit/${id}`)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit CV
            </button>
            
            <button
              onClick={handlePrint}
              disabled={isGeneratingPDF}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
              </svg>
              Print
            </button>
            
            <button
              onClick={handleDownload}
              disabled={isGeneratingPDF}
              className="bg-[#2c3e50] text-white px-6 py-3 rounded-lg hover:bg-[#34495e] transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 text-red-600 p-4 rounded-lg print:hidden">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default Preview; 