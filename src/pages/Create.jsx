/* eslint-disable */
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
  const cvId = searchParams.get('cvId'); // Check if we're editing an existing CV
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCV, setIsLoadingCV] = useState(false);
  const [error, setError] = useState('');
  const [currentCvId, setCurrentCvId] = useState(cvId);
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

  // Function to normalize phone number format for CV creation
  // Converts domestic formats to international format for consistent display
  const normalizePhoneNumber = (phone) => {
    if (!phone) return '';
    
    // Clean the phone number (remove spaces, parentheses, dashes)
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // If it's already in international format, check for embedded domestic format
    if (cleaned.startsWith('+')) {
      // Check for UK international format with embedded domestic format: +44 07850680317
      const ukInternationalWithDomestic = cleaned.match(/^\+440(\d{9,10})$/);
      if (ukInternationalWithDomestic) {
        const result = `+44 ${ukInternationalWithDomestic[1]}`;
        return result;
      }
      
      return phone;
    }
    
    // Handle different country formats based on common patterns
    // Note: This covers major markets but isn't exhaustive
    
    // UK: 07850680317 → +44 7850680317
    if (cleaned.match(/^0\d{9,10}$/)) {
      const result = `+44 ${cleaned.substring(1)}`;
      return result;
    }
    
    // US: 5551234567 → +1 5551234567
    if (cleaned.match(/^\d{10}$/)) {
      const result = `+1 ${cleaned}`;
      return result;
    }
    
    // US with country code: 15551234567 → +15551234567
    if (cleaned.match(/^1\d{10}$/)) {
      const result = `+${cleaned}`;
      return result;
    }
    
    // Australia mobile: 0412345678 → +61 412345678
    if (cleaned.match(/^04\d{8}$/)) {
      const result = `+61 ${cleaned.substring(1)}`;
      return result;
    }
    
    // Germany: 03012345678 or 01751234567 → +49 03012345678
    if (cleaned.match(/^(030|040|089)\d{7,8}$/) || cleaned.match(/^01[567]\d{7,8}$/)) {
      const result = `+49 ${cleaned}`;
      return result;
    }
    
    // France: 0123456789 → +33 123456789
    if (cleaned.match(/^0[1-9]\d{8}$/)) {
      const result = `+33 ${cleaned.substring(1)}`;
      return result;
    }
    
    // If no pattern matches, return as is
    // This handles edge cases and unknown formats gracefully
    return phone;
  };

  // Load existing CV data if available
  useEffect(() => {
    const loadExistingCV = async () => {
      try {
        setIsLoadingCV(true);
        
        const token = localStorage.getItem('token');
        if (!token) return;

        let cvToLoad = null;

        if (cvId) {
          // If cvId is provided, load that specific CV (Continue CV workflow)
          const response = await fetch(`${serverUrl}/api/cv/${cvId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            cvToLoad = await response.json();
          }
        } else {
          // If no cvId, this is "Build My CV" - start completely fresh
        }

        // If we have CV data, populate the form
        if (cvToLoad) {
          let personalInfoData = null;
          
          // Check different possible locations for personalInfo based on API structure
          if (cvToLoad.personalInfo) {
            personalInfoData = cvToLoad.personalInfo;
          } else if (cvToLoad.content && cvToLoad.content.personalInfo) {
            personalInfoData = cvToLoad.content.personalInfo;
          } else if (typeof cvToLoad.content === 'string') {
            try {
              const parsedContent = JSON.parse(cvToLoad.content);
              if (parsedContent.personalInfo) {
                personalInfoData = parsedContent.personalInfo;
              }
            } catch (e) {
              console.error('Error parsing CV content:', e);
            }
          }
          
          if (personalInfoData) {
            setFormData(prev => ({
              ...prev,
              personalInfo: {
                fullName: personalInfoData.fullName || '',
                email: personalInfoData.email || '',
                phone: personalInfoData.phone || '',
                location: personalInfoData.location || '',
                socialNetwork: personalInfoData.socialNetwork || ''
              }
            }));
            
            // Set the current CV ID if we loaded specific CV data
            if (cvId && cvToLoad.id) {
              setCurrentCvId(cvToLoad.id);
            }
            
            toast.success('Loaded your existing CV data');
          } else {
            // Fallback to user profile data
            if (user) {
              setFormData(prev => ({
                ...prev,
                personalInfo: {
                  fullName: user.name || '',
                  email: user.email || '',
                  phone: normalizePhoneNumber(user.phone) || '',
                  location: '',
                  socialNetwork: ''
                }
              }));
            }
          }
        } else {
          // No existing CV found or starting fresh, initialize with user profile data only
          if (user) {
            setFormData(prev => ({
              ...prev,
              personalInfo: {
                fullName: user.name || '',
                email: user.email || '',
                phone: normalizePhoneNumber(user.phone) || '',
                location: '', // Start with empty location for new CV
                socialNetwork: '' // Start with empty social network for new CV
              }
            }));
          }
        }

      } catch (err) {
        console.error('Error loading existing CV:', err);
        // Fallback to user profile data
        if (user) {
          setFormData(prev => ({
            ...prev,
            personalInfo: {
              fullName: user.name || '',
              email: user.email || '',
              phone: normalizePhoneNumber(user.phone) || '',
              location: '', // Start with empty location on error
              socialNetwork: '' // Start with empty social network on error
            }
          }));
        }
      } finally {
        setIsLoadingCV(false);
      }
    };

    loadExistingCV();
  }, [cvId, user, serverUrl]);

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
    if (!phone.trim()) {
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
      console.log('Saving CV with templateId:', templateId, 'currentCvId:', currentCvId);
      
      const requestBody = {
        templateId: templateId,
        personalInfo: formData.personalInfo
      };

      // If we have an existing CV ID, include it to update rather than create new
      if (currentCvId) {
        requestBody.cvId = currentCvId;
      }

      const response = await fetch(`${serverUrl}/api/cv/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(requestBody),
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
      
      // Update our current CV ID
      setCurrentCvId(data.cv.id);
      
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

  if (isLoadingCV) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c3e50] dark:border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading your CV data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2c3e50] dark:text-white mb-2">
            Personal Information
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {currentCvId ? 'Update your contact details' : "Let's start with your contact details"}
          </p>
          {currentCvId && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
              ✓ Continuing your existing CV
            </p>
          )}
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