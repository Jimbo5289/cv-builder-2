import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Autocomplete, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Tooltip,
  IconButton,
  FormHelperText
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { DEGREE_LEVELS, GRADES_UK, GRADES_US, UNIVERSITIES, FIELDS_OF_STUDY } from '../data/educationData';

const EDUCATION_TYPES = {
  UNIVERSITY: 'university',
  HIGH_SCHOOL: 'highSchool',
  CERTIFICATION: 'certification',
  BOOTCAMP: 'bootcamp',
  VOCATIONAL: 'vocational'
};

const EDUCATION_TYPE_LABELS = {
  [EDUCATION_TYPES.UNIVERSITY]: 'University/College',
  [EDUCATION_TYPES.HIGH_SCHOOL]: 'High School',
  [EDUCATION_TYPES.CERTIFICATION]: 'Certification',
  [EDUCATION_TYPES.BOOTCAMP]: 'Bootcamp',
  [EDUCATION_TYPES.VOCATIONAL]: 'Vocational Training'
};

function Education() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cvId = searchParams.get('cvId');
  const [education, setEducation] = useState([
    { 
      type: EDUCATION_TYPES.UNIVERSITY,
      institution: '', 
      degree: '', 
      field: '', 
      startDate: '', 
      endDate: '', 
      description: '',
      grade: '',
      certificationId: '',
      issuer: '',
      expiryDate: '',
      errors: {}
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestedFields, setSuggestedFields] = useState([]);

  const validateDates = (startDate, endDate) => {
    if (!startDate || !endDate) return true;
    return new Date(startDate) <= new Date(endDate);
  };

  const handleInputChange = (index, field, value) => {
    const updatedEducation = education.map((edu, i) => {
      if (i === index) {
        const updatedEdu = { ...edu, [field]: value };
        
        // Clear field errors when value changes
        if (updatedEdu.errors) {
          delete updatedEdu.errors[field];
        }

        // Validate dates when either date changes
        if (field === 'startDate' || field === 'endDate') {
          if (!validateDates(field === 'startDate' ? value : edu.startDate, 
                           field === 'endDate' ? value : edu.endDate)) {
            updatedEdu.errors = {
              ...updatedEdu.errors,
              endDate: 'End date must be after start date'
            };
          }
        }

        // If institution changes, update suggested fields
        if (field === 'institution') {
          // In a real implementation, this would call your API
          // For now, we'll filter the existing fields based on some logic
          const suggestedFields = FIELDS_OF_STUDY.filter(f => 
            edu.type === EDUCATION_TYPES.UNIVERSITY
          );
          setSuggestedFields(suggestedFields);
        }

        return updatedEdu;
      }
      return edu;
    });
    setEducation(updatedEducation);
  };

  const addEducation = () => {
    setEducation([
      ...education,
      { 
        type: EDUCATION_TYPES.UNIVERSITY,
        institution: '', 
        degree: '', 
        field: '', 
        startDate: '', 
        endDate: '', 
        description: '',
        grade: '',
        certificationId: '',
        issuer: '',
        expiryDate: '',
        errors: {}
      }
    ]);
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleSaveAndContinue = async () => {
    setIsLoading(true);
    setError('');

    // Validate all entries before saving
    const hasErrors = education.some(edu => {
      const errors = {};
      
      if (!validateDates(edu.startDate, edu.endDate)) {
        errors.endDate = 'End date must be after start date';
      }

      if (Object.keys(errors).length > 0) {
        edu.errors = errors;
        return true;
      }
      return false;
    });

    if (hasErrors) {
      setIsLoading(false);
      setError('Please fix validation errors before continuing');
      setEducation([...education]); // Trigger re-render to show errors
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to continue');
      }

      const response = await fetch(`http://localhost:3001/api/cv/${cvId}/education`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ education }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save education');
      }

      navigate(`/create/references?cvId=${cvId}`);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'An error occurred while saving. Please try again.');
      
      if (err.message.includes('token')) {
        navigate('/login?redirect=/create/education');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderEducationFields = (edu, index) => {
    switch (edu.type) {
      case EDUCATION_TYPES.UNIVERSITY:
        return (
          <>
            <div className="mb-6">
              <FormControl fullWidth>
                <InputLabel>Education Type</InputLabel>
                <Select
                  value={edu.type}
                  onChange={(e) => handleInputChange(index, 'type', e.target.value)}
                  label="Education Type"
                  className="mb-6"
                >
                  {Object.entries(EDUCATION_TYPE_LABELS).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Institution
                  <Tooltip title="Enter your university name. As you type, matching institutions will be suggested." arrow>
                    <IconButton size="small" className="ml-1">
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </label>
                <Autocomplete
                  value={edu.institution}
                  onChange={(event, newValue) => handleInputChange(index, 'institution', newValue)}
                  options={UNIVERSITIES.sort((a, b) => a.localeCompare(b))}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Start typing university name..."
                      className="w-full"
                      variant="outlined"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Degree Level
                  <Tooltip title="Select your degree level. This helps employers understand your qualification level." arrow>
                    <IconButton size="small" className="ml-1">
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </label>
                <FormControl fullWidth>
                  <Select
                    value={edu.degree}
                    onChange={(e) => handleInputChange(index, 'degree', e.target.value)}
                    displayEmpty
                    variant="outlined"
                  >
                    <MenuItem value="" disabled>Select Degree Level</MenuItem>
                    {DEGREE_LEVELS.map((degree) => (
                      <MenuItem key={degree.value} value={degree.value}>
                        {degree.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Field of Study
                  <Tooltip title="Your major or main area of study. Suggestions will update based on your selected institution." arrow>
                    <IconButton size="small" className="ml-1">
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </label>
                <Autocomplete
                  value={edu.field}
                  onChange={(event, newValue) => handleInputChange(index, 'field', newValue)}
                  options={(suggestedFields.length > 0 ? suggestedFields : FIELDS_OF_STUDY).sort((a, b) => a.localeCompare(b))}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Start typing field of study..."
                      className="w-full"
                      variant="outlined"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Grade
                  <Tooltip title="Your achieved grade or classification." arrow>
                    <IconButton size="small" className="ml-1">
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </label>
                <FormControl fullWidth>
                  <Select
                    value={edu.grade}
                    onChange={(e) => handleInputChange(index, 'grade', e.target.value)}
                    displayEmpty
                    variant="outlined"
                  >
                    <MenuItem value="" disabled>Select Grade</MenuItem>
                    {GRADES_UK.map((grade) => (
                      <MenuItem key={grade.value} value={grade.value}>
                        {grade.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Start Date
                  <Tooltip title="When did you begin this education? For current studies, leave the end date empty." arrow>
                    <IconButton size="small" className="ml-1">
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </label>
                <input
                  type="date"
                  value={edu.startDate}
                  onChange={(e) => {
                    handleInputChange(index, 'startDate', e.target.value);
                    e.target.blur(); // Force blur after selection
                  }}
                  onBlur={(e) => e.target.blur()} // Ensure blur on calendar close
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  End Date
                  <Tooltip title="When did you complete this education? Leave empty if currently studying." arrow>
                    <IconButton size="small" className="ml-1">
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </label>
                <input
                  type="date"
                  value={edu.endDate}
                  onChange={(e) => {
                    handleInputChange(index, 'endDate', e.target.value);
                    e.target.blur(); // Force blur after selection
                  }}
                  onBlur={(e) => e.target.blur()} // Ensure blur on calendar close
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                />
                {edu.errors?.endDate && (
                  <FormHelperText error>{edu.errors.endDate}</FormHelperText>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 font-medium mb-2">
                Description
                <Tooltip title="Include key achievements, relevant coursework, thesis title, or research areas." arrow>
                  <IconButton size="small" className="ml-1">
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </label>
              <textarea
                value={edu.description}
                onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                rows="4"
                placeholder="Describe your achievements, relevant coursework, etc."
              />
            </div>
          </>
        );

      case EDUCATION_TYPES.HIGH_SCHOOL:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">School Name</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleInputChange(index, 'institution', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  placeholder="High School Name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Diploma/Certificate</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleInputChange(index, 'degree', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  placeholder="e.g., High School Diploma"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Grade/GPA</label>
                <input
                  type="text"
                  value={edu.grade}
                  onChange={(e) => handleInputChange(index, 'grade', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  placeholder="e.g., 4.0/4.0"
                />
              </div>
            </div>
          </>
        );

      case EDUCATION_TYPES.CERTIFICATION:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Certification Name</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleInputChange(index, 'degree', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  placeholder="e.g., AWS Solutions Architect"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Issuing Organization</label>
                <input
                  type="text"
                  value={edu.issuer}
                  onChange={(e) => handleInputChange(index, 'issuer', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  placeholder="e.g., Amazon Web Services"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Certification ID</label>
                <input
                  type="text"
                  value={edu.certificationId}
                  onChange={(e) => handleInputChange(index, 'certificationId', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  placeholder="Certification ID/Number"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Expiry Date</label>
                <input
                  type="date"
                  value={edu.expiryDate}
                  onChange={(e) => handleInputChange(index, 'expiryDate', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                />
              </div>
            </div>
          </>
        );

      case EDUCATION_TYPES.BOOTCAMP:
      case EDUCATION_TYPES.VOCATIONAL:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Institution</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleInputChange(index, 'institution', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  placeholder="Institution Name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Program/Course</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleInputChange(index, 'degree', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  placeholder="e.g., Full Stack Development"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Field/Focus Area</label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => handleInputChange(index, 'field', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  placeholder="e.g., Web Development"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Certification/Completion ID</label>
                <input
                  type="text"
                  value={edu.certificationId}
                  onChange={(e) => handleInputChange(index, 'certificationId', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  placeholder="Certificate ID (if applicable)"
                />
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">
            Education
          </h1>
          <p className="text-gray-600">
            Add your educational background
          </p>
        </div>

        {education.map((edu, index) => (
          <div key={index} className="mb-8 p-6 border rounded-lg">
            <div className="flex justify-between items-center mb-6">
              {education.length > 1 && (
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>

            {renderEducationFields(edu, index)}
          </div>
        ))}

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={addEducation}
            className="text-[#2c3e50] hover:text-[#34495e]"
          >
            + Add Another Education
          </button>

          <div className="space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleSaveAndContinue}
              disabled={isLoading}
              className="bg-[#2c3e50] text-white px-6 py-2 rounded-lg hover:bg-[#34495e] disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save & Continue'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default Education; 