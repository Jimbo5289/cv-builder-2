import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CVEnhancer = ({ cvId, currentScore, onEnhance }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [personSpec, setPersonSpec] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleEnhance = async () => {
    if (!jobDescription || !personSpec) {
      alert('Please provide both job description and person specification');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3002/api/cv/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          cvId,
          jobDescription,
          personSpec
        })
      });

      if (!response.ok) {
        throw new Error('Failed to enhance CV');
      }

      const data = await response.json();
      onEnhance(data.enhancedCV, data.newScore);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error enhancing CV:', error);
      alert('Failed to enhance CV. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Enhance CV with AI
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Enhance Your CV</h2>
            <p className="mb-4 text-gray-800 dark:text-gray-200">Current ATS Score: {currentScore}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full h-32 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Paste the job description here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Person Specification
                </label>
                <textarea
                  value={personSpec}
                  onChange={(e) => setPersonSpec(e.target.value)}
                  className="w-full h-32 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Paste the person specification here..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleEnhance}
                disabled={isLoading}
                className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Enhancing...' : 'Enhance CV'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVEnhancer; 