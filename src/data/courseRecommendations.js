import { getCareerPathway, analyzeEducationLevel } from './careerPathways.js';

// Course recommendations based on identified skills gaps
export const COURSE_RECOMMENDATIONS = {
  // Technical skills (IT/Technology industry only)
  'programming': [
    { 
      title: 'Introduction to Python Programming',
      provider: 'Alison',
      url: 'https://alison.com/course/introduction-to-python-programming',
      level: 'Beginner'
    },
    { 
      title: 'JavaScript Fundamentals',
      provider: 'Alison',
      url: 'https://alison.com/course/javascript-fundamentals', 
      level: 'Intermediate'
    }
  ],
  'data analysis': [
    { 
      title: 'Data Analysis with Excel',
      provider: 'Alison',
      url: 'https://alison.com/course/data-analysis-with-excel', 
      level: 'Beginner'
    },
    { 
      title: 'Introduction to Data Analytics',
      provider: 'Alison',
      url: 'https://alison.com/course/introduction-to-data-analytics', 
      level: 'Beginner'
    }
  ],
  
  // Generic project management (business/corporate only)
  'project management': [
    { 
      title: 'Project Management Fundamentals',
      provider: 'Alison',
      url: 'https://alison.com/course/project-management-fundamentals',
      level: 'Beginner'
    },
    { 
      title: 'Agile Project Management',
      provider: 'Alison',
      url: 'https://alison.com/course/agile-project-management',
      level: 'Intermediate'
    }
  ],
  
  // Education-specific project management
  'educational project management': [
    { 
      title: 'Educational Program Management',
      provider: 'Alison',
      url: 'https://alison.com/course/educational-program-management',
      level: 'Intermediate'
    },
    { 
      title: 'Academic Project Leadership',
      provider: 'Alison',
      url: 'https://alison.com/course/academic-project-leadership',
      level: 'Advanced'
    }
  ],
  
  // Soft skills
  'communication': [
    { 
      title: 'Effective Communication Skills',
      provider: 'Alison',
      url: 'https://alison.com/course/effective-communication-skills',
      level: 'Beginner'
    },
    { 
      title: 'Advanced Communication Techniques',
      provider: 'Alison',
      url: 'https://alison.com/course/advanced-communication-techniques',
      level: 'Intermediate'
    }
  ],
  'leadership': [
    { 
      title: 'Leadership Fundamentals',
      provider: 'Alison',
      url: 'https://alison.com/course/leadership-fundamentals',
      level: 'Intermediate'
    },
    { 
      title: 'Team Leadership Skills',
      provider: 'Alison',
      url: 'https://alison.com/course/team-leadership-skills',
      level: 'Advanced'
    }
  ],
  'teamwork': [
    { 
      title: 'Teamwork and Collaboration',
      provider: 'Alison',
      url: 'https://alison.com/course/teamwork-and-collaboration',
      level: 'Beginner'
    }
  ],
  
  // Education-specific leadership
  'educational leadership': [
    { 
      title: 'Academic Leadership and Management',
      provider: 'Alison',
      url: 'https://alison.com/course/academic-leadership-management',
      level: 'Advanced'
    },
    { 
      title: 'Educational Leadership Principles',
      provider: 'Alison',
      url: 'https://alison.com/course/educational-leadership-principles',
      level: 'Intermediate'
    }
  ],
  
  // Healthcare and Nursing specific courses
  'healthcare': [
    { 
      title: 'Introduction to Healthcare Systems',
      provider: 'Alison',
      url: 'https://alison.com/course/introduction-to-healthcare-systems',
      level: 'Beginner'
    },
    { 
      title: 'Healthcare Management Fundamentals',
      provider: 'Alison',
      url: 'https://alison.com/course/healthcare-management-fundamentals',
      level: 'Advanced'
    }
  ],
  'nursing': [
    { 
      title: 'Fundamentals of Nursing Practice',
      provider: 'Alison',
      url: 'https://alison.com/course/fundamentals-of-nursing-practice',
      level: 'Beginner'
    },
    { 
      title: 'Advanced Nursing Concepts',
      provider: 'Alison',
      url: 'https://alison.com/course/advanced-nursing-concepts',
      level: 'Advanced'
    }
  ],
  'patient care': [
    { 
      title: 'Patient Care Essentials',
      provider: 'Alison',
      url: 'https://alison.com/course/patient-care-essentials',
      level: 'Beginner'
    },
    { 
      title: 'Advanced Patient Care Management',
      provider: 'Alison',
      url: 'https://alison.com/course/advanced-patient-care-management',
      level: 'Intermediate'
    }
  ],
  'medical': [
    { 
      title: 'Medical Terminology for Healthcare',
      provider: 'Alison',
      url: 'https://alison.com/course/medical-terminology-healthcare',
      level: 'Beginner'
    },
    { 
      title: 'Medical Ethics and Professional Practice',
      provider: 'Alison',
      url: 'https://alison.com/course/medical-ethics-professional-practice',
      level: 'Intermediate'
    }
  ],
  'clinical': [
    { 
      title: 'Clinical Skills Development',
      provider: 'Alison',
      url: 'https://alison.com/course/clinical-skills-development',
      level: 'Intermediate'
    },
    { 
      title: 'Evidence-Based Clinical Practice',
      provider: 'Alison',
      url: 'https://alison.com/course/evidence-based-clinical-practice',
      level: 'Advanced'
    }
  ],
  'cpr': [
    { 
      title: 'CPR and Basic Life Support Certification',
      provider: 'Alison',
      url: 'https://alison.com/course/cpr-basic-life-support-certification',
      level: 'Beginner'
    },
    { 
      title: 'Advanced Cardiac Life Support (ACLS)',
      provider: 'Alison',
      url: 'https://alison.com/course/advanced-cardiac-life-support-acls',
      level: 'Advanced'
    }
  ],
  'first aid': [
    { 
      title: 'Workplace First Aid Certification',
      provider: 'Alison',
      url: 'https://alison.com/course/workplace-first-aid-certification',
      level: 'Beginner'
    },
    { 
      title: 'Emergency First Aid Response',
      provider: 'Alison',
      url: 'https://alison.com/course/emergency-first-aid-response',
      level: 'Intermediate'
    }
  ],
  'emergency response': [
    { 
      title: 'Healthcare Emergency Response',
      provider: 'Alison',
      url: 'https://alison.com/course/healthcare-emergency-response',
      level: 'Intermediate'
    },
    { 
      title: 'Crisis Management in Healthcare Settings',
      provider: 'Alison',
      url: 'https://alison.com/course/crisis-management-healthcare-settings',
      level: 'Advanced'
    }
  ],
  'hipaa': [
    { 
      title: 'HIPAA Compliance for Healthcare Professionals',
      provider: 'Alison',
      url: 'https://alison.com/course/hipaa-compliance-healthcare-professionals',
      level: 'Beginner'
    }
  ],
  'medical records': [
    { 
      title: 'Medical Records Management Systems',
      provider: 'Alison',
      url: 'https://alison.com/course/medical-records-management-systems',
      level: 'Intermediate'
    }
  ],
  'patient safety': [
    { 
      title: 'Patient Safety and Quality Improvement',
      provider: 'Alison',
      url: 'https://alison.com/course/patient-safety-quality-improvement',
      level: 'Intermediate'
    }
  ],

  // Additional Healthcare Specialties
  'pharmacy': [
    { 
      title: 'Introduction to Pharmaceutical Sciences',
      provider: 'Alison',
      url: 'https://alison.com/course/introduction-pharmaceutical-sciences',
      level: 'Beginner'
    },
    { 
      title: 'Clinical Pharmacy and Drug Therapy',
      provider: 'Alison',
      url: 'https://alison.com/course/clinical-pharmacy-drug-therapy',
      level: 'Advanced'
    },
    { 
      title: 'Pharmaceutical Calculations and Dosage',
      provider: 'Alison',
      url: 'https://alison.com/course/pharmaceutical-calculations-dosage',
      level: 'Intermediate'
    }
  ],
  'veterinary': [
    { 
      title: 'Introduction to Veterinary Medicine',
      provider: 'Alison',
      url: 'https://alison.com/course/introduction-veterinary-medicine',
      level: 'Beginner'
    },
    { 
      title: 'Animal Anatomy and Physiology',
      provider: 'Alison',
      url: 'https://alison.com/course/animal-anatomy-physiology',
      level: 'Intermediate'
    },
    { 
      title: 'Veterinary Practice Management',
      provider: 'Alison',
      url: 'https://alison.com/course/veterinary-practice-management',
      level: 'Advanced'
    }
  ],

  // Legal and Professional Services
  'legal': [
    { 
      title: 'Introduction to Legal Studies',
      provider: 'Alison',
      url: 'https://alison.com/course/introduction-legal-studies',
      level: 'Beginner'
    },
    { 
      title: 'Legal Research and Writing',
      provider: 'Alison',
      url: 'https://alison.com/course/legal-research-writing',
      level: 'Intermediate'
    },
    { 
      title: 'Contract Law and Business Legal Issues',
      provider: 'Alison',
      url: 'https://alison.com/course/contract-law-business-legal',
      level: 'Advanced'
    }
  ],
  'law': [
    { 
      title: 'Constitutional Law Fundamentals',
      provider: 'Alison',
      url: 'https://alison.com/course/constitutional-law-fundamentals',
      level: 'Intermediate'
    },
    { 
      title: 'Criminal Law and Procedure',
      provider: 'Alison',
      url: 'https://alison.com/course/criminal-law-procedure',
      level: 'Advanced'
    },
    { 
      title: 'Civil Litigation and Trial Practice',
      provider: 'Alison',
      url: 'https://alison.com/course/civil-litigation-trial-practice',
      level: 'Advanced'
    }
  ],
  
  // Education and Academic specific courses
  'education': [
    { 
      title: 'Foundations of Education',
      provider: 'Alison',
      url: 'https://alison.com/course/foundations-of-education',
      level: 'Beginner'
    },
    { 
      title: 'Educational Psychology and Learning',
      provider: 'Alison',
      url: 'https://alison.com/course/educational-psychology-learning',
      level: 'Intermediate'
    }
  ],
  'teaching': [
    { 
      title: 'Effective Teaching Strategies',
      provider: 'Alison',
      url: 'https://alison.com/course/effective-teaching-strategies',
      level: 'Beginner'
    },
    { 
      title: 'Advanced Pedagogical Methods',
      provider: 'Alison',
      url: 'https://alison.com/course/advanced-pedagogical-methods',
      level: 'Advanced'
    }
  ],
  'curriculum development': [
    { 
      title: 'Curriculum Design and Development',
      provider: 'Alison',
      url: 'https://alison.com/course/curriculum-design-development',
      level: 'Intermediate'
    },
    { 
      title: 'Academic Program Development',
      provider: 'Alison',
      url: 'https://alison.com/course/academic-program-development',
      level: 'Advanced'
    }
  ],
  'research': [
    { 
      title: 'Research Methods in Education',
      provider: 'Alison',
      url: 'https://alison.com/course/research-methods-education',
      level: 'Intermediate'
    },
    { 
      title: 'Academic Research and Publication',
      provider: 'Alison',
      url: 'https://alison.com/course/academic-research-publication',
      level: 'Advanced'
    }
  ],
  'assessment': [
    { 
      title: 'Educational Assessment and Evaluation',
      provider: 'Alison',
      url: 'https://alison.com/course/educational-assessment-evaluation',
      level: 'Intermediate'
    },
    { 
      title: 'Advanced Assessment Techniques',
      provider: 'Alison',
      url: 'https://alison.com/course/advanced-assessment-techniques',
      level: 'Advanced'
    }
  ],
  'student engagement': [
    { 
      title: 'Student Engagement Strategies',
      provider: 'Alison',
      url: 'https://alison.com/course/student-engagement-strategies',
      level: 'Intermediate'
    }
  ],
  'educational technology': [
    { 
      title: 'Technology in Education',
      provider: 'Alison',
      url: 'https://alison.com/course/technology-in-education',
      level: 'Intermediate'
    },
    { 
      title: 'Digital Learning Environments',
      provider: 'Alison',
      url: 'https://alison.com/course/digital-learning-environments',
      level: 'Advanced'
    }
  ],

  // Engineering-specific courses
  'aerospace engineering': [
    { 
      title: 'Introduction to Aerospace Engineering',
      provider: 'Alison',
      url: 'https://alison.com/course/introduction-to-aerospace-engineering',
      level: 'Beginner'
    },
    { 
      title: 'Aircraft Design and Manufacturing',
      provider: 'Alison',
      url: 'https://alison.com/course/aircraft-design-manufacturing',
      level: 'Advanced'
    },
    { 
      title: 'Aerospace Materials and Structures',
      provider: 'Alison',
      url: 'https://alison.com/course/aerospace-materials-structures',
      level: 'Intermediate'
    }
  ],
  'civil engineering': [
    { 
      title: 'Fundamentals of Civil Engineering',
      provider: 'Alison',
      url: 'https://alison.com/course/fundamentals-civil-engineering',
      level: 'Beginner'
    },
    { 
      title: 'Structural Analysis and Design',
      provider: 'Alison',
      url: 'https://alison.com/course/structural-analysis-design',
      level: 'Advanced'
    },
    { 
      title: 'Construction Project Management',
      provider: 'Alison',
      url: 'https://alison.com/course/construction-project-management',
      level: 'Intermediate'
    }
  ],
  'mechanical engineering': [
    { 
      title: 'Mechanical Engineering Fundamentals',
      provider: 'Alison',
      url: 'https://alison.com/course/mechanical-engineering-fundamentals',
      level: 'Beginner'
    },
    { 
      title: 'CAD Design and Manufacturing',
      provider: 'Alison',
      url: 'https://alison.com/course/cad-design-manufacturing',
      level: 'Intermediate'
    },
    { 
      title: 'Thermodynamics and Heat Transfer',
      provider: 'Alison',
      url: 'https://alison.com/course/thermodynamics-heat-transfer',
      level: 'Advanced'
    }
  ],
  'electrical engineering': [
    { 
      title: 'Electrical Engineering Basics',
      provider: 'Alison',
      url: 'https://alison.com/course/electrical-engineering-basics',
      level: 'Beginner'
    },
    { 
      title: 'Power Systems and Electronics',
      provider: 'Alison',
      url: 'https://alison.com/course/power-systems-electronics',
      level: 'Advanced'
    },
    { 
      title: 'Control Systems Engineering',
      provider: 'Alison',
      url: 'https://alison.com/course/control-systems-engineering',
      level: 'Intermediate'
    }
  ],
  'chemical engineering': [
    { 
      title: 'Chemical Engineering Principles',
      provider: 'Alison',
      url: 'https://alison.com/course/chemical-engineering-principles',
      level: 'Beginner'
    },
    { 
      title: 'Process Design and Optimization',
      provider: 'Alison',
      url: 'https://alison.com/course/process-design-optimization',
      level: 'Advanced'
    },
    { 
      title: 'Chemical Safety and Environmental Engineering',
      provider: 'Alison',
      url: 'https://alison.com/course/chemical-safety-environmental',
      level: 'Intermediate'
    }
  ],
  'biomedical engineering': [
    { 
      title: 'Introduction to Biomedical Engineering',
      provider: 'Alison',
      url: 'https://alison.com/course/introduction-biomedical-engineering',
      level: 'Beginner'
    },
    { 
      title: 'Medical Device Design and Development',
      provider: 'Alison',
      url: 'https://alison.com/course/medical-device-design-development',
      level: 'Advanced'
    },
    { 
      title: 'Biomaterials and Tissue Engineering',
      provider: 'Alison',
      url: 'https://alison.com/course/biomaterials-tissue-engineering',
      level: 'Intermediate'
    }
  ],

  // Professional Engineering Certifications
  'professional engineer': [
    { 
      title: 'FE Exam Preparation - Fundamentals of Engineering',
      provider: 'Alison',
      url: 'https://alison.com/course/fe-exam-preparation',
      level: 'Intermediate'
    },
    { 
      title: 'PE Exam Preparation - Professional Engineer License',
      provider: 'Alison',
      url: 'https://alison.com/course/pe-exam-preparation',
      level: 'Advanced'
    },
    { 
      title: 'Engineering Ethics and Professional Practice',
      provider: 'Alison',
      url: 'https://alison.com/course/engineering-ethics-professional-practice',
      level: 'Intermediate'
    }
  ],
  'cad design': [
    { 
      title: 'AutoCAD for Engineering Design',
      provider: 'Alison',
      url: 'https://alison.com/course/autocad-engineering-design',
      level: 'Beginner'
    },
    { 
      title: 'SolidWorks 3D Modeling and Design',
      provider: 'Alison',
      url: 'https://alison.com/course/solidworks-3d-modeling-design',
      level: 'Intermediate'
    },
    { 
      title: 'Advanced CAD and Product Development',
      provider: 'Alison',
      url: 'https://alison.com/course/advanced-cad-product-development',
      level: 'Advanced'
    }
  ],
  
  // Industry-specific skills (non-healthcare)
  'marketing': [
    { 
      title: 'Digital Marketing Strategy',
      provider: 'Alison',
      url: 'https://alison.com/course/digital-marketing-strategy', 
      level: 'Intermediate'
    },
    { 
      title: 'Social Media Marketing',
      provider: 'Alison',
      url: 'https://alison.com/course/social-media-marketing', 
      level: 'Beginner'
    }
  ],
  'finance': [
    { 
      title: 'Finance Fundamentals',
      provider: 'Alison',
      url: 'https://alison.com/course/finance-fundamentals', 
      level: 'Beginner'
    },
    { 
      title: 'Accounting Principles',
      provider: 'Alison',
      url: 'https://alison.com/course/accounting-principles', 
      level: 'Intermediate'
    }
  ],
  'it': [
    { 
      title: 'CompTIA A+ Certification',
      provider: 'Alison',
      url: 'https://alison.com/course/comptia-a-plus-certification-220-1001', 
      level: 'Beginner'
    },
    { 
      title: 'Introduction to Cybersecurity',
      provider: 'Alison',
      url: 'https://alison.com/course/introduction-to-cybersecurity', 
      level: 'Beginner'
    }
  ],
  
  // Safety, compliance and regulations (general)
  'safety': [
    { 
      title: 'Workplace Health and Safety',
      provider: 'Alison',
      url: 'https://alison.com/course/workplace-health-and-safety', 
      level: 'Beginner'
    },
    { 
      title: 'Health and Safety in the Workplace',
      provider: 'Alison',
      url: 'https://alison.com/course/health-and-safety-in-the-workplace-revised', 
      level: 'Intermediate'
    }
  ],
  'compliance': [
    { 
      title: 'Healthcare Compliance and Regulations',
      provider: 'Alison',
      url: 'https://alison.com/course/healthcare-compliance-regulations', 
      level: 'Intermediate'
    },
    { 
      title: 'Business Compliance and Regulations',
      provider: 'Alison',
      url: 'https://alison.com/course/business-law-compliance-and-regulations', 
      level: 'Intermediate'
    }
  ],
  'regulations': [
    { 
      title: 'Healthcare Regulatory Standards',
      provider: 'Alison',
      url: 'https://alison.com/course/healthcare-regulatory-standards', 
      level: 'Advanced'
    },
    { 
      title: 'Understanding Building Regulations',
      provider: 'CIOB Academy',
      url: 'https://ciobacademy.org/product/building-regulations-in-practice/', 
      level: 'Intermediate'
    }
  ],
  'building safety': [
    { 
      title: 'Building Safety and Compliance',
      provider: 'RICS Training',
      url: 'https://www.rics.org/courses-events/search-results/?topic=BuildingSafety', 
      level: 'Advanced'
    },
    { 
      title: 'Building Regulations and Safety',
      provider: 'CIOB Academy',
      url: 'https://ciobacademy.org/product/building-regulations-in-practice/', 
      level: 'Intermediate'
    }
  ],
  
  // Certifications and qualifications
  'iosh': [
    { 
      title: 'IOSH Managing Safely',
      provider: 'IOSH',
      url: 'https://alison.com/course/health-and-safety-in-the-workplace-revised', 
      level: 'Intermediate'
    }
  ],
  'customer service': [
    { 
      title: 'Customer Service Training',
      provider: 'Alison',
      url: 'https://alison.com/course/customer-service-training', 
      level: 'Beginner'
    }
  ],
  'gdpr': [
    { 
      title: 'GDPR Compliance',
      provider: 'Alison',
      url: 'https://alison.com/course/gdpr-compliance', 
      level: 'Beginner'
    }
  ],
  
  // Generic fallback courses for any missing skills
  'general': [
    { 
      title: 'Professional Development Skills',
      provider: 'Alison',
      url: 'https://alison.com/course/professional-development-skills', 
      level: 'Beginner'
    },
    { 
      title: 'Career Development: Skills for Success',
      provider: 'Alison',
      url: 'https://alison.com/course/career-development-skills-for-success', 
      level: 'Beginner'
    }
  ]
};

