/* eslint-disable */
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useServer } from '../context/ServerContext';
import toast from 'react-hot-toast';

function Experience() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cvId = searchParams.get('cvId');
  const [experiences, setExperiences] = useState([
    { company: '', position: '', startDate: '', endDate: '', description: '' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { serverUrl } = useServer();

  // Fetch existing experience data when component loads
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
            
            // Check different possible locations for experience data
            let experienceData = [];
            
            if (data.experiences && Array.isArray(data.experiences)) {
              experienceData = data.experiences;
            } else if (data.content && data.content.experiences && Array.isArray(data.content.experiences)) {
              experienceData = data.content.experiences;
            } else if (typeof data.content === 'string') {
              try {
                const parsedContent = JSON.parse(data.content);
                if (parsedContent.experiences && Array.isArray(parsedContent.experiences)) {
                  experienceData = parsedContent.experiences;
                }
              } catch (e) {
                console.error('Error parsing CV content:', e);
              }
            }
            
            if (experienceData.length > 0) {
              setExperiences(experienceData);
            }
          }
        } catch (err) {
          console.error('Error fetching experience data:', err);
        }
      };

      fetchCV();
    }
  }, [cvId, serverUrl]);

  const handleInputChange = (index, field, value) => {
    const updatedExperiences = experiences.map((exp, i) => {
      if (i === index) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    setExperiences(updatedExperiences);
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { company: '', position: '', startDate: '', endDate: '', description: '' }
    ]);
  };

  const removeExperience = (index) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((_, i) => i !== index));
    } else {
      toast.error('You need at least one experience entry');
    }
  };

  const validateExperiences = () => {
    // Check if required fields are filled
    const invalidExperiences = experiences.filter(exp => 
      !exp.company.trim() || !exp.position.trim()
    );
    
    if (invalidExperiences.length > 0) {
      toast.error('Please provide at least company and position for all entries');
      return false;
    }
    
    return true;
  };

  const handleSaveAndContinue = async () => {
    if (!validateExperiences()) return;
    
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to continue');
      }

      const response = await fetch(`${serverUrl}/api/cv/${cvId}/experience`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ experiences }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to save experience');
      }

      toast.success('Experience saved successfully');
      navigate(`/create/education?cvId=${cvId}`);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'An error occurred. Please try again.');
      
      if (err.message.includes('token')) {
        navigate('/login?redirect=/create/experience');
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
            Professional Experience
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Add your work history, starting with your most recent position
          </p>
        </div>

        <div className="space-y-6">
          {experiences.map((experience, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#2c3e50] dark:text-white">
                  Experience {index + 1}
                </h2>
                <button
                  onClick={() => removeExperience(index)}
                  className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Company</label>
                    <input
                      type="text"
                      value={experience.company}
                      onChange={(e) => handleInputChange(index, 'company', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] dark:focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Company name"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Position</label>
                    <input
                      type="text"
                      value={experience.position}
                      onChange={(e) => handleInputChange(index, 'position', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] dark:focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Job title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Start Date</label>
                    <input
                      type="date"
                      value={experience.startDate}
                      onChange={(e) => handleInputChange(index, 'startDate', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] dark:focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">End Date</label>
                    <input
                      type="date"
                      value={experience.endDate}
                      onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] dark:focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Description</label>
                  <div className="relative">
                    <textarea
                      value={experience.description}
                      onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                      rows="4"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] dark:focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder=""
                    />
                    {experience.description.length === 0 && (
                      <div className="absolute inset-0 pointer-events-none flex items-start pt-2 px-4">
                        <span className="text-gray-400/60 dark:text-gray-500/70 text-sm italic">
                          Describe your responsibilities and achievements...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addExperience}
            className="text-[#2c3e50] dark:text-blue-400 hover:text-[#34495e] dark:hover:text-blue-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Another Experience
          </button>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => navigate(`/create/skills?cvId=${cvId}`)}
              className="text-[#2c3e50] dark:text-blue-400 hover:text-[#34495e] dark:hover:text-blue-300"
            >
              ← Back to Skills
            </button>

            <button
              onClick={handleSaveAndContinue}
              disabled={isLoading}
              className={`bg-[#2c3e50] dark:bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-[#34495e] dark:hover:bg-blue-700 transition-all duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Saving...' : 'Next: Education →'}
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

export default Experience; 