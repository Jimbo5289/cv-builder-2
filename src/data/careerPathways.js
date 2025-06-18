// Career pathway definitions for different roles
export const CAREER_PATHWAYS = {
  // Education/Academic Roles
  'professor': {
    title: 'Professor Career Pathway',
    description: 'Traditional academic career path requiring extensive education and research experience',
    stages: [
      {
        level: 'Undergraduate',
        requirements: ['Bachelor\'s degree in relevant field'],
        duration: '3-4 years',
        description: 'Foundation education in chosen discipline'
      },
      {
        level: 'Graduate',
        requirements: ['Master\'s degree in specialized area', 'Research experience', 'Academic writing skills'],
        duration: '1-2 years',
        description: 'Specialized knowledge and initial research experience'
      },
      {
        level: 'Doctoral',
        requirements: ['PhD in field of expertise', 'Doctoral dissertation', 'Conference presentations', 'Teaching experience'],
        duration: '3-7 years',
        description: 'Original research contribution and teaching credentials'
      },
      {
        level: 'Postdoctoral',
        requirements: ['Postdoctoral research position', '2-5 published papers', 'Grant application experience'],
        duration: '1-3 years',
        description: 'Advanced research experience and publication record'
      },
      {
        level: 'Assistant Professor',
        requirements: ['5-10 peer-reviewed publications', 'Teaching portfolio', 'Research funding'],
        duration: '6-7 years',
        description: 'Tenure-track position with research and teaching duties'
      },
      {
        level: 'Associate Professor',
        requirements: ['Tenure achievement', '15-25 publications', 'Administrative experience'],
        duration: 'Ongoing',
        description: 'Tenured position with increased responsibilities'
      },
      {
        level: 'Full Professor',
        requirements: ['30+ publications', 'International recognition', 'Major grants', 'Editorial experience'],
        duration: 'Career peak',
        description: 'Senior academic leadership and expertise'
      }
    ],
    qualifications: [
      'Subject-specific Bachelor\'s degree',
      'Master\'s degree in specialized area',
      'PhD in field of expertise',
      'Teaching qualifications (varies by country)',
      'Professional development courses'
    ],
    publications: {
      minimum: 30,
      types: ['Peer-reviewed journal articles', 'Book chapters', 'Monographs', 'Conference papers']
    }
  },
  
  'teacher': {
    title: 'Teacher Career Pathway',
    description: 'Professional teaching career in primary/secondary education',
    stages: [
      {
        level: 'Education',
        requirements: ['Bachelor\'s degree', 'Teaching qualification (PGCE/Education degree)'],
        duration: '3-4 years',
        description: 'Subject knowledge and pedagogical training'
      },
      {
        level: 'Newly Qualified Teacher (NQT)',
        requirements: ['Teaching qualification', 'DBS check', 'School placement'],
        duration: '1 year',
        description: 'Induction year with mentorship and support'
      },
      {
        level: 'Qualified Teacher',
        requirements: ['Successful NQT completion', 'Continuing professional development'],
        duration: '2-5 years',
        description: 'Independent teaching with ongoing skill development'
      },
      {
        level: 'Senior Teacher/Head of Department',
        requirements: ['Leadership training', 'Subject expertise', 'Management experience'],
        duration: '5-10 years',
        description: 'Leadership responsibilities within subject area'
      },
      {
        level: 'Assistant Head/Deputy Head',
        requirements: ['Senior leadership qualification', 'Whole-school experience'],
        duration: '10-15 years',
        description: 'School-wide leadership and management'
      },
      {
        level: 'Headteacher/Principal',
        requirements: ['Headship qualification', 'Extensive leadership experience'],
        duration: 'Career peak',
        description: 'Overall school leadership and vision'
      }
    ],
    qualifications: [
      'Bachelor\'s degree in teaching subject',
      'PGCE or equivalent teaching qualification',
      'Qualified Teacher Status (QTS)',
      'Safeguarding training',
      'Subject-specific CPD courses'
    ]
  },

  // Healthcare Roles
  'nurse': {
    title: 'Nursing Career Pathway',
    description: 'Professional nursing career with multiple specialization options',
    stages: [
      {
        level: 'Pre-Registration',
        requirements: ['Nursing degree or diploma', 'Clinical placements', 'Academic study'],
        duration: '3-4 years',
        description: 'Foundation nursing education and practical experience'
      },
      {
        level: 'Newly Qualified Nurse',
        requirements: ['Nursing registration', 'Preceptorship program', 'Basic life support'],
        duration: '6-12 months',
        description: 'Transition to independent practice with support'
      },
      {
        level: 'Registered Nurse',
        requirements: ['Professional registration', 'Continuing professional development', 'Specialization training'],
        duration: '2-5 years',
        description: 'Independent nursing practice in chosen specialty'
      },
      {
        level: 'Senior Nurse/Charge Nurse',
        requirements: ['Leadership training', 'Mentorship skills', 'Advanced practice courses'],
        duration: '5-8 years',
        description: 'Ward or unit leadership with staff management'
      },
      {
        level: 'Nurse Practitioner/Specialist',
        requirements: ['Master\'s degree', 'Advanced clinical skills', 'Prescribing qualification'],
        duration: '8-12 years',
        description: 'Advanced practice with independent decision-making'
      },
      {
        level: 'Matron/Nurse Manager',
        requirements: ['Management qualifications', 'Budget management', 'Strategic planning'],
        duration: '10+ years',
        description: 'Senior management and strategic nursing leadership'
      }
    ],
    qualifications: [
      'Bachelor\'s degree in Nursing or Nursing Diploma',
      'Professional nursing registration',
      'CPR and Basic Life Support certification',
      'Specialist certifications (ICU, Emergency, etc.)',
      'Management and leadership courses'
    ],
    certifications: ['BLS', 'ACLS', 'PALS', 'Specialty certifications']
  },

  'doctor': {
    title: 'Medical Doctor Career Pathway',
    description: 'Medical career pathway with extensive education and training requirements',
    stages: [
      {
        level: 'Pre-Medical',
        requirements: ['Bachelor\'s degree with science prerequisites', 'MCAT exam', 'Healthcare experience'],
        duration: '4 years',
        description: 'Undergraduate education with medical school preparation'
      },
      {
        level: 'Medical School',
        requirements: ['Medical degree (MBBS/MD)', 'Clinical rotations', 'Medical licensing exams'],
        duration: '4-6 years',
        description: 'Comprehensive medical education and clinical training'
      },
      {
        level: 'Resident',
        requirements: ['Medical license', 'Residency match', 'Specialty training'],
        duration: '3-7 years',
        description: 'Intensive specialty training under supervision'
      },
      {
        level: 'Fellow (Optional)',
        requirements: ['Board certification', 'Fellowship program', 'Subspecialty training'],
        duration: '1-3 years',
        description: 'Advanced subspecialty training'
      },
      {
        level: 'Attending Physician',
        requirements: ['Board certification', 'Hospital privileges', 'Continuing medical education'],
        duration: 'Career',
        description: 'Independent medical practice and patient care'
      },
      {
        level: 'Senior Consultant/Department Head',
        requirements: ['Extensive experience', 'Leadership training', 'Administrative skills'],
        duration: '15+ years',
        description: 'Medical leadership and departmental management'
      }
    ],
    qualifications: [
      'Bachelor\'s degree (science background preferred)',
      'Medical degree (MBBS/MD)',
      'Medical license',
      'Board certification in specialty',
      'Continuing medical education credits'
    ]
  },

  // Technology Roles
  'software_engineer': {
    title: 'Software Engineer Career Pathway',
    description: 'Technology career path with focus on software development',
    stages: [
      {
        level: 'Education/Self-Learning',
        requirements: ['Computer Science degree or equivalent', 'Programming language proficiency', 'Portfolio projects'],
        duration: '3-4 years or ongoing',
        description: 'Foundation in computer science and programming skills'
      },
      {
        level: 'Junior Developer',
        requirements: ['Programming skills', 'Version control (Git)', 'Basic algorithms knowledge'],
        duration: '1-2 years',
        description: 'Entry-level development with mentorship'
      },
      {
        level: 'Mid-Level Developer',
        requirements: ['Multiple programming languages', 'Database knowledge', 'Framework expertise'],
        duration: '2-4 years',
        description: 'Independent development and feature ownership'
      },
      {
        level: 'Senior Developer',
        requirements: ['System design skills', 'Mentoring ability', 'Architecture knowledge'],
        duration: '4-7 years',
        description: 'Technical leadership and complex problem solving'
      },
      {
        level: 'Technical Lead/Architect',
        requirements: ['Leadership skills', 'System architecture', 'Cross-team collaboration'],
        duration: '7-10 years',
        description: 'Technical strategy and team leadership'
      },
      {
        level: 'Engineering Manager/CTO',
        requirements: ['Management training', 'Strategic thinking', 'Business acumen'],
        duration: '10+ years',
        description: 'Engineering leadership and organizational strategy'
      }
    ],
    qualifications: [
      'Bachelor\'s degree in Computer Science or related field',
      'Programming certifications (optional)',
      'Cloud platform certifications',
      'Agile/Scrum certifications',
      'Technical leadership courses'
    ]
  },

  // Business/Finance Roles
  'financial_analyst': {
    title: 'Financial Analyst Career Pathway',
    description: 'Finance career focused on analysis and strategic planning',
    stages: [
      {
        level: 'Education',
        requirements: ['Bachelor\'s in Finance/Economics/Business', 'Accounting knowledge', 'Excel proficiency'],
        duration: '4 years',
        description: 'Foundation in financial principles and analysis'
      },
      {
        level: 'Junior Financial Analyst',
        requirements: ['Financial modeling skills', 'Industry knowledge', 'Certification study'],
        duration: '1-3 years',
        description: 'Basic financial analysis and reporting'
      },
      {
        level: 'Financial Analyst',
        requirements: ['CFA Level I or equivalent', 'Advanced Excel/modeling', 'Industry expertise'],
        duration: '2-4 years',
        description: 'Independent analysis and recommendations'
      },
      {
        level: 'Senior Financial Analyst',
        requirements: ['CFA progression', 'Leadership skills', 'Strategic thinking'],
        duration: '4-7 years',
        description: 'Complex analysis and team coordination'
      },
      {
        level: 'Finance Manager/Director',
        requirements: ['MBA or CFA charter', 'Management experience', 'Strategic planning'],
        duration: '7-12 years',
        description: 'Financial strategy and team leadership'
      },
      {
        level: 'CFO/Finance Executive',
        requirements: ['Executive experience', 'Board reporting', 'Organizational leadership'],
        duration: '15+ years',
        description: 'Financial leadership and corporate strategy'
      }
    ],
    qualifications: [
      'Bachelor\'s degree in Finance, Economics, or Business',
      'CFA (Chartered Financial Analyst) designation',
      'FRM (Financial Risk Manager) certification',
      'MBA (preferred for senior roles)',
      'Industry-specific certifications'
    ]
  }
};

