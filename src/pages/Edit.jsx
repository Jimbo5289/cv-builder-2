/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useServer } from '../context/ServerContext';
import toast from 'react-hot-toast';

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { serverUrl } = useServer();
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCV = async () => {
      try {
        setLoading(true);
        setError('');
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please log in to edit your CV');
        }

        const response = await fetch(`${serverUrl}/api/cv/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch CV: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched CV data:', data);
        setCV(data);
      } catch (err) {
        console.error('Error fetching CV:', err);
        setError(err.message || 'Failed to load CV');
        
        if (err.message.includes('log in')) {
          navigate(`/login?redirect=/edit/${id}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, [id, navigate, serverUrl]);

  // CV sections and their corresponding edit routes
  const sections = [
    { 
      id: 'personal-info', 
      title: 'Personal Information', 
      description: 'Your contact and basic details',
      route: `/create?cvId=${id}`
    },
    { 
      id: 'personal-statement', 
      title: 'Personal Statement', 
      description: 'Your professional summary',
      route: `/create/personal-statement?cvId=${id}`
    },
    { 
      id: 'skills', 
      title: 'Skills', 
      description: 'Your professional skills and competencies',
      route: `/create/skills?cvId=${id}`
    },
    { 
      id: 'experience', 
      title: 'Experience', 
      description: 'Your work history and achievements',
      route: `/create/experience?cvId=${id}`
    },
    { 
      id: 'education', 
      title: 'Education', 
      description: 'Your academic background and qualifications',
      route: `/create/education?cvId=${id}`
    },
    { 
      id: 'references', 
      title: 'References', 
      description: 'People who can vouch for your skills and experience',
      route: `/create/references?cvId=${id}`
    }
  ];

  // Calculate completion status
  const getCompletionStatus = () => {
    if (!cv) return {};

    return {
      'personal-info': cv.personalInfo && 
        cv.personalInfo.fullName && 
        cv.personalInfo.email && 
        cv.personalInfo.phone,
      'personal-statement': !!cv.personalStatement,
      'skills': Array.isArray(cv.skills) && cv.skills.length > 0,
      'experience': Array.isArray(cv.experiences) && cv.experiences.length > 0,
      'education': Array.isArray(cv.education) && cv.education.length > 0,
      'references': Array.isArray(cv.references) && cv.references.length > 0
    };
  };

  const completionStatus = getCompletionStatus();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your CV...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 max-w-lg mx-auto bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 max-w-lg mx-auto bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No CV Found</h2>
          <p className="text-gray-700 mb-6">
            We couldn't find your CV. Please make sure you have created one.
          </p>
          <button
            onClick={() => navigate('/create')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Create New CV
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">
            Edit Your CV
          </h1>
          <p className="text-gray-600">
            Select a section below to edit the details of your CV
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <div 
              key={section.id}
              className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#2c3e50] mb-2">{section.title}</h2>
                  <p className="text-gray-600 mb-4">{section.description}</p>
                </div>
                <div>
                  <span 
                    className={`inline-block w-4 h-4 rounded-full ${
                      completionStatus[section.id] ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  ></span>
                </div>
              </div>
              <Link 
                to={section.route} 
                className="inline-block bg-[#2c3e50] text-white px-6 py-2 rounded-lg hover:bg-[#34495e] transition-colors"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => navigate(`/preview/${id}`)}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Preview
          </button>
        </div>
      </div>
    </div>
  );
}

export default Edit; 