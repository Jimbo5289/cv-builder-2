import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SubscriptionProtectedRoute from './components/SubscriptionProtectedRoute';

// Ensure Component is properly defined to fix the i1.Component error
if (React && !React.Component) {
  console.warn('Adding React.Component definition for compatibility');
  // Try to get Component class from one of React's core APIs
  const possibleComponentSource = React.PureComponent || React.memo || Object;
  React.Component = possibleComponentSource;
}

// Helper function to enhance lazy loading and prevent i1.Component errors
const enhancedLazy = (importFn) => {
  // Use the original React.lazy
  const LazyComponent = React.lazy(importFn);
  
  // Add Component property to fix potential issues
  if (React.Component && !LazyComponent.Component) {
    LazyComponent.Component = React.Component;
  }
  
  return LazyComponent;
};

// Lazy load components
const Login = enhancedLazy(() => import('./pages/Login'));
const Register = enhancedLazy(() => import('./pages/Register'));
const Dashboard = enhancedLazy(() => import('./pages/Dashboard'));
const Create = enhancedLazy(() => import('./pages/Create'));
const PersonalStatement = enhancedLazy(() => import('./pages/PersonalStatement'));
const Skills = enhancedLazy(() => import('./pages/Skills'));
const Experience = enhancedLazy(() => import('./pages/Experience'));
const Education = enhancedLazy(() => import('./pages/Education'));
const References = enhancedLazy(() => import('./pages/References'));
const Edit = enhancedLazy(() => import('./pages/Edit'));
const Preview = enhancedLazy(() => import('./pages/Preview'));
const Settings = enhancedLazy(() => import('./pages/Settings'));
const Subscription = enhancedLazy(() => import('./pages/Subscription'));
const SubscriptionSuccess = enhancedLazy(() => import('./pages/SubscriptionSuccess'));
const SubscriptionCancel = enhancedLazy(() => import('./pages/SubscriptionCancel'));
const NotFound = enhancedLazy(() => import('./pages/NotFound'));
const Home = enhancedLazy(() => import('./pages/Home'));
const ForgotPassword = enhancedLazy(() => import('./pages/ForgotPassword'));
const ResetPassword = enhancedLazy(() => import('./pages/ResetPassword'));
const Templates = enhancedLazy(() => import('./pages/Templates'));
const Examples = enhancedLazy(() => import('./pages/Examples'));
const Pricing = enhancedLazy(() => import('./pages/Pricing'));
const Blog = enhancedLazy(() => import('./pages/Blog'));
const Contact = enhancedLazy(() => import('./pages/Contact'));
const CvTips = enhancedLazy(() => import('./pages/CvTips'));
const FAQ = enhancedLazy(() => import('./pages/FAQ'));
const CookiePolicy = enhancedLazy(() => import('./pages/CookiePolicy'));
const Analyse = enhancedLazy(() => import('./pages/Analyse'));
const CvAnalyse = enhancedLazy(() => import('./pages/CvAnalyse'));
const CvAnalyseByRole = enhancedLazy(() => import('./pages/CvAnalyseByRole'));
const Profile = enhancedLazy(() => import('./pages/Profile'));
const SavedCVs = enhancedLazy(() => import('./pages/SavedCVs'));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// ErrorBoundary for Suspense fallbacks
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Lazy loading error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="p-4 bg-white rounded shadow text-center">
            <h2 className="text-red-500 text-xl mb-2">Something went wrong</h2>
            <p className="mb-4">{this.state.error?.message || "Error loading component"}</p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced Suspense wrapper that's more resilient
const EnhancedSuspense = ({ children, fallback }) => (
  <ErrorBoundary>
    <Suspense fallback={fallback || <LoadingFallback />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <EnhancedSuspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        } />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/examples" element={<Examples />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cv-tips" element={<CvTips />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        
        {/* Protected routes that require authentication */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/create" element={
          <ProtectedRoute>
            <Create />
          </ProtectedRoute>
        } />
        {/* CV Creation flow routes */}
        <Route path="/create/personal-statement" element={
          <ProtectedRoute>
            <PersonalStatement />
          </ProtectedRoute>
        } />
        <Route path="/create/skills" element={
          <ProtectedRoute>
            <Skills />
          </ProtectedRoute>
        } />
        <Route path="/create/experience" element={
          <ProtectedRoute>
            <Experience />
          </ProtectedRoute>
        } />
        <Route path="/create/education" element={
          <ProtectedRoute>
            <Education />
          </ProtectedRoute>
        } />
        <Route path="/create/references" element={
          <ProtectedRoute>
            <References />
          </ProtectedRoute>
        } />
        <Route path="/edit/:id" element={
          <ProtectedRoute>
            <Edit />
          </ProtectedRoute>
        } />
        <Route path="/preview/:id" element={
          <ProtectedRoute>
            <Preview />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/saved-cvs" element={
          <ProtectedRoute>
            <Navigate to="/profile" replace />
          </ProtectedRoute>
        } />
        <Route path="/subscription" element={
          <ProtectedRoute>
            <Subscription />
          </ProtectedRoute>
        } />
        <Route path="/subscription/success" element={
          <ProtectedRoute>
            <SubscriptionSuccess />
          </ProtectedRoute>
        } />
        <Route path="/subscription/cancel" element={
          <ProtectedRoute>
            <SubscriptionCancel />
          </ProtectedRoute>
        } />
        
        {/* Premium routes that require an active subscription */}
        <Route path="/analyse" element={
          <SubscriptionProtectedRoute>
            <Analyse />
          </SubscriptionProtectedRoute>
        } />
        <Route path="/cv-analyse" element={
          <SubscriptionProtectedRoute>
            <CvAnalyse />
          </SubscriptionProtectedRoute>
        } />
        <Route path="/cv-analyse-by-role" element={
          <SubscriptionProtectedRoute>
            <CvAnalyseByRole />
          </SubscriptionProtectedRoute>
        } />

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </EnhancedSuspense>
  );
}

export default AppRoutes; 