// Function to analyze current education level
export function analyzeEducationLevel(education) {
  if (!education || !Array.isArray(education) || education.length === 0) {
    return {
      currentLevel: 'none',
      highestDegree: 'None',
      suggestedNextStep: 'Complete secondary education and consider bachelor\'s degree'
    };
  }

  const degreeHierarchy = {
    'gcse': 1,
    'o-level': 1,
    'a-level': 2,
    'btec-level-3': 2,
    'high-school-diploma': 2,
    'certificate': 2.5,
    'diploma': 3,
    'foundation-degree': 3.5,
    'associate-degree': 3.5,
    'higher-national-diploma': 4,
    'bachelors-degree': 5,
    'bachelor': 5,
    'graduate-certificate': 5.5,
    'postgraduate-certificate': 6,
    'masters-degree': 7,
    'master': 7,
    'mba': 7.5,
    'doctorate': 9,
    'phd': 9
  };

  let highestLevel = 0;
  let highestDegree = 'None';

  education.forEach(edu => {
    const degree = edu.degree?.toLowerCase() || '';
    
    // Check for degree keywords
    for (const [degreeType, level] of Object.entries(degreeHierarchy)) {
      if (degree.includes(degreeType)) {
        if (level > highestLevel) {
          highestLevel = level;
          highestDegree = edu.degree;
        }
      }
    }
  });

  // Determine current level and next step
  let currentLevel, suggestedNextStep;
  
  if (highestLevel === 0) {
    currentLevel = 'none';
    suggestedNextStep = 'Complete secondary education and consider bachelor\'s degree';
  } else if (highestLevel <= 2) {
    currentLevel = 'secondary';
    suggestedNextStep = 'Consider bachelor\'s degree or professional certification';
  } else if (highestLevel <= 4) {
    currentLevel = 'vocational';
    suggestedNextStep = 'Consider bachelor\'s degree for career advancement';
  } else if (highestLevel <= 5) {
    currentLevel = 'undergraduate';
    suggestedNextStep = 'Consider master\'s degree for specialization';
  } else if (highestLevel <= 7.5) {
    currentLevel = 'graduate';
    suggestedNextStep = 'Consider doctoral studies for academic/research careers';
  } else {
    currentLevel = 'doctoral';
    suggestedNextStep = 'Focus on publications, research, and career advancement';
  }

  return {
    currentLevel,
    highestDegree,
    suggestedNextStep,
    level: highestLevel
  };
}

