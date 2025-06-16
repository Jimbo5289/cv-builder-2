# Setting Up Database Connection in Render

To properly configure your PostgreSQL database connection in Render, follow these steps:

## Option 1: Set Environment Variables in Render Dashboard

1. Go to your Render dashboard
2. Select your `cv-builder-2` service
3. Click on the **Environment** tab
4. Add the following environment variable:

```
DATABASE_URL=postgresql://postgres:reqvip-ciftag-2Qizgo@cvbuilder-db.c1augguy6rx8.eu-central-1.rds.amazonaws.com:5432/cvbuilder-db?sslmode=require
```

5. Set `MOCK_DATABASE=false` to ensure the application uses the real database
6. Click "Save Changes"
7. Redeploy your application by clicking "Manual Deploy" > "Deploy latest commit"

## Option 2: Use Pre-start Script (Already Implemented)

The `pre-start.js` script already contains the database connection details. If you're using this approach:

1. Make sure your Start Command in Render is set to:
```
cd server && npm run render:start
```

2. You don't need to manually set the DATABASE_URL environment variable, as the script will set it automatically.

## Troubleshooting Database Connection

If you're experiencing database connection issues:

1. Verify that your AWS RDS instance is running
2. Check that your security group allows connections from Render's IP addresses
3. Confirm that the database user has the necessary permissions
4. Verify the database name is correct
5. Check the Render logs for specific error messages

## SSL Configuration

The application is configured to use SSL with the AWS RDS instance. The `?sslmode=require` parameter is automatically added to the connection string if it's missing.

## Fallback to Mock Database

If the database connection fails for any reason, the application will automatically fall back to using the mock database. You'll see a message in the logs indicating this fallback occurred.

# CV Builder - Render.com Database Setup

## Database Configuration

### AWS RDS PostgreSQL Database
The application uses an AWS RDS PostgreSQL database instance for production data storage.

**Database Details:**
- Host: cvbuilder-db.c1augguy6rx8.eu-central-1.rds.amazonaws.com
- Port: 5432
- Database: cvbuilder-db
- SSL Mode: Required

**Connection String:**
```
DATABASE_URL=postgresql://postgres:reqvip-ciftag-2Qizgo@cvbuilder-db.c1augguy6rx8.eu-central-1.rds.amazonaws.com:5432/cvbuilder-db?sslmode=require
```

### Security Configuration

#### Encryption at Rest
**Important**: Ensure your AWS RDS instance has encryption at rest enabled:

1. **For New Instances**: Enable encryption during creation
   - In AWS Console: RDS → Create Database → Additional Configuration → Encryption
   - Check "Enable encryption"
   - Select AWS KMS key (aws/rds or custom key)

2. **For Existing Instances**: 
   - Take a snapshot of your current database
   - Create a new encrypted instance from the snapshot
   - Update your connection string accordingly

3. **Verification**: 
   ```bash
   aws rds describe-db-instances --db-instance-identifier cvbuilder-db --query 'DBInstances[0].StorageEncrypted'
   ```
   Should return `true`

#### SSL/TLS Configuration
The application is configured to use SSL with the AWS RDS instance. The `?sslmode=require` parameter is automatically added to the connection string if it's missing. 