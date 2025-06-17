# Render Deployment Guide - Environment Variables

## Secure Environment Configuration

To avoid committing secrets to GitHub, configure these environment variables directly on Render:

### Step 1: Access Render Dashboard
1. Go to https://dashboard.render.com/
2. Select your CV Builder backend service
3. Go to **Environment** tab

### Step 2: Add Environment Variables

Use the values from your production.env file for these variables:

```
NODE_ENV=production
PORT=3005
DATABASE_URL=postgresql://postgres:your-db-password@cvbuilder-db-encrypted.c1augguy6rx8.eu-central-1.rds.amazonaws.com:5432/cvbuilder-db?sslmode=require
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-jwt-refresh-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_PRICE_MONTHLY=price_your-monthly-price-id
STRIPE_PRICE_ANNUAL=price_your-annual-price-id
STRIPE_PRICE_CV_DOWNLOAD=price_your-cv-download-price-id
STRIPE_PRICE_ENHANCED_CV_DOWNLOAD=price_your-enhanced-cv-download-price-id
STRIPE_PRICE_LINKEDIN_REVIEW=price_your-linkedin-review-price-id
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
FRONTEND_URL=https://mycvbuilder.co.uk
SENTRY_DSN=https://your-sentry-dsn@sentry.io/your-project-id
SENTRY_ENVIRONMENT=production
OPENAI_API_KEY=sk-proj-your-openai-api-key
USE_AI_ANALYSIS=true
```

**Note:** Replace all placeholder values with your actual credentials from the production.env file.

### Step 3: Deploy

After adding all environment variables:
1. Click **Save Changes**
2. Render will automatically redeploy with the new configuration
3. Monitor the deployment logs for any issues

### Important Notes

- ✅ **Real AI Analysis Enabled** - `USE_AI_ANALYSIS=true`
- ✅ **OpenAI Integration** - Real API key configured
- ✅ **Production Database** - Connected to encrypted RDS
- ✅ **Live Stripe** - Production payment processing
- ✅ **Security** - No secrets in GitHub repository

### Verification

Once deployed, the CV Builder will:
- Use real OpenAI AI for CV analysis
- Provide different results for different industries
- Process payments through live Stripe
- Store data in production database
- Log errors to Sentry

### Cost Monitoring

**OpenAI Usage:**
- Per CV Analysis: ~$0.0003
- 1000 analyses/month: ~$0.30
- Monitor usage at: https://platform.openai.com/usage

The system is now configured for secure, production-ready deployment with real AI analysis capabilities! 