// Helper function to find recommendations based on keywords and industry context
export const findCourseRecommendations = (keywords = [], count = 3, industry = null, role = null, cvEducation = null) => {
  if (!keywords || keywords.length === 0) {
    return COURSE_RECOMMENDATIONS.general.slice(0, count);
  }

  let results = [];
  
  // Convert keywords to lowercase for case-insensitive matching
  const normalizedKeywords = keywords.map(kw => kw.toLowerCase());
  
  // Define industry-specific course priorities
  const industryCoursePriorities = {
    'healthcare': ['nursing', 'patient care', 'medical', 'clinical', 'pharmacy', 'veterinary', 'cpr', 'first aid', 'emergency response', 'hipaa', 'medical records', 'patient safety', 'healthcare'],
    'technology': ['programming', 'data analysis', 'it'],
    'finance': ['finance', 'data analysis'],
    'marketing': ['marketing', 'communication'],
    'education': ['education', 'teaching', 'curriculum development', 'research', 'assessment', 'student engagement', 'educational technology', 'educational leadership', 'educational project management'],
    'design': ['communication'],
    'engineering': ['aerospace engineering', 'civil engineering', 'mechanical engineering', 'electrical engineering', 'chemical engineering', 'biomedical engineering', 'professional engineer', 'cad design', 'project management', 'safety'],
    'aerospace': ['aerospace engineering', 'mechanical engineering', 'professional engineer', 'cad design', 'project management'],
    'civil': ['civil engineering', 'project management', 'safety', 'professional engineer'],
    'mechanical': ['mechanical engineering', 'cad design', 'professional engineer', 'project management'],
    'legal': ['legal', 'law', 'communication'],
    'pharmaceutical': ['pharmacy', 'medical', 'healthcare'],
    'veterinary': ['veterinary', 'healthcare', 'medical'],
    'sales': ['communication', 'customer service'],
    'emergency_services': ['emergency response', 'first aid', 'cpr', 'safety']
  };
  
  // Define courses to exclude for specific industries
  const industryExclusions = {
    'healthcare': ['it', 'programming', 'engineering', 'aerospace engineering', 'civil engineering', 'mechanical engineering', 'marketing', 'finance'],
    'emergency_services': ['it', 'programming', 'marketing', 'finance', 'education', 'engineering'],
    'finance': ['healthcare', 'nursing', 'medical', 'clinical', 'it', 'programming', 'education', 'engineering'],
    'technology': ['healthcare', 'nursing', 'medical', 'clinical', 'education', 'civil engineering', 'aerospace engineering'],
    'education': ['it', 'programming', 'healthcare', 'nursing', 'medical', 'clinical', 'engineering', 'aerospace engineering', 'civil engineering', 'marketing', 'finance'],
    'marketing': ['healthcare', 'nursing', 'medical', 'clinical', 'it', 'programming', 'education', 'engineering'],
    'design': ['healthcare', 'nursing', 'medical', 'clinical', 'engineering', 'aerospace engineering', 'civil engineering'],
    'engineering': ['healthcare', 'nursing', 'medical', 'clinical', 'education', 'marketing'],
    'aerospace': ['healthcare', 'nursing', 'medical', 'clinical', 'education', 'marketing', 'finance'],
    'civil': ['healthcare', 'nursing', 'medical', 'clinical', 'education', 'marketing', 'it', 'programming'],
    'mechanical': ['healthcare', 'nursing', 'medical', 'clinical', 'education', 'marketing']
  };
  
  const priorityCategories = industry ? industryCoursePriorities[industry] || [] : [];
  const excludedCategories = industry ? industryExclusions[industry] || [] : [];
  
  // First, try exact matches for keywords, prioritizing industry-relevant ones
  const sortedKeywords = [...normalizedKeywords].sort((a, b) => {
    const aInPriority = priorityCategories.some(cat => a.includes(cat) || cat.includes(a));
    const bInPriority = priorityCategories.some(cat => b.includes(cat) || cat.includes(b));
    if (aInPriority && !bInPriority) return -1;
    if (!aInPriority && bInPriority) return 1;
    return 0;
  });
  
  sortedKeywords.forEach(keyword => {
    for (const [key, courses] of Object.entries(COURSE_RECOMMENDATIONS)) {
      // Skip excluded categories for this industry
      if (excludedCategories.includes(key.toLowerCase())) {
        continue;
      }
      
      if (key.toLowerCase() === keyword) {
        // Add courses that aren't already in results
        courses.forEach(course => {
          if (!results.find(r => r.url === course.url)) {
            results.push(course);
          }
        });
      }
    }
  });
  
  // If we don't have enough results, look for partial matches (industry-filtered)
  if (results.length < count) {
    sortedKeywords.forEach(keyword => {
      for (const [key, courses] of Object.entries(COURSE_RECOMMENDATIONS)) {
        // Skip excluded categories and already matched keys
        if (excludedCategories.includes(key.toLowerCase()) || key.toLowerCase() === keyword) {
          continue;
        }
        
        // Check for partial matches
        if (keyword.includes(key.toLowerCase()) || key.toLowerCase().includes(keyword)) {
          // Add courses that aren't already in results
          courses.forEach(course => {
            if (!results.find(r => r.url === course.url)) {
              results.push(course);
            }
          });
        }
      }
    });
  }
  
  // Handle industry-specific skill mapping
  if (results.length < count) {
    const industrySpecificMapping = {
      'healthcare': {
        'management': ['leadership'],
        'lead': ['leadership'], 
        'manager': ['leadership'],
        'safety': ['patient safety'],
        'compliance': ['hipaa'],
        'emergency': ['emergency response', 'cpr'],
        'health': ['healthcare', 'patient care'],
        'care': ['patient care', 'nursing'],
        'documentation': ['medical records'],
        'records': ['medical records']
      },
      'technology': {
        'analysis': ['data analysis'],
        'coding': ['programming'],
        'software': ['programming'],
        'security': ['it'],
        'cyber': ['it']
      },
      'finance': {
        'analysis': ['data analysis'],
        'money': ['finance'],
        'accounting': ['finance']
      },
      'education': {
        'management': ['educational leadership', 'educational project management'],
        'lead': ['educational leadership'],
        'leadership': ['educational leadership'],
        'project': ['educational project management'],
        'curriculum': ['curriculum development'],
        'teach': ['teaching', 'education'],
        'student': ['student engagement', 'assessment'],
        'research': ['research'],
        'assessment': ['assessment'],
        'technology': ['educational technology'],
        'learning': ['education', 'educational psychology and learning']
      },
      'engineering': {
        'aerospace': ['aerospace engineering', 'mechanical engineering'],
        'aircraft': ['aerospace engineering'],
        'space': ['aerospace engineering'],
        'civil': ['civil engineering'],
        'structural': ['civil engineering'],
        'construction': ['civil engineering', 'project management'],
        'mechanical': ['mechanical engineering'],
        'design': ['cad design', 'mechanical engineering'],
        'manufacturing': ['mechanical engineering'],
        'electrical': ['electrical engineering'],
        'power': ['electrical engineering'],
        'chemical': ['chemical engineering'],
        'process': ['chemical engineering'],
        'biomedical': ['biomedical engineering'],
        'medical device': ['biomedical engineering'],
        'cad': ['cad design'],
        'autocad': ['cad design'],
        'solidworks': ['cad design'],
        'fe exam': ['professional engineer'],
        'pe license': ['professional engineer'],
        'project': ['project management']
      },
      'healthcare': {
        'pharmacy': ['pharmacy'],
        'pharmaceutical': ['pharmacy'],
        'drug': ['pharmacy'],
        'veterinary': ['veterinary'],
        'animal': ['veterinary'],
        'medical': ['medical', 'healthcare'],
        'clinical': ['clinical'],
        'patient': ['patient care']
      },
      'legal': {
        'law': ['law', 'legal'],
        'legal': ['legal'],
        'court': ['law'],
        'litigation': ['law'],
        'contract': ['legal'],
        'attorney': ['law'],
        'lawyer': ['law']
      },
      'general': {
        'analysis': ['data analysis'],
        'analytics': ['data analysis'],
        'sale': ['customer service'],
        'customer': ['customer service']
      }
    };
    
    const mappingToUse = industrySpecificMapping[industry] || industrySpecificMapping['general'];
    
    normalizedKeywords.forEach(keyword => {
      for (const [relatedKey, relatedValues] of Object.entries(mappingToUse)) {
        if (keyword.includes(relatedKey)) {
          // Look up each related skill
          relatedValues.forEach(relatedSkill => {
            // Skip if this category is excluded for the industry
            if (excludedCategories.includes(relatedSkill.toLowerCase())) {
              return;
            }
            
            const coursesForSkill = COURSE_RECOMMENDATIONS[relatedSkill];
            if (coursesForSkill) {
              coursesForSkill.forEach(course => {
                if (!results.find(r => r.url === course.url)) {
                  results.push(course);
                }
              });
            }
          });
        }
      }
    });
  }
  
  // If we still don't have enough results, add industry-appropriate general recommendations
  if (results.length < count) {
    let fallbackCourses = [];
    
    if (industry && priorityCategories.length > 0) {
      // Add courses from priority categories
      priorityCategories.forEach(category => {
        const categoryCourses = COURSE_RECOMMENDATIONS[category];
        if (categoryCourses) {
          fallbackCourses = [...fallbackCourses, ...categoryCourses];
        }
      });
    }
    
    // Add general courses if still needed
    if (fallbackCourses.length === 0) {
      fallbackCourses = COURSE_RECOMMENDATIONS.general;
    }
    
    const filteredFallback = fallbackCourses.filter(
      course => !results.find(r => r.url === course.url)
    );
    
    results = [...results, ...filteredFallback].slice(0, count);
  }
  
  // Return just the requested number of courses
  return results.slice(0, count);
};

// Enhanced function that includes career pathway analysis
export const findCourseRecommendationsWithPathway = (keywords = [], count = 3, industry = null, role = null, cvEducation = null) => {
  // Get course recommendations
  const courseRecommendations = findCourseRecommendations(keywords, count, industry, role, cvEducation);
  
  // Get career pathway analysis if education data is provided
  let careerPathway = null;
  if (role && cvEducation) {
    careerPathway = getCareerPathway(role, cvEducation, industry);
  }
  
  return {
    courses: courseRecommendations,
    careerPathway: careerPathway
  };
}; 