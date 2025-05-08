// API configuration
const PRIMARY_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';
const FALLBACK_API_URL = 'http://localhost:3006';

// Current API URL - will be updated based on health check
let API_URL = PRIMARY_API_URL;

// Helper function to check if the API is available
const checkApiHealth = async (url) => {
  try {
    const response = await fetch(`${url}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'include'
    });
    
    if (!response.ok) {
      console.error(`API health check failed for ${url}:`, await response.text());
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`API health check failed for ${url}:`, error);
    return false;
  }
};

export const getApiUrl = (endpoint) => {
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${formattedEndpoint}`;
};

// Initialize API health check with fallback
const initializeApiConnection = async () => {
  // Try primary URL first
  const isPrimaryHealthy = await checkApiHealth(PRIMARY_API_URL);
  
  if (isPrimaryHealthy) {
    API_URL = PRIMARY_API_URL;
    console.log(`Successfully connected to API at ${API_URL}`);
    return;
  }
  
  // Try fallback URL
  const isFallbackHealthy = await checkApiHealth(FALLBACK_API_URL);
  
  if (isFallbackHealthy) {
    API_URL = FALLBACK_API_URL;
    console.log(`Successfully connected to API at ${API_URL}`);
    return;
  }
  
  // No working API endpoint found
  console.error(`Warning: API server is not responding at ${PRIMARY_API_URL} or ${FALLBACK_API_URL}. Please ensure the server is running.`);
};

// Initialize the connection
initializeApiConnection();

export default {
  get API_URL() { return API_URL; },
  getApiUrl,
  checkApiHealth
}; 