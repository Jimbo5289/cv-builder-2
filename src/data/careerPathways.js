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

  'software-developer': {
    title: 'Software Developer Career Pathway',
    description: 'Software development career with programming focus',
    stages: [
      {
        level: 'Education/Training',
        requirements: ['Programming bootcamp or CS degree', 'Portfolio development', 'Technical skills'],
        duration: '3-12 months',
        description: 'Foundation programming and development skills'
      },
      {
        level: 'Junior Developer',
        requirements: ['Programming language proficiency', 'Git/version control', 'Basic web development'],
        duration: '1-2 years',
        description: 'Entry-level coding with mentorship'
      },
      {
        level: 'Developer',
        requirements: ['Multiple frameworks', 'Database skills', 'Testing knowledge'],
        duration: '2-4 years',
        description: 'Independent feature development'
      },
      {
        level: 'Senior Developer',
        requirements: ['Architecture design', 'Code review skills', 'Mentoring ability'],
        duration: '4-7 years',
        description: 'Technical leadership and complex systems'
      },
      {
        level: 'Lead Developer',
        requirements: ['Team leadership', 'Project management', 'Technical strategy'],
        duration: '7+ years',
        description: 'Development team leadership'
      }
    ],
    qualifications: [
      'Programming certifications',
      'Computer Science degree (preferred)',
      'Framework certifications',
      'Cloud platform knowledge'
    ]
  },

  'data-scientist': {
    title: 'Data Scientist Career Pathway', 
    description: 'Data science career combining statistics, programming, and domain expertise',
    stages: [
      {
        level: 'Education',
        requirements: ['Statistics/Math/CS degree', 'Python/R proficiency', 'SQL knowledge'],
        duration: '4 years',
        description: 'Foundation in mathematics, statistics, and programming'
      },
      {
        level: 'Junior Data Scientist',
        requirements: ['Machine learning basics', 'Data visualization', 'Business understanding'],
        duration: '1-2 years',
        description: 'Entry-level analysis with supervision'
      },
      {
        level: 'Data Scientist',
        requirements: ['Advanced ML algorithms', 'Model deployment', 'Statistical analysis'],
        duration: '2-4 years',
        description: 'Independent analysis and modeling'
      },
      {
        level: 'Senior Data Scientist',
        requirements: ['Deep learning expertise', 'Research skills', 'Cross-functional leadership'],
        duration: '4-7 years',
        description: 'Complex modeling and team guidance'
      },
      {
        level: 'Principal Data Scientist',
        requirements: ['Strategic thinking', 'Research leadership', 'Business impact'],
        duration: '7+ years',
        description: 'Data science strategy and innovation'
      }
    ],
    qualifications: [
      'Master\'s/PhD in quantitative field',
      'Machine learning certifications',
      'Cloud platform certifications (AWS/GCP/Azure)',
      'Programming certifications (Python/R)'
    ]
  },

  'network-engineer': {
    title: 'Network Engineer Career Pathway',
    description: 'Network infrastructure and security career path',
    stages: [
      {
        level: 'Education/Training',
        requirements: ['IT degree or certifications', 'Networking fundamentals', 'Lab experience'],
        duration: '1-2 years',
        description: 'Foundation in networking concepts and protocols'
      },
      {
        level: 'Junior Network Technician',
        requirements: ['CompTIA Network+', 'Basic troubleshooting', 'Help desk experience'],
        duration: '1-2 years',
        description: 'Entry-level network support and maintenance'
      },
      {
        level: 'Network Engineer',
        requirements: ['Cisco CCNA', 'Network design', 'Security basics'],
        duration: '2-4 years',
        description: 'Network implementation and management'
      },
      {
        level: 'Senior Network Engineer',
        requirements: ['CCNP or equivalent', 'Complex troubleshooting', 'Project leadership'],
        duration: '4-7 years',
        description: 'Advanced network design and optimization'
      },
      {
        level: 'Network Architect',
        requirements: ['CCIE or equivalent', 'Strategic planning', 'Vendor management'],
        duration: '7+ years',
        description: 'Enterprise network strategy and architecture'
      }
    ],
    qualifications: [
      'CompTIA Network+ certification',
      'Cisco CCNA/CCNP/CCIE certifications',
      'Security certifications (Security+, CISSP)',
      'Cloud networking certifications'
    ]
  },

  'product-manager': {
    title: 'Product Manager Career Pathway',
    description: 'Product management career bridging technology and business',
    stages: [
      {
        level: 'Education/Training',
        requirements: ['Business/Technical degree', 'Product management courses', 'Market research skills'],
        duration: '4 years',
        description: 'Foundation in business, technology, and user experience'
      },
      {
        level: 'Associate Product Manager',
        requirements: ['Product analytics', 'User research', 'Agile methodology'],
        duration: '1-2 years',
        description: 'Entry-level product support and feature planning'
      },
      {
        level: 'Product Manager',
        requirements: ['Roadmap planning', 'Stakeholder management', 'Data analysis'],
        duration: '2-4 years',
        description: 'Product strategy and feature delivery'
      },
      {
        level: 'Senior Product Manager',
        requirements: ['Go-to-market strategy', 'Team leadership', 'P&L responsibility'],
        duration: '4-7 years',
        description: 'Product line management and strategic planning'
      },
      {
        level: 'Director of Product',
        requirements: ['Portfolio management', 'Executive communication', 'Vision setting'],
        duration: '7+ years',
        description: 'Product organization leadership'
      }
    ],
    qualifications: [
      'MBA or relevant degree',
      'Product management certifications',
      'Agile/Scrum certifications',
      'Analytics certifications'
    ]
  },

  'cybersecurity-analyst': {
    title: 'Cybersecurity Analyst Career Pathway',
    description: 'Information security and threat analysis career',
    stages: [
      {
        level: 'Education/Training',
        requirements: ['IT/Security degree or certifications', 'Security fundamentals', 'Networking knowledge'],
        duration: '1-2 years',
        description: 'Foundation in cybersecurity principles and technologies'
      },
      {
        level: 'Junior Security Analyst',
        requirements: ['Security+ certification', 'Incident response', 'Security tools'],
        duration: '1-2 years',
        description: 'Entry-level security monitoring and analysis'
      },
      {
        level: 'Security Analyst',
        requirements: ['Threat analysis', 'Vulnerability assessment', 'Security frameworks'],
        duration: '2-4 years',
        description: 'Independent security analysis and response'
      },
      {
        level: 'Senior Security Analyst',
        requirements: ['Advanced certifications', 'Security architecture', 'Team leadership'],
        duration: '4-7 years',
        description: 'Complex security projects and mentoring'
      },
      {
        level: 'Security Architect/CISO',
        requirements: ['CISSP or equivalent', 'Business alignment', 'Strategic planning'],
        duration: '7+ years',
        description: 'Enterprise security strategy and governance'
      }
    ],
    qualifications: [
      'CompTIA Security+ certification',
      'CISSP (Certified Information Systems Security Professional)',
      'CEH (Certified Ethical Hacker)',
      'CISM (Certified Information Security Manager)'
    ]
  },

  'devops-engineer': {
    title: 'DevOps Engineer Career Pathway',
    description: 'Development operations and automation career',
    stages: [
      {
        level: 'Education/Training',
        requirements: ['IT/CS degree or experience', 'Linux/scripting', 'Cloud basics'],
        duration: '1-2 years',
        description: 'Foundation in systems administration and development'
      },
      {
        level: 'Junior DevOps Engineer',
        requirements: ['CI/CD basics', 'Docker/containers', 'Version control'],
        duration: '1-2 years',
        description: 'Entry-level automation and deployment'
      },
      {
        level: 'DevOps Engineer',
        requirements: ['Infrastructure as Code', 'Monitoring/logging', 'Cloud platforms'],
        duration: '2-4 years',
        description: 'Full pipeline automation and management'
      },
      {
        level: 'Senior DevOps Engineer',
        requirements: ['Kubernetes/orchestration', 'Security integration', 'Performance optimization'],
        duration: '4-7 years',
        description: 'Complex infrastructure and optimization'
      },
      {
        level: 'DevOps Architect/Lead',
        requirements: ['Platform strategy', 'Team leadership', 'Enterprise architecture'],
        duration: '7+ years',
        description: 'DevOps strategy and organizational transformation'
      }
    ],
    qualifications: [
      'Cloud certifications (AWS/Azure/GCP)',
      'Docker/Kubernetes certifications',
      'Linux certifications',
      'Automation tool certifications'
    ]
  },

  'ui-ux-designer': {
    title: 'UI/UX Designer Career Pathway',
    description: 'User experience and interface design career',
    stages: [
      {
        level: 'Education/Training',
        requirements: ['Design degree or portfolio', 'Design tools proficiency', 'User research basics'],
        duration: '2-4 years',
        description: 'Foundation in design principles and user experience'
      },
      {
        level: 'Junior UI/UX Designer',
        requirements: ['Wireframing/prototyping', 'User testing', 'Design systems'],
        duration: '1-2 years',
        description: 'Entry-level design work with mentorship'
      },
      {
        level: 'UI/UX Designer',
        requirements: ['Advanced prototyping', 'User research', 'Cross-functional collaboration'],
        duration: '2-4 years',
        description: 'Independent design projects and user research'
      },
      {
        level: 'Senior UI/UX Designer',
        requirements: ['Design strategy', 'Team leadership', 'Business impact measurement'],
        duration: '4-7 years',
        description: 'Design leadership and strategic thinking'
      },
      {
        level: 'Design Lead/Director',
        requirements: ['Team management', 'Design vision', 'Stakeholder alignment'],
        duration: '7+ years',
        description: 'Design organization leadership'
      }
    ],
    qualifications: [
      'Design degree or equivalent portfolio',
      'UX certifications (Google UX, Nielsen Norman)',
      'Design tool certifications (Figma, Adobe)',
      'User research certifications'
    ]
  },

  'cloud-architect': {
    title: 'Cloud Architect Career Pathway',
    description: 'Cloud infrastructure and strategy career path',
    stages: [
      {
        level: 'Education/Training',
        requirements: ['IT/CS degree', 'Cloud fundamentals', 'Networking knowledge'],
        duration: '4 years',
        description: 'Foundation in IT infrastructure and cloud concepts'
      },
      {
        level: 'Cloud Engineer',
        requirements: ['Cloud certifications', 'Infrastructure automation', 'DevOps practices'],
        duration: '2-3 years',
        description: 'Cloud implementation and management'
      },
      {
        level: 'Cloud Solutions Architect',
        requirements: ['Advanced cloud certifications', 'Solution design', 'Cost optimization'],
        duration: '3-5 years',
        description: 'Cloud solution design and implementation'
      },
      {
        level: 'Senior Cloud Architect',
        requirements: ['Multi-cloud expertise', 'Security architecture', 'Enterprise patterns'],
        duration: '5-8 years',
        description: 'Complex cloud architecture and governance'
      },
      {
        level: 'Principal Cloud Architect',
        requirements: ['Strategic planning', 'Technology leadership', 'Organization transformation'],
        duration: '8+ years',
        description: 'Cloud strategy and organizational transformation'
      }
    ],
    qualifications: [
      'Cloud platform certifications (AWS Solutions Architect, Azure Architect)',
      'Security certifications',
      'DevOps certifications',
      'Enterprise architecture certifications'
    ]
  },

  'electrical-engineer': {
    title: 'Electrical Engineer Career Pathway',
    description: 'Electrical systems design and power engineering career',
    stages: [
      {
        level: 'Education',
        requirements: ['Bachelor\'s in Electrical Engineering', 'ABET accreditation', 'Circuit design fundamentals'],
        duration: '4 years',
        description: 'Foundation in electrical theory, circuits, and power systems'
      },
      {
        level: 'Engineer-in-Training (EIT)',
        requirements: ['EE degree', 'FE exam passed', 'Entry-level position'],
        duration: '1-4 years',
        description: 'Supervised electrical design work and professional development'
      },
      {
        level: 'Professional Engineer (PE)',
        requirements: ['4+ years experience', 'PE exam passed', 'Design authority'],
        duration: '4-8 years',
        description: 'Independent electrical design and system planning'
      },
      {
        level: 'Senior Electrical Engineer',
        requirements: ['Project leadership', 'Power systems expertise', 'Team management'],
        duration: '8-12 years',
        description: 'Complex electrical projects and technical leadership'
      },
      {
        level: 'Principal Engineer/Manager',
        requirements: ['Business development', 'Strategic planning', 'Department leadership'],
        duration: '12+ years',
        description: 'Engineering practice leadership and growth'
      }
    ],
    qualifications: [
      'Bachelor\'s degree in Electrical Engineering (ABET accredited)',
      'Professional Engineer (PE) license',
      'IEEE certifications',
      'Power systems certifications',
      'Project management certification'
    ]
  },

  'chemical-engineer': {
    title: 'Chemical Engineer Career Pathway',
    description: 'Chemical process design and manufacturing engineering',
    stages: [
      {
        level: 'Education',
        requirements: ['Bachelor\'s in Chemical Engineering', 'Process design fundamentals', 'Chemistry knowledge'],
        duration: '4 years',
        description: 'Foundation in chemical processes, thermodynamics, and mass transfer'
      },
      {
        level: 'Process Engineer',
        requirements: ['ChE degree', 'Process simulation software', 'Safety protocols'],
        duration: '1-3 years',
        description: 'Process optimization and plant support'
      },
      {
        level: 'Chemical Engineer',
        requirements: ['Process design experience', 'Plant operations', 'Environmental compliance'],
        duration: '3-6 years',
        description: 'Independent process design and improvement'
      },
      {
        level: 'Senior Chemical Engineer',
        requirements: ['Project management', 'Cost optimization', 'Team leadership'],
        duration: '6-10 years',
        description: 'Major project leadership and process innovation'
      },
      {
        level: 'Engineering Manager/Director',
        requirements: ['Business planning', 'Strategic thinking', 'Operations management'],
        duration: '10+ years',
        description: 'Engineering organization leadership'
      }
    ],
    qualifications: [
      'Bachelor\'s degree in Chemical Engineering',
      'Professional Engineer (PE) license (preferred)',
      'Process safety certifications',
      'Six Sigma certifications',
      'Management training'
    ]
  },

  'industrial-engineer': {
    title: 'Industrial Engineer Career Pathway',
    description: 'Process optimization and manufacturing efficiency career',
    stages: [
      {
        level: 'Education',
        requirements: ['Bachelor\'s in Industrial Engineering', 'Statistics knowledge', 'Operations research'],
        duration: '4 years',
        description: 'Foundation in process optimization and systems analysis'
      },
      {
        level: 'Process Improvement Engineer',
        requirements: ['IE degree', 'Lean manufacturing', 'Data analysis skills'],
        duration: '1-3 years',
        description: 'Process analysis and efficiency improvements'
      },
      {
        level: 'Industrial Engineer',
        requirements: ['Six Sigma certification', 'Project management', 'Cost analysis'],
        duration: '3-6 years',
        description: 'Independent process design and optimization'
      },
      {
        level: 'Senior Industrial Engineer',
        requirements: ['Advanced lean methods', 'Change management', 'Team leadership'],
        duration: '6-10 years',
        description: 'Complex process transformation and leadership'
      },
      {
        level: 'Operations Manager/Director',
        requirements: ['Business strategy', 'Operations planning', 'Organizational leadership'],
        duration: '10+ years',
        description: 'Operations strategy and organizational improvement'
      }
    ],
    qualifications: [
      'Bachelor\'s degree in Industrial Engineering',
      'Six Sigma Black Belt certification',
      'Lean manufacturing certifications',
      'Project management certification (PMP)',
      'Operations management training'
    ]
  },

  'manufacturing-manager': {
    title: 'Manufacturing Manager Career Pathway',
    description: 'Manufacturing operations and production management',
    stages: [
      {
        level: 'Education/Training',
        requirements: ['Engineering/Business degree', 'Manufacturing knowledge', 'Leadership training'],
        duration: '4 years',
        description: 'Foundation in manufacturing processes and management'
      },
      {
        level: 'Production Supervisor',
        requirements: ['Manufacturing experience', 'Safety training', 'Team leadership'],
        duration: '2-4 years',
        description: 'Shop floor supervision and team management'
      },
      {
        level: 'Operations Manager',
        requirements: ['Process improvement', 'Budget management', 'Quality systems'],
        duration: '4-7 years',
        description: 'Manufacturing operations and process optimization'
      },
      {
        level: 'Manufacturing Manager',
        requirements: ['Strategic planning', 'Cost control', 'Supply chain management'],
        duration: '7-12 years',
        description: 'Manufacturing strategy and organizational leadership'
      },
      {
        level: 'Plant Manager/Director',
        requirements: ['P&L responsibility', 'Business strategy', 'Executive leadership'],
        duration: '12+ years',
        description: 'Manufacturing facility leadership and business results'
      }
    ],
    qualifications: [
      'Engineering or Business degree',
      'Manufacturing management certifications',
      'Lean/Six Sigma certifications',
      'Safety management training',
      'Executive leadership programs'
    ]
  },

  'quality-assurance': {
    title: 'Quality Assurance Engineer Career Pathway',
    description: 'Quality systems and process improvement career',
    stages: [
      {
        level: 'Education/Training',
        requirements: ['Engineering degree', 'Quality fundamentals', 'Statistical analysis'],
        duration: '4 years',
        description: 'Foundation in quality principles and statistical methods'
      },
      {
        level: 'Quality Technician',
        requirements: ['Quality training', 'Inspection methods', 'Documentation skills'],
        duration: '1-2 years',
        description: 'Quality testing and inspection support'
      },
      {
        level: 'Quality Engineer',
        requirements: ['Statistical process control', 'Quality standards', 'Problem solving'],
        duration: '2-5 years',
        description: 'Quality system design and process improvement'
      },
      {
        level: 'Senior Quality Engineer',
        requirements: ['Advanced quality methods', 'Team leadership', 'Supplier quality'],
        duration: '5-8 years',
        description: 'Complex quality projects and team leadership'
      },
      {
        level: 'Quality Manager/Director',
        requirements: ['Quality strategy', 'Organizational leadership', 'Business alignment'],
        duration: '8+ years',
        description: 'Quality organization leadership and strategy'
      }
    ],
    qualifications: [
      'Engineering degree',
      'ASQ Quality Engineer certification',
      'Six Sigma Black Belt',
      'ISO 9001 Lead Auditor',
      'Quality management training'
    ]
  },

  // Additional Healthcare Roles
  'physician': {
    title: 'Physician Career Pathway',
    description: 'Medical doctor career with comprehensive patient care focus',
    stages: [
      {
        level: 'Pre-Medical Education',
        requirements: ['Bachelor\'s degree', 'MCAT exam', 'Medical school prerequisites'],
        duration: '4 years',
        description: 'Undergraduate education with medical school preparation'
      },
      {
        level: 'Medical School',
        requirements: ['Medical degree (MD/DO)', 'Clinical rotations', 'USMLE exams'],
        duration: '4 years',
        description: 'Comprehensive medical education and clinical training'
      },
      {
        level: 'Residency',
        requirements: ['Medical license', 'Specialty training', 'Board preparation'],
        duration: '3-7 years',
        description: 'Intensive specialty training under supervision'
      },
      {
        level: 'Fellowship (Optional)',
        requirements: ['Board certification', 'Subspecialty training', 'Research experience'],
        duration: '1-3 years',
        description: 'Advanced subspecialty training'
      },
      {
        level: 'Attending Physician',
        requirements: ['Board certification', 'Medical license', 'Hospital privileges'],
        duration: 'Career',
        description: 'Independent medical practice and patient care'
      },
      {
        level: 'Senior Physician/Department Chief',
        requirements: ['Clinical excellence', 'Leadership training', 'Administrative skills'],
        duration: '15+ years',
        description: 'Medical leadership and departmental management'
      }
    ],
    qualifications: [
      'Medical degree (MD or DO)',
      'Medical license',
      'Board certification in specialty',
      'DEA registration',
      'Continuing medical education'
    ]
  },

  'medical-technician': {
    title: 'Medical Technician Career Pathway',
    description: 'Medical laboratory and diagnostic technology career',
    stages: [
      {
        level: 'Education/Training',
        requirements: ['Medical technology degree/diploma', 'Laboratory training', 'Certification prep'],
        duration: '2-4 years',
        description: 'Foundation in medical laboratory procedures'
      },
      {
        level: 'Entry-Level Medical Technician',
        requirements: ['Professional certification', 'Laboratory experience', 'Quality protocols'],
        duration: '1-2 years',
        description: 'Basic laboratory testing and analysis'
      },
      {
        level: 'Medical Technician',
        requirements: ['Specialized testing', 'Equipment operation', 'Quality assurance'],
        duration: '2-5 years',
        description: 'Independent laboratory operations'
      },
      {
        level: 'Senior Medical Technician',
        requirements: ['Advanced testing', 'Training responsibility', 'Quality leadership'],
        duration: '5-8 years',
        description: 'Complex testing and team supervision'
      },
      {
        level: 'Laboratory Supervisor/Manager',
        requirements: ['Management training', 'Laboratory compliance', 'Staff leadership'],
        duration: '8+ years',
        description: 'Laboratory management and operations'
      }
    ],
    qualifications: [
      'Medical technology degree or certificate',
      'Professional certification (MT, MLT)',
      'Laboratory quality certifications',
      'Specialized testing certifications'
    ]
  },

  'healthcare-admin': {
    title: 'Healthcare Administrator Career Pathway',
    description: 'Healthcare management and administration career',
    stages: [
      {
        level: 'Education',
        requirements: ['Healthcare administration degree', 'Business knowledge', 'Healthcare systems'],
        duration: '4 years',
        description: 'Foundation in healthcare management and policy'
      },
      {
        level: 'Administrative Assistant',
        requirements: ['Healthcare experience', 'Administrative skills', 'Healthcare regulations'],
        duration: '1-2 years',
        description: 'Entry-level healthcare administration support'
      },
      {
        level: 'Healthcare Coordinator',
        requirements: ['Project management', 'Healthcare operations', 'Compliance knowledge'],
        duration: '2-4 years',
        description: 'Healthcare program coordination and management'
      },
      {
        level: 'Healthcare Manager',
        requirements: ['Department management', 'Budget responsibility', 'Staff leadership'],
        duration: '4-7 years',
        description: 'Healthcare department or service management'
      },
      {
        level: 'Healthcare Administrator/Executive',
        requirements: ['Strategic planning', 'Executive leadership', 'Healthcare policy'],
        duration: '7+ years',
        description: 'Healthcare organization leadership'
      }
    ],
    qualifications: [
      'Bachelor\'s in Healthcare Administration',
      'Master\'s in Healthcare Administration (MHA)',
      'Healthcare management certifications',
      'Healthcare compliance training'
    ]
  },

  'physical-therapist': {
    title: 'Physical Therapist Career Pathway',
    description: 'Physical therapy and rehabilitation career',
    stages: [
      {
        level: 'Pre-Professional Education',
        requirements: ['Bachelor\'s degree', 'PT prerequisites', 'Clinical observation'],
        duration: '4 years',
        description: 'Undergraduate preparation for PT school'
      },
      {
        level: 'Physical Therapy School',
        requirements: ['Doctor of Physical Therapy (DPT)', 'Clinical rotations', 'NPTE exam'],
        duration: '3 years',
        description: 'Professional physical therapy education'
      },
      {
        level: 'Licensed Physical Therapist',
        requirements: ['PT license', 'Entry-level practice', 'Continuing education'],
        duration: '1-3 years',
        description: 'Independent physical therapy practice'
      },
      {
        level: 'Experienced Physical Therapist',
        requirements: ['Specialized training', 'Clinical expertise', 'Patient outcomes'],
        duration: '3-7 years',
        description: 'Advanced clinical skills and specialization'
      },
      {
        level: 'Clinical Specialist/Manager',
        requirements: ['Board certification', 'Leadership skills', 'Clinical mentoring'],
        duration: '7+ years',
        description: 'Clinical leadership and specialty practice'
      }
    ],
    qualifications: [
      'Doctor of Physical Therapy (DPT) degree',
      'Physical therapy license',
      'Board certifications (optional specialties)',
      'Continuing education requirements'
    ]
  },

  'nutritionist': {
    title: 'Nutritionist/Dietitian Career Pathway',
    description: 'Nutrition science and dietary counseling career',
    stages: [
      {
        level: 'Education',
        requirements: ['Nutrition/Dietetics degree', 'Science coursework', 'Internship preparation'],
        duration: '4 years',
        description: 'Foundation in nutrition science and dietetics'
      },
      {
        level: 'Dietetic Internship',
        requirements: ['Accredited internship', 'Clinical rotations', 'Community nutrition'],
        duration: '6-12 months',
        description: 'Supervised practice in various nutrition settings'
      },
      {
        level: 'Registered Dietitian',
        requirements: ['RD credential', 'Professional practice', 'Continuing education'],
        duration: '1-3 years',
        description: 'Independent nutrition counseling and education'
      },
      {
        level: 'Experienced Dietitian',
        requirements: ['Specialized practice', 'Clinical expertise', 'Professional development'],
        duration: '3-7 years',
        description: 'Advanced nutrition practice and specialization'
      },
      {
        level: 'Clinical Nutrition Manager',
        requirements: ['Management training', 'Program development', 'Team leadership'],
        duration: '7+ years',
        description: 'Nutrition program management and leadership'
      }
    ],
    qualifications: [
      'Bachelor\'s in Nutrition or Dietetics',
      'Registered Dietitian (RD) credential',
      'State licensure (where required)',
      'Specialty certifications'
    ]
  },

  'mental-health': {
    title: 'Mental Health Professional Career Pathway',
    description: 'Mental health counseling and therapy career',
    stages: [
      {
        level: 'Education',
        requirements: ['Psychology/Counseling degree', 'Mental health coursework', 'Research experience'],
        duration: '4 years',
        description: 'Foundation in psychology and mental health principles'
      },
      {
        level: 'Graduate Education',
        requirements: ['Master\'s in Counseling/Psychology', 'Clinical training', 'Practicum experience'],
        duration: '2-3 years',
        description: 'Advanced mental health education and supervised practice'
      },
      {
        level: 'Clinical Intern/Trainee',
        requirements: ['Supervised clinical hours', 'Therapy techniques', 'Documentation skills'],
        duration: '1-2 years',
        description: 'Supervised clinical practice and skill development'
      },
      {
        level: 'Licensed Mental Health Counselor',
        requirements: ['Professional licensure', 'Independent practice', 'Continuing education'],
        duration: '2-5 years',
        description: 'Independent mental health counseling practice'
      },
      {
        level: 'Senior Therapist/Clinical Supervisor',
        requirements: ['Advanced certifications', 'Supervision training', 'Specialized expertise'],
        duration: '5+ years',
        description: 'Advanced practice and clinical supervision'
      }
    ],
    qualifications: [
      'Master\'s in Counseling/Clinical Psychology',
      'Professional licensure (LPC, LMFT, etc.)',
      'Specialized therapy certifications',
      'Continuing education requirements'
    ]
  },

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
  },

  // Construction Industry Pathways
  'carpenter': {
    title: 'Carpenter Career Pathway',
    description: 'Woodworking and construction carpentry career from apprentice to management',
    stages: [
      {
        level: 'Education/Apprenticeship',
        requirements: ['Construction apprenticeship program', 'Basic woodworking skills', 'Safety training'],
        duration: '2-4 years',
        description: 'Apprenticeship training with experienced carpenter'
      },
      {
        level: 'Journeyman Carpenter',
        requirements: ['Completed apprenticeship', 'Trade certification', 'Tool proficiency'],
        duration: '2-5 years',
        description: 'Independent carpentry work on various projects'
      },
      {
        level: 'Skilled Carpenter/Specialist',
        requirements: ['Specialized training (framing, finishing, etc.)', 'Advanced techniques', 'Quality craftsmanship'],
        duration: '5-8 years',
        description: 'Specialized carpentry and complex project work'
      },
      {
        level: 'Lead Carpenter/Foreman',
        requirements: ['Leadership training', 'Project coordination', 'Team supervision'],
        duration: '8-12 years',
        description: 'Team leadership and project oversight'
      },
      {
        level: 'Construction Supervisor/Manager',
        requirements: ['Management certification', 'Business skills', 'Contract knowledge'],
        duration: '12+ years',
        description: 'Construction project management and business operations'
      }
    ],
    qualifications: [
      'Construction apprenticeship completion',
      'Trade certification/license',
      'OSHA safety certifications',
      'First aid/CPR certification',
      'Construction management training'
    ]
  },

  'electrician': {
    title: 'Electrician Career Pathway',
    description: 'Electrical trade career from apprentice to electrical contractor',
    stages: [
      {
        level: 'Education/Apprenticeship',
        requirements: ['Electrical apprenticeship program', 'Basic electrical theory', 'Code knowledge'],
        duration: '4 years',
        description: 'Formal electrical training and supervised work experience'
      },
      {
        level: 'Journeyman Electrician',
        requirements: ['Apprenticeship completion', 'Journeyman license', 'Code compliance'],
        duration: '2-4 years',
        description: 'Independent electrical work under master electrician'
      },
      {
        level: 'Master Electrician',
        requirements: ['Additional experience', 'Master electrician exam', 'Advanced electrical knowledge'],
        duration: '4-6 years',
        description: 'Complex electrical systems and supervision authority'
      },
      {
        level: 'Electrical Supervisor/Foreman',
        requirements: ['Leadership skills', 'Project management', 'Team coordination'],
        duration: '6-10 years',
        description: 'Electrical crew leadership and project oversight'
      },
      {
        level: 'Electrical Contractor/Manager',
        requirements: ['Contractor license', 'Business management', 'Bidding and estimating'],
        duration: '10+ years',
        description: 'Electrical contracting business and operations management'
      }
    ],
    qualifications: [
      'Electrical apprenticeship (4 years)',
      'Journeyman electrician license',
      'Master electrician license',
      'Electrical contractor license',
      'OSHA electrical safety certifications',
      'Continuing education requirements'
    ]
  },

  'plumber': {
    title: 'Plumber Career Pathway',
    description: 'Plumbing trade career from apprentice to mechanical contractor',
    stages: [
      {
        level: 'Education/Apprenticeship',
        requirements: ['Plumbing apprenticeship program', 'Pipe fitting basics', 'Code knowledge'],
        duration: '4-5 years',
        description: 'Plumbing fundamentals and hands-on training'
      },
      {
        level: 'Journeyman Plumber',
        requirements: ['Apprenticeship completion', 'Journeyman license', 'System installation'],
        duration: '2-4 years',
        description: 'Independent plumbing work and system maintenance'
      },
      {
        level: 'Master Plumber',
        requirements: ['Advanced experience', 'Master plumber exam', 'Complex systems knowledge'],
        duration: '4-6 years',
        description: 'Advanced plumbing systems and supervision'
      },
      {
        level: 'Plumbing Supervisor/Foreman',
        requirements: ['Team leadership', 'Project coordination', 'Quality control'],
        duration: '6-10 years',
        description: 'Plumbing crew management and project oversight'
      },
      {
        level: 'Plumbing Contractor/Manager',
        requirements: ['Contractor license', 'Business operations', 'Customer relations'],
        duration: '10+ years',
        description: 'Plumbing contracting business and operations'
      }
    ],
    qualifications: [
      'Plumbing apprenticeship (4-5 years)',
      'Journeyman plumber license',
      'Master plumber license',
      'Plumbing contractor license',
      'Backflow prevention certification',
      'Gas line certification (where applicable)'
    ]
  },

  'construction-worker': {
    title: 'General Construction Worker Career Pathway',
    description: 'General construction career from laborer to construction management',
    stages: [
      {
        level: 'Construction Laborer',
        requirements: ['Physical fitness', 'Basic safety training', 'Willingness to learn'],
        duration: '6 months - 2 years',
        description: 'Entry-level construction work and skill development'
      },
      {
        level: 'Skilled Construction Worker',
        requirements: ['Specialized training', 'Equipment operation', 'Trade skills'],
        duration: '2-4 years',
        description: 'Specialized construction skills and equipment operation'
      },
      {
        level: 'Construction Specialist/Craftsman',
        requirements: ['Trade certification', 'Advanced skills', 'Quality workmanship'],
        duration: '4-7 years',
        description: 'Specialized construction trades and expert-level work'
      },
      {
        level: 'Construction Foreman/Lead',
        requirements: ['Leadership training', 'Safety management', 'Crew supervision'],
        duration: '7-10 years',
        description: 'Construction crew leadership and site supervision'
      },
      {
        level: 'Construction Superintendent/Manager',
        requirements: ['Project management', 'Contract knowledge', 'Business skills'],
        duration: '10+ years',
        description: 'Construction project management and operations'
      }
    ],
    qualifications: [
      'Construction safety certifications (OSHA 10/30)',
      'Equipment operation licenses',
      'First aid/CPR certification',
      'Trade-specific certifications',
      'Construction management training',
      'Project management certification'
    ]
  },

  'hvac-technician': {
    title: 'HVAC Technician Career Pathway',
    description: 'Heating, ventilation, and air conditioning career pathway',
    stages: [
      {
        level: 'Education/Training',
        requirements: ['HVAC training program', 'EPA certification', 'Basic mechanical knowledge'],
        duration: '6 months - 2 years',
        description: 'HVAC fundamentals and certification preparation'
      },
      {
        level: 'HVAC Apprentice/Helper',
        requirements: ['Entry-level certification', 'On-the-job training', 'Tool familiarity'],
        duration: '1-2 years',
        description: 'Supervised HVAC installation and maintenance'
      },
      {
        level: 'HVAC Technician',
        requirements: ['Journeyman certification', 'System troubleshooting', 'Customer service'],
        duration: '2-5 years',
        description: 'Independent HVAC service and repair work'
      },
      {
        level: 'Senior HVAC Technician',
        requirements: ['Advanced certifications', 'Complex systems', 'Mentoring ability'],
        duration: '5-8 years',
        description: 'Complex HVAC systems and technician training'
      },
      {
        level: 'HVAC Supervisor/Contractor',
        requirements: ['Contractor license', 'Business management', 'Team leadership'],
        duration: '8+ years',
        description: 'HVAC business operations and team management'
      }
    ],
    qualifications: [
      'EPA Section 608 certification',
      'HVAC Excellence certifications',
      'State HVAC license',
      'Electrical basics certification',
      'Customer service training'
    ]
  },

  'welder': {
    title: 'Welder Career Pathway',
    description: 'Welding trade career from basic welder to welding engineer',
    stages: [
      {
        level: 'Education/Training',
        requirements: ['Welding program', 'Basic welding processes', 'Safety training'],
        duration: '6 months - 1 year',
        description: 'Welding fundamentals and process training'
      },
      {
        level: 'Entry-Level Welder',
        requirements: ['Basic welding certification', 'Process proficiency', 'Quality standards'],
        duration: '1-2 years',
        description: 'Basic welding operations and skill development'
      },
      {
        level: 'Certified Welder',
        requirements: ['Multiple process certifications', 'Code compliance', 'Quality welding'],
        duration: '2-5 years',
        description: 'Advanced welding processes and specialized applications'
      },
      {
        level: 'Welding Supervisor/Inspector',
        requirements: ['CWI certification', 'Quality control', 'Team leadership'],
        duration: '5-8 years',
        description: 'Welding quality control and team supervision'
      },
      {
        level: 'Welding Engineer/Manager',
        requirements: ['Engineering knowledge', 'Process development', 'Project management'],
        duration: '8+ years',
        description: 'Welding engineering and operations management'
      }
    ],
    qualifications: [
      'AWS welding certifications',
      'CWI (Certified Welding Inspector)',
      'ASME/API certifications',
      'Safety certifications',
      'Quality control training'
    ]
  },

  'heavy-equipment-operator': {
    title: 'Heavy Equipment Operator Career Pathway',
    description: 'Heavy machinery operation career in construction and industrial settings',
    stages: [
      {
        level: 'Equipment Operator Training',
        requirements: ['Equipment training program', 'CDL license', 'Safety certification'],
        duration: '3-6 months',
        description: 'Heavy equipment operation fundamentals'
      },
      {
        level: 'Equipment Operator',
        requirements: ['Equipment certifications', 'Safe operation record', 'Maintenance knowledge'],
        duration: '1-3 years',
        description: 'Professional equipment operation and basic maintenance'
      },
      {
        level: 'Senior Equipment Operator',
        requirements: ['Multiple equipment types', 'Advanced operations', 'Training others'],
        duration: '3-6 years',
        description: 'Complex operations and operator mentoring'
      },
      {
        level: 'Equipment Supervisor/Foreman',
        requirements: ['Leadership training', 'Fleet management', 'Safety oversight'],
        duration: '6-10 years',
        description: 'Equipment fleet supervision and safety management'
      },
      {
        level: 'Equipment Manager/Coordinator',
        requirements: ['Fleet management', 'Maintenance planning', 'Operations coordination'],
        duration: '10+ years',
        description: 'Equipment operations management and fleet planning'
      }
    ],
    qualifications: [
      'CDL (Commercial Driver\'s License)',
      'Equipment-specific certifications',
      'OSHA safety training',
      'Equipment maintenance training',
      'Fleet management certification'
    ]
  },

  'mason': {
    title: 'Mason Career Pathway',
    description: 'Masonry and stonework career from apprentice to masonry contractor',
    stages: [
      {
        level: 'Masonry Apprenticeship',
        requirements: ['Apprenticeship program', 'Basic masonry skills', 'Material knowledge'],
        duration: '3-4 years',
        description: 'Masonry fundamentals and hands-on training'
      },
      {
        level: 'Journeyman Mason',
        requirements: ['Apprenticeship completion', 'Masonry certification', 'Tool proficiency'],
        duration: '2-4 years',
        description: 'Independent masonry work and project completion'
      },
      {
        level: 'Skilled Mason/Specialist',
        requirements: ['Specialized techniques', 'Restoration skills', 'Artistic ability'],
        duration: '4-7 years',
        description: 'Specialized masonry and restoration work'
      },
      {
        level: 'Mason Foreman/Supervisor',
        requirements: ['Team leadership', 'Project coordination', 'Quality oversight'],
        duration: '7-10 years',
        description: 'Masonry crew leadership and project management'
      },
      {
        level: 'Masonry Contractor/Manager',
        requirements: ['Contractor license', 'Business management', 'Estimating skills'],
        duration: '10+ years',
        description: 'Masonry contracting business and operations'
      }
    ],
    qualifications: [
      'Masonry apprenticeship completion',
      'Masonry trade certification',
      'OSHA safety certifications',
      'Restoration technique training',
      'Business management training'
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
    'construction': {
      title: `${role} Career Pathway`,
      description: 'Construction trade career path with hands-on skills and safety focus',
      stages: [
        {
          level: 'Education/Training',
          requirements: ['Trade program or apprenticeship', 'Safety certification', 'Basic tools knowledge'],
          duration: '6 months - 4 years',
          description: 'Trade-specific training and apprenticeship program'
        },
        {
          level: 'Entry-Level Worker',
          requirements: ['Completed training', 'Safety certifications', 'Basic competency'],
          duration: '1-2 years',
          description: 'Supervised work and skill development'
        },
        {
          level: 'Skilled Tradesperson',
          requirements: ['Journeyman certification', 'Advanced skills', 'Quality workmanship'],
          duration: '3-6 years',
          description: 'Independent skilled work and specialization'
        },
        {
          level: 'Lead/Supervisor',
          requirements: ['Leadership training', 'Team management', 'Advanced certifications'],
          duration: '6-10 years',
          description: 'Team leadership and project coordination'
        },
        {
          level: 'Contractor/Manager',
          requirements: ['Business license', 'Management skills', 'Project oversight'],
          duration: '10+ years',
          description: 'Business operations and construction management'
        }
      ],
      qualifications: [
        'Trade-specific certification or apprenticeship',
        'OSHA safety certifications',
        'State licensing (where required)',
        'Continuing education requirements',
        'Business management training'
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