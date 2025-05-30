# CV Builder Testing Checklist

Use this checklist to verify all functionality is working correctly after deployment.

## General Functionality

- [ ] Website loads correctly at https://mycvbuilder.co.uk
- [ ] All pages render without errors
- [ ] Navigation menu works on all pages
- [ ] Dark/light mode toggle functions correctly
- [ ] All links go to the correct destinations
- [ ] Footer links and information are correct

## Authentication

- [ ] User can register with email and password
- [ ] User receives welcome email after registration
- [ ] User can log in with email and password
- [ ] User can log out
- [ ] "Remember me" functionality works
- [ ] Forgot password process works correctly
- [ ] Email verification works (if implemented)
- [ ] User session persists appropriately
- [ ] JWT tokens refresh correctly

## User Profile & Settings

- [ ] User can view their profile information
- [ ] User can update their profile details
- [ ] User can change their password
- [ ] User can update their notification preferences
- [ ] User can view their subscription status
- [ ] User can delete their account

## CV Creation Process

- [ ] User can create a new CV
- [ ] All CV sections (personal info, education, experience, etc.) can be filled out
- [ ] Form validation works correctly
- [ ] Data is saved correctly when navigating between sections
- [ ] CV preview updates in real-time
- [ ] User can download CV as PDF
- [ ] User can print CV directly
- [ ] User can save CV to their account
- [ ] User can create multiple CVs

## Payment & Subscription

- [ ] Pricing page displays correctly with all options
- [ ] User can select any pricing plan
- [ ] Stripe checkout process initiates correctly
- [ ] Pay-Per-CV payment completes successfully
- [ ] 24-Hour Access payment completes successfully
- [ ] Monthly subscription payment completes successfully
- [ ] Yearly subscription payment completes successfully
- [ ] User account is updated with correct subscription status
- [ ] User can access features according to their plan
- [ ] User can cancel subscription
- [ ] User receives confirmation emails for payments

## CV Analysis & AI Features

- [ ] CV analysis feature works correctly
- [ ] AI suggestions are relevant and helpful
- [ ] Role-specific analysis provides targeted feedback
- [ ] Course recommendations are appropriate

## Responsive Design

- [ ] Website displays correctly on desktop (1920x1080)
- [ ] Website displays correctly on laptop (1366x768)
- [ ] Website displays correctly on tablet (768x1024)
- [ ] Website displays correctly on mobile (375x667)
- [ ] Interactive elements are usable on touch devices
- [ ] Forms are usable on all device sizes

## Browser Compatibility

- [ ] Chrome - All features work correctly
- [ ] Firefox - All features work correctly
- [ ] Safari - All features work correctly
- [ ] Edge - All features work correctly

## Performance

- [ ] Pages load in under 3 seconds
- [ ] Images load efficiently
- [ ] No console errors appear
- [ ] Scrolling is smooth on all pages
- [ ] Animations run smoothly
- [ ] No memory leaks occur during extended use

## Security

- [ ] HTTPS is enabled and certificate is valid
- [ ] Protected routes require authentication
- [ ] API endpoints are secured appropriately
- [ ] CSRF protection is in place
- [ ] XSS vulnerabilities are mitigated
- [ ] Security headers are properly configured

## Accessibility

- [ ] Text has sufficient contrast
- [ ] All images have alt text
- [ ] Form inputs have associated labels
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility is maintained
- [ ] Color is not the only means of conveying information

## Notes on Testing Issues

Use this section to document any issues found during testing:

1. Issue: 
   - Description:
   - Steps to reproduce:
   - Severity:
   - Screenshot/recording:

2. Issue:
   - Description:
   - Steps to reproduce:
   - Severity:
   - Screenshot/recording:

## Test Results

- Date tested:
- Tester name:
- Overall status:
- Critical issues found:
- Next steps: 