// Function to get career pathway for a specific role
export function getCareerPathway(role, currentEducation, targetIndustry) {
  // Normalize role name
  const normalizedRole = role.toLowerCase().replace(/\s+/g, '_');
  
  // Try exact match first
  let pathway = CAREER_PATHWAYS[normalizedRole];
  
  // If no exact match, try partial matches
  if (!pathway) {
    for (const [pathwayKey, pathwayData] of Object.entries(CAREER_PATHWAYS)) {
      if (role.toLowerCase().includes(pathwayKey) || pathwayKey.includes(role.toLowerCase().split(' ')[0])) {
        pathway = pathwayData;
        break;
      }
    }
  }

  // If still no match, provide generic pathway based on industry
  if (!pathway) {
    pathway = getGenericPathway(targetIndustry, role);
  }

  // Analyze current position in pathway
  const educationAnalysis = analyzeEducationLevel(currentEducation);
  const currentStage = determineCurrentStage(pathway, educationAnalysis);
  
  return {
    ...pathway,
    currentStage,
    educationAnalysis,
    nextSteps: getNextSteps(pathway, currentStage, educationAnalysis)
  };
}

function getGenericPathway(industry, role) {
  const genericPathways = {
    'education': {
      title: `${role} Career Pathway`,
      description: 'Educational career path with focus on teaching and learning',
      stages: [
        {
          level: 'Education',
          requirements: ['Bachelor\'s degree in relevant subject', 'Teaching qualification'],
          duration: '3-4 years',
          description: 'Foundation education and pedagogical training'
        },
        {
          level: 'Entry Level',
          requirements: ['Professional qualification', 'Practical experience'],
          duration: '1-2 years',
          description: 'Initial professional experience with supervision'
        },
        {
          level: 'Qualified Professional',
          requirements: ['Professional development', 'Continuing education'],
          duration: '3-5 years',
          description: 'Independent practice and skill development'
        },
        {
          level: 'Senior Professional',
          requirements: ['Leadership training', 'Specialization'],
          duration: '5-10 years',
          description: 'Advanced skills and mentoring responsibilities'
        }
      ],
      qualifications: [
        'Bachelor\'s degree in relevant field',
        'Professional teaching qualification',
        'Continuing professional development'
      ]
    },
    'healthcare': {
      title: `${role} Career Pathway`,
      description: 'Healthcare career path with clinical focus',
      stages: [
        {
          level: 'Education',
          requirements: ['Healthcare degree/diploma', 'Clinical training'],
          duration: '3-4 years',
          description: 'Medical education and clinical skills'
        },
        {
          level: 'Registration',
          requirements: ['Professional registration', 'Basic certifications'],
          duration: '6-12 months',
          description: 'Professional qualification and initial practice'
        },
        {
          level: 'Qualified Practitioner',
          requirements: ['Continuing education', 'Specialty training'],
          duration: '2-5 years',
          description: 'Independent practice and specialization'
        },
        {
          level: 'Senior Practitioner',
          requirements: ['Advanced certifications', 'Leadership skills'],
          duration: '5-10 years',
          description: 'Advanced practice and team leadership'
        }
      ],
      qualifications: [
        'Healthcare degree or professional qualification',
        'Professional registration',
        'Clinical certifications',
        'Continuing professional development'
      ]
    },
    'technology': {
      title: `${role} Career Pathway`,
      description: 'Technology career path with technical expertise focus',
      stages: [
        {
          level: 'Education/Training',
          requirements: ['Technical degree or certification', 'Programming skills'],
          duration: '2-4 years',
          description: 'Technical foundation and practical skills'
        },
        {
          level: 'Junior Professional',
          requirements: ['Entry-level certifications', 'Portfolio projects'],
          duration: '1-2 years',
          description: 'Initial professional experience'
        },
        {
          level: 'Professional',
          requirements: ['Advanced certifications', 'Industry experience'],
          duration: '3-5 years',
          description: 'Independent work and technical expertise'
        },
        {
          level: 'Senior Professional',
          requirements: ['Leadership skills', 'System design experience'],
          duration: '5+ years',
          description: 'Technical leadership and mentoring'
        }
      ],
      qualifications: [
        'Computer Science degree or equivalent',
        'Programming certifications',
        'Cloud platform certifications',
        'Professional development courses'
      ]
    }
  };

  return genericPathways[industry] || genericPathways['technology']; // Default fallback
}

