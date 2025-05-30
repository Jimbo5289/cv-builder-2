import { useAuth } from '../context/AuthContext';
import CVUploader from '../components/CVUploader';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

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
                to="/saved-cvs"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900"
              >
                View Saved CVs
              </Link>
              <Link
                to="/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#E78F81] hover:bg-[#d36e62] dark:bg-[#d36e62] dark:hover:bg-[#c65c50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81] dark:focus:ring-[#d36e62] dark:focus:ring-offset-gray-900"
              >
                Create New CV
              </Link>
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