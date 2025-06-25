import { getCareerPathway, analyzeEducationLevel } from './careerPathways.js';

// REVOLUTIONARY Course Recommendation System - Dynamic for ALL Industry/Role Combinations
export const courseRecommendations = {
  // UNIVERSAL skill-based course mapping for infinite combinations
  universalSkillMapping: {
    // Technical Skills
    'python': [
      { title: 'Python Programming Masterclass', provider: 'TechLearn', duration: '12 weeks', level: 'Beginner to Advanced' },
      { title: 'Data Science with Python', provider: 'DataCamp', duration: '8 weeks', level: 'Intermediate' },
      { title: 'Python for Automation', provider: 'Coursera', duration: '6 weeks', level: 'Beginner' }
    ],
    'javascript': [
      { title: 'Complete JavaScript Course', provider: 'TechAcademy', duration: '10 weeks', level: 'Beginner to Advanced' },
      { title: 'React.js Development', provider: 'FrontEnd Masters', duration: '8 weeks', level: 'Intermediate' },
      { title: 'Node.js Backend Development', provider: 'BackEnd Pro', duration: '12 weeks', level: 'Advanced' }
    ],
    'data analysis': [
      { title: 'Data Analysis with Excel', provider: 'Microsoft Learn', duration: '4 weeks', level: 'Beginner' },
      { title: 'Advanced Analytics with Python', provider: 'DataCamp', duration: '10 weeks', level: 'Intermediate' },
      { title: 'Statistical Analysis Masterclass', provider: 'StatsPro', duration: '8 weeks', level: 'Advanced' }
    ],
    'project management': [
      { title: 'PMP Certification Prep', provider: 'PMI', duration: '12 weeks', level: 'Professional' },
      { title: 'Agile Project Management', provider: 'Scrum Alliance', duration: '6 weeks', level: 'Intermediate' },
      { title: 'Project Leadership Skills', provider: 'Leadership Institute', duration: '8 weeks', level: 'Advanced' }
    ],
    'digital marketing': [
      { title: 'Google Digital Marketing Course', provider: 'Google', duration: '6 weeks', level: 'Beginner' },
      { title: 'Social Media Marketing Strategy', provider: 'HubSpot', duration: '4 weeks', level: 'Intermediate' },
      { title: 'Advanced SEO Techniques', provider: 'SEO Masters', duration: '8 weeks', level: 'Advanced' }
    ],
    'fire safety': [
      { title: 'NEBOSH Fire Safety Certificate', provider: 'NEBOSH', duration: '5 days', level: 'Professional' },
      { title: 'Fire Risk Assessment Course', provider: 'Fire Safety Training', duration: '3 days', level: 'Intermediate' },
      { title: 'Fire Prevention Management', provider: 'IFE', duration: '10 weeks', level: 'Advanced' }
    ],
    'building safety': [
      { title: 'Building Safety Act 2022 Overview', provider: 'CIOB', duration: '2 days', level: 'Professional' },
      { title: 'Institute of Fire Engineers Membership', provider: 'IFE', duration: '6 months', level: 'Professional' },
      { title: 'Building Regulations Compliance', provider: 'BSI', duration: '5 days', level: 'Intermediate' },
      { title: 'Principal Building Surveyor Training', provider: 'RICS', duration: '12 weeks', level: 'Advanced' }
    ],
    'health and safety': [
      { title: 'IOSH Managing Safety', provider: 'IOSH', duration: '4 days', level: 'Professional' },
      { title: 'NEBOSH General Certificate', provider: 'NEBOSH', duration: '10 days', level: 'Professional' },
      { title: 'Risk Assessment Techniques', provider: 'Safety Institute', duration: '3 days', level: 'Intermediate' }
    ],
    'leadership': [
      { title: 'Strategic Leadership Program', provider: 'Leadership Academy', duration: '8 weeks', level: 'Advanced' },
      { title: 'Team Management Essentials', provider: 'Management Institute', duration: '6 weeks', level: 'Intermediate' },
      { title: 'Executive Leadership Development', provider: 'Executive Education', duration: '12 weeks', level: 'Executive' }
    ],
    'communication': [
      { title: 'Business Communication Skills', provider: 'Communication Pro', duration: '4 weeks', level: 'Beginner' },
      { title: 'Presentation Mastery', provider: 'Public Speaking Institute', duration: '6 weeks', level: 'Intermediate' },
      { title: 'Strategic Communication Leadership', provider: 'Comm Leaders', duration: '8 weeks', level: 'Advanced' }
    ],
    'financial analysis': [
      { title: 'Financial Modeling Course', provider: 'Finance Institute', duration: '8 weeks', level: 'Intermediate' },
      { title: 'CFA Level 1 Preparation', provider: 'CFA Institute', duration: '20 weeks', level: 'Professional' },
      { title: 'Corporate Finance Fundamentals', provider: 'Business School', duration: '6 weeks', level: 'Beginner' }
    ],
    'nursing': [
      { title: 'Advanced Clinical Skills', provider: 'Nursing College', duration: '12 weeks', level: 'Advanced' },
      { title: 'Emergency Nursing Certification', provider: 'ENA', duration: '8 weeks', level: 'Professional' },
      { title: 'Nursing Leadership Program', provider: 'Healthcare Leadership', duration: '10 weeks', level: 'Advanced' }
    ]
  },

  // INDUSTRY-SPECIFIC course collections for targeted development
  industrySpecific: {
    technology: {
      core: [
        { title: 'Software Development Fundamentals', provider: 'TechUniversity', duration: '16 weeks', level: 'Beginner', priority: 'high' },
        { title: 'Cloud Computing Essentials', provider: 'AWS', duration: '8 weeks', level: 'Intermediate', priority: 'high' },
        { title: 'DevOps Engineering', provider: 'DevOps Institute', duration: '12 weeks', level: 'Advanced', priority: 'medium' }
      ],
      specialized: [
        { title: 'Machine Learning Fundamentals', provider: 'AI Academy', duration: '14 weeks', level: 'Intermediate', priority: 'medium' },
        { title: 'Cybersecurity Foundations', provider: 'Security Institute', duration: '10 weeks', level: 'Intermediate', priority: 'medium' }
      ]
    },
    healthcare: {
      core: [
        { title: 'Patient Care Excellence', provider: 'Healthcare Institute', duration: '6 weeks', level: 'Beginner', priority: 'high' },
        { title: 'Medical Ethics and Law', provider: 'Medical College', duration: '4 weeks', level: 'Intermediate', priority: 'high' },
        { title: 'Healthcare Leadership', provider: 'Health Leaders', duration: '8 weeks', level: 'Advanced', priority: 'medium' }
      ],
      specialized: [
        { title: 'Emergency Medicine Protocols', provider: 'EM Academy', duration: '12 weeks', level: 'Advanced', priority: 'medium' },
        { title: 'Healthcare Quality Management', provider: 'Quality Institute', duration: '8 weeks', level: 'Intermediate', priority: 'low' }
      ]
    },
    emergency_services: {
      core: [
        { title: 'Incident Command System', provider: 'Emergency Training', duration: '5 days', level: 'Professional', priority: 'high' },
        { title: 'Crisis Management Leadership', provider: 'Crisis Institute', duration: '6 weeks', level: 'Advanced', priority: 'high' },
        { title: 'Emergency Response Coordination', provider: 'Response Academy', duration: '8 weeks', level: 'Intermediate', priority: 'medium' }
      ],
      specialized: [
        { title: 'Hazmat Response Training', provider: 'Hazmat Institute', duration: '10 days', level: 'Professional', priority: 'medium' },
        { title: 'Community Emergency Planning', provider: 'Community Safety', duration: '6 weeks', level: 'Intermediate', priority: 'low' }
      ]
    },
    building_safety: {
      core: [
        { title: 'Institute of Fire Engineers Membership', provider: 'IFE', duration: '6 months', level: 'Professional', priority: 'critical' },
        { title: 'Building Safety Act 2022 Implementation', provider: 'BSR', duration: '3 days', level: 'Professional', priority: 'critical' },
        { title: 'Fire Safety Engineering', provider: 'Fire Engineering Institute', duration: '12 weeks', level: 'Advanced', priority: 'high' },
        { title: 'Building Regulations Compliance', provider: 'LABC', duration: '5 days', level: 'Professional', priority: 'high' }
      ],
      specialized: [
        { title: 'Structural Fire Safety Design', provider: 'Structural Institute', duration: '8 weeks', level: 'Advanced', priority: 'medium' },
        { title: 'Fire Risk Assessment Advanced', provider: 'FRA Specialists', duration: '5 days', level: 'Professional', priority: 'medium' },
        { title: 'Building Control Surveying', provider: 'RICS', duration: '16 weeks', level: 'Professional', priority: 'medium' }
      ]
    },
    finance: {
      core: [
        { title: 'Financial Analysis Fundamentals', provider: 'Finance Institute', duration: '8 weeks', level: 'Beginner', priority: 'high' },
        { title: 'Investment Banking Essentials', provider: 'Banking Academy', duration: '12 weeks', level: 'Intermediate', priority: 'high' },
        { title: 'Risk Management Professional', provider: 'Risk Institute', duration: '10 weeks', level: 'Advanced', priority: 'medium' }
      ],
      specialized: [
        { title: 'Derivatives Trading', provider: 'Trading Academy', duration: '8 weeks', level: 'Advanced', priority: 'medium' },
        { title: 'Financial Compliance', provider: 'Compliance Institute', duration: '6 weeks', level: 'Intermediate', priority: 'low' }
      ]
    },
    education: {
      core: [
        { title: 'Modern Teaching Methods', provider: 'Education Institute', duration: '8 weeks', level: 'Beginner', priority: 'high' },
        { title: 'Curriculum Development', provider: 'Curriculum Academy', duration: '6 weeks', level: 'Intermediate', priority: 'high' },
        { title: 'Educational Leadership', provider: 'School Leaders', duration: '10 weeks', level: 'Advanced', priority: 'medium' }
      ],
      specialized: [
        { title: 'Special Needs Education', provider: 'Special Ed Institute', duration: '12 weeks', level: 'Intermediate', priority: 'medium' },
        { title: 'Educational Technology', provider: 'EdTech Academy', duration: '6 weeks', level: 'Beginner', priority: 'low' }
      ]
    }
  },

  // ROLE-SPECIFIC courses for targeted skill development
  roleSpecific: {
    manager: [
      { title: 'Strategic Management', provider: 'Business School', duration: '8 weeks', level: 'Advanced', priority: 'high' },
      { title: 'Team Leadership Excellence', provider: 'Leadership Institute', duration: '6 weeks', level: 'Intermediate', priority: 'high' },
      { title: 'Performance Management', provider: 'HR Academy', duration: '4 weeks', level: 'Intermediate', priority: 'medium' }
    ],
    analyst: [
      { title: 'Data Analysis Mastery', provider: 'Data Institute', duration: '10 weeks', level: 'Intermediate', priority: 'high' },
      { title: 'Business Intelligence Tools', provider: 'BI Academy', duration: '8 weeks', level: 'Intermediate', priority: 'high' },
      { title: 'Statistical Analysis', provider: 'Stats Institute', duration: '6 weeks', level: 'Advanced', priority: 'medium' }
    ],
    developer: [
      { title: 'Full Stack Development', provider: 'Dev Academy', duration: '16 weeks', level: 'Intermediate', priority: 'high' },
      { title: 'Software Architecture', provider: 'Architecture Institute', duration: '12 weeks', level: 'Advanced', priority: 'high' },
      { title: 'Agile Development Practices', provider: 'Agile Academy', duration: '6 weeks', level: 'Intermediate', priority: 'medium' }
    ],
    consultant: [
      { title: 'Management Consulting Skills', provider: 'Consulting Institute', duration: '8 weeks', level: 'Advanced', priority: 'high' },
      { title: 'Business Strategy Development', provider: 'Strategy Academy', duration: '10 weeks', level: 'Advanced', priority: 'high' },
      { title: 'Client Relationship Management', provider: 'Client Success Institute', duration: '6 weeks', level: 'Intermediate', priority: 'medium' }
    ]
  },

  // CAREER TRANSITION courses for changing fields
  careerTransition: {
    'technology_to_finance': [
      { title: 'FinTech Fundamentals', provider: 'FinTech Institute', duration: '8 weeks', level: 'Intermediate', priority: 'critical' },
      { title: 'Financial Markets Overview', provider: 'Markets Academy', duration: '6 weeks', level: 'Beginner', priority: 'high' },
      { title: 'Algorithmic Trading', provider: 'Algo Trading', duration: '10 weeks', level: 'Advanced', priority: 'medium' }
    ],
    'emergency_services_to_building_safety': [
      { title: 'Institute of Fire Engineers Membership', provider: 'IFE', duration: '6 months', level: 'Professional', priority: 'critical' },
      { title: 'Building Safety Act Implementation', provider: 'BSR', duration: '3 days', level: 'Professional', priority: 'critical' },
      { title: 'Fire Safety Engineering Principles', provider: 'FSE Institute', duration: '8 weeks', level: 'Advanced', priority: 'high' },
      { title: 'Building Control and Regulations', provider: 'BC Academy', duration: '6 weeks', level: 'Professional', priority: 'high' }
    ],
    'emergency_services_to_healthcare': [
      { title: 'Emergency Medical Technician', provider: 'EMT Academy', duration: '12 weeks', level: 'Professional', priority: 'critical' },
      { title: 'Healthcare Systems Overview', provider: 'Health Institute', duration: '4 weeks', level: 'Beginner', priority: 'high' },
      { title: 'Patient Care Fundamentals', provider: 'Care Academy', duration: '6 weeks', level: 'Intermediate', priority: 'high' }
    ],
    'healthcare_to_emergency_services': [
      { title: 'Emergency Response Protocols', provider: 'Emergency Academy', duration: '8 weeks', level: 'Intermediate', priority: 'critical' },
      { title: 'Crisis Management in Emergencies', provider: 'Crisis Institute', duration: '6 weeks', level: 'Advanced', priority: 'high' },
      { title: 'First Aid Instructor Certification', provider: 'First Aid Institute', duration: '5 days', level: 'Professional', priority: 'medium' }
    ]
  },

  // PROFESSIONAL QUALIFICATIONS by industry
  professionalQualifications: {
    building_safety: [
      { title: 'Institute of Fire Engineers - Graduate Membership', provider: 'IFE', duration: '12 months', level: 'Professional', priority: 'critical', type: 'membership' },
      { title: 'Institute of Fire Engineers - Member Grade', provider: 'IFE', duration: '18 months', level: 'Professional', priority: 'critical', type: 'membership' },
      { title: 'NEBOSH Fire Safety Certificate', provider: 'NEBOSH', duration: '5 days', level: 'Professional', priority: 'high', type: 'certification' },
      { title: 'IOSH Managing Safety', provider: 'IOSH', duration: '4 days', level: 'Professional', priority: 'high', type: 'certification' }
    ],
    emergency_services: [
      { title: 'IOSH Working Safety', provider: 'IOSH', duration: '1 day', level: 'Professional', priority: 'high', type: 'certification' },
      { title: 'NEBOSH General Certificate', provider: 'NEBOSH', duration: '10 days', level: 'Professional', priority: 'medium', type: 'certification' },
      { title: 'Emergency Planning Society Membership', provider: 'EPS', duration: 'Ongoing', level: 'Professional', priority: 'medium', type: 'membership' }
    ],
    technology: [
      { title: 'AWS Certified Solutions Architect', provider: 'AWS', duration: '3 months prep', level: 'Professional', priority: 'high', type: 'certification' },
      { title: 'PMP Project Management', provider: 'PMI', duration: '6 months prep', level: 'Professional', priority: 'medium', type: 'certification' },
      { title: 'CompTIA Security+', provider: 'CompTIA', duration: '2 months prep', level: 'Professional', priority: 'medium', type: 'certification' }
    ]
  }
};

