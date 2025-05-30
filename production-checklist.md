# CV Builder Production Deployment Checklist

## Environment Variables
- [x] JWT_SECRET - Secure random string (already generated)
- [x] JWT_REFRESH_SECRET - Secure random string (already generated)
- [x] DATABASE_URL - Production database connection string
- [x] STRIPE_SECRET_KEY - Stripe API secret key
- [x] STRIPE_WEBHOOK_SECRET - Stripe webhook signing secret
- [x] STRIPE_PRICE_ID_PAY_PER_CV - Price ID for Pay-Per-CV product
- [x] STRIPE_PRICE_ID_24_HOUR - Price ID for 24-Hour Access product
- [x] STRIPE_PRICE_ID_MONTHLY - Price ID for Monthly Subscription product
- [x] STRIPE_PRICE_ID_YEARLY - Price ID for Yearly Subscription product
- [ ] FRONTEND_URL - Set to https://mycvbuilder.co.uk
- [ ] EMAIL_HOST - SMTP server for sending emails
- [ ] EMAIL_PORT - SMTP port
- [ ] EMAIL_USER - SMTP username
- [ ] EMAIL_PASSWORD - SMTP password
- [ ] EMAIL_FROM - Sender email address

## IONOS Deployment Steps
1. Sign up for IONOS Deploy Now service
2. Connect GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Configure PHP runtime:
   - PHP 8.3 (or latest available)
   - Connect MariaDB database
5. Set environment variables in IONOS dashboard
6. Connect mycvbuilder.co.uk domain

## Post-Deployment Checks
- [ ] Verify SSL/HTTPS is working
- [ ] Test user registration and login
- [ ] Test CV creation process
- [ ] Test payment flows for all pricing tiers
- [ ] Verify email notifications
- [ ] Check mobile responsiveness on multiple devices
- [ ] Test cross-browser compatibility (Chrome, Firefox, Safari, Edge)

## Performance Optimization Suggestions
- Consider code splitting for large bundles (Preview.js is over 2MB)
- Optimize image loading with lazy loading
- Implement caching strategies for API responses
- Consider using a CDN for static assets

## Security Checks
- [ ] Ensure all API endpoints are properly protected
- [ ] Verify JWT token validation is working correctly
- [ ] Check CORS settings are properly configured
- [ ] Ensure sensitive data is not exposed in frontend code
- [ ] Verify Stripe webhook validation is working 