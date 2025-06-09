/* eslint-disable */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';
import { Link } from 'react-router-dom';
import { FiDownload, FiPrinter, FiEye, FiEdit, FiTrash2, FiAlertCircle } from 'react-icons/fi';

export default function SavedCVs() {
  const { user, getAuthHeader } = useAuth();
  const { apiUrl, status: serverStatus } = useServer();
  const [savedCVs, setSavedCVs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCV, setSelectedCV] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (serverStatus === 'connected') {
      fetchSavedCVs();
    }
  }, [serverStatus]);

  const fetchSavedCVs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${apiUrl}/api/cv/user/all`, {
        headers: {
          ...getAuthHeader()
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch saved CVs');
      }

      const data = await response.json();
      setSavedCVs(data);
    } catch (err) {
      console.error('Error fetching saved CVs:', err);
      setError(err.message || 'Failed to load your saved CVs');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (cvId) => {
    try {
      window.open(`${apiUrl}/api/cv/download/${cvId}`, '_blank');
    } catch (err) {
      console.error('Error downloading CV:', err);
      alert('Failed to download CV. Please try again.');
    }
  };

  const handlePrint = async (cvId) => {
    try {
      // Create a hidden iframe to load the PDF for printing
      const printFrame = document.createElement('iframe');
      printFrame.style.display = 'none';
      document.body.appendChild(printFrame);
      
      // Set the src to the PDF download endpoint
      printFrame.src = `${apiUrl}/api/cv/download/${cvId}`;
      
      // Once loaded, print the iframe content
      printFrame.onload = () => {
        try {
          printFrame.contentWindow.print();
          // Remove the iframe after printing
          setTimeout(() => {
            document.body.removeChild(printFrame);
          }, 1000);
        } catch (err) {
          console.error('Error during print:', err);
          alert('Failed to print CV. Please try downloading instead.');
          document.body.removeChild(printFrame);
        }
      };
    } catch (err) {
      console.error('Error setting up print:', err);
      alert('Failed to prepare CV for printing. Please try downloading instead.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Saved CVs</h1>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-4 mb-6">
            <div className="flex items-center">
              <FiAlertCircle className="text-red-500 dark:text-red-400 mr-2" />
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}
        
        {savedCVs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">No CVs Found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You haven't created any CVs yet. Get started by creating your first CV.
            </p>
            <Link 
              to="/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#E78F81] hover:bg-[#d36e62] dark:bg-[#e07c6e] dark:hover:bg-[#c75d50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81] dark:focus:ring-offset-gray-900"
            >
              Create New CV
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            <div className="grid gap-4">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400">
                <div className="col-span-4">CV Title</div>
                <div className="col-span-2">Created On</div>
                <div className="col-span-2">Last Updated</div>
                <div className="col-span-4 text-right">Actions</div>
              </div>
              
              {/* Table Body */}
              {savedCVs.map((cv) => (
                <div 
                  key={cv.id} 
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="col-span-4">
                    <h3 className="text-gray-900 dark:text-white font-medium">{cv.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm md:hidden">Created: {formatDate(cv.createdAt)}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm md:hidden">Updated: {formatDate(cv.updatedAt)}</p>
                  </div>
                  
                  <div className="hidden md:block col-span-2 text-gray-600 dark:text-gray-300">
                    {formatDate(cv.createdAt)}
                  </div>
                  
                  <div className="hidden md:block col-span-2 text-gray-600 dark:text-gray-300">
                    {formatDate(cv.updatedAt)}
                  </div>
                  
                  <div className="col-span-4 flex justify-start md:justify-end space-x-3">
                    <button
                      onClick={() => handleDownload(cv.id)}
                      className="inline-flex items-center p-2 text-sm text-gray-700 dark:text-gray-300 hover:text-[#E78F81] dark:hover:text-[#E78F81] transition-colors"
                      title="Download CV"
                    >
                      <FiDownload className="h-5 w-5" />
                      <span className="ml-1 md:hidden">Download</span>
                    </button>
                    
                    <button
                      onClick={() => handlePrint(cv.id)}
                      className="inline-flex items-center p-2 text-sm text-gray-700 dark:text-gray-300 hover:text-[#E78F81] dark:hover:text-[#E78F81] transition-colors"
                      title="Print CV"
                    >
                      <FiPrinter className="h-5 w-5" />
                      <span className="ml-1 md:hidden">Print</span>
                    </button>
                    
                    <Link
                      to={`/preview/${cv.id}`}
                      className="inline-flex items-center p-2 text-sm text-gray-700 dark:text-gray-300 hover:text-[#E78F81] dark:hover:text-[#E78F81] transition-colors"
                      title="Preview CV"
                    >
                      <FiEye className="h-5 w-5" />
                      <span className="ml-1 md:hidden">Preview</span>
                    </Link>
                    
                    <Link
                      to={`/edit/${cv.id}`}
                      className="inline-flex items-center p-2 text-sm text-gray-700 dark:text-gray-300 hover:text-[#E78F81] dark:hover:text-[#E78F81] transition-colors"
                      title="Edit CV"
                    >
                      <FiEdit className="h-5 w-5" />
                      <span className="ml-1 md:hidden">Edit</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Link 
                to="/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#E78F81] hover:bg-[#d36e62] dark:bg-[#e07c6e] dark:hover:bg-[#c75d50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E78F81] dark:focus:ring-offset-gray-900"
              >
                Create New CV
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 