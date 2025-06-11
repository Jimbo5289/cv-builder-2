# Deploying to Render

This document outlines the steps to deploy the CV Builder application to Render.

## Deployment Steps

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Configure the following settings:
   - **Name**: cv-builder-2
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `cd server && npm run render:start`

## Environment Variables

Set the following environment variables in your Render dashboard:

```
NODE_ENV=production
PORT=3005
DATABASE_URL=postgresql://username:password@your-aws-rds-instance.amazonaws.com:5432/your_database_name
FRONTEND_URL=https://cv-builder-2.onrender.com
JWT_SECRET=your-secure-jwt-secret
JWT_REFRESH_SECRET=your-secure-refresh-token-secret
```

### AWS RDS PostgreSQL Configuration

For connecting to an AWS RDS PostgreSQL instance:

1. Ensure your RDS instance allows connections from Render IP addresses
2. Set the `DATABASE_URL` environment variable with your AWS RDS connection string
3. The application will automatically configure SSL for AWS RDS connections
4. If your database requires additional configuration, you can add query parameters to the DATABASE_URL:
   ```
   DATABASE_URL=postgresql://username:password@your-aws-rds-instance.amazonaws.com:5432/your_database_name?schema=public&connection_limit=5
   ```

### Fallback to Mock Database

If the application fails to connect to the PostgreSQL database:

1. It will automatically fall back to using the mock database
2. You'll see the message "Falling back to mock database client due to connection failure" in the logs
3. To intentionally use the mock database, set `MOCK_DATABASE=true` and remove `DATABASE_URL`

## Troubleshooting

If you encounter the error "Failed to connect to database", it's likely because:

1. You're trying to connect to a local database (`localhost:5432`)
2. The `DATABASE_URL` environment variable is not set

Solutions:

- Set `MOCK_DATABASE=true` to use the mock database
- Or configure a proper `DATABASE_URL` pointing to your Render PostgreSQL instance

## Frontend Configuration

If you're deploying the frontend and backend separately:

1. Set `FRONTEND_URL` to your frontend URL (e.g., `https://cv-builder-2-frontend.onrender.com`)
2. Update the backend URL in your frontend code to point to your backend service URL

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
