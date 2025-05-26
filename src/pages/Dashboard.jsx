import { useAuth } from '../context/AuthContext';
import CVUploader from '../components/CVUploader';
import { Link } from 'react-router-dom';
import { FiFileText, FiSearch, FiLinkedin } from 'react-icons/fi';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Welcome, {user?.name || 'User'}!</h1>
        
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

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">AI Analysis Tools</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Our AI-powered tools help you optimize your professional presence and stand out to recruiters.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/cv-analyse"
              className="flex items-start p-4 border border-blue-100 dark:border-blue-900 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            >
              <FiFileText className="mt-1 mr-3 text-blue-500 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">CV Analysis</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Analyze your CV against job descriptions</p>
              </div>
            </Link>
            <Link
              to="/cv-analyse-by-role"
              className="flex items-start p-4 border border-blue-100 dark:border-blue-900 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            >
              <FiSearch className="mt-1 mr-3 text-blue-500 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Role-Based Analysis</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Evaluate your CV for specific roles</p>
              </div>
            </Link>
            <Link
              to="/linkedin-review"
              className="flex items-start p-4 border border-blue-100 dark:border-blue-900 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors md:col-span-2"
            >
              <FiLinkedin className="mt-1 mr-3 text-blue-500 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">LinkedIn Profile Review</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Optimize your LinkedIn profile to attract recruiters and opportunities</p>
              </div>
            </Link>
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