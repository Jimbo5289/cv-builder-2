// Course recommendations based on identified skills gaps
export const COURSE_RECOMMENDATIONS = {
  // Technical skills - Computer Science and Software Development
  'programming': [
    { 
      title: 'Introduction to Python Programming',
      provider: 'Alison',
      url: 'https://alison.com/course/introduction-to-programming-with-python-revised',
      level: 'Beginner'
    },
    { 
      title: 'JavaScript - The Complete Guide 2023', 
      provider: 'Alison',
      url: 'https://alison.com/course/javascript-the-complete-guide', 
      level: 'Intermediate'
    },
    {
      title: 'React - The Complete Guide',
      provider: 'Udemy',
      url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
      level: 'Intermediate'
    }
  ],
  'web development': [
    {
      title: 'Full Stack Web Development',
      provider: 'Coursera',
      url: 'https://www.coursera.org/specializations/full-stack-web-development',
      level: 'Intermediate'
    },
    {
      title: 'Advanced CSS and Sass',
      provider: 'Udemy',
      url: 'https://www.udemy.com/course/advanced-css-and-sass/',
      level: 'Intermediate'
    },
    {
      title: 'The Web Developer Bootcamp',
      provider: 'Udemy',
      url: 'https://www.udemy.com/course/the-web-developer-bootcamp/',
      level: 'Beginner to Intermediate'
    }
  ],
  'data analysis': [
    { 
      title: 'Data Analysis with Python',
      provider: 'Coursera',
      url: 'https://www.coursera.org/learn/data-analysis-with-python', 
      level: 'Intermediate'
    },
    { 
      title: 'Introduction to Data Science',
      provider: 'edX',
      url: 'https://www.edx.org/learn/data-science/harvard-university-data-science-r-basics', 
      level: 'Beginner'
    },
    {
      title: 'SQL for Data Analysis',
      provider: 'Udacity',
      url: 'https://www.udacity.com/course/sql-for-data-analysis--ud198',
      level: 'Beginner'
    }
  ],
  'machine learning': [
    {
      title: 'Machine Learning Specialization',
      provider: 'Coursera',
      url: 'https://www.coursera.org/specializations/machine-learning-introduction',
      level: 'Intermediate'
    },
    {
      title: 'Deep Learning Specialization',
      provider: 'Coursera',
      url: 'https://www.coursera.org/specializations/deep-learning',
      level: 'Advanced'
    },
    {
      title: 'TensorFlow Developer Professional Certificate',
      provider: 'Coursera',
      url: 'https://www.coursera.org/professional-certificates/tensorflow-in-practice',
      level: 'Intermediate'
    }
  ],
  'software engineering': [
    {
      title: 'Software Design and Architecture Specialization',
      provider: 'Coursera',
      url: 'https://www.coursera.org/specializations/software-design-architecture',
      level: 'Intermediate'
    },
    {
      title: 'Git & GitHub - The Complete Git & GitHub Course',
      provider: 'Udemy',
      url: 'https://www.udemy.com/course/git-github-practical-guide/',
      level: 'Beginner'
    },
    {
      title: 'Clean Code: Writing Code for Humans',
      provider: 'Pluralsight',
      url: 'https://www.pluralsight.com/courses/clean-code-writing-code-humans',
      level: 'Intermediate'
    }
  ],
  'cloud computing': [
    {
      title: 'AWS Certified Cloud Practitioner',
      provider: 'Amazon',
      url: 'https://www.coursera.org/learn/aws-cloud-practitioner-essentials',
      level: 'Beginner'
    },
    {
      title: 'Microsoft Azure Fundamentals',
      provider: 'Microsoft',
      url: 'https://learn.microsoft.com/en-us/certifications/azure-fundamentals/',
      level: 'Beginner'
    },
    {
      title: 'Google Cloud Platform Fundamentals',
      provider: 'Coursera',
      url: 'https://www.coursera.org/learn/gcp-fundamentals',
      level: 'Beginner'
    }
  ],
  'cybersecurity': [
    {
      title: 'Introduction to Cybersecurity',
      provider: 'Alison',
      url: 'https://alison.com/course/introduction-to-cybersecurity',
      level: 'Beginner'
    },
    {
      title: 'Ethical Hacking - CEH Prep',
      provider: 'Udemy',
      url: 'https://www.udemy.com/course/ethical-hacking-hands-on-ceh-prep/',
      level: 'Intermediate'
    },
    {
      title: 'CompTIA Security+ Certification',
      provider: 'CompTIA',
      url: 'https://www.comptia.org/certifications/security',
      level: 'Intermediate'
    }
  ],
  'mobile development': [
    {
      title: 'iOS App Development with Swift',
      provider: 'Coursera',
      url: 'https://www.coursera.org/specializations/app-development',
      level: 'Intermediate'
    },
    {
      title: 'Android App Development Specialization',
      provider: 'Coursera',
      url: 'https://www.coursera.org/specializations/android-app-development',
      level: 'Intermediate'
    },
    {
      title: 'React Native - The Practical Guide',
      provider: 'Udemy',
      url: 'https://www.udemy.com/course/react-native-the-practical-guide/',
      level: 'Intermediate'
    }
  ],
  'project management': [
    { 
      title: 'Project Management - Fundamentals',
      provider: 'Alison',
      url: 'https://alison.com/course/project-management-fundamentals', 
      level: 'Beginner'
    },
    { 
      title: 'PRINCE2 Foundation Certification',
      provider: 'FutureLearn',
      url: 'https://www.futurelearn.com/courses/prince2-foundation-certificate', 
      level: 'Intermediate'
    },
    {
      title: 'Agile with Atlassian Jira',
      provider: 'Coursera',
      url: 'https://www.coursera.org/learn/agile-atlassian-jira',
      level: 'Beginner'
    }
  ],
  
  // Soft skills
  'communication': [
    { 
      title: 'Business Communication - Developing Effective Communication Skills',
      provider: 'Alison',
      url: 'https://alison.com/course/business-communication-developing-effective-communication-skills', 
      level: 'Beginner'
    },
    {
      title: 'Technical Writing',
      provider: 'Coursera',
      url: 'https://www.coursera.org/learn/technical-writing',
      level: 'Intermediate'
    }
  ],
  'leadership': [
    { 
      title: 'Leadership Skills in Business',
      provider: 'Alison',
      url: 'https://alison.com/course/leadership-skills-in-business', 
      level: 'Intermediate'
    },
    {
      title: 'Strategic Leadership and Management',
      provider: 'Coursera',
      url: 'https://www.coursera.org/specializations/strategic-leadership',
      level: 'Intermediate'
    }
  ],
  'teamwork': [
    { 
      title: 'Teamwork Skills: Communicating Effectively in Groups',
      provider: 'Coursera',
      url: 'https://www.coursera.org/learn/teamwork-skills-effective-communication', 
      level: 'Beginner'
    },
    {
      title: 'Collaborative Working in a Remote Team',
      provider: 'FutureLearn',
      url: 'https://www.futurelearn.com/courses/collaborative-working-in-a-remote-team',
      level: 'Beginner'
    }
  ],
  
  // Computer Science student-specific recommendations
  'computer science': [
    {
      title: 'Data Structures and Algorithms Specialization',
      provider: 'Coursera',
      url: 'https://www.coursera.org/specializations/data-structures-algorithms',
      level: 'Intermediate'
    },
    {
      title: 'Database Management Essentials',
      provider: 'Coursera',
      url: 'https://www.coursera.org/learn/database-management',
      level: 'Intermediate'
    },
    {
      title: 'Operating Systems: Virtualization, Concurrency & Persistence',
      provider: 'edX',
      url: 'https://www.edx.org/learn/operating-systems',
      level: 'Intermediate'
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
    },
    {
      title: 'Coding Interview Preparation',
      provider: 'Coursera',
      url: 'https://www.coursera.org/learn/coding-interview-preparation',
      level: 'Intermediate'
    }
  ]
};