// DYNAMIC RECOMMENDATION ALGORITHM
export const getPersonalizedCourseRecommendations = (cvData, jobData, gapAreas, matchType, currentField, targetIndustry) => {
  const recommendations = [];
  
  // 1. CRITICAL PROFESSIONAL QUALIFICATIONS (highest priority)
  if (courseRecommendations.professionalQualifications[targetIndustry]) {
    const professionalQuals = courseRecommendations.professionalQualifications[targetIndustry]
      .filter(qual => qual.priority === 'critical')
      .slice(0, 2);
    recommendations.push(...professionalQuals);
  }

  // 2. SKILL-SPECIFIC COURSES based on gap areas
  gapAreas.forEach(skill => {
    const skillLower = skill.toLowerCase();
    if (courseRecommendations.universalSkillMapping[skillLower]) {
      const skillCourses = courseRecommendations.universalSkillMapping[skillLower]
        .slice(0, 1); // Top course for each skill
      recommendations.push(...skillCourses);
    }
  });

  // 3. CAREER TRANSITION COURSES for field changes
  const transitionKey = `${currentField}_to_${targetIndustry}`;
  if (courseRecommendations.careerTransition[transitionKey]) {
    const transitionCourses = courseRecommendations.careerTransition[transitionKey]
      .filter(course => course.priority === 'critical' || course.priority === 'high')
      .slice(0, 3);
    recommendations.push(...transitionCourses);
  }

  // 4. INDUSTRY-SPECIFIC CORE COURSES
  if (courseRecommendations.industrySpecific[targetIndustry]) {
    const industryCourses = courseRecommendations.industrySpecific[targetIndustry].core
      .filter(course => course.priority === 'high')
      .slice(0, 2);
    recommendations.push(...industryCourses);
  }

  // 5. ROLE-SPECIFIC COURSES if role detected
  const detectedRole = detectRoleFromJobData(jobData);
  if (detectedRole && courseRecommendations.roleSpecific[detectedRole]) {
    const roleCourses = courseRecommendations.roleSpecific[detectedRole]
      .slice(0, 2);
    recommendations.push(...roleCourses);
  }

  // Remove duplicates and prioritize
  const uniqueRecommendations = removeDuplicateCourses(recommendations);
  return sortByPriorityAndRelevance(uniqueRecommendations, gapAreas, matchType);
};

