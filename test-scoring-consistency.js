/**
 * Test Script: CV Analysis Scoring Consistency
 * 
 * This script tests the fix for inconsistent CV analysis scores.
 * It should now return identical scores for identical CV content.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server/.env') });

const AIAnalysisService = require('./server/src/services/aiAnalysisService');

// Sample CV content for testing
const testCV = `
John Smith
Senior Software Engineer

EXPERIENCE:
- Software Engineer at TechCorp (2020-2024)
- Developed React applications with Node.js backend
- Led team of 5 developers on microservices architecture
- Implemented CI/CD pipelines using Docker and Kubernetes

SKILLS:
JavaScript, React, Node.js, Python, AWS, Docker, Kubernetes

EDUCATION:
Bachelor of Computer Science, University of Technology (2016-2020)
`;

const testJobDescription = `
Senior Full Stack Developer
Requirements:
- 3+ years experience with React and Node.js
- Experience with cloud platforms (AWS/Azure)
- Knowledge of containerization (Docker/Kubernetes)
- Strong JavaScript and Python skills
- Bachelor's degree in Computer Science or related field
`;

async function testScoringConsistency() {
  console.log('🧪 Testing CV Analysis Scoring Consistency...\n');
  
  const aiService = new AIAnalysisService();
  const results = [];
  
  try {
    // Run the same analysis 3 times
    for (let i = 1; i <= 3; i++) {
      console.log(`📊 Running analysis ${i}/3...`);
      
      const result = await aiService.analyzeCV(
        testCV,
        'technology',
        'software-engineer',
        false,
        testJobDescription
      );
      
      results.push({
        run: i,
        score: result.score,
        fromCache: result.analysisMetadata?.fromCache || false,
        cacheAge: result.analysisMetadata?.cacheAge || 0,
        processingTime: result.analysisMetadata?.processingTime || 0
      });
      
      console.log(`   Score: ${result.score}% | From Cache: ${result.analysisMetadata?.fromCache || false}`);
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Analyze results
    console.log('\n📈 Results Summary:');
    console.log('==================');
    
    const scores = results.map(r => r.score);
    const uniqueScores = [...new Set(scores)];
    
    console.log(`Run 1: ${results[0].score}% (${results[0].processingTime}ms)`);
    console.log(`Run 2: ${results[1].score}% (from cache: ${results[1].fromCache})`);
    console.log(`Run 3: ${results[2].score}% (from cache: ${results[2].fromCache})`);
    
    console.log(`\nUnique Scores: ${uniqueScores.length}`);
    console.log(`All Scores: [${scores.join(', ')}]`);
    
    if (uniqueScores.length === 1) {
      console.log('\n✅ SUCCESS: All scores are identical!');
      console.log('   The scoring consistency issue has been fixed.');
    } else {
      console.log('\n❌ ISSUE: Scores are still inconsistent.');
      console.log('   Further investigation needed.');
    }
    
  } catch (error) {
    console.error('\n❌ Error during testing:', error.message);
    
    if (error.message.includes('API key')) {
      console.log('\n💡 Note: This test requires OpenAI/Anthropic API keys.');
      console.log('   Without API keys, the system uses algorithmic analysis only.');
      console.log('   Algorithmic analysis should be fully deterministic.');
    }
  }
}

// Run the test
if (require.main === module) {
  testScoringConsistency()
    .then(() => {
      console.log('\n🏁 Test completed.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testScoringConsistency }; 