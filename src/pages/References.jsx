import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function References() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cvId = searchParams.get('cvId');
  const [references, setReferences] = useState([
    { name: '', position: '', company: '', email: '', phone: '' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (index, field, value) => {
    const updatedReferences = references.map((ref, i) => {
      if (i === index) {
        return { ...ref, [field]: value };
      }
      return ref;
    });
    setReferences(updatedReferences);
  };

  const addReference = () => {
    setReferences([
      ...references,
      { name: '', position: '', company: '', email: '', phone: '' }
    ]);
  };

  const removeReference = (index) => {
    setReferences(references.filter((_, i) => i !== index));
  };

  const handleSaveAndFinish = async () => {
    // Validate that at least one reference has a name and either email or phone
    const isValid = references.some(ref => 
      ref.name.trim() && (ref.email.trim() || ref.phone.trim())
    );

    if (!isValid) {
      setError('Please provide at least one reference with name and contact information');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to continue');
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';
      const response = await fetch(`${API_URL}/api/cv/${cvId}/references`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ references }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save references');
      }

      // Navigate to preview
      navigate(`/preview?cvId=${cvId}`);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'An error occurred while saving. Please try again.');
      
      if (err.message.includes('token')) {
        navigate('/login?redirect=/create/references');
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
            References
          </h1>
          <p className="text-gray-600">
            Add professional references who can vouch for your skills and experience
          </p>
        </div>

        <div className="space-y-6">
          {references.map((reference, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#2c3e50]">
                  Reference {index + 1}
                </h2>
                {index > 0 && (
                  <button
                    onClick={() => removeReference(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={reference.name}
                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={reference.position}
                    onChange={(e) => handleInputChange(index, 'position', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                    placeholder="Senior Manager"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={reference.company}
                    onChange={(e) => handleInputChange(index, 'company', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={reference.email}
                    onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={reference.phone}
                    onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addReference}
            className="text-[#2c3e50] hover:text-[#34495e]"
          >
            + Add Another Reference
          </button>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>

            <button
              onClick={handleSaveAndFinish}
              disabled={isLoading}
              className={`bg-[#2c3e50] text-white px-8 py-3 rounded-lg hover:bg-[#34495e] transition-all duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Saving...' : 'Preview CV →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default References; 