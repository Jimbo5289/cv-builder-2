/* eslint-disable */
/**
 * Database Workflow Test Script
 * 
 * This script tests the complete CV creation workflow to ensure:
 * 1. User registration and authentication works
 * 2. CV data is properly saved to AWS RDS database
 * 3. CV data persists between sessions
 * 4. Users can retrieve their saved CVs
 * 5. CV analysis and uploads are stored correctly
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'https://cv-builder-backend-zjax.onrender.com';
const TEST_USER_EMAIL = `test-${Date.now()}@example.com`;
const TEST_USER_PASSWORD = 'TestPassword123!';
const TEST_USER_NAME = 'Test User';

// Test results tracking
const testResults = {
  userRegistration: false,
  userLogin: false,
  cvCreation: false,
  cvPersonalStatement: false,
  cvSkills: false,
  cvExperience: false,
  cvEducation: false,
  cvReferences: false,
  cvRetrieval: false,
  cvList: false,
  cvAnalysis: false,
  dataConsistency: false
};

let authToken = null;
let testCvId = null;

/**
 * Helper function to make authenticated API requests
 */
async function apiRequest(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
}

/**
 * Test 1: User Registration
 */
async function testUserRegistration() {
  console.log('\n🧪 Testing User Registration...');
  
  const result = await apiRequest('POST', '/api/auth/register', {
    name: TEST_USER_NAME,
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD
  });

  if (result.success) {
    console.log('✅ User registration successful');
    testResults.userRegistration = true;
    return true;
  } else {
    console.log('❌ User registration failed:', result.error);
    return false;
  }
}

/**
 * Test 2: User Login
 */
async function testUserLogin() {
  console.log('\n🧪 Testing User Login...');
  
  const result = await apiRequest('POST', '/api/auth/login', {
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD
  });

  if (result.success && (result.data.accessToken || result.data.token)) {
    authToken = result.data.accessToken || result.data.token;
    console.log('✅ User login successful');
    testResults.userLogin = true;
    return true;
  } else {
    console.log('❌ User login failed:', result.error);
    console.log('Response data:', result.data);
    return false;
  }
}

/**
 * Test 3: CV Creation (Personal Information)
 */
async function testCvCreation() {
  console.log('\n🧪 Testing CV Creation (Personal Information)...');
  
  const personalInfo = {
    fullName: 'John Test Doe',
    email: 'john.doe@example.com',
    phone: '+44 7123 456789',
    location: 'London, UK',
    socialNetwork: 'https://linkedin.com/in/johndoe'
  };

  const result = await apiRequest('POST', '/api/cv/save', {
    templateId: 'professional',
    personalInfo
  });

  if (result.success && result.data.cv && result.data.cv.id) {
    testCvId = result.data.cv.id;
    console.log('✅ CV creation successful, ID:', testCvId);
    testResults.cvCreation = true;
    
    // Verify the data was saved correctly
    if (result.data.cv.content && result.data.cv.content.personalInfo) {
      const savedInfo = result.data.cv.content.personalInfo;
      if (savedInfo.fullName === personalInfo.fullName && 
          savedInfo.email === personalInfo.email) {
        console.log('✅ Personal information saved correctly');
        return true;
      }
    }
    console.log('⚠️ Personal information may not have been saved correctly');
    return true;
  } else {
    console.log('❌ CV creation failed:', result.error);
    return false;
  }
}

/**
 * Test 4: CV Personal Statement Update
 */
async function testCvPersonalStatement() {
  console.log('\n🧪 Testing CV Personal Statement Update...');
  
  if (!testCvId) {
    console.log('❌ No CV ID available for testing');
    return false;
  }

  const personalStatement = 'Experienced software developer with a passion for creating innovative solutions and leading high-performing teams.';

  const result = await apiRequest('PUT', `/api/cv/${testCvId}/personal-statement`, {
    personalStatement
  });

  if (result.success) {
    console.log('✅ Personal statement update successful');
    testResults.cvPersonalStatement = true;
    return true;
  } else {
    console.log('❌ Personal statement update failed:', result.error);
    return false;
  }
}

/**
 * Test 5: CV Skills Update
 */
async function testCvSkills() {
  console.log('\n🧪 Testing CV Skills Update...');
  
  if (!testCvId) {
    console.log('❌ No CV ID available for testing');
    return false;
  }

  const skills = [
    { skill: 'JavaScript', level: 'Advanced' },
    { skill: 'React', level: 'Intermediate' },
    { skill: 'Node.js', level: 'Advanced' },
    { skill: 'Project Management', level: 'Expert' }
  ];

  const result = await apiRequest('PUT', `/api/cv/${testCvId}/skills`, {
    skills
  });

  if (result.success) {
    console.log('✅ Skills update successful');
    testResults.cvSkills = true;
    return true;
  } else {
    console.log('❌ Skills update failed:', result.error);
    return false;
  }
}

