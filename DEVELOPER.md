# Developer Documentation - CV Builder

This document provides detailed information for developers working on the CV Builder project.

## Project Structure

The project is organized into two main parts:

### Frontend (React)
```
src/
├── components/         # Reusable UI components
├── context/            # Context providers for state management
├── pages/              # Page components
│   ├── Create.jsx      # CV creation flow
│   ├── CvAnalyse.jsx   # CV analysis against job description
│   ├── CvAnalyseByRole.jsx # General CV analysis
│   ├── LinkedInReview.jsx  # LinkedIn profile analysis
│   └── Pricing.jsx     # Pricing plans page
├── data/               # Static data files
│   ├── courseRecommendations.js # Course recommendation data
│   └── educationData.js # Education qualifications data
└── routes.jsx          # Application routing
```

### Backend (Node.js/Express)
```
server/
├── src/
│   ├── config/         # Server configuration
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   │   └── cv.js       # CV-related endpoints including analysis
└── index.js            # Server entry point
```

## Key Features Implementation

### CV Analysis
- Implemented in `src/pages/CvAnalyse.jsx` and `src/pages/CvAnalyseByRole.jsx`
- Server-side implementation in `server/src/routes/cv.js` 
- Currently uses mock responses for development, with hooks to integrate with real AI services in production
- Analysis endpoints: `/api/cv/analyse`, `/api/cv/analyse-by-role`

### LinkedIn Profile Review
- Implemented in `src/pages/LinkedInReview.jsx`
- Server-side implementation in `server/src/routes/cv.js`
- Endpoint: `/api/cv/analyse-linkedin`
- Provides profile analysis, improvement recommendations, and course suggestions
- Uses mock responses for development purposes

### Course Recommendations
- Data defined in `src/data/courseRecommendations.js`
- Component for displaying courses: `src/components/CourseRecommendations.jsx`
- Algorithm analyzes CV or LinkedIn profile to suggest relevant courses
- Automatically detects Computer Science profiles and provides tailored recommendations
- All course links go directly to provider websites

### Pricing Plans
- Implemented in `src/components/PricingSection.jsx`
- Features:
  - Free tier with basic functionality
  - Subscription options (monthly/yearly)
  - One-time purchase options for specific features
  - Add-ons for additional services

## Development Guidelines

### Adding New Features
1. Create new components in the appropriate directories
2. Update routes if adding new pages
3. For API endpoints, add them to the relevant route files
4. Update the README.md with any new features

### Styling
- Uses Tailwind CSS for styling
- Follow existing component patterns for consistency
- Maintain responsive design for all components

### Testing
- Test all features in different browsers
- Use the reliable startup script to ensure proper connections
- Verify all links work correctly, especially external course links

### Adding New Course Recommendations
1. Update the `src/data/courseRecommendations.js` file
2. Ensure all URLs are valid and direct
3. Use the formatUrl helper in the CourseRecommendations component to ensure proper URL formatting

### Mock API Responses
- During development, the server uses mock responses for AI analysis
- You can modify these in `server/src/routes/cv.js`
- To use real AI services, you'll need to configure API keys in environment variables

## Common Issues and Solutions

### Server Connection Issues
- Check if backend is running on port 3005
- Verify CORS configuration if implementing new endpoints
- Use `node start-reliable.js` to ensure proper startup

### Course Links Not Working
- Verify URLs in `courseRecommendations.js`
- Check the `formatUrl` function in CourseRecommendations component
- Test links in incognito/private browsing mode

### CV/LinkedIn Analysis Not Working
- Verify the server is running
- Check network requests for proper endpoint calls
- Ensure subscription check is bypassed in development mode

## Deployment Considerations

### Production Setup
- Configure real OpenAI API keys for production
- Set up proper database connections instead of mock database
- Configure proper authentication and subscription management

### Environment Variables
- Frontend: Create a `.env` file with proper API endpoints
- Backend: Configure production environment variables for database, AI services, etc.

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request with detailed description of changes

---

Last updated: May 2025 