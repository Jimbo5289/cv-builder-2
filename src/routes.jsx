/* eslint-disable */

/**
 * @module routes
 * @description Defines all application routes and their corresponding components.
 * 
 * This configuration file serves as the central routing definition for the CV Builder application.
 * It implements the following key features:
 * 
 * - Code splitting through React.lazy() for optimized loading performance
 * - Clear separation between public and protected routes
 * - Redirects for backward compatibility (British to American spelling variants)
 * - Consistent route naming conventions
 * 
 * The routes array is consumed by AppRoutes.jsx which renders the actual Route components.
 * Each route object contains:
 * - path: The URL path for the route
 * - Component: The lazy-loaded component to render
 * - protected: (optional) Whether the route requires authentication
 * 
 * @exports {Array} routes - Array of route configuration objects
 */

import React from 'react';
import { Navigate } from 'react-router-dom';

// Static imports for all pages - using consistent American spelling
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const Templates = React.lazy(() => import('./pages/Templates'));
const Examples = React.lazy(() => import('./pages/Examples'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const Blog = React.lazy(() => import('./pages/Blog'));
const Contact = React.lazy(() => import('./pages/Contact'));
const CvTips = React.lazy(() => import('./pages/CvTips'));
// Using American spelling consistently
const CvAnalyze = React.lazy(() => import('./pages/CvAnalyze'));
const CvAnalyzeByRole = React.lazy(() => import('./pages/CvAnalyzeByRole'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Create = React.lazy(() => import('./pages/Create'));
const Preview = React.lazy(() => import('./pages/Preview'));
const Profile = React.lazy(() => import('./pages/Profile'));
const PersonalStatement = React.lazy(() => import('./pages/PersonalStatement'));
const Experience = React.lazy(() => import('./pages/Experience'));
const Education = React.lazy(() => import('./pages/Education'));
const Skills = React.lazy(() => import('./pages/Skills'));
const References = React.lazy(() => import('./pages/References'));
const SavedCVs = React.lazy(() => import('./pages/SavedCVs'));
const Analyze = React.lazy(() => import('./pages/Analyze'));
const SubscriptionSuccess = React.lazy(() => import('./pages/SubscriptionSuccess'));
const Subscription = React.lazy(() => import('./pages/Subscription'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

/**
 * Route configuration array
 * 
 * Each route object has the following properties:
 * @property {string} path - The URL path for the route
 * @property {Function} Component - The lazy-loaded component to render at this route
 * @property {boolean} [protected] - Whether the route requires authentication
 */
const routes = [
  /**
   * Public Routes
   * These routes are accessible to all users, whether authenticated or not
   */
  { path: '/', Component: Home },
  { path: '/login', Component: Login },
  { path: '/register', Component: Register },
  { path: '/forgot-password', Component: ForgotPassword },
  { path: '/reset-password', Component: ResetPassword },
  { path: '/templates', Component: Templates },
  { path: '/examples', Component: Examples },
  { path: '/pricing', Component: Pricing },
  { path: '/blog', Component: Blog },
  { path: '/contact', Component: Contact },
  { path: '/cv-tips', Component: CvTips },
  { path: '/analyze', Component: Analyze },
  
  /**
   * Redirects for backward compatibility
   * These routes handle British/American spelling differences
   * and ensure users with old links still reach the correct pages
   */
  { path: '/analyse', Component: () => <Navigate to="/analyze" replace /> },
  { path: '/cv-analyse', Component: () => <Navigate to="/cv-analyze" replace /> },
  { path: '/cv-analyse-by-role', Component: () => <Navigate to="/cv-analyze-by-role" replace /> },
  
  /**
   * Protected Routes
   * These routes require authentication
   * Users who are not logged in will be redirected to the login page
   */
  { path: '/dashboard', Component: Dashboard, protected: true },
  { path: '/cv-analyze', Component: CvAnalyze, protected: true },
  { path: '/cv-analyze-by-role', Component: CvAnalyzeByRole, protected: true },
  { path: '/settings', Component: Settings, protected: true },
  { path: '/create', Component: Create, protected: true },
  { path: '/create/personal-statement', Component: PersonalStatement, protected: true },
  { path: '/create/skills', Component: Skills, protected: true },
  { path: '/create/experience', Component: Experience, protected: true },
  { path: '/create/education', Component: Education, protected: true },
  { path: '/create/references', Component: References, protected: true },
  { path: '/preview/:id', Component: Preview, protected: true },
  { path: '/preview', Component: Preview, protected: true },
  { path: '/profile', Component: Profile, protected: true },
  { path: '/personal-statement', Component: PersonalStatement, protected: true },
  { path: '/experience', Component: Experience, protected: true },
  { path: '/education', Component: Education, protected: true },
  { path: '/skills', Component: Skills, protected: true },
  { path: '/references', Component: References, protected: true },
  { path: '/saved', Component: SavedCVs, protected: true },
  { path: '/subscription-success', Component: SubscriptionSuccess, protected: true },
  { path: '/subscription', Component: Subscription, protected: true },
];

export default routes;
// This file defines the routes for the application using React.lazy for code splitting.