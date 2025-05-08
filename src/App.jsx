import React from 'react';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import AppRoutes from './routes';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Toaster position="top-right" />
          <Header />
          <main className="container mx-auto px-4 py-8 flex-grow">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;