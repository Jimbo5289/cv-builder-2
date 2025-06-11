# React Frontend API Configuration Guide

This guide explains how the CV Builder frontend connects to the backend API, following the best practices recommended by ChatGPT.

## Key Configuration Files

### 1. `src/utils/api.js`

Central API configuration file that:

- Sets up Axios with the base URL from environment variables
- Configures credentials for authentication
- Defines API endpoints in a centralized object

```javascript
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3005";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

// Centralized endpoint configuration
const apiConfig = {
  auth: {
    /* endpoints */
  },
  cv: {
    /* endpoints */
  },
};

export default api;
export { apiConfig, API_BASE_URL };
```

### 2. `src/context/ServerContext.jsx`

Context provider that:

- Makes the API configuration available throughout the app
- Handles server connection status
- Provides connection retry functionality

### 3. `src/utils/authApiExample.js`

Example of API usage that:

- Implements authentication functions using the API configuration
- Shows proper error handling
- Follows best practices for API calls

## Best Practices Implemented

### 1. Using Environment Variables

The API base URL is configured from the `VITE_API_BASE_URL` environment variable, with a fallback for local development:

```javascript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3005";
```

### 2. Authentication with Credentials

All requests include credentials (cookies) for authentication:

```javascript
api.defaults.withCredentials = true;
```

### 3. Centralized API Configuration

All API endpoints are defined in one place for easy maintenance:

```javascript
const apiConfig = {
  auth: {
    login: "/auth/login",
    // other endpoints...
  },
  // other resources...
};
```

### 4. CORS Configuration

The backend handles CORS headers to allow cross-origin requests from the frontend.

## Setup for New Environments

1. Create a `.env` file in the project root with:

   ```
   VITE_API_BASE_URL=https://your-backend-url.com
   ```

2. For local development, the default URL will be `http://localhost:3005`

3. For production, set the environment variable in your hosting platform (Vercel, Netlify, etc.)

## Example API Call

```javascript
import api, { apiConfig } from "../utils/api";

const loginUser = async (email, password) => {
  try {
    const response = await api.post(apiConfig.auth.login, { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};
```
