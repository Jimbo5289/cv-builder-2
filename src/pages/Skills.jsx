import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function Skills() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cvId = searchParams.get('cvId');
  const [skills, setSkills] = useState([{ skill: '', level: 'Intermediate' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSaveAndContinue = async () => {
    if (skills.some(skill => !skill.skill.trim())) {
      setError('Please fill in all skill fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to continue');
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';
      const response = await fetch(`${API_URL}/api/cv/${cvId}/skills`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ skills }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save skills');
      }

      // Navigate to experience section
      navigate(`/create/experience?cvId=${cvId}`);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'An error occurred while saving. Please try again.');
      
      if (err.message.includes('token')) {
        navigate('/login?redirect=/create/skills');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">
            Key Skills
          </h1>
          <p className="text-gray-600">
            Add your key professional skills and competencies
          </p>
        </div>

        <div className="space-y-6">
          {skills.map((skill, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#2c3e50]">
                  Skill {index + 1}
                </h2>
                {index > 0 && (
                  <button
                    onClick={() => removeSkill(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    value={skill.skill}
                    onChange={(e) => handleSkillChange(index, 'skill', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                    placeholder="e.g., Project Management"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Proficiency Level
                  </label>
                  <select
                    value={skill.level}
                    onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent h-[42px]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addSkill}
            className="text-[#2c3e50] hover:text-[#34495e]"
          >
            + Add Another Skill
          </button>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>

            <button
              onClick={handleSaveAndContinue}
              disabled={isLoading}
              className={`bg-[#2c3e50] text-white px-8 py-3 rounded-lg hover:bg-[#34495e] transition-all duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Saving...' : 'Next: Experience →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skills; 