import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useServer } from '../context/ServerContext';

function Experience() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cvId = searchParams.get('cvId');
  const [experiences, setExperiences] = useState([
    { company: '', position: '', startDate: '', endDate: '', description: '' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { apiUrl } = useServer();

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
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleSaveAndContinue = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to continue');
      }

      const response = await fetch(`${apiUrl}/api/cv/${cvId}/experience`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ experiences }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save experience');
      }

      // Navigate to education section
      navigate(`/create/education?cvId=${cvId}`);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'An error occurred while saving. Please try again.');
      
      if (err.message.includes('token')) {
        navigate('/login?redirect=/create/experience');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-[#2c3e50] mb-8">
        Professional Experience
      </h1>

      <div className="max-w-3xl mx-auto">
        {experiences.map((experience, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-[#2c3e50]">
                Experience {index + 1}
              </h2>
              {index > 0 && (
                <button
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={experience.company}
                  onChange={(e) => handleInputChange(index, 'company', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E78F81] focus:border-transparent"
                  placeholder="Company name"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Position</label>
                <input
                  type="text"
                  value={experience.position}
                  onChange={(e) => handleInputChange(index, 'position', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E78F81] focus:border-transparent"
                  placeholder="Job title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={experience.startDate}
                    onChange={(e) => handleInputChange(index, 'startDate', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E78F81] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={experience.endDate}
                    onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E78F81] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={experience.description}
                  onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E78F81] focus:border-transparent"
                  placeholder="Describe your responsibilities and achievements..."
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={addExperience}
            className="text-[#E78F81] hover:text-[#d36e62]"
          >
            + Add Another Experience
          </button>

          <button
            onClick={handleSaveAndContinue}
            disabled={isLoading}
            className={`bg-[#E78F81] text-white px-6 py-2 rounded-lg hover:bg-[#d36e62] transition-all duration-200 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Saving...' : 'Save and Continue'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default Experience; 