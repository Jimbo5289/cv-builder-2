import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SubscriptionProtectedRoute from './components/SubscriptionProtectedRoute';
import routes from './routes';

// Loading fallback
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
        {routes.map(({ path, Component, protected: isProtected, subscription }, index) => {
          if (!Component) {
            console.warn(`Missing Component for route: ${path}`);
            return null;
          }

          let element = <Component />;

          if (subscription) {
            element = <SubscriptionProtectedRoute>{element}</SubscriptionProtectedRoute>;
          } else if (isProtected) {
            element = <ProtectedRoute>{element}</ProtectedRoute>;
          }

          if (path === '/login' && isAuthenticated) {
            element = <Navigate to="/dashboard" replace />;
          }

          if (path === '/register' && isAuthenticated) {
            element = <Navigate to="/dashboard" replace />;
          }

          return <Route key={index} path={path} element={element} />;
        })}
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
