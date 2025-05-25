// Course recommendations based on identified skills gaps
export const COURSE_RECOMMENDATIONS = {
  // Technical skills
  'programming': [
    { 
      title: 'Introduction to Python Programming',
      provider: 'Alison',
      url: 'https://alison.com/course/introduction-to-python-programming',
      level: 'Beginner'
    },
    { 
      title: 'JavaScript - The Complete Guide 2023', 
      provider: 'Alison',
      url: 'https://alison.com/course/javascript-the-complete-guide', 
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
      provider: 'Coursera',
      url: 'https://www.coursera.org/learn/introduction-to-data-analytics', 
      level: 'Beginner'
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
    }
  ],
  
  // Soft skills
  'communication': [
    { 
      title: 'Business Communication - Developing Effective Communication Skills',
      provider: 'Alison',
      url: 'https://alison.com/course/business-communication-developing-effective-communication-skills', 
      level: 'Beginner'
    }
  ],
  'leadership': [
    { 
      title: 'Leadership Skills in Business',
      provider: 'Alison',
      url: 'https://alison.com/course/leadership-skills-in-business', 
      level: 'Intermediate'
    }
  ],
  'teamwork': [
    { 
      title: 'Teamwork Skills: Communicating Effectively in Groups',
      provider: 'Coursera',
      url: 'https://www.coursera.org/learn/teamwork-skills-effective-communication', 
      level: 'Beginner'
    }
  ],
  
  // Industry-specific skills
  'healthcare': [
    { 
      title: 'Introduction to Healthcare',
      provider: 'Alison',
      url: 'https://alison.com/course/introduction-to-healthcare', 
      level: 'Beginner'
    },
    { 
      title: 'Diploma in Healthcare Management',
      provider: 'Alison',
      url: 'https://alison.com/course/diploma-in-healthcare-management', 
      level: 'Advanced'
    }
  ],
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
  'education': [
    { 
      title: 'Teaching Skills for Teachers',
      provider: 'Alison',
      url: 'https://alison.com/course/teaching-skills-for-teachers', 
      level: 'Beginner'
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
  
  // Certifications and qualifications
  'iosh': [
    { 
      title: 'IOSH Managing Safely',
      provider: 'IOSH',
      url: 'https://alison.com/course/health-and-safety-in-the-workplace-revised', 
      level: 'Intermediate'
    }
  ],
  'first aid': [
    { 
      title: 'First Aid at Work',
      provider: 'Alison',
      url: 'https://alison.com/course/first-aid-cpr-and-aed-advanced', 
      level: 'Beginner'
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

// Helper function to find recommendations based on keywords
export const findCourseRecommendations = (keywords = [], count = 3) => {
  if (!keywords || keywords.length === 0) {
    return COURSE_RECOMMENDATIONS.general.slice(0, count);
  }

  let results = [];
  
  // Convert keywords to lowercase for case-insensitive matching
  const normalizedKeywords = keywords.map(kw => kw.toLowerCase());
  
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
  
  // If we don't have enough results, add some general recommendations
  if (results.length < count) {
    const generalCourses = COURSE_RECOMMENDATIONS.general.filter(
      course => !results.find(r => r.url === course.url)
    );
    results = [...results, ...generalCourses].slice(0, count);
  }
  
  // Return just the requested number of courses
  return results.slice(0, count);
}; 