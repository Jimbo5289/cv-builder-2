import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function PersonalStatement() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cvId = searchParams.get('cvId');
  const [statement, setStatement] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSaveAndContinue = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to continue');
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';
      const response = await fetch(`${API_URL}/api/cv/${cvId}/personal-statement`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ personalStatement: statement }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save personal statement');
      }

      // Navigate to skills section
      navigate(`/create/skills?cvId=${cvId}`);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'An error occurred while saving. Please try again.');
      
      if (err.message.includes('token')) {
        navigate('/login?redirect=/create/personal-statement');
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
            Personal Statement
          </h1>
          <p className="text-gray-600">
            Write a compelling personal statement that summarizes your professional profile
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Your Personal Statement
            </label>
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              rows="8"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
              placeholder="Write a brief summary of your professional background, key skills, and career objectives..."
            />
            <p className="mt-2 text-sm text-gray-500">
              Aim for 100-200 words. Focus on your unique value proposition and what makes you stand out.
            </p>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => navigate(`/create?cvId=${cvId}`)}
              className="text-[#2c3e50] hover:text-[#34495e]"
            >
              ← Back to Personal Info
            </button>

            <button
              onClick={handleSaveAndContinue}
              disabled={isLoading}
              className={`bg-[#2c3e50] text-white px-8 py-3 rounded-lg hover:bg-[#34495e] transition-all duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Saving...' : 'Next: Key Skills →'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PersonalStatement; 