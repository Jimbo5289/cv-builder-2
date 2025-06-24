#!/usr/bin/env node

const AIAnalysisService = require('./server/src/services/aiAnalysisService');

// Test data for universal algorithm validation
const testCases = [
  {
    name: 'Emergency Services → Building Safety (Original Test)',
    cv: `John Smith
Fire Safety Officer with 8 years of experience in emergency services.

Experience:
• Fire Safety Officer at London Fire Brigade (2018 - Present)
  - Conducted fire risk assessments for commercial and residential buildings
  - Led emergency response teams and incident command operations
  - Trained new recruits in fire safety protocols and emergency procedures
  - Investigated fire incidents and produced detailed safety reports

• Paramedic at East Midlands Ambulance Service (2016 - 2018)
  - Provided emergency medical care in high-pressure situations
  - Coordinated with multiple emergency services during major incidents
  - Maintained detailed patient records and incident documentation

Education:
• Bachelor's Degree in Fire Engineering (2016)
• NEBOSH General Certificate in Health and Safety (2017)
• Fire Risk Assessment Certification (2018)

Skills: Fire safety, Risk assessment, Emergency response, Incident management, Team leadership, Report writing, Building regulations, Safety protocols`,
    
    jobDescription: `Head of Building Safety

The Head of Building Safety role is responsible for ensuring compliance with building safety regulations, managing fire risk assessments, and overseeing building safety management systems across the organization. This position requires expertise in building regulations, fire safety compliance, risk assessment, and safety management.

Key Responsibilities:
• Develop and implement building safety policies and procedures
• Conduct fire risk assessments for all properties
• Ensure compliance with building safety regulations and codes
• Manage building safety inspection programs
• Lead incident investigations related to building safety
• Provide training and guidance on building safety matters
• Collaborate with regulatory bodies and external consultants
• Maintain building safety management systems and documentation

Required Experience:
• 5+ years experience in fire safety or building safety management
• Experience in fire risk assessment and building safety
• Knowledge of building regulations and safety codes
• Leadership and team management experience
• Strong analytical and problem-solving skills

Qualifications:
• NEBOSH General Certificate or equivalent
• Building safety or fire safety qualification
• Knowledge of relevant legislation and regulations`
  },

  {
    name: 'Entry Level Graduate → Software Development',
    cv: `Sarah Johnson
Recent Computer Science Graduate

Education:
• Bachelor of Science in Computer Science (2024)
  - First Class Honours, University of Manchester
  - Final year project: Machine Learning recommendation system
  - Coursework in algorithms, data structures, web development, databases

• A-Levels: Mathematics (A*), Computer Science (A*), Physics (A)

Projects:
• E-commerce Web Application (React, Node.js, MongoDB)
• Stock Market Analysis Tool (Python, pandas, scikit-learn)
• Mobile Weather App (React Native)

Skills: Python, JavaScript, React, Node.js, SQL, MongoDB, Git, HTML/CSS, Machine Learning basics

Experience:
• Summer Intern at Local Tech Startup (2023)
  - Assisted with bug fixes and feature development
  - Learned agile development practices`,
    
    jobDescription: `Junior Software Developer

We are looking for a motivated Junior Software Developer to join our development team. This role is perfect for recent graduates or career changers looking to start their career in software development.

Key Responsibilities:
• Develop and maintain web applications using modern JavaScript frameworks
• Write clean, maintainable code following best practices
• Participate in code reviews and agile development processes
• Learn new technologies and contribute to team knowledge sharing
• Work collaboratively with senior developers and designers

Required Skills:
• Programming experience in JavaScript, Python, or similar languages
• Understanding of web development fundamentals (HTML, CSS, JavaScript)
• Familiarity with version control systems (Git)
• Basic understanding of databases and APIs
• Problem-solving and analytical thinking skills

Experience:
• 0-2 years of professional development experience
• Portfolio of personal or academic projects
• Internship or placement experience preferred but not essential

Qualifications:
• Degree in Computer Science, Software Engineering, or related field
• Demonstrable programming skills through projects or coursework`
  },

  {
    name: 'Retail Manager → Career Change to Marketing',
    cv: `Michael Brown
Retail Store Manager with 6 years of management experience

Experience:
• Store Manager at H&M (2020 - Present)
  - Managed team of 25 staff members across multiple departments
  - Achieved 15% increase in sales through strategic product placement
  - Implemented customer service training programs
  - Analyzed sales data and customer feedback to improve operations
  - Coordinated marketing campaigns and seasonal promotions

• Assistant Manager at Next (2018 - 2020)
  - Supervised daily operations and staff scheduling
  - Handled customer complaints and returns professionally
  - Assisted with inventory management and stock control

Education:
• Bachelor's Degree in Business Management (2018)
• Retail Management Certificate (2019)

Skills: Team leadership, Customer service, Sales analysis, Staff training, Inventory management, Budget management, Customer relationship management, Problem solving`,
    
    jobDescription: `Marketing Coordinator

We are seeking a Marketing Coordinator to support our marketing team with campaign development, social media management, and market research activities.

Key Responsibilities:
• Assist in developing and executing marketing campaigns
• Manage social media accounts and create engaging content
• Conduct market research and analyze customer data
• Coordinate marketing events and promotional activities
• Support the creation of marketing materials and presentations
• Monitor and report on marketing campaign performance

Required Skills:
• Strong communication and writing skills
• Social media marketing experience
• Data analysis and reporting abilities
• Creative thinking and problem-solving skills
• Project management and organizational skills
• Customer insight and market understanding

Experience:
• 2-4 years of marketing, communications, or related experience
• Experience with social media platforms and digital marketing
• Background in customer-facing roles preferred

Qualifications:
• Degree in Marketing, Communications, Business, or related field
• Digital marketing certifications preferred`
  }
];