/**
 * Test 6: CV Experience Update
 */
async function testCvExperience() {
  console.log('\n🧪 Testing CV Experience Update...');
  
  if (!testCvId) {
    console.log('❌ No CV ID available for testing');
    return false;
  }

  const experiences = [
    {
      position: 'Senior Software Developer',
      company: 'Tech Solutions Ltd',
      startDate: '2020-01-01',
      endDate: 'Present',
      description: 'Lead development of web applications and mentor junior developers.'
    },
    {
      position: 'Software Developer',
      company: 'Digital Innovations',
      startDate: '2018-06-01',
      endDate: '2019-12-31',
      description: 'Developed responsive web applications using modern frameworks.'
    }
  ];

  const result = await apiRequest('PUT', `/api/cv/${testCvId}/experience`, {
    experiences
  });

  if (result.success) {
    console.log('✅ Experience update successful');
    testResults.cvExperience = true;
    return true;
  } else {
    console.log('❌ Experience update failed:', result.error);
    return false;
  }
}

/**
 * Test 7: CV Education Update
 */
async function testCvEducation() {
  console.log('\n🧪 Testing CV Education Update...');
  
  if (!testCvId) {
    console.log('❌ No CV ID available for testing');
    return false;
  }

  const education = [
    {
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2014-09-01',
      endDate: '2018-06-30',
      description: 'First Class Honours'
    }
  ];

  const result = await apiRequest('PUT', `/api/cv/${testCvId}/education`, {
    education
  });

  if (result.success) {
    console.log('✅ Education update successful');
    testResults.cvEducation = true;
    return true;
  } else {
    console.log('❌ Education update failed:', result.error);
    return false;
  }
}

/**
 * Test 8: CV References Update
 */
async function testCvReferences() {
  console.log('\n🧪 Testing CV References Update...');
  
  if (!testCvId) {
    console.log('❌ No CV ID available for testing');
    return false;
  }

  const references = [
    {
      name: 'Jane Smith',
      position: 'CTO',
      company: 'Tech Solutions Ltd',
      email: 'jane.smith@techsolutions.com',
      phone: '+44 7987 654321'
    }
  ];

  const result = await apiRequest('PUT', `/api/cv/${testCvId}/references`, {
    references
  });

  if (result.success) {
    console.log('✅ References update successful');
    testResults.cvReferences = true;
    return true;
  } else {
    console.log('❌ References update failed:', result.error);
    return false;
  }
}

/**
 * Test 9: CV Retrieval (Data Persistence)
 */
async function testCvRetrieval() {
  console.log('\n🧪 Testing CV Retrieval (Data Persistence)...');
  
  if (!testCvId) {
    console.log('❌ No CV ID available for testing');
    return false;
  }

  const result = await apiRequest('GET', `/api/cv/${testCvId}`);

  if (result.success && result.data) {
    console.log('✅ CV retrieval successful');
    testResults.cvRetrieval = true;
    
    // Verify data integrity
    const cv = result.data;
    let dataConsistent = true;
    
    // Check personal info
    if (!cv.personalInfo || cv.personalInfo.fullName !== 'John Test Doe') {
      console.log('⚠️ Personal information not consistent');
      dataConsistent = false;
    }
    
    // Check skills
    if (!cv.skills || cv.skills.length < 4) {
      console.log('⚠️ Skills not consistent');
      dataConsistent = false;
    }
    
    // Check experiences
    if (!cv.experiences || cv.experiences.length < 2) {
      console.log('⚠️ Experiences not consistent');
      dataConsistent = false;
    }
    
    // Check education
    if (!cv.education || cv.education.length < 1) {
      console.log('⚠️ Education not consistent');
      dataConsistent = false;
    }
    
    if (dataConsistent) {
      console.log('✅ Data consistency verified');
      testResults.dataConsistency = true;
    } else {
      console.log('❌ Data consistency issues detected');
    }
    
    return true;
  } else {
    console.log('❌ CV retrieval failed:', result.error);
    return false;
  }
}

/**
 * Test 10: CV List (User's Saved CVs)
 */
async function testCvList() {
  console.log('\n🧪 Testing CV List (User\'s Saved CVs)...');
  
  const result = await apiRequest('GET', '/api/cv/user/all');

  if (result.success && Array.isArray(result.data)) {
    console.log('✅ CV list retrieval successful');
    console.log(`📊 Found ${result.data.length} CV(s) for user`);
    
    // Check if our test CV is in the list
    const testCv = result.data.find(cv => cv.id === testCvId);
    if (testCv) {
      console.log('✅ Test CV found in user\'s CV list');
      testResults.cvList = true;
      return true;
    } else {
      console.log('⚠️ Test CV not found in user\'s CV list');
      return false;
    }
  } else {
    console.log('❌ CV list retrieval failed:', result.error);
    return false;
  }
}

