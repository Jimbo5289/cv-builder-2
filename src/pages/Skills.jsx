/* eslint-disable */
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useServer } from '../context/ServerContext';
import toast from 'react-hot-toast';

function Skills() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cvId = searchParams.get('cvId');
  const [skills, setSkills] = useState([{ skill: '', level: 'Intermediate' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { serverUrl } = useServer();

  // Fetch existing skills data when component loads
  useEffect(() => {
    if (cvId) {
      const fetchCV = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          console.log('Fetching CV with ID:', cvId);
          const response = await fetch(`${serverUrl}/api/cv/${cvId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Fetched CV data:', data);
            
            // Check different possible locations for skills data
            let skillsData = [];
            
            if (data.skills && Array.isArray(data.skills)) {
              skillsData = data.skills;
            } else if (data.content && data.content.skills && Array.isArray(data.content.skills)) {
              skillsData = data.content.skills;
            } else if (typeof data.content === 'string') {
              try {
                const parsedContent = JSON.parse(data.content);
                if (parsedContent.skills && Array.isArray(parsedContent.skills)) {
                  skillsData = parsedContent.skills;
                }
              } catch (e) {
                console.error('Error parsing CV content:', e);
              }
            }
            
            if (skillsData.length > 0) {
              setSkills(skillsData);
            }
          } else {
            // If CV not found in development mode, continue with default skills
            console.log('CV not found, using default skills');
            if (process.env.NODE_ENV === 'development') {
              toast.info('Using default skills in development mode');
            }
          }
        } catch (err) {
          console.error('Error fetching skills data:', err);
          // In development, don't show error to user, just use default skills
          if (process.env.NODE_ENV !== 'development') {
            setError('Error loading skills data. Using default skills.');
          }
        }
      };

      fetchCV();
    }
  }, [cvId, serverUrl]);

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = skills.map((skill, i) => {
      if (i === index) {
        return { ...skill, [field]: value };
      }
      return skill;
    });
    setSkills(updatedSkills);
  };

  const addSkill = () => {
    setSkills([...skills, { skill: '', level: 'Intermediate' }]);
  };

  const removeSkill = (index) => {
    if (skills.length > 1) {
      setSkills(skills.filter((_, i) => i !== index));
    } else {
      toast.error('You need at least one skill');
    }
  };

  const handleSaveAndContinue = async () => {
    // Validate skills
    const invalidSkills = skills.filter(s => !s.skill.trim());
    if (invalidSkills.length > 0) {
      toast.error('Please fill in all skill fields or remove empty ones');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to continue');
      }

      const response = await fetch(`${serverUrl}/api/cv/${cvId}/skills`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ skills }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to save skills');
      }

      toast.success('Skills saved successfully');
      navigate(`/create/experience?cvId=${cvId}`);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'An error occurred. Please try again.');
      
      if (err.message.includes('token')) {
        navigate('/login?redirect=/create/skills');
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
            Key Skills
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Add your professional skills and proficiency levels
          </p>
        </div>

        <div className="space-y-6">
          {skills.map((skillItem, index) => (
            <div key={index} className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-grow">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                  Skill {index + 1}
                </label>
                <input
                  type="text"
                  value={skillItem.skill}
                  onChange={(e) => handleSkillChange(index, 'skill', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] dark:focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g., Project Management, JavaScript, etc."
                />
              </div>
              
              <div className="md:w-1/3">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                  Proficiency
                </label>
                <select
                  value={skillItem.level}
                  onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] dark:focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              
              <div className="flex items-end justify-end md:pb-0 pb-2">
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 ml-2"
                  aria-label="Remove skill"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addSkill}
            className="text-[#2c3e50] dark:text-blue-400 hover:text-[#34495e] dark:hover:text-blue-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Another Skill
          </button>
          
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => navigate(`/create/personal-statement?cvId=${cvId}`)}
              className="text-[#2c3e50] dark:text-blue-400 hover:text-[#34495e] dark:hover:text-blue-300"
            >
              ← Back to Personal Statement
            </button>
            
            <button
              onClick={handleSaveAndContinue}
              disabled={isLoading}
              className={`bg-[#2c3e50] dark:bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-[#34495e] dark:hover:bg-blue-700 transition-all duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Saving...' : 'Next: Experience →'}
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

export default Skills; 