// Test function
async function testUniversalAnalysis() {
  console.log('🔬 Testing Universal CV Analysis System\n');
  
  for (const testCase of testCases) {
    console.log(`\n📊 Testing: ${testCase.name}`);
    console.log('=' .repeat(60));
    
    try {
      const result = await AIAnalysisService.analyzeCV(
        testCase.cv, 
        null, // industry 
        null, // role
        false, // isGeneric
        testCase.jobDescription // jobDescription
      );
      
      console.log(`\n📈 Analysis Results:`);
      console.log(`Overall Score: ${result.score}/100`);
      console.log(`Analysis Type: ${result.analysisType || 'N/A'}`);
      console.log(`Career Stage: ${result.careerStage || 'N/A'}`);
      console.log(`Match Type: ${result.fieldCompatibility || 'N/A'}`);
      console.log(`Experience Level: ${result.experienceLevel || 'N/A'}`);
      
      console.log(`\n🎯 Detailed Scores:`);
      console.log(`Experience Relevance: ${result.experienceRelevance || 'N/A'}/100`);
      console.log(`Skills Alignment: ${result.skillsAlignment || 'N/A'}/100`);
      console.log(`Qualification Match: ${result.qualificationMatch || 'N/A'}/100`);
      console.log(`ATS Compliance: ${result.atsCompliance || 'N/A'}/100`);
      
      console.log(`\n💪 Strengths:`);
      (result.strengths || []).forEach((strength, i) => {
        console.log(`${i + 1}. ${strength}`);
      });
      
      console.log(`\n🎯 Recommendations:`);
      (result.recommendations || []).forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`);
      });
      
      console.log(`\n📚 Development Path:`);
      (result.improvements || []).forEach((improvement, i) => {
        console.log(`${i + 1}. ${improvement}`);
      });
      
      if (result.timeToCompetitive) {
        console.log(`\n⏱️ Time to Competitive: ${result.timeToCompetitive}`);
      }
      
      if (result.careerTransitionAdvice) {
        console.log(`\n🚀 Transition Advice: ${result.careerTransitionAdvice}`);
      }
      
      console.log(`\n✅ Test passed - Analysis completed successfully`);
      
    } catch (error) {
      console.error(`\n❌ Test failed with error:`, error.message);
      console.error('Stack trace:', error.stack);
    }
    
    console.log('\n' + '='.repeat(60));
  }
  
  console.log('\n🎉 Universal Analysis Testing Complete!');
}

// Run the test
if (require.main === module) {
  testUniversalAnalysis().catch(console.error);
}

module.exports = { testUniversalAnalysis }; 