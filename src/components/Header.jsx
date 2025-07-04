/* eslint-disable */
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import logo from "../assets/A_cartoon-style_digital_illustration_logo_features.png";
import NotificationBell from './NotificationBell';

// Simple ChevronDown component to replace the heroicons import
const ChevronDownIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    viewBox="0 0 20 20" 
    fill="currentColor"
  >
    <path 
      fillRule="evenodd" 
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
      clipRule="evenodd" 
    />
  </svg>
);

// Analysis menu items
const analysisItems = [
  { name: 'Analyze CV Only', href: '/cv-analyze', description: 'Get general feedback on your CV' },
  { name: 'Industry-Focused Analysis', href: '/cv-analyze-by-role', description: 'Optimize for specific career fields' },
  { name: 'Analyze with Job', href: '/analyze', description: 'Compare your CV to a specific job description' }
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll events for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle clicking outside menu to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('.mobile-menu-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white dark:bg-gray-800 shadow-md py-2' : 'bg-white dark:bg-gray-800 py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="CV Builder Logo" className="h-10 w-auto" />
            <span className="ml-2 font-bold text-xl dark:text-white">MyCVBuilder.co.uk</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              }
            >
              Home
            </NavLink>
            
            <NavLink 
              to="/templates" 
              className={({ isActive }) => 
                isActive ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              }
            >
              Templates
            </NavLink>
            
            {/* Analysis Dropdown */}
            <div className="relative">
              <button
                type="button"
                className={`group inline-flex items-center text-base font-medium ${
                  location.pathname.includes('analyze') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                onClick={() => setIsAnalysisOpen(!isAnalysisOpen)}
                onMouseEnter={() => setIsAnalysisOpen(true)}
              >
                <span>Analysis</span>
                <ChevronDownIcon
                  className={`ml-1 h-5 w-5 transition-transform ${isAnalysisOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isAnalysisOpen && (
                <div 
                  className="absolute left-0 z-10 mt-2 w-64 origin-top-left rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none"
                  onMouseLeave={() => setIsAnalysisOpen(false)}
                >
                  <div className="py-1">
                    {analysisItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsAnalysisOpen(false)}
                      >
                        <div className="font-medium">{item.name}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {isAuthenticated && (
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  isActive ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                }
              >
                Dashboard
              </NavLink>
            )}
            
            {/* Admin Panel Link - Only show for admin users */}
            {isAuthenticated && user && (user.role === 'admin' || user.role === 'superuser' || user.email === 'jamesingleton1971@gmail.com') && (
              <NavLink 
                to="/admin/dashboard" 
                className={({ isActive }) => 
                  isActive || location.pathname.startsWith('/admin') ? "text-purple-600 dark:text-purple-400 font-medium" : "text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium"
                }
              >
                Admin
              </NavLink>
            )}
            
            {/* Auth Links */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <NotificationBell />
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => 
                    isActive ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                  }
                >
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-red-500 text-red-500 dark:border-red-400 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 dark:text-gray-200 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mobile-menu-container bg-white dark:bg-gray-800 absolute top-full left-0 right-0 shadow-lg z-20">
            <div className="px-4 py-3 space-y-2">
              <Link
                to="/"
                className="block py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/templates"
                className="block py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Templates
              </Link>
              
              {/* Analysis Section */}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 pb-1">Analysis Tools</p>
                {analysisItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="block py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              
              {/* Admin Panel Link - Mobile */}
              {isAuthenticated && user && (user.role === 'admin' || user.role === 'superuser' || user.email === 'jamesingleton1971@gmail.com') && (
                <Link
                  to="/admin/dashboard"
                  className="block py-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              
              {/* Auth Section */}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="block py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block py-2 mt-2 bg-blue-600 dark:bg-blue-700 text-white text-center rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 px-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;