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
const ForgotPassword = React.lazy(() => import(/* webpackChunkName: "forgot-password" */ './pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import(/* webpackChunkName: "reset-password" */ './pages/ResetPassword'));
const Templates = React.lazy(() => import(/* webpackChunkName: "templates" */ './pages/Templates'));
const Examples = React.lazy(() => import(/* webpackChunkName: "examples" */ './pages/Examples'));
const Pricing = React.lazy(() => import(/* webpackChunkName: "pricing" */ './pages/Pricing'));
const Blog = React.lazy(() => import(/* webpackChunkName: "blog" */ './pages/Blog'));
const BlogPost = React.lazy(() => import(/* webpackChunkName: "blog-post" */ './pages/BlogPost'));
const Contact = React.lazy(() => import(/* webpackChunkName: "contact" */ './pages/Contact'));
const CvTips = React.lazy(() => import(/* webpackChunkName: "cv-tips" */ './pages/CvTips'));
const CookiePolicy = React.lazy(() => import(/* webpackChunkName: "cookie-policy" */ './pages/CookiePolicy'));
const PrivacyPolicy = React.lazy(() => import(/* webpackChunkName: "privacy-policy" */ './pages/PrivacyPolicy'));
const FAQ = React.lazy(() => import(/* webpackChunkName: "faq" */ './pages/FAQ'));
const ConsentPreferences = React.lazy(() => import(/* webpackChunkName: "consent-preferences" */ './pages/ConsentPreferences'));
const CompanyInfo = React.lazy(() => import(/* webpackChunkName: "company-info" */ './pages/CompanyInfo'));
// Using American spelling consistently
const CvAnalyze = React.lazy(() => import(/* webpackChunkName: "cv-analyze" */ './pages/CvAnalyze'));
const CvAnalyzeByRole = React.lazy(() => import(/* webpackChunkName: "cv-analyze-by-role" */ './pages/CvAnalyzeByRole'));
const Settings = React.lazy(() => import(/* webpackChunkName: "settings" */ './pages/Settings'));
const Create = React.lazy(() => import(/* webpackChunkName: "create" */ './pages/Create'));
const Preview = React.lazy(() => import(/* webpackChunkName: "preview" */ './pages/Preview'));
const Profile = React.lazy(() => import(/* webpackChunkName: "profile" */ './pages/Profile'));
const PersonalStatement = React.lazy(() => import(/* webpackChunkName: "personal-statement" */ './pages/PersonalStatement'));
const Experience = React.lazy(() => import(/* webpackChunkName: "experience" */ './pages/Experience'));
const Education = React.lazy(() => import('./pages/Education'));
const Skills = React.lazy(() => import('./pages/Skills'));
const References = React.lazy(() => import('./pages/References'));
const SavedCVs = React.lazy(() => import('./pages/SavedCVs'));
const Analyze = React.lazy(() => import('./pages/Analyze'));
const SubscriptionSuccess = React.lazy(() => import('./pages/SubscriptionSuccess'));
const SubscriptionCancel = React.lazy(() => import('./pages/SubscriptionCancel'));
const Subscription = React.lazy(() => import('./pages/Subscription'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Edit = React.lazy(() => import(/* webpackChunkName: "edit" */ './pages/Edit'));
const Unsubscribe = React.lazy(() => import(/* webpackChunkName: "unsubscribe" */ './pages/Unsubscribe'));

// Admin Panel Components - Lazy loaded for performance
const AdminLayout = React.lazy(() => import(/* webpackChunkName: "admin-layout" */ './components/admin/AdminLayout'));
const AdminDashboard = React.lazy(() => import(/* webpackChunkName: "admin-dashboard" */ './components/admin/AdminDashboard'));
const AdminCustomerManagement = React.lazy(() => import(/* webpackChunkName: "admin-customers" */ './components/admin/AdminCustomerManagement'));
const AdminStaffManagement = React.lazy(() => import(/* webpackChunkName: "admin-staff" */ './components/admin/AdminStaffManagement'));
const AdminAnalytics = React.lazy(() => import(/* webpackChunkName: "admin-analytics" */ './components/admin/AdminAnalytics'));
const AdminSubscriptions = React.lazy(() => import(/* webpackChunkName: "admin-subscriptions" */ './components/admin/AdminSubscriptions'));
const AdminSystemHealth = React.lazy(() => import(/* webpackChunkName: "admin-system" */ './components/admin/AdminSystemHealth'));

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
  { path: '/blog/:id', Component: BlogPost },
  { path: '/contact', Component: Contact },
  { path: '/cv-tips', Component: CvTips },
  { path: '/analyze', Component: Analyze },
  { path: '/cookie-policy', Component: CookiePolicy },
  { path: '/privacy-policy', Component: PrivacyPolicy },
  { path: '/faq', Component: FAQ },
  { path: '/consent-preferences', Component: ConsentPreferences },
  { path: '/company-info', Component: CompanyInfo },
  { path: '/unsubscribe', Component: Unsubscribe },
  
  /**
   * Redirects for backward compatibility
   * These routes handle British/American spelling differences
   * and ensure users with old links still reach the correct pages
   */
  { path: '/analyse', Component: () => <Navigate to="/analyze" replace /> },
  { path: '/cv-analyse', Component: () => <Navigate to="/cv-analyse" replace /> },
  { path: '/cv-analyse-by-role', Component: () => <Navigate to="/cv-analyse-by-role" replace /> },
  
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
  { path: '/subscription/success', Component: SubscriptionSuccess, protected: false },
  { path: '/subscription/cancel', Component: SubscriptionCancel, protected: true },
  { path: '/subscription', Component: Subscription, protected: true },
  { path: '/edit/:id', Component: Edit, protected: true },

  /**
   * Admin Panel Routes
   * These routes require admin authentication and provide administrative functionality
   * All admin routes are protected and require admin role verification
   */
  { path: '/admin', Component: () => <Navigate to="/admin/dashboard" replace />, protected: true },
  { path: '/admin/dashboard', Component: () => <AdminLayout><AdminDashboard /></AdminLayout>, protected: true },
  { path: '/admin/customers', Component: () => <AdminLayout><AdminCustomerManagement /></AdminLayout>, protected: true },
  { path: '/admin/staff', Component: () => <AdminLayout><AdminStaffManagement /></AdminLayout>, protected: true },
  { path: '/admin/analytics', Component: () => <AdminLayout><AdminAnalytics /></AdminLayout>, protected: true },
  { path: '/admin/subscriptions', Component: () => <AdminLayout><AdminSubscriptions /></AdminLayout>, protected: true },
  { path: '/admin/system', Component: () => <AdminLayout><AdminSystemHealth /></AdminLayout>, protected: true },
];

export default routes;
// This file defines the routes for the application using React.lazy for code splitting.