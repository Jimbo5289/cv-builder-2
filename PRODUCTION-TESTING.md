# CV Builder Production Testing Guide

This document outlines the process for testing the CV Builder application in a production-like environment before final deployment.

## Prerequisites

- Node.js v16+ installed
- npm v8+ installed
- curl installed (for health checks)

## Testing Process

### 1. Setup Production Test Environment

Run the production testing script:

```bash
node start-production-test.js
```

This script will:

- Kill any conflicting processes on ports 3005-3007 and 5173-5175
- Build the frontend for production
- Start the backend server in production mode with mock database
- Serve the built frontend files using a static server
- Configure proper environment variables for production testing

### 2. Testing Checklist

Once the application is running in production test mode, perform these checks:

#### Backend Checks

- [ ] Server starts without errors
- [ ] Health endpoint returns 200 (`curl http://localhost:3005/health`)
- [ ] API endpoints return expected responses (`curl http://localhost:3005/api/health`)
- [ ] Mock authentication works correctly

#### Frontend Checks

- [ ] Application loads without errors
- [ ] User can register/login
- [ ] All pages render correctly
- [ ] CV creation flow works end-to-end
- [ ] Data persists between pages
- [ ] CV preview renders correctly
- [ ] Download functionality works

#### Feature Checks

- [ ] Personal Information form works
- [ ] Skills section works
- [ ] Experience section works
- [ ] Education section works
- [ ] References section works
- [ ] CV preview and generation works
- [ ] PDF download works
- [ ] Print functionality works

### 3. Mobile and Cross-Browser Testing

Test the application on:

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile devices (or responsive mode in DevTools)

### 4. Performance Checks

- [ ] Page load times are acceptable
- [ ] UI interactions are responsive
- [ ] No memory leaks during extended use
- [ ] No console errors

## Known Issues and Workarounds

1. **Socket.IO Error**: The setupSocketIO error has been fixed by removing the call from the server code.

2. **Port Conflicts**: The production testing script automatically handles port conflicts by finding available ports.

3. **CORS Issues**: The server is configured to accept connections from multiple frontend origins.

## Deploying to Production

After successful testing, follow these steps for production deployment:

1. Make sure all tests pass
2. Create a production build: `npm run build`
3. Deploy backend server to production hosting
4. Deploy frontend build to static hosting
5. Configure environment variables on production servers
6. Test the live deployment

## Rollback Procedure

If issues are found in production:

1. Identify the specific issue
2. If critical, roll back to the previous stable version
3. Fix the issue in development
4. Re-test using the production testing procedure
5. Deploy the fixed version

## Support

If you encounter any issues during testing, please document them with:

- Clear description of the issue
- Steps to reproduce
- Screenshots or error logs
- Environment details
