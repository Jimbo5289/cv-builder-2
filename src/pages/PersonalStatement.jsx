/* eslint-disable */
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useServer } from '../context/ServerContext';
import toast from 'react-hot-toast';

function PersonalStatement() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cvId = searchParams.get('cvId');
  const [statement, setStatement] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState('');
  const { serverUrl } = useServer();

  // Attempt to fetch any existing statement when component loads
  useEffect(() => {
    if (cvId) {
      const fetchCV = async () => {
        setIsLoadingData(true);
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
            
            // Check different possible locations for personalStatement based on API structure
            if (data.personalStatement) {
              setStatement(data.personalStatement);
            } else if (data.content && data.content.personalStatement) {
              setStatement(data.content.personalStatement);
            } else if (typeof data.content === 'string') {
              try {
                const parsedContent = JSON.parse(data.content);
                if (parsedContent.personalStatement) {
                  setStatement(parsedContent.personalStatement);
                }
              } catch (e) {
                console.error('Error parsing CV content:', e);
              }
            }
          }
        } catch (err) {
          console.error('Error fetching CV data:', err);
        } finally {
          setIsLoadingData(false);
        }
      };

      fetchCV();
    }
  }, [cvId, serverUrl]);

  const handleSaveAndContinue = async () => {
    if (!statement.trim()) {
      toast.error('Please enter a personal statement');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to continue');
      }

      const response = await fetch(`${serverUrl}/api/cv/${cvId}/personal-statement`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ personalStatement: statement }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save personal statement');
      }

      toast.success('Personal statement saved successfully');

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

  if (isLoadingData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c3e50] dark:border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading your personal statement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2c3e50] dark:text-white mb-2">
            Personal Statement
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Write a compelling personal statement that summarizes your professional profile
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
              Your Personal Statement
            </label>
            <div className="relative">
              <textarea
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                rows="8"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] dark:focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder=""
              />
              {statement.length === 0 && (
                <div className="absolute inset-0 pointer-events-none flex items-start pt-2 px-4">
                  <span className="text-gray-400/60 dark:text-gray-500/70 text-sm italic">
                    Write a brief summary of your professional background, key skills, and career objectives...
                  </span>
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Aim for 100-200 words. Focus on your unique value proposition and what makes you stand out.
            </p>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => navigate(`/create?cvId=${cvId}`)}
              className="text-[#2c3e50] dark:text-blue-400 hover:text-[#34495e] dark:hover:text-blue-300"
            >
              ← Back to Personal Info
            </button>

            <button
              onClick={handleSaveAndContinue}
              disabled={isLoading}
              className={`bg-[#2c3e50] dark:bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-[#34495e] dark:hover:bg-blue-700 transition-all duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Saving...' : 'Next: Key Skills →'}
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

export default PersonalStatement; 