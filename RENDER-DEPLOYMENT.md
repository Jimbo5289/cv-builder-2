# Render Deployment Guide for CV Builder

This guide provides instructions for deploying the CV Builder application to Render.

## Deployment Steps

### 1. Create a Web Service on Render

1. Log in to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository: `https://github.com/Jimbo5289/cv-builder-2`
4. Configure the service:
   - **Name**: `cv-builder-api` (or any name you prefer)
   - **Region**: Choose the region closest to your users
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `cd server && node src/index.js`
   - **Instance Type**: `Free` (for testing) or higher for production

### 2. Environment Variables

**Important**: You need to set the following environment variables in the Render dashboard:

```
PORT=3005
NODE_ENV=production
MOCK_DATABASE=true
USE_LOCAL_STORAGE=true
SKIP_AUTH_CHECK=false
DEV_USER_ID=devuser123
DEV_USER_NAME=James Singleton
FRONTEND_URL=https://cv-builder-vercel.vercel.app
JWT_SECRET=your-secure-jwt-secret-key
JWT_EXPIRY=24h
REFRESH_TOKEN_SECRET=your-secure-refresh-token-secret
REFRESH_TOKEN_EXPIRY=7d
```

To set these variables:

1. Go to your service in the Render dashboard
2. Click "Environment" tab
3. Add each key-value pair and click "Save Changes"

### 3. PostgreSQL Database (Optional)

If you want to use a real database instead of the mock database:

1. In Render dashboard, create a new PostgreSQL database
2. Copy the "Internal Database URL" from the PostgreSQL service
3. Add it as an environment variable in your web service:
   ```
   DATABASE_URL=your-postgresql-internal-url
   MOCK_DATABASE=false
   ```

### 4. Troubleshooting Common Issues

#### Database Connection Error

If you see this error:

```
Failed to connect to database: Can't reach database server at `localhost:5432`
```

**Solution**: Either:

1. Set `MOCK_DATABASE=true` in environment variables to use the mock database, or
2. Create a PostgreSQL database in Render and set the `DATABASE_URL` environment variable

#### Missing Environment Variables

If you see this error:

```
[error] : ENV file not found at: /opt/render/project/src/server/.env
```

**Solution**: Set all required environment variables directly in the Render dashboard as described above.

#### Port Issues

If there are port conflicts, Render automatically assigns the correct port, but make sure your `PORT` environment variable is set to `3005`.

### 5. Connecting Frontend and Backend

To ensure your Vercel frontend can communicate with your Render backend:

1. Update your CORS settings in `server/src/index.js` to include your Vercel domain
2. In your Vercel frontend deployment, set the `SERVER_URL` environment variable to your Render service URL (e.g., `https://cv-builder-api.onrender.com`)

## Monitoring and Logs

- View logs in the Render dashboard under the "Logs" tab
- Set up alerts for service errors or outages
- Consider adding more detailed logging with Winston (already implemented)

## Production Considerations

For a production environment, consider:

1. Upgrading from the free tier for better performance and reliability
2. Setting up a real PostgreSQL database instead of using the mock database
3. Configuring proper email settings for user communications
4. Adding Stripe for payment processing
5. Setting up Sentry for error tracking
6. Securing your JWT secrets with strong random values
