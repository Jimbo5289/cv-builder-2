export const DEGREE_LEVELS = [
  { value: 'bachelors', label: "Bachelor's Degree" },
  { value: 'masters', label: "Master's Degree" },
  { value: 'phd', label: 'PhD/Doctorate' },
  { value: 'foundation', label: 'Foundation Degree' },
  { value: 'associate', label: 'Associate Degree' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'postgraduate', label: 'Postgraduate Diploma' },
];

export const GRADES_UK = [
  { value: 'first', label: 'First Class Honours (1st)' },
  { value: 'upper_second', label: 'Upper Second Class Honours (2:1)' },
  { value: 'lower_second', label: 'Lower Second Class Honours (2:2)' },
  { value: 'third', label: 'Third Class Honours (3rd)' },
  { value: 'pass', label: 'Pass' },
  { value: 'merit', label: 'Merit' },
  { value: 'distinction', label: 'Distinction' },
];

export const GRADES_US = [
  { value: '4.0', label: 'A (4.0 GPA)' },
  { value: '3.7', label: 'A- (3.7 GPA)' },
  { value: '3.3', label: 'B+ (3.3 GPA)' },
  { value: '3.0', label: 'B (3.0 GPA)' },
  { value: '2.7', label: 'B- (2.7 GPA)' },
  { value: '2.3', label: 'C+ (2.3 GPA)' },
  { value: '2.0', label: 'C (2.0 GPA)' },
];

// Comprehensive list of universities (this is a subset, you can expand further)
export const UNIVERSITIES = [
  // UK Universities
  'University of Oxford',
  'University of Cambridge',
  'Imperial College London',
  'University College London',
  'London School of Economics',
  'University of Edinburgh',
  'University of Manchester',
  'King\'s College London',
  'University of Bristol',
  'University of Warwick',
  'University of Birmingham',
  'University of Leeds',
  'University of Sheffield',
  'University of Nottingham',
  'University of Southampton',
  'Durham University',
  'University of Glasgow',
  'Cardiff University',
  'Queen Mary University of London',
  'University of Liverpool',
  'University of York',
  'University of East Anglia',
  'University of Essex',
  'Canterbury Christ Church University',
  'University of Kent',
  'University of Sussex',
  'University of Surrey',
  'University of Bath',
  'University of Exeter',
  'University of Leicester',
  
  // US Universities
  'Harvard University',
  'Massachusetts Institute of Technology',
  'Stanford University',
  'Yale University',
  'Princeton University',
  'California Institute of Technology',
  'Columbia University',
  'University of Chicago',
  'University of Pennsylvania',
  'Johns Hopkins University',
  
  // European Universities
  'ETH Zurich',
  'Technical University of Munich',
  'University of Amsterdam',
  'KU Leuven',
  'University of Copenhagen',
  'Trinity College Dublin',
  'University of Oslo',
  'Uppsala University',
  
  // Asian Universities
  'National University of Singapore',
  'Tsinghua University',
  'University of Tokyo',
  'Peking University',
  'Seoul National University',
  'Kyoto University',
  
  // Australian/NZ Universities
  'University of Melbourne',
  'Australian National University',
  'University of Sydney',
  'University of Queensland',
  'University of Auckland'
];