function determineCurrentStage(pathway, educationAnalysis) {
  const currentLevel = educationAnalysis.level;
  
  // Map education level to pathway stage
  if (currentLevel <= 2) {
    return 0; // Pre-professional/education stage
  } else if (currentLevel <= 5) {
    return 1; // Entry level/newly qualified
  } else if (currentLevel <= 7) {
    return 2; // Professional level
  } else {
    return Math.min(3, pathway.stages.length - 1); // Senior/advanced level
  }
}

function getNextSteps(pathway, currentStage, educationAnalysis) {
  const nextSteps = [];
  
  // Educational next steps
  if (educationAnalysis.suggestedNextStep !== 'Focus on publications, research, and career advancement') {
    nextSteps.push({
      type: 'education',
      title: 'Educational Advancement',
      description: educationAnalysis.suggestedNextStep,
      priority: 'high'
    });
  }

  // Career progression steps
  if (currentStage < pathway.stages.length - 1) {
    const nextStage = pathway.stages[currentStage + 1];
    nextSteps.push({
      type: 'career',
      title: `Progress to ${nextStage.level}`,
      description: `Requirements: ${nextStage.requirements.join(', ')}`,
      priority: 'medium'
    });
  }

  // Professional development
  nextSteps.push({
    type: 'professional',
    title: 'Professional Development',
    description: 'Continue with industry-relevant certifications and training',
    priority: 'medium'
  });

  return nextSteps;
} 