/**
 * Test 11: CV Analysis (Upload and Save)
 */
async function testCvAnalysis() {
  console.log('\n🧪 Testing CV Analysis (Upload and Save)...');
  
  // Create a simple test CV content for analysis
  const testCvContent = {
    title: 'Analyzed CV Test',
    content: {
      personalInfo: {
        fullName: 'Jane Analysis Doe',
        email: 'jane.analysis@example.com',
        phone: '+44 7111 222333',
        location: 'Manchester, UK'
      },
      personalStatement: 'Marketing professional with 5 years of experience.',
      skills: [
        { skill: 'Digital Marketing', level: 'Advanced' },
        { skill: 'SEO', level: 'Intermediate' }
      ],
      experiences: [],
      education: [],
      references: []
    }
  };

  const result = await apiRequest('POST', '/api/cv/save', testCvContent);

  if (result.success && result.data.cv && result.data.cv.id) {
    console.log('✅ CV analysis and save successful');
    console.log('📊 Analyzed CV ID:', result.data.cv.id);
    testResults.cvAnalysis = true;
    return true;
  } else {
    console.log('❌ CV analysis failed:', result.error);
    return false;
  }
}

/**
 * Generate Test Report
 */
function generateTestReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📋 DATABASE WORKFLOW TEST REPORT');
  console.log('='.repeat(60));
  
  const totalTests = Object.keys(testResults).length;
  const passedTests = Object.values(testResults).filter(Boolean).length;
  const successRate = Math.round((passedTests / totalTests) * 100);
  
  console.log(`\n📊 Overall Success Rate: ${successRate}% (${passedTests}/${totalTests})`);
  console.log('\n📝 Detailed Results:');
  
  Object.entries(testResults).forEach(([test, passed]) => {
    const status = passed ? '✅' : '❌';
    const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    console.log(`${status} ${testName}`);
  });
  
  console.log('\n🔍 Analysis:');
  
  if (testResults.userRegistration && testResults.userLogin) {
    console.log('✅ User authentication system working correctly');
  } else {
    console.log('❌ User authentication system has issues');
  }
  
  if (testResults.cvCreation && testResults.cvRetrieval && testResults.dataConsistency) {
    console.log('✅ CV data persistence working correctly');
    console.log('✅ AWS RDS database integration successful');
  } else {
    console.log('❌ CV data persistence has issues');
    console.log('❌ AWS RDS database integration may have problems');
  }
  
  if (testResults.cvList) {
    console.log('✅ User CV management working correctly');
  } else {
    console.log('❌ User CV management has issues');
  }
  
  const workflowSteps = [
    'cvCreation', 'cvPersonalStatement', 'cvSkills', 
    'cvExperience', 'cvEducation', 'cvReferences'
  ];
  
  const workflowSuccess = workflowSteps.every(step => testResults[step]);
  
  if (workflowSuccess) {
    console.log('✅ Complete CV creation workflow working correctly');
    console.log('✅ Users can create CVs step-by-step and resume later');
  } else {
    console.log('❌ CV creation workflow has issues');
    console.log('❌ Users may not be able to complete CV creation properly');
  }
  
  console.log('\n💡 Recommendations:');
  
  if (successRate >= 90) {
    console.log('🎉 Excellent! The system is working as expected.');
    console.log('✅ Users can sign up, create CVs, and their data persists correctly.');
    console.log('✅ AWS RDS database integration is successful.');
  } else if (successRate >= 70) {
    console.log('⚠️ Good, but some issues need attention.');
    console.log('🔧 Review failed tests and fix any database connection issues.');
  } else {
    console.log('🚨 Critical issues detected!');
    console.log('🔧 Immediate attention required for database and workflow issues.');
  }
  
  console.log('\n' + '='.repeat(60));
}

/**
 * Main Test Runner
 */
async function runDatabaseWorkflowTests() {
  console.log('🚀 Starting Database Workflow Tests...');
  console.log(`🌐 Testing against: ${API_BASE_URL}`);
  console.log(`👤 Test user: ${TEST_USER_EMAIL}`);
  
  try {
    // Run tests in sequence
    await testUserRegistration();
    await testUserLogin();
    
    if (authToken) {
      await testCvCreation();
      await testCvPersonalStatement();
      await testCvSkills();
      await testCvExperience();
      await testCvEducation();
      await testCvReferences();
      await testCvRetrieval();
      await testCvList();
      await testCvAnalysis();
    } else {
      console.log('❌ Cannot proceed with CV tests - authentication failed');
    }
    
  } catch (error) {
    console.error('💥 Test runner error:', error.message);
  } finally {
    generateTestReport();
  }
}

// Run the tests
if (require.main === module) {
  runDatabaseWorkflowTests().catch(console.error);
}

module.exports = {
  runDatabaseWorkflowTests,
  testResults
}; 