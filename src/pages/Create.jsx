import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SocialNetworkInput from '../components/SocialNetworkInput';
import PhoneInputWithCountry from '../components/PhoneInputWithCountry';
import toast from 'react-hot-toast';
import { useServer } from '../context/ServerContext';

function Create() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, getAuthHeader } = useAuth();
  const templateId = searchParams.get('template') || '1'; // Default to template 1 if not specified
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      socialNetwork: ''
    }
  });
  const { serverUrl } = useServer();

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          fullName: user.name || '',
          email: user.email || '',
        }
      }));
    }
  }, [user]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const { fullName, email, phone, location } = formData.personalInfo;
    
    if (!fullName.trim()) {
      toast.error('Full name is required');
      return false;
    }
    if (!email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!phone.trim() || phone === '+44 ') {
      toast.error('Phone number is required');
      return false;
    }
    if (!location.trim()) {
      toast.error('Location is required');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSaveAndContinue = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      console.log('Saving CV with templateId:', templateId);
      
      // No special phone formatting - just send as is
      const response = await fetch(`${serverUrl}/api/cv/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({
          templateId: templateId,
          personalInfo: formData.personalInfo
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || data.error || 'Failed to save CV');
      }

      const data = await response.json();
      console.log('Save response:', data);
      
      // Check if we have a valid CV ID in the response
      if (!data.cv || !data.cv.id) {
        throw new Error('Server did not return a valid CV ID');
      }
      
      toast.success('Personal information saved successfully');
      navigate(`/create/personal-statement?cvId=${data.cv.id}`);
    } catch (err) {
      console.error('Save error:', err);
      if (err.message.includes('token') || err.message.includes('unauthorized')) {
        toast.error('Please log in to save your CV');
        navigate('/login?redirect=/create');
        return;
      }
      toast.error(err.message || 'An error occurred while saving your CV');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2c3e50] dark:text-white mb-2">
            Personal Information
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Let's start with your contact details
          </p>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.personalInfo.fullName}
                onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] dark:focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.personalInfo.email}
                onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] dark:focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <PhoneInputWithCountry
                label="Phone Number"
                required={true}
                value={formData.personalInfo.phone}
                onChange={(value) => handleInputChange('personalInfo', 'phone', value)}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.personalInfo.location}
                onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] dark:focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="City, Country"
                style={{ height: '42px' }}
              />
            </div>
          </div>

          <div>
            <SocialNetworkInput
              value={formData.personalInfo.socialNetwork}
              onChange={(value) => handleInputChange('personalInfo', 'socialNetwork', value)}
              label="LinkedIn Profile"
            />
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSaveAndContinue}
            disabled={isLoading}
            className={`bg-[#2c3e50] text-white px-8 py-3 rounded-lg hover:bg-[#34495e] dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Saving...' : 'Next: Personal Statement →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Create; 