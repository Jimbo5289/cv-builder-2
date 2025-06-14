# Blue-Green Deployment Setup for CV Builder

## Overview
This guide sets up blue-green deployment for zero-downtime deployments and safe testing.

## Architecture

### Current (Single Environment)
```
mycvbuilder.co.uk → Vercel → Render Backend → AWS RDS
```

### Blue-Green (Dual Environment)
```
mycvbuilder.co.uk → Blue Environment (Production)
staging.mycvbuilder.co.uk → Green Environment (Testing)

Blue:  Vercel Blue → Render Blue → AWS RDS
Green: Vercel Green → Render Green → AWS RDS (same DB)
```

## Step 1: Create Green Environment on Render

### 1.1 Clone Current Render Service
1. Go to Render Dashboard
2. Create new Web Service: `cv-builder-green`
3. Connect same GitHub repo
4. Configure:
   - **Branch**: `main` (same as blue)
   - **Build Command**: `npm install`
   - **Start Command**: `cd server && npm run render:start`

### 1.2 Environment Variables for Green
```env
NODE_ENV=production
PORT=3005
DATABASE_URL=postgresql://your-aws-rds-connection-string
JWT_SECRET=your-secure-jwt-secret
JWT_REFRESH_SECRET=your-secure-refresh-token-secret
FRONTEND_URL=https://cv-builder-green.vercel.app
STRIPE_PUBLISHABLE_KEY=pk_test_mock_key
STRIPE_SECRET_KEY=sk_test_mock_key
SENTRY_DSN=your-sentry-dsn
SENTRY_ENVIRONMENT=staging
```

## Step 2: Create Green Environment on Vercel

### 2.1 Create New Vercel Project
1. Go to Vercel Dashboard
2. Import same GitHub repo as new project
3. Name: `cv-builder-green`
4. Configure build settings (same as current)

### 2.2 Environment Variables for Green
```env
VITE_API_URL=https://cv-builder-green.onrender.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_mock_key
VITE_SENTRY_DSN=your-sentry-dsn
VITE_SENTRY_ENVIRONMENT=staging
```

## Step 3: DNS Configuration

### 3.1 Add Staging Subdomain
In your DNS provider (where mycvbuilder.co.uk is managed):
```
CNAME staging.mycvbuilder.co.uk → cv-builder-green.vercel.app
```

### 3.2 Configure Custom Domains
- **Vercel Blue**: Add `mycvbuilder.co.uk` (production)
- **Vercel Green**: Add `staging.mycvbuilder.co.uk` (staging)

## Step 4: Deployment Workflow

### 4.1 Development Process
1. **Develop**: Work on feature branches
2. **Test Locally**: Test changes locally
3. **Deploy to Green**: Merge to `staging` branch
4. **Test Green**: Test on `staging.mycvbuilder.co.uk`
5. **Deploy to Blue**: Merge to `main` branch
6. **Switch Traffic**: Update DNS if needed

### 4.2 Branch Strategy
```
main → Blue Environment (Production)
staging → Green Environment (Testing)
feature/* → Local Development
```

## Step 5: Automated Deployment Scripts

### 5.1 Deploy to Green Script
```bash
#!/bin/bash
# deploy-green.sh
echo "Deploying to Green Environment..."
git checkout staging
git merge main
git push origin staging
echo "Green deployment initiated!"
echo "Test at: https://staging.mycvbuilder.co.uk"
```

### 5.2 Promote Green to Blue Script
```bash
#!/bin/bash
# promote-to-blue.sh
echo "Promoting Green to Blue..."
git checkout main
git merge staging
git push origin main
echo "Blue deployment initiated!"
echo "Live at: https://mycvbuilder.co.uk"
```

## Step 6: Database Considerations

### 6.1 Shared Database (Recommended)
- Both environments use same AWS RDS
- Simpler setup
- Database migrations affect both environments

### 6.2 Separate Databases (Advanced)
- Blue: Production database
- Green: Staging database with production data copy
- Requires data sync strategy

## Step 7: Monitoring & Health Checks

### 7.1 Health Check Endpoints
Add to both environments:
```javascript
// server/src/routes/health.js
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});
```

### 7.2 Monitoring Setup
- **Render**: Built-in monitoring
- **Vercel**: Built-in analytics
- **Sentry**: Error tracking for both environments
- **Uptime Monitoring**: Use service like UptimeRobot

## Step 8: Cost Considerations

### Render Costs
- **Free Tier**: 750 hours/month (enough for 1 service)
- **Starter Plan**: $7/month per service
- **Total for Blue-Green**: $14/month

### Vercel Costs
- **Hobby Plan**: Free (sufficient for both projects)
- **Pro Plan**: $20/month (if you need advanced features)

### AWS RDS
- **Current**: Single database
- **Blue-Green**: Same database (no additional cost)

## Step 9: Rollback Strategy

### 9.1 Quick Rollback
If issues in production:
1. **DNS Switch**: Point mycvbuilder.co.uk back to previous version
2. **Git Revert**: Revert problematic commits
3. **Redeploy**: Push fixed version

### 9.2 Database Rollback
- **Shared DB**: Use database backups
- **Separate DBs**: Switch database connections

## Benefits

✅ **Zero Downtime**: Switch between environments instantly
✅ **Safe Testing**: Test in production-like environment
✅ **Quick Rollback**: Instant rollback if issues occur
✅ **Reduced Risk**: Thorough testing before going live
✅ **Parallel Development**: Work on features while production runs

## Complexity Level

**Simple Blue-Green**: ⭐⭐⭐ (Moderate)
- 2-3 hours setup time
- Shared database
- Basic workflow

**Advanced Blue-Green**: ⭐⭐⭐⭐⭐ (Complex)
- 1-2 days setup time
- Separate databases
- Advanced automation

## Recommendation

Start with **Simple Blue-Green** using shared database:
1. Lower complexity
2. Faster setup
3. Most benefits with less overhead
4. Can upgrade to advanced later

Would you like me to help you implement this step by step? 