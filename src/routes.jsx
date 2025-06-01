// routes.jsx
import React from 'react';

// Lazy load all components
const lazyImport = (path, name) =>
  React.lazy(() =>
    import(`${path}`).catch((err) => {
      console.error(`Failed to load ${name}:`, err);
      return { default: () => <div>Error loading {name}</div> };
    })
  );

// Route definitions
const routes = [
  // Public routes
  { path: '/', Component: lazyImport('./pages/Home', 'Home') },
  { path: '/login', Component: lazyImport('./pages/Login', 'Login') },
  { path: '/register', Component: lazyImport('./pages/Register', 'Register') },
  { path: '/forgot-password', Component: lazyImport('./pages/ForgotPassword', 'ForgotPassword') },
  { path: '/reset-password', Component: lazyImport('./pages/ResetPassword', 'ResetPassword') },
  { path: '/templates', Component: lazyImport('./pages/Templates', 'Templates') },
  { path: '/examples', Component: lazyImport('./pages/Examples', 'Examples') },
  { path: '/pricing', Component: lazyImport('./pages/Pricing', 'Pricing') },
  { path: '/blog', Component: lazyImport('./pages/Blog', 'Blog') },
  { path: '/contact', Component: lazyImport('./pages/Contact', 'Contact') },
  { path: '/cv-tips', Component: lazyImport('./pages/CvTips', 'CvTips') },
  { path: '/faq', Component: lazyImport('./pages/FAQ', 'FAQ') },
  { path: '/cookie-policy', Component: lazyImport('./pages/CookiePolicy', 'CookiePolicy') },

  // Protected (auth) routes
  { path: '/dashboard', Component: lazyImport('./pages/Dashboard', 'Dashboard'), protected: true },
  { path: '/create', Component: lazyImport('./pages/Create', 'Create'), protected: true },
  { path: '/create/personal-statement', Component: lazyImport('./pages/PersonalStatement', 'PersonalStatement'), protected: true },
  { path: '/create/skills', Component: lazyImport('./pages/Skills', 'Skills'), protected: true },
  { path: '/create/experience', Component: lazyImport('./pages/Experience', 'Experience'), protected: true },
  { path: '/create/education', Component: lazyImport('./pages/Education', 'Education'), protected: true },
  { path: '/create/references', Component: lazyImport('./pages/References', 'References'), protected: true },
  { path: '/edit/:id', Component: lazyImport('./pages/Edit', 'Edit'), protected: true },
  { path: '/preview/:id', Component: lazyImport('./pages/Preview', 'Preview'), protected: true },
  { path: '/settings', Component: lazyImport('./pages/Settings', 'Settings'), protected: true },
  { path: '/profile', Component: lazyImport('./pages/Profile', 'Profile'), protected: true },
  { path: '/saved-cvs', Component: lazyImport('./pages/SavedCVs', 'SavedCVs'), protected: true },
  { path: '/subscription', Component: lazyImport('./pages/Subscription', 'Subscription'), protected: true },
  { path: '/subscription/success', Component: lazyImport('./pages/SubscriptionSuccess', 'SubscriptionSuccess'), protected: true },
  { path: '/subscription/cancel', Component: lazyImport('./pages/SubscriptionCancel', 'SubscriptionCancel'), protected: true },

  // Premium (subscription) routes
  { path: '/analyse', Component: lazyImport('./pages/Analyse', 'Analyse'), subscription: true },
  { path: '/cv-analyse', Component: lazyImport('./pages/CvAnalyse', 'CvAnalyse'), subscription: true },
  { path: '/cv-analyse-by-role', Component: lazyImport('./pages/CvAnalyseByRole', 'CvAnalyseByRole'), subscription: true },

  // Fallback
  { path: '*', Component: lazyImport('./pages/NotFound', 'NotFound') },
];

export default routes;
// This file defines the routes for the application using React.lazy for code splitting.