// Helper function to find recommendations based on keywords
export const findCourseRecommendations = (keywords = [], count = 3) => {
  if (!keywords || keywords.length === 0) {
    // For empty keywords, prioritize computer science courses as default
    return COURSE_RECOMMENDATIONS['computer science'].slice(0, count);
  }

  let results = [];
  let csProfileDetected = false;
  
  // Convert keywords to lowercase for case-insensitive matching
  const normalizedKeywords = keywords.map(kw => kw.toLowerCase());
  
  // Check if user profile appears to be CS-related
  const csRelatedTerms = ['computer science', 'programming', 'software', 'developer', 'web development', 'coding'];
  csProfileDetected = normalizedKeywords.some(keyword => 
    csRelatedTerms.some(term => keyword.includes(term) || term.includes(keyword))
  );
  
  // Check each keyword against our recommendations
  normalizedKeywords.forEach(keyword => {
    // Find exact matches first
    for (const [key, courses] of Object.entries(COURSE_RECOMMENDATIONS)) {
      if (keyword.includes(key) || key.includes(keyword)) {
        // Add courses that aren't already in results
        courses.forEach(course => {
          if (!results.find(r => r.url === course.url)) {
            results.push(course);
          }
        });
      }
    }
  });
  
  // If we detected a CS profile but don't have CS-specific recommendations yet,
  // prioritize adding some CS courses
  if (csProfileDetected && !results.some(course => 
      course.title.toLowerCase().includes('programming') || 
      course.title.toLowerCase().includes('computer science') ||
      course.title.toLowerCase().includes('software'))) {
    
    const csCourses = [
      ...COURSE_RECOMMENDATIONS['programming'],
      ...COURSE_RECOMMENDATIONS['software engineering'],
      ...COURSE_RECOMMENDATIONS['computer science']
    ].filter(course => !results.find(r => r.url === course.url));
    
    // Add CS courses to beginning of results
    results = [...csCourses.slice(0, Math.min(2, count)), ...results];
  }
  
  // If we still don't have enough results, add some general recommendations
  if (results.length < count) {
    // For CS students, prioritize tech-related general courses
    const backupCourses = csProfileDetected 
      ? [...COURSE_RECOMMENDATIONS['computer science'], ...COURSE_RECOMMENDATIONS['general']]
      : COURSE_RECOMMENDATIONS['general'];
      
    const additionalCourses = backupCourses.filter(
      course => !results.find(r => r.url === course.url)
    );
    results = [...results, ...additionalCourses].slice(0, count);
  }
  
  // Return just the requested number of courses
  return results.slice(0, count);
}; 