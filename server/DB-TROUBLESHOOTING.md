# Database Connection Troubleshooting

This guide will help you troubleshoot and resolve database connection issues with your CV Builder application.

## Database Connection Error

If you're seeing the following error in your logs:

```
Failed to connect to database: Can't reach database server at `cvbuilder-db.c1augguy6rx8.eu-central-1.rds.amazonaws.com:5432`
```

This indicates that your application can't establish a connection to the PostgreSQL database on AWS RDS.

## Diagnosing the Issue

### 1. Run the Database Connection Test Tool

```bash
cd server
node src/tools/db-test.js
```

This tool will test both TCP connectivity and database credentials, giving you specific information about what's failing.

### 2. Check AWS RDS Status

1. Log into your AWS Management Console
2. Navigate to the RDS Dashboard
3. Check if your `cvbuilder-db` instance is in the "Available" state
4. If it's stopped, start it by selecting the instance and clicking "Actions" > "Start"

### 3. Check AWS RDS Security Group Settings

1. In the RDS Dashboard, select your `cvbuilder-db` instance
2. Go to the "Connectivity & security" tab
3. Click on the VPC security group
4. In the "Inbound rules" tab, ensure there's a rule that allows PostgreSQL traffic (port 5432) from:
   - Your local IP address (for development)
   - Render's IP ranges (for production)
   
For Render, you need to add these CIDR ranges:
- `3.33.130.196/32`
- `3.33.135.55/32`
- `35.172.116.215/32`
- More details at: https://render.com/docs/static-outbound-ip-addresses

### 4. Check Database Credentials

Verify that your database credentials are correct:

1. Ensure the `DATABASE_URL` environment variable is correctly set in Render
2. Check if the username and password in the connection string match your RDS credentials

## Temporary Solution: Using Mock Database

If you need to keep the application running while fixing the database connection:

1. Set the `MOCK_DATABASE=true` environment variable in your Render dashboard
2. This will use an in-memory database with some persistence to a JSON file

To enable this:

1. Go to your Render dashboard
2. Select your service
3. Go to the "Environment" tab
4. Add `MOCK_DATABASE` with value `true`
5. Click "Save Changes" and redeploy

## Port Binding Issues

If Render reports "No open HTTP ports detected", ensure:

1. Your application is correctly binding to the port Render expects
2. The `PORT` environment variable is properly set in Render
3. Your code is using `process.env.PORT` (already fixed in the latest update)

## Need Further Help?

If you're still experiencing issues:

1. Check the server logs for more detailed error messages
2. Make sure your AWS RDS instance is in a publicly accessible subnet
3. Verify that you don't have any network ACLs blocking traffic
4. Contact AWS Support if you suspect RDS connectivity issues

## Additional Resources

- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/index.html)
- [Render Deployment Documentation](https://render.com/docs)
- [Prisma Database Connection Documentation](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections) 