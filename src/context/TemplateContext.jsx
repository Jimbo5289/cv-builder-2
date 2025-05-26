import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Create context
const TemplateContext = createContext();

// Template details
const templateDetails = {
  '1': {
    id: '1',
    name: 'Professional',
    description: 'A clean and traditional layout, perfect for corporate roles.',
    color: '#4A90E2',
    features: [
      'Clean, minimal design for corporate settings',
      'Structured layout emphasizing work experience',
      'Professional typography and color scheme',
      'Optimized for Applicant Tracking Systems (ATS)',
      'Ideal for finance, consulting, management roles'
    ]
  },
  '2': {
    id: '2',
    name: 'Creative',
    description: 'A modern design with visual elements for creative industries.',
    color: '#E24A8B',
    features: [
      'Modern layout with visual elements',
      'Balanced white space for better readability',
      'Space for portfolio highlights or achievements',
      'Eye-catching design elements',
      'Perfect for design, marketing, and media roles'
    ]
  },
  '3': {
    id: '3',
    name: 'Executive',
    description: 'A sophisticated format for senior leadership positions.',
    color: '#4AE2C4',
    features: [
      'Sophisticated layout for leadership positions',
      'Focus on accomplishments and leadership skills',
      'Elegant typography and spacing',
      'Professional and authoritative design',
      'Suitable for C-level executives and directors'
    ]
  },
  '4': {
    id: '4',
    name: 'Academic',
    description: 'Tailored for academic and research positions.',
    color: '#E2A64A',
    features: [
      'Focused on education and research achievements',
      'Dedicated sections for publications and presentations',
      'Formal and structured layout',
      'Emphasis on qualifications and research experience',
      'Ideal for professors, researchers, and PhDs'
    ]
  }
};

export const useTemplate = () => useContext(TemplateContext);

export const TemplateProvider = ({ children }) => {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "Professional",
      image: "/images/templates/professional.svg",
      photo: "/images/templates/photos/professional.jpg",
      description: "A clean and traditional layout, perfect for corporate roles.",
      color: "#4A90E2", // Blue color for professional template
    },
    {
      id: 2,
      name: "Creative",
      image: "/images/templates/creative.svg",
      photo: "/images/templates/photos/creative.jpg",
      description: "A modern design with visual elements for creative industries.",
      color: "#E24A8B", // Pink color for creative template
    },
    {
      id: 3,
      name: "Executive",
      image: "/images/templates/executive.svg",
      photo: "/images/templates/photos/executive.jpg",
      description: "A sophisticated format for senior leadership positions.",
      color: "#4AE2C4", // Teal color for executive template
    },
    {
      id: 4,
      name: "Academic",
      image: "/images/templates/academic.svg",
      photo: "/images/templates/photos/academic.jpg",
      description: "Tailored for academic and research positions.",
      color: "#E2A64A", // Orange color for academic template
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const location = useLocation();

  // Update template ID when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const templateParam = searchParams.get('template');
    
    if (templateParam && templateDetails[templateParam]) {
      setSelectedTemplate(templateParam);
    }
  }, [location]);

  // For demonstration purposes, simulate fetching templates from an API
  useEffect(() => {
    // This could be replaced with an actual API call
    // setLoading(true);
    // fetch('/api/templates')
    //   .then(response => response.json())
    //   .then(data => {
    //     setTemplates(data);
    //     setLoading(false);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching templates:', error);
    //     setLoading(false);
    //   });
  }, []);

  // Get current template details
  const getCurrentTemplate = () => {
    return templateDetails[selectedTemplate] || templateDetails['1'];
  };

  const value = {
    templates,
    loading,
    selectedTemplate,
    setSelectedTemplate,
    getCurrentTemplate,
    templateDetails,
  };

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
};

export default TemplateContext; 