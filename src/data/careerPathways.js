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

  // Engineering Roles
  'aerospace_engineer': {
    title: 'Aerospace Engineer Career Pathway',
    description: 'Specialized engineering career in aircraft, spacecraft, and aerospace systems design',
    stages: [
      {
        level: 'Education',
        requirements: ['Bachelor\'s degree in Aerospace Engineering or related field', 'Strong mathematics and physics background', 'CAD software proficiency'],
        duration: '4 years',
        description: 'Foundation in aerodynamics, propulsion, materials, and spacecraft systems'
      },
      {
        level: 'Entry-Level Engineer',
        requirements: ['Engineering degree', 'FE exam (Fundamentals of Engineering)', 'Internship experience'],
        duration: '1-3 years',
        description: 'Junior engineer role with supervision and mentorship'
      },
      {
        level: 'Professional Engineer',
        requirements: ['4+ years experience', 'PE license (Professional Engineer)', 'Project experience'],
        duration: '4-8 years',
        description: 'Independent engineering practice and project leadership'
      },
      {
        level: 'Senior Engineer',
        requirements: ['Master\'s degree (preferred)', 'Specialized certifications', 'Leadership experience'],
        duration: '8-12 years',
        description: 'Complex system design and team leadership'
      },
      {
        level: 'Principal Engineer/Lead',
        requirements: ['Advanced degree or equivalent experience', 'Industry expertise', 'Cross-functional leadership'],
        duration: '12-20 years',
        description: 'Technical leadership and strategic planning'
      },
      {
        level: 'Chief Engineer/Director',
        requirements: ['Executive experience', 'Business acumen', 'Organizational leadership'],
        duration: '20+ years',
        description: 'Engineering strategy and organizational management'
      }
    ],
    qualifications: [
      'Bachelor\'s degree in Aerospace Engineering',
      'Master\'s degree in specialized area (recommended)',
      'Professional Engineer (PE) license',
      'FE exam certification',
      'Industry-specific certifications (NASA, FAA, etc.)',
      'Security clearance (for defense work)'
    ],
    certifications: ['PE License', 'FE Certification', 'CATIA/SolidWorks', 'Project Management', 'Six Sigma']
  },

  'civil_engineer': {
    title: 'Civil Engineer Career Pathway',
    description: 'Engineering career focused on infrastructure, construction, and public works',
    stages: [
      {
        level: 'Education',
        requirements: ['Bachelor\'s degree in Civil Engineering', 'ABET accreditation preferred', 'Mathematics and science foundation'],
        duration: '4 years',
        description: 'Structural analysis, hydraulics, geotechnical, and transportation engineering'
      },
      {
        level: 'Engineer-in-Training (EIT)',
        requirements: ['Engineering degree', 'FE exam passed', 'Entry-level position'],
        duration: '1-4 years',
        description: 'Supervised engineering work and professional development'
      },
      {
        level: 'Professional Engineer (PE)',
        requirements: ['4+ years experience', 'PE exam passed', 'Professional references'],
        duration: '4-10 years',
        description: 'Independent practice and design authority'
      },
      {
        level: 'Senior Civil Engineer',
        requirements: ['Project management experience', 'Specialized expertise', 'Client management'],
        duration: '10-15 years',
        description: 'Complex project leadership and technical oversight'
      },
      {
        level: 'Principal Engineer/Manager',
        requirements: ['Business development', 'Team leadership', 'Strategic planning'],
        duration: '15+ years',
        description: 'Practice leadership and organizational growth'
      }
    ],
    qualifications: [
      'Bachelor\'s degree in Civil Engineering (ABET accredited)',
      'Professional Engineer (PE) license',
      'Fundamentals of Engineering (FE) certification',
      'Specialized certifications (structural, environmental, etc.)',
      'Project management certification (PMP preferred)'
    ]
  },

  'mechanical_engineer': {
    title: 'Mechanical Engineer Career Pathway',
    description: 'Engineering career in mechanical systems, manufacturing, and product design',
    stages: [
      {
        level: 'Education',
        requirements: ['Bachelor\'s degree in Mechanical Engineering', 'Thermodynamics and mechanics coursework', 'CAD proficiency'],
        duration: '4 years',
        description: 'Mechanical systems design, manufacturing, and analysis'
      },
      {
        level: 'Associate Engineer',
        requirements: ['Engineering degree', 'FE exam', 'Manufacturing experience'],
        duration: '1-3 years',
        description: 'Product development and manufacturing support'
      },
      {
        level: 'Mechanical Engineer',
        requirements: ['Professional experience', 'Design software expertise', 'Project involvement'],
        duration: '3-7 years',
        description: 'Independent design and analysis work'
      },
      {
        level: 'Senior Engineer',
        requirements: ['PE license (preferred)', 'Leadership experience', 'Specialized knowledge'],
        duration: '7-12 years',
        description: 'Technical leadership and mentoring'
      },
      {
        level: 'Engineering Manager',
        requirements: ['Management training', 'Business understanding', 'Team leadership'],
        duration: '12+ years',
        description: 'Engineering team management and strategy'
      }
    ],
    qualifications: [
      'Bachelor\'s degree in Mechanical Engineering',
      'Professional Engineer (PE) license (industry dependent)',
      'CAD software certifications (SolidWorks, AutoCAD, etc.)',
      'Manufacturing and quality certifications',
      'Project management training'
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

  // Additional Healthcare Roles
  'pharmacist': {
    title: 'Pharmacist Career Pathway',
    description: 'Professional pharmacy career requiring extensive pharmaceutical education',
    stages: [
      {
        level: 'Pre-Pharmacy',
        requirements: ['Bachelor\'s degree with science prerequisites', 'PCAT exam', 'Pharmacy experience'],
        duration: '2-4 years',
        description: 'Undergraduate education with pharmacy school preparation'
      },
      {
        level: 'Pharmacy School',
        requirements: ['Doctor of Pharmacy (PharmD) degree', 'Clinical rotations', 'NAPLEX exam'],
        duration: '4 years',
        description: 'Comprehensive pharmaceutical education and clinical training'
      },
      {
        level: 'Pharmacy Resident (Optional)',
        requirements: ['PharmD degree', 'Residency match', 'Specialized training'],
        duration: '1-2 years',
        description: 'Advanced clinical training in specialized areas'
      },
      {
        level: 'Licensed Pharmacist',
        requirements: ['PharmD degree', 'State licensure', 'Continuing education'],
        duration: 'Career',
        description: 'Independent pharmacy practice and patient care'
      },
      {
        level: 'Clinical Specialist',
        requirements: ['Board certification', 'Specialized experience', 'Advanced training'],
        duration: '5+ years',
        description: 'Specialized clinical pharmacy practice'
      },
      {
        level: 'Pharmacy Manager/Director',
        requirements: ['Management experience', 'Business training', 'Leadership skills'],
        duration: '10+ years',
        description: 'Pharmacy operations and staff management'
      }
    ],
    qualifications: [
      'Doctor of Pharmacy (PharmD) degree',
      'State pharmacy license',
      'Board certifications (specialty dependent)',
      'Continuing education requirements',
      'Management training (for leadership roles)'
    ]
  },

  'veterinarian': {
    title: 'Veterinarian Career Pathway',
    description: 'Veterinary medicine career with animal healthcare focus',
    stages: [
      {
        level: 'Pre-Veterinary',
        requirements: ['Bachelor\'s degree with science prerequisites', 'GRE/VMCAS', 'Animal experience'],
        duration: '4 years',
        description: 'Undergraduate education with veterinary school preparation'
      },
      {
        level: 'Veterinary School',
        requirements: ['Doctor of Veterinary Medicine (DVM)', 'Clinical rotations', 'NAVLE exam'],
        duration: '4 years',
        description: 'Comprehensive veterinary education and clinical training'
      },
      {
        level: 'Veterinary Intern (Optional)',
        requirements: ['DVM degree', 'Internship match', 'Clinical experience'],
        duration: '1 year',
        description: 'Intensive clinical training and experience'
      },
      {
        level: 'Licensed Veterinarian',
        requirements: ['DVM degree', 'State licensure', 'Continuing education'],
        duration: 'Career',
        description: 'Independent veterinary practice and animal care'
      },
      {
        level: 'Board-Certified Specialist',
        requirements: ['Residency completion', 'Board examination', 'Specialized expertise'],
        duration: '3+ years post-DVM',
        description: 'Specialized veterinary practice in specific field'
      },
      {
        level: 'Practice Owner/Manager',
        requirements: ['Business training', 'Management experience', 'Financial planning'],
        duration: '8+ years',
        description: 'Veterinary practice ownership and management'
      }
    ],
    qualifications: [
      'Doctor of Veterinary Medicine (DVM) degree',
      'State veterinary license',
      'Board certifications (specialty dependent)',
      'Continuing education requirements',
      'Business management training (for ownership)'
    ]
  },

  // Legal Profession
  'lawyer': {
    title: 'Lawyer Career Pathway',
    description: 'Legal profession requiring law degree and bar admission',
    stages: [
      {
        level: 'Undergraduate',
        requirements: ['Bachelor\'s degree (any field)', 'Strong GPA', 'LSAT preparation'],
        duration: '4 years',
        description: 'Undergraduate education and law school preparation'
      },
      {
        level: 'Law School',
        requirements: ['Juris Doctor (JD) degree', 'Law clinic experience', 'Bar exam preparation'],
        duration: '3 years',
        description: 'Legal education and practical training'
      },
      {
        level: 'Associate Attorney',
        requirements: ['JD degree', 'Bar admission', 'Law firm experience'],
        duration: '1-8 years',
        description: 'Junior attorney role with supervision and mentorship'
      },
      {
        level: 'Senior Associate',
        requirements: ['Specialization development', 'Client management', 'Business development'],
        duration: '6-10 years',
        description: 'Advanced legal practice and client responsibility'
      },
      {
        level: 'Partner/Principal',
        requirements: ['Book of business', 'Leadership skills', 'Firm contribution'],
        duration: '10+ years',
        description: 'Firm ownership and strategic leadership'
      },
      {
        level: 'Senior Partner/Managing Partner',
        requirements: ['Extensive experience', 'Firm management', 'Industry recognition'],
        duration: '15+ years',
        description: 'Firm leadership and strategic direction'
      }
    ],
    qualifications: [
      'Bachelor\'s degree (any field)',
      'Juris Doctor (JD) degree',
      'Bar admission in practice jurisdiction',
      'Continuing legal education (CLE)',
      'Specialization certifications (optional)'
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