// Helper functions
const detectRoleFromJobData = (jobData) => {
  if (!jobData.role) return null;
  
  const roleLower = jobData.role.toLowerCase();
  if (roleLower.includes('manager') || roleLower.includes('head') || roleLower.includes('director')) return 'manager';
  if (roleLower.includes('analyst') || roleLower.includes('analysis')) return 'analyst';
  if (roleLower.includes('developer') || roleLower.includes('engineer') || roleLower.includes('programmer')) return 'developer';
  if (roleLower.includes('consultant') || roleLower.includes('advisor')) return 'consultant';
  
  return null;
};

const removeDuplicateCourses = (courses) => {
  const seen = new Set();
  return courses.filter(course => {
    const key = `${course.title}-${course.provider}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const sortByPriorityAndRelevance = (courses, gapAreas, matchType) => {
  const priorityWeights = {
    'critical': 100,
    'high': 80,
    'medium': 60,
    'low': 40
  };

  return courses
    .map(course => ({
      ...course,
      relevanceScore: calculateRelevanceScore(course, gapAreas, matchType),
      priorityWeight: priorityWeights[course.priority] || 50
    }))
    .sort((a, b) => (b.priorityWeight + b.relevanceScore) - (a.priorityWeight + a.relevanceScore))
    .slice(0, 8); // Top 8 recommendations
};

const calculateRelevanceScore = (course, gapAreas, matchType) => {
  let score = 0;
  
  // Boost score if course addresses specific gaps
  gapAreas.forEach(gap => {
    if (course.title.toLowerCase().includes(gap.toLowerCase()) || 
        course.description?.toLowerCase().includes(gap.toLowerCase())) {
      score += 20;
    }
  });
  
  // Boost for career transition courses
  if (matchType === 'career-change' && course.type === 'certification') {
    score += 15;
  }
  
  // Boost for professional qualifications
  if (course.type === 'membership' || course.type === 'certification') {
    score += 10;
  }
  
  return score;
};

export default courseRecommendations; 