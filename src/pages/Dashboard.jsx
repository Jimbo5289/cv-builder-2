/* eslint-disable */
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';
import CVUploader from '../components/CVUploader';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const { user } = useAuth();
  const { serverUrl } = useServer();
  const [mostRecentCV, setMostRecentCV] = useState(null);
  const [isLoadingCVs, setIsLoadingCVs] = useState(true);

  // Load user's most recent CV to check if they have one in progress
  useEffect(() => {
    const loadRecentCV = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoadingCVs(false);
          return;
        }

        const response = await fetch(`${serverUrl}/api/cv/user/all`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const allCVs = await response.json();
          if (allCVs && allCVs.length > 0) {
            // Get the most recent CV (they're already ordered by updatedAt desc)
            setMostRecentCV(allCVs[0]);
          }
        }
      } catch (err) {
        console.error('Error loading recent CV:', err);
      } finally {
        setIsLoadingCVs(false);
      }
    };

    loadRecentCV();
  }, [serverUrl]);

  // Determine if the most recent CV is incomplete (missing key sections)
  const isIncompleteCV = (cv) => {
    if (!cv || !cv.sectionsPresent) return false;
    
    // Consider CV incomplete if it's missing essential sections
    const hasPersonalInfo = cv.sectionsPresent.personalInfo;
    const hasPersonalStatement = cv.sectionsPresent.personalStatement;
    const hasSkills = cv.sectionsPresent.skills > 0;
    const hasExperience = cv.sectionsPresent.experiences > 0;
    
    // CV is incomplete if it's missing multiple key sections
    const completedSections = [hasPersonalInfo, hasPersonalStatement, hasSkills, hasExperience].filter(Boolean).length;
    return completedSections < 3; // Less than 3 out of 4 key sections
  };

  const shouldShowContinue = mostRecentCV && isIncompleteCV(mostRecentCV);

  return (
    <div className="container mx-auto px-4 pt-12 pb-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 pt-4">Welcome, {user?.name || 'User'}!</h1>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Upload & Analyze Your CV</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Upload your current CV and our AI will analyze it for ATS compatibility and provide recommendations for improvement.
          </p>
          <CVUploader />
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your CVs</h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">Manage your saved CVs to download, print, or make updates.</p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/saved"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900"
              >
                View Saved CVs
              </Link>
              
              {isLoadingCVs ? (
                <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-400 bg-gray-200 dark:bg-gray-600">
                  Loading...
                </div>
              ) : shouldShowContinue ? (
                <div className="flex gap-2">
                  <Link
                    to={`/create?cvId=${mostRecentCV.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-green-400 dark:focus:ring-offset-gray-900"
                  >
                    Continue My CV
                  </Link>
                  <Link
                    to="/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#E78F81] hover:bg-[#d36e62] dark:bg-[#d36e62] dark:hover:bg-[#c65c50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81] dark:focus:ring-[#d36e62] dark:focus:ring-offset-gray-900"
                  >
                    Build My CV
                  </Link>
                </div>
              ) : (
                <Link
                  to="/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#E78F81] hover:bg-[#d36e62] dark:bg-[#d36e62] dark:hover:bg-[#c65c50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81] dark:focus:ring-[#d36e62] dark:focus:ring-offset-gray-900"
                >
                  Build My CV
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* Placeholder for activity list */}
            <p className="text-gray-600 dark:text-gray-300">No recent activity to show.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 