# AWS RDS Security Group Configuration for Render

## Issue

Your application on Render can't connect to your AWS RDS database (`cvbuilder-db.c1augguy6rx8.eu-central-1.rds.amazonaws.com`). The most likely cause is that the AWS RDS security group is not configured to allow inbound connections from Render's IP addresses.

## Solution: Configure AWS RDS Security Group

1. Log in to the AWS Management Console
2. Navigate to the RDS service
3. Select your database instance (cvbuilder-db)
4. Click on the "Connectivity & security" tab
5. Look for the VPC security group(s) associated with your database
6. Click on the security group to view its details
7. In the security group details, click on the "Inbound rules" tab
8. Click "Edit inbound rules"
9. Add a new rule with the following details:
   - Type: PostgreSQL
   - Protocol: TCP
   - Port Range: 5432
   - Source: Custom
   - IP ranges: Add Render's IP addresses (see below)
10. Click "Save rules"

## Render IP Addresses

According to Render's documentation, you need to allow the following IP ranges:
- `35.180.39.82/32`
- `35.181.114.243/32`
- `35.181.155.97/32`

You can find the most up-to-date list of Render's IP addresses in their documentation: https://render.com/docs/networking#egress-ip-addresses

## Alternative Solution: Allow All Traffic (For Testing Only)

**Warning: This is less secure and should only be used for testing.**

1. In the inbound rules, you could temporarily add a rule that allows all traffic:
   - Type: PostgreSQL
   - Protocol: TCP
   - Port Range: 5432
   - Source: Anywhere (0.0.0.0/0)
2. Test if your application can connect
3. If it works, replace this rule with more restricted rules using specific IP addresses

## AWS RDS Public Accessibility

Ensure your RDS instance is set to be publicly accessible:

1. In the RDS console, select your database instance
2. Click "Modify"
3. Under "Connectivity", ensure "Publicly accessible" is set to "Yes"
4. Click "Continue" and "Apply immediately"
5. Click "Modify DB instance"

## Testing the Connection

After making these changes, you can test the connection:

1. Wait a few minutes for the changes to propagate
2. Redeploy your application on Render
3. Check the logs to see if the connection succeeds

If you're still experiencing issues, you may need to check:
1. Database credentials (username/password)
2. Database name
3. AWS RDS instance status (make sure it's "Available")
4. Network ACLs in your VPC 