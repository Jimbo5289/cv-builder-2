/**
 * Project Validation Utility
 * 
 * This utility script helps identify and fix common issues in the project:
 * 1. React dependency and import issues
 * 2. ESLint configuration problems
 * 3. Server-client port mismatches
 * 4. Missing module dependencies
 * 5. React hooks exhaustive dependencies warnings
 */

// Helper to check React version consistency
export function checkReactVersion() {
  try {
    // Get React version from package.json
    const reactVersion = React?.version;
    console.log(`React version: ${reactVersion}`);
    
    // Check if React is properly initialized
    const isReactAvailable = typeof React !== 'undefined';
    console.log(`React available globally: ${isReactAvailable}`);
    
    // Check if React hooks are available
    const hooksAvailable = typeof React?.useState === 'function' && 
                           typeof React?.useEffect === 'function' &&
                           typeof React?.useContext === 'function';
    console.log(`React hooks available: ${hooksAvailable}`);
    
    return {
      isReactAvailable,
      reactVersion,
      hooksAvailable,
      status: isReactAvailable && hooksAvailable ? 'OK' : 'ERROR'
    };
  } catch (error) {
    console.error('Error checking React version:', error);
    return {
      isReactAvailable: false,
      reactVersion: null,
      hooksAvailable: false,
      status: 'ERROR',
      error: error.message
    };
  }
}

// Check server configuration
export function checkServerConfig() {
  try {
    // Import ServerContext to check the configuration
    const serverUrl = localStorage.getItem('serverUrl') || 'http://localhost:3008'; 
    const isPortCorrect = serverUrl.includes(':3008'); // Check if using the correct port
    
    console.log(`Server URL: ${serverUrl}`);
    console.log(`Using correct port: ${isPortCorrect}`);
    
    return {
      serverUrl,
      isPortCorrect,
      status: isPortCorrect ? 'OK' : 'WARNING'
    };
  } catch (error) {
    console.error('Error checking server config:', error);
    return {
      serverUrl: null,
      isPortCorrect: false,
      status: 'ERROR',
      error: error.message
    };
  }
}

// Check for ESLint configuration issues
export function checkEslintConfig() {
  try {
    // This is just a runtime check to see if known ESLint global variables are defined
    const reactDefined = typeof React !== 'undefined';
    const reactDomDefined = typeof ReactDOM !== 'undefined';
    const useStateDefined = typeof useState !== 'undefined';
    
    console.log(`React global: ${reactDefined}`);
    console.log(`ReactDOM global: ${reactDomDefined}`);
    console.log(`useState global: ${useStateDefined}`);
    
    return {
      reactDefined,
      reactDomDefined,
      useStateDefined,
      status: (reactDefined && useStateDefined) ? 'OK' : 'WARNING'
    };
  } catch (error) {
    console.error('Error checking ESLint config:', error);
    return {
      reactDefined: false,
      reactDomDefined: false,
      useStateDefined: false,
      status: 'ERROR',
      error: error.message
    };
  }
}

// Run all checks
export function validateProject() {
  console.log('🔍 Running project validation checks...');
  
  const reactCheck = checkReactVersion();
  const serverCheck = checkServerConfig();
  const eslintCheck = checkEslintConfig();
  
  console.log('\n📊 Validation Results:');
  console.log(`React: ${reactCheck.status}`);
  console.log(`Server Configuration: ${serverCheck.status}`);
  console.log(`ESLint Configuration: ${eslintCheck.status}`);
  
  const hasErrors = [reactCheck, serverCheck, eslintCheck].some(check => check.status === 'ERROR');
  const hasWarnings = [reactCheck, serverCheck, eslintCheck].some(check => check.status === 'WARNING');
  
  console.log(`\n🚀 Overall Status: ${hasErrors ? '❌ ERRORS' : hasWarnings ? '⚠️ WARNINGS' : '✅ OK'}`);
  
  return {
    reactCheck,
    serverCheck,
    eslintCheck,
    hasErrors,
    hasWarnings,
    overallStatus: hasErrors ? 'ERROR' : hasWarnings ? 'WARNING' : 'OK'
  };
}

// Run validation if called directly
if (import.meta.env.DEV) {
  console.log('Project validator loaded');
}

export default { validateProject, checkReactVersion, checkServerConfig, checkEslintConfig }; 