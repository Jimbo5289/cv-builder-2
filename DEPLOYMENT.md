# CV Builder Deployment Guide

This document provides detailed instructions for deploying the CV Builder application to IONOS hosting with the mycvbuilder.co.uk domain.

## Prerequisites

1. IONOS Deploy Now account
2. GitHub repository with the CV Builder code
3. Stripe account with configured products and prices
4. SMTP email service credentials

## Step 1: Prepare Your Repository

Ensure your GitHub repository is up-to-date with all the latest changes. Make sure to commit the following files:

- `.htaccess` file in the dist directory for proper SPA routing
- All environment variables are properly configured
- All required dependencies are listed in package.json

## Step 2: Sign Up for IONOS Deploy Now

1. Go to [IONOS Deploy Now](https://www.ionos.com/hosting/deploy-now)
2. Select the PHP Project plan (£7/month) which includes PHP runtime and MariaDB
3. Complete the signup process

## Step 3: Connect Your GitHub Repository

1. In the IONOS Deploy Now dashboard, click "Add new project"
2. Connect your GitHub account if not already connected
3. Select your CV Builder repository
4. Choose the main branch for deployment

## Step 4: Configure Build Settings

1. Set the build command to: `npm run build`
2. Set the output directory to: `dist`
3. Ensure Node.js is selected as the build environment

## Step 5: Configure PHP Runtime

1. Select PHP 8.3 (or the latest available version)
2. Configure the MariaDB database settings
3. Set the document root to the output directory

## Step 6: Set Environment Variables

Add all required environment variables in the IONOS dashboard:

```
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
DATABASE_URL=your_database_url
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRICE_ID_PAY_PER_CV=your_price_id
STRIPE_PRICE_ID_24_HOUR=your_price_id
STRIPE_PRICE_ID_MONTHLY=your_price_id
STRIPE_PRICE_ID_YEARLY=your_price_id
FRONTEND_URL=https://mycvbuilder.co.uk
EMAIL_HOST=your_smtp_host
EMAIL_PORT=your_smtp_port
EMAIL_USER=your_smtp_username
EMAIL_PASSWORD=your_smtp_password
EMAIL_FROM=your_sender_email
```

## Step 7: Connect Your Domain

1. In the IONOS dashboard, go to the "Domains" section
2. Connect your mycvbuilder.co.uk domain
3. Configure DNS settings as required
4. Enable SSL/HTTPS for your domain

## Step 8: Configure Stripe Webhooks

1. Log in to your Stripe dashboard
2. Go to Developers > Webhooks
3. Add a new endpoint with the URL: `https://mycvbuilder.co.uk/api/webhooks/stripe`
4. Select the following events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the signing secret and add it to your environment variables

## Step 9: Post-Deployment Checks

After deployment, verify the following:

1. The website is accessible at https://mycvbuilder.co.uk
2. SSL/HTTPS is working correctly
3. User registration and login work
4. CV creation and download work
5. Payments process correctly for all plans
6. Email notifications are being sent
7. The application is responsive on all devices
8. Check browser compatibility

## Troubleshooting

### Common Issues

1. **SPA Routing Issues**: Ensure the .htaccess file is properly configured to redirect all requests to index.html
2. **Database Connection Errors**: Verify your DATABASE_URL environment variable is correct
3. **Stripe Payment Issues**: Check that all Stripe price IDs are correctly configured
4. **CORS Errors**: Ensure FRONTEND_URL is correctly set to your domain

### Support Resources

- IONOS Deploy Now Documentation: https://docs.ionos.space/
- IONOS Support: deploynow-support@ionos.com

## Maintenance

1. **Database Backups**: Set up regular database backups
2. **Monitoring**: Consider setting up uptime monitoring
3. **Updates**: Regularly update dependencies to maintain security

## Performance Optimization

1. Consider implementing a CDN for static assets
2. Optimize large JavaScript bundles through code splitting
3. Implement server-side caching strategies
4. Configure proper browser caching through .htaccess 