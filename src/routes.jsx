import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SubscriptionProtectedRoute from './components/SubscriptionProtectedRoute';

// Lazy load components
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Create = React.lazy(() => import('./pages/Create'));
const Edit = React.lazy(() => import('./pages/Edit'));
const Preview = React.lazy(() => import('./pages/Preview'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Subscription = React.lazy(() => import('./pages/Subscription'));
const SubscriptionSuccess = React.lazy(() => import('./pages/SubscriptionSuccess'));
const SubscriptionCancel = React.lazy(() => import('./pages/SubscriptionCancel'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Home = React.lazy(() => import('./pages/Home'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const Templates = React.lazy(() => import('./pages/Templates'));
const Examples = React.lazy(() => import('./pages/Examples'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const Blog = React.lazy(() => import('./pages/Blog'));
const Contact = React.lazy(() => import('./pages/Contact'));
const CvTips = React.lazy(() => import('./pages/CvTips'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const CookiePolicy = React.lazy(() => import('./pages/CookiePolicy'));
const Analyse = React.lazy(() => import('./pages/Analyse'));
const CvAnalyse = React.lazy(() => import('./pages/CvAnalyse'));
const CvAnalyseByRole = React.lazy(() => import('./pages/CvAnalyseByRole'));
const Profile = React.lazy(() => import('./pages/Profile'));
const SavedCVs = React.lazy(() => import('./pages/SavedCVs'));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<LoadingFallback />}>
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
    </Suspense>
  );
}

export default AppRoutes; 