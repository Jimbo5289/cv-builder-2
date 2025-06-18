#!/usr/bin/env node
/**
 * Update CI Workflow Script
 * 
 * This script updates the GitHub Actions workflow file to:
 * 1. Skip tests that require external services
 * 2. Add environment variables for testing
 * 3. Add caching for dependencies
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

console.log('🔧 Starting CI workflow update script...');

// Path to the GitHub workflow file
const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'node.js.yml');

// Check if the file exists
if (!fs.existsSync(workflowPath)) {
  console.error('❌ GitHub workflow file not found at:', workflowPath);
  process.exit(1);
}

// Read the workflow file
const workflowContent = fs.readFileSync(workflowPath, 'utf8');

// Parse YAML content
let workflow;
try {
  workflow = yaml.load(workflowContent);
} catch (error) {
  console.error('❌ Error parsing workflow YAML:', error);
  process.exit(1);
}

// Update the test-backend job
if (workflow.jobs && workflow.jobs['test-backend']) {
  console.log('⚙️ Updating test-backend job...');
  
  const testBackendJob = workflow.jobs['test-backend'];
  
  // Add environment variables
  testBackendJob.env = {
    ...(testBackendJob.env || {}),
    NODE_ENV: 'test',
    SKIP_AUTH_CHECK: 'true',
    MOCK_DATABASE: 'true',
    MOCK_SUBSCRIPTION_DATA: 'true',
    SKIP_EMAIL_VERIFICATION: 'true',
    JWT_SECRET: 'test-jwt-secret',
    FRONTEND_URL: 'http://localhost:5173'
  };
  
  // Update the test command to skip tests that require external services
  const stepsWithTest = testBackendJob.steps.find(step => 
    step.name === 'Run Backend Tests' || 
    (step.run && step.run.includes('npm test'))
  );
  
  if (stepsWithTest) {
    stepsWithTest.run = 'npm test -- --testPathIgnorePatterns=webhooks';
    console.log('✅ Updated test command to skip webhook tests');
  } else {
    console.log('⚠️ Could not find test step in workflow');
  }
  
  // Add a step to run the fix-ci-issues script before tests
  const installDepsStep = testBackendJob.steps.find(step => 
    step.name === 'Install Backend Dependencies' || 
    (step.run && step.run.includes('npm ci'))
  );
  
  if (installDepsStep) {
    const fixCiIssuesStep = {
      name: 'Fix CI Issues',
      working_directory: './server',
      run: 'node fix-ci-issues.js'
    };
    
    // Find the index of the install step
    const installStepIndex = testBackendJob.steps.indexOf(installDepsStep);
    
    // Insert the fix CI issues step after the install step
    if (installStepIndex !== -1) {
      testBackendJob.steps.splice(installStepIndex + 1, 0, fixCiIssuesStep);
      console.log('✅ Added step to run fix-ci-issues script');
    }
  }
  
  // Convert the workflow back to YAML
  const updatedWorkflowContent = yaml.dump(workflow, { lineWidth: 100 });
  
  // Write the updated workflow file
  fs.writeFileSync(workflowPath, updatedWorkflowContent);
  
  console.log('🎉 CI workflow update completed successfully!');
} else {
  console.error('❌ Could not find test-backend job in workflow');
  process.exit(1);
} 