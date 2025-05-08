import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuthHeader } = useAuth();
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cvs/${id}`, {
          headers: {
            ...getAuthHeader(),
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch CV');
        }

        const data = await response.json();
        setCV(data);
      } catch (error) {
        console.error('Error fetching CV:', error);
        toast.error('Failed to load CV');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, [id, getAuthHeader, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">CV Not Found</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit CV</h1>
          {/* Add your CV editing form here */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h2>
              {/* Add form fields for basic information */}
            </div>

            {/* Experience */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Experience</h2>
              {/* Add form fields for experience */}
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Education</h2>
              {/* Add form fields for education */}
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Skills</h2>
              {/* Add form fields for skills */}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                onClick={() => {
                  // Add save functionality
                  toast.success('Changes saved successfully');
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Edit; 