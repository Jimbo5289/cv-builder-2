# CV Builder Deployment Guide

This document outlines the deployment configuration for the CV Builder application.

## Architecture

The application is deployed with the following architecture:

- **Frontend**: Deployed on Vercel

  - URL: https://cv-builder-vercel.vercel.app
  - Repository: https://github.com/Jimbo5289/cv-builder-2

- **Backend**: Deployed on Render
  - URL: https://cv-builder-api.onrender.com
  - API Base URL: https://cv-builder-api.onrender.com/api

## Configuration

### Frontend Configuration

The frontend application needs to be configured with the correct backend URL:

1. The backend URL is set in `src/context/ServerContext.jsx`
2. CORS is configured on the backend to allow requests from the Vercel domain

### Backend Configuration

The backend needs the following environment variables:

```
NODE_ENV=production
PORT=3005
FRONTEND_URL=https://cv-builder-vercel.vercel.app
MOCK_DATABASE=true
JWT_SECRET=your-jwt-secret
SKIP_AUTH_CHECK=false
```

## Deployment Steps

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set the build command to `npm run build`
3. Set the output directory to `dist`
4. Deploy

### Backend Deployment (Render)

1. Connect your GitHub repository to Render
2. Set the build command to `cd server && npm install`
3. Set the start command to `cd server && node src/index.js`
4. Add the environment variables listed above
5. Deploy

## Troubleshooting

### CORS Issues

If you experience CORS issues, ensure that:

1. The frontend URL is correctly added to the CORS allowed origins in `server/src/index.js`
2. The `credentials` option is set to `true` in the CORS configuration
3. The frontend is using the correct backend URL

### Connection Issues

If the frontend cannot connect to the backend:

1. Check that the backend is running (health check at `/api/health`)
2. Verify that the ServerContext is using the correct URL
3. Check for network errors in the browser console
4. Ensure that the frontend can reach the backend (no firewalls blocking)

### Authentication Issues

If users cannot log in:

1. Ensure the JWT_SECRET is correctly set
2. Check that the token is being correctly stored and sent with requests
3. Verify that the authentication routes are working correctly

## Monitoring

- Backend logs are available in the Render dashboard
- Frontend errors can be monitored in browser consoles or by implementing error tracking