// Comprehensive list of fields of study
export const FIELDS_OF_STUDY = [
  // Computer & Technology
  'Computer Science',
  'Software Engineering',
  'Information Technology',
  'Data Science',
  'Artificial Intelligence',
  'Cybersecurity',
  'Network Engineering',
  'Cloud Computing',
  'Web Development',
  'Mobile App Development',
  
  // Business & Management
  'Business Administration',
  'Economics',
  'Finance',
  'Marketing',
  'International Business',
  'Accounting',
  'Human Resource Management',
  'Supply Chain Management',
  'Project Management',
  'Entrepreneurship',
  
  // Science & Mathematics
  'Biology',
  'Chemistry',
  'Physics',
  'Mathematics',
  'Environmental Science',
  'Biochemistry',
  'Biotechnology',
  'Marine Biology',
  'Astronomy',
  'Geology',
  
  // Engineering
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Aerospace Engineering',
  'Biomedical Engineering',
  'Environmental Engineering',
  'Industrial Engineering',
  'Materials Science',
  'Robotics Engineering',
  
  // Healthcare & Medicine
  'Medicine',
  'Nursing',
  'Pharmacy',
  'Dentistry',
  'Public Health',
  'Veterinary Science',
  'Physiotherapy',
  'Occupational Therapy',
  'Nutrition',
  'Psychology',
  
  // Arts & Humanities
  'English Literature',
  'History',
  'Philosophy',
  'Languages',
  'Linguistics',
  'Art History',
  'Creative Writing',
  'Classical Studies',
  'Religious Studies',
  'Cultural Studies',
  
  // Social Sciences
  'Political Science',
  'Sociology',
  'Anthropology',
  'International Relations',
  'Criminology',
  'Social Work',
  'Gender Studies',
  'Development Studies',
  'Education',
  'Communication Studies',
  
  // Creative Arts & Design
  'Architecture',
  'Graphic Design',
  'Industrial Design',
  'Fashion Design',
  'Interior Design',
  'Fine Art',
  'Photography',
  'Film Studies',
  'Music',
  'Theatre Studies',
  
  // Law & Legal Studies
  'Law',
  'International Law',
  'Criminal Law',
  'Commercial Law',
  'Human Rights Law',
  'Environmental Law',
  'Intellectual Property Law',
  
  // Agriculture & Environment
  'Agriculture',
  'Forestry',
  'Horticulture',
  'Environmental Management',
  'Sustainable Development',
  'Conservation Biology',
  'Climate Science'
];

// Education qualification levels from secondary to advanced degrees
export const QUALIFICATION_LEVELS = [
  // Secondary Education
  { value: 'gcse', label: 'GCSE' },
  { value: 'o-level', label: 'O-Level' },
  { value: 'a-level', label: 'A-Level' },
  { value: 'btec-level-2', label: 'BTEC Level 2' },
  { value: 'btec-level-3', label: 'BTEC Level 3' },
  { value: 'international-baccalaureate', label: 'International Baccalaureate' },
  { value: 'high-school-diploma', label: 'High School Diploma' },

  // Vocational Qualifications
  { value: 'nvq-level-1', label: 'NVQ Level 1' },
  { value: 'nvq-level-2', label: 'NVQ Level 2' },
  { value: 'nvq-level-3', label: 'NVQ Level 3' },
  { value: 'nvq-level-4', label: 'NVQ Level 4' },
  { value: 'nvq-level-5', label: 'NVQ Level 5' },
  { value: 'city-and-guilds', label: 'City & Guilds' },
  { value: 'apprenticeship', label: 'Apprenticeship' },
  { value: 'higher-apprenticeship', label: 'Higher Apprenticeship' },
  { value: 'vocational-certificate', label: 'Vocational Certificate' },

  // Higher Education
  { value: 'foundation-degree', label: 'Foundation Degree' },
  { value: 'higher-national-certificate', label: 'Higher National Certificate (HNC)' },
  { value: 'higher-national-diploma', label: 'Higher National Diploma (HND)' },
  { value: 'associate-degree', label: 'Associate Degree' },
  { value: 'bachelors-degree', label: "Bachelor's Degree (BA/BSc)" },
  { value: 'graduate-certificate', label: 'Graduate Certificate' },
  { value: 'graduate-diploma', label: 'Graduate Diploma' },
  { value: 'postgraduate-certificate', label: 'Postgraduate Certificate' },
  { value: 'postgraduate-diploma', label: 'Postgraduate Diploma' },
  { value: 'masters-degree', label: "Master's Degree (MA/MSc/MEng)" },
  { value: 'mba', label: 'Master of Business Administration (MBA)' },
  { value: 'doctorate', label: 'Doctorate/PhD' },
  { value: 'professional-qualification', label: 'Professional Qualification' },

  // Other qualifications
  { value: 'certificate', label: 'Certificate' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'short-course', label: 'Short Course/Workshop' },
  { value: 'online-certification', label: 'Online Certification' },
  { value: 'other', label: 'Other' }
]; 