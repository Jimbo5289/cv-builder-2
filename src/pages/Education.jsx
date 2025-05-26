import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useServer } from '../context/ServerContext';
import toast from 'react-hot-toast';
import { QUALIFICATION_LEVELS } from '../data/educationData';

// Remove @mui imports and replace with simpler HTML/CSS components
function Education() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cvId = searchParams.get('cvId');
  const [education, setEducation] = useState([
    { 
      institution: '', 
      degree: '', 
      field: '', 
      startDate: '', 
      endDate: '', 
      description: ''
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { serverUrl } = useServer();

  // Fetch existing education data when component loads
  useEffect(() => {
    if (cvId) {
      const fetchCV = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const response = await fetch(`${serverUrl}/api/cv/${cvId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Fetched CV data:', data);
            
            // Check different possible locations for education data
            let educationData = [];
            
            if (data.education && Array.isArray(data.education)) {
              educationData = data.education;
            } else if (data.content && data.content.education && Array.isArray(data.content.education)) {
              educationData = data.content.education;
            } else if (typeof data.content === 'string') {
              try {
                const parsedContent = JSON.parse(data.content);
                if (parsedContent.education && Array.isArray(parsedContent.education)) {
                  educationData = parsedContent.education;
                }
              } catch (e) {
                console.error('Error parsing CV content:', e);
              }
            }
            
            if (educationData.length > 0) {
              setEducation(educationData);
            }
          }
        } catch (err) {
          console.error('Error fetching education data:', err);
        }
      };

      fetchCV();
    }
  }, [cvId, serverUrl]);

  const handleInputChange = (index, field, value) => {
    const updatedEducation = education.map((edu, i) => {
      if (i === index) {
        // For date fields, ensure the date is properly formatted
        if (field === 'startDate' || field === 'endDate') {
          // This ensures we store dates in YYYY-MM-DD format
          return { ...edu, [field]: value };
        }
        return { ...edu, [field]: value };
      }
      return edu;
    });
    setEducation(updatedEducation);
  };

  const addEducation = () => {
    setEducation([
      ...education,
      { 
        institution: '', 
        degree: '', 
        field: '', 
        startDate: '', 
        endDate: '', 
        description: ''
      }
    ]);
  };

  const removeEducation = (index) => {
    if (education.length > 1) {
      setEducation(education.filter((_, i) => i !== index));
    } else {
      toast.error('You need at least one education entry');
    }
  };

  const validateEducation = () => {
    // Check if required fields are filled
    const invalidEducation = education.filter(edu => 
      !edu.institution.trim() || !edu.degree.trim()
    );
    
    if (invalidEducation.length > 0) {
      toast.error('Please provide at least institution and degree for all entries');
      return false;
    }
    
    return true;
  };

  const handleSaveAndContinue = async () => {
    if (!validateEducation()) return;

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to continue');
      }

      const response = await fetch(`${serverUrl}/api/cv/${cvId}/education`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ education }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to save education');
      }

      toast.success('Education saved successfully');
      navigate(`/create/references?cvId=${cvId}`);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'An error occurred. Please try again.');
      
      if (err.message.includes('token')) {
        navigate('/login?redirect=/create/education');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2c3e50] dark:text-white mb-2">
            Education
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Add your educational background and qualifications
          </p>
        </div>

        <div className="space-y-6">
          {education.map((edu, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#2c3e50] dark:text-white">
                  Education {index + 1}
                </h2>
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleInputChange(index, 'institution', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] dark:focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="University or school name"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Qualification Level</label>
                    <select
                      value={edu.degree}
                      onChange={(e) => handleInputChange(index, 'degree', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] dark:focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Select qualification level</option>
                      
                      {/* Secondary Education */}
                      <optgroup label="Secondary Education">
                        {QUALIFICATION_LEVELS.filter(qual => 
                          ['gcse', 'o-level', 'a-level', 'btec-level-2', 'btec-level-3', 'international-baccalaureate', 'high-school-diploma'].includes(qual.value)
                        ).map(qual => (
                          <option key={qual.value} value={qual.value}>{qual.label}</option>
                        ))}
                      </optgroup>
                      
                      {/* Vocational Qualifications */}
                      <optgroup label="Vocational Qualifications">
                        {QUALIFICATION_LEVELS.filter(qual => 
                          ['nvq-level-1', 'nvq-level-2', 'nvq-level-3', 'nvq-level-4', 'nvq-level-5', 'city-and-guilds', 'apprenticeship', 'higher-apprenticeship', 'vocational-certificate'].includes(qual.value)
                        ).map(qual => (
                          <option key={qual.value} value={qual.value}>{qual.label}</option>
                        ))}
                      </optgroup>
                      
                      {/* Higher Education */}
                      <optgroup label="Higher Education">
                        {QUALIFICATION_LEVELS.filter(qual => 
                          ['foundation-degree', 'higher-national-certificate', 'higher-national-diploma', 'associate-degree', 'bachelors-degree', 'graduate-certificate', 'graduate-diploma', 'postgraduate-certificate', 'postgraduate-diploma', 'masters-degree', 'mba', 'doctorate', 'professional-qualification'].includes(qual.value)
                        ).map(qual => (
                          <option key={qual.value} value={qual.value}>{qual.label}</option>
                        ))}
                      </optgroup>
                      
                      {/* Other qualifications */}
                      <optgroup label="Other Qualifications">
                        {QUALIFICATION_LEVELS.filter(qual => 
                          ['certificate', 'diploma', 'short-course', 'online-certification', 'other'].includes(qual.value)
                        ).map(qual => (
                          <option key={qual.value} value={qual.value}>{qual.label}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Field of Study</label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => handleInputChange(index, 'field', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] dark:focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Field of study or major"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Start Date</label>
                    <input
                      type="date"
                      value={edu.startDate || ''}
                      onChange={(e) => handleInputChange(index, 'startDate', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] dark:focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: YYYY-MM-DD</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">End Date</label>
                    <input
                      type="date"
                      value={edu.endDate || ''}
                      onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] dark:focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty for "Present"</p>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Description</label>
                  <textarea
                    value={edu.description}
                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] dark:focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Describe your coursework, achievements, or relevant activities..."
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addEducation}
            className="text-[#2c3e50] dark:text-blue-400 hover:text-[#34495e] dark:hover:text-blue-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Another Education
          </button>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => navigate(`/create/experience?cvId=${cvId}`)}
              className="text-[#2c3e50] dark:text-blue-400 hover:text-[#34495e] dark:hover:text-blue-300"
            >
              ← Back to Experience
            </button>

            <button
              onClick={handleSaveAndContinue}
              disabled={isLoading}
              className={`bg-[#2c3e50] dark:bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-[#34495e] dark:hover:bg-blue-700 transition-all duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Saving...' : 'Next: References →'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Education; 