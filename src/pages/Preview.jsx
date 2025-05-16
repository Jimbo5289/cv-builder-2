import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { useServer } from '../context/ServerContext';

// Initialize pdfMake with fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function Preview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cvId = searchParams.get('cvId');
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
  const { apiUrl } = useServer();

  useEffect(() => {
    const fetchCV = async () => {
      try {
        setIsLoading(true);
        setError('');

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please log in to view your CV');
        }

        if (!cvId) {
          throw new Error('No CV ID provided');
        }

        console.log('Fetching CV with ID:', cvId);
        console.log('Using token:', token ? 'Token present' : 'No token');
        
        const response = await fetch(`${apiUrl}/api/cv/${cvId}`, {
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
          referencesCount: Array.isArray(data.references) ? data.references.length : 'not an array'
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
          })) : []
        };

        console.log('Normalized CV data:', normalizedData);
        setCV(normalizedData);
        updateCompletionStatus(normalizedData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'An error occurred while fetching your CV');
        
        if (err.message.includes('log in')) {
          navigate('/login?redirect=/preview?cvId=' + cvId);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCV();
  }, [cvId, navigate, apiUrl]);

  const updateCompletionStatus = (cvData) => {
    setCompletionStatus({
      personalInfo: validatePersonalInfo(cvData.personalInfo),
      personalStatement: Boolean(cvData.personalStatement?.trim()),
      skills: Array.isArray(cvData.skills) && cvData.skills.length > 0,
      experiences: Array.isArray(cvData.experiences) && cvData.experiences.length > 0,
      education: Array.isArray(cvData.education) && cvData.education.length > 0,
      references: Array.isArray(cvData.references) && cvData.references.length > 0
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
    const completed = Object.values(completionStatus).filter(Boolean).length;
    return Math.round((completed / Object.keys(completionStatus).length) * 100);
  };

  const generatePdfDefinition = () => {
    if (!cv) return null;

    const sections = [];

    // Personal Information - Centered at the top
    sections.push(
      {
        text: cv.personalInfo?.fullName,
        alignment: 'center',
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 5]
      },
      {
        text: cv.personalInfo?.location,
        alignment: 'center',
        margin: [0, 0, 0, 5]
      },
      {
        text: `• ${cv.personalInfo?.phone} • ${cv.personalInfo?.email}`,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      }
    );

    // Personal Statement
    if (cv.personalStatement) {
      sections.push(
        { 
          text: 'Personal Statement',
          style: 'sectionHeader',
          margin: [0, 0, 0, 10]
        },
        { 
          text: cv.personalStatement,
          margin: [0, 0, 0, 20]
        }
      );
    }

    // Skills
    if (cv.skills?.length > 0) {
      sections.push(
        { 
          text: 'Key Skills',
          style: 'sectionHeader',
          margin: [0, 0, 0, 10]
        },
        {
          ul: cv.skills.map(skill => `${skill.skill} - ${skill.level}`),
          margin: [0, 0, 0, 20]
        }
      );
    }

    // Experience
    if (cv.experiences?.length > 0) {
      sections.push(
        { 
          text: 'Employment History',
          style: 'sectionHeader',
          margin: [0, 0, 0, 10]
        }
      );

      cv.experiences.forEach(exp => {
        sections.push(
          {
            text: [
              { text: exp.position, bold: true },
              { text: `, ${exp.company}`, bold: true },
              { text: ` (${exp.startDate} - ${exp.endDate || 'Present'})`, italics: true }
            ],
            margin: [0, 10, 0, 5]
          },
          {
            text: 'Achievements and responsibilities:',
            margin: [0, 5, 0, 5]
          },
          {
            ul: exp.description.split('\n').filter(line => line.trim()),
            margin: [0, 0, 0, 15]
          }
        );
      });
    }

    // Education
    if (cv.education?.length > 0) {
      sections.push(
        { 
          text: 'Education',
          style: 'sectionHeader',
          margin: [0, 0, 0, 10]
        }
      );

      cv.education.forEach(edu => {
        sections.push(
          {
            text: [
              { text: edu.institution, bold: true },
              { text: `\n${edu.degree}` },
              { text: ` (${edu.startDate} - ${edu.endDate || 'Present'})`, italics: true }
            ],
            margin: [0, 5, 0, 5]
          },
          edu.description ? {
            ul: edu.description.split('\n').filter(line => line.trim()),
            margin: [0, 0, 0, 15]
          } : {}
        );
      });
    }

    // References
    if (cv.references?.length > 0) {
      sections.push(
        { 
          text: 'References',
          style: 'sectionHeader',
          margin: [0, 0, 0, 10]
        },
        {
          text: 'References are available on request.',
          margin: [0, 0, 0, 20]
        }
      );
    }

    return {
      content: sections,
      styles: {
        sectionHeader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 10],
          color: '#000000'
        }
      },
      defaultStyle: {
        fontSize: 11,
        lineHeight: 1.3
      },
      pageMargins: [40, 40, 40, 40]
    };
  };

  const handleDownload = async () => {
    try {
      setIsGeneratingPDF(true);
      setError('');

      const docDefinition = generatePdfDefinition();
      if (!docDefinition) {
        throw new Error('Failed to generate PDF');
      }

      // Generate and download PDF
      await new Promise((resolve, reject) => {
        pdfMake.createPdf(docDefinition).download('my-cv.pdf', resolve, reject);
      });
    } catch (err) {
      console.error('Download error:', err);
      setError(err.message || 'An error occurred while generating your CV');
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">
            CV Preview
          </h1>
          <p className="text-gray-600">
            Review your CV before downloading or printing
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
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
            {Object.entries(completionStatus).map(([section, isComplete]) => (
              <div key={section} className="flex items-center">
                <span className={`w-4 h-4 rounded-full mr-2 ${isComplete ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="capitalize">{section.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CV Content */}
        <div className="space-y-8 print:space-y-6">
          {/* Personal Information */}
          <section>
            <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Name:</p>
                <p>{cv.personalInfo?.fullName}</p>
              </div>
              <div>
                <p className="font-semibold">Email:</p>
                <p>{cv.personalInfo?.email}</p>
              </div>
              <div>
                <p className="font-semibold">Phone:</p>
                <p>{cv.personalInfo?.phone}</p>
              </div>
              <div>
                <p className="font-semibold">Location:</p>
                <p>{cv.personalInfo?.location}</p>
              </div>
            </div>
          </section>

          {/* Personal Statement */}
          <section>
            <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">Personal Statement</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{cv.personalStatement}</p>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">Key Skills</h2>
            <div className="grid grid-cols-2 gap-4">
              {cv.skills?.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <span className="font-semibold">{skill.skill}</span>
                  <span className="ml-2 text-gray-600">- {skill.level}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section>
            <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">Employment History</h2>
            {cv.experiences?.map((exp, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-semibold">{exp.position}</h3>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-gray-500">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </p>
                <p className="mt-2 whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </section>

          {/* Education */}
          <section>
            <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">Education</h2>
            {cv.education?.map((edu, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-semibold">{edu.institution}</h3>
                <p className="text-gray-600">{edu.degree}</p>
                <p className="text-gray-500">
                  {edu.startDate} - {edu.endDate || 'Present'}
                </p>
                <p className="mt-2 whitespace-pre-wrap">{edu.description}</p>
              </div>
            ))}
          </section>

          {/* References */}
          <section>
            <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">References</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cv.references?.map((ref, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">{ref.name}</p>
                  <p className="text-gray-600">{ref.position}</p>
                  <p className="text-gray-600">{ref.company}</p>
                  <p className="text-gray-500">{ref.email}</p>
                  <p className="text-gray-500">{ref.phone}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>

          <div className="space-x-4">
            <button
              onClick={handlePrint}
              disabled={isGeneratingPDF}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Print
            </button>
            <button
              onClick={handleDownload}
              disabled={isGeneratingPDF}
              className="bg-[#2c3e50] text-white px-6 py-2 rounded-lg hover:bg-[#34495e] transition-colors disabled:opacity-50 flex items-center"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating PDF...
                </>
              ) : (
                'Download PDF'
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default Preview; 