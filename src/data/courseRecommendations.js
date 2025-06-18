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
export const findCourseRecommendations = (keywords = [], count = 3, industry = null, role = null) => {
  if (!keywords || keywords.length === 0) {
    return COURSE_RECOMMENDATIONS.general.slice(0, count);
  }

  let results = [];
  
  // Convert keywords to lowercase for case-insensitive matching
  const normalizedKeywords = keywords.map(kw => kw.toLowerCase());
  
  // Define industry-specific course priorities
  const industryCoursePriorities = {
    'healthcare': ['nursing', 'patient care', 'medical', 'clinical', 'cpr', 'first aid', 'emergency response', 'hipaa', 'medical records', 'patient safety', 'healthcare'],
    'technology': ['programming', 'data analysis', 'it'],
    'finance': ['finance', 'data analysis'],
    'marketing': ['marketing', 'communication'],
    'education': ['education', 'teaching', 'curriculum development', 'research', 'assessment', 'student engagement', 'educational technology', 'educational leadership', 'educational project management'],
    'design': ['communication'],
    'engineering': ['safety', 'data analysis'],
    'sales': ['communication', 'customer service'],
    'emergency_services': ['emergency response', 'first aid', 'cpr', 'safety']
  };
  
  // Define courses to exclude for specific industries
  const industryExclusions = {
    'healthcare': ['it', 'programming', 'project management', 'marketing', 'finance'],
    'emergency_services': ['it', 'programming', 'marketing', 'finance', 'education'],
    'finance': ['healthcare', 'nursing', 'medical', 'clinical', 'it', 'programming', 'education'],
    'technology': ['healthcare', 'nursing', 'medical', 'clinical', 'education'],
    'education': ['it', 'programming', 'healthcare', 'nursing', 'medical', 'clinical', 'project management', 'marketing', 'finance'],
    'marketing': ['healthcare', 'nursing', 'medical', 'clinical', 'it', 'programming', 'education'],
    'design': ['healthcare', 'nursing', 'medical', 'clinical', 'it', 'programming', 'education']
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