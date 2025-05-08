import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/A_cartoon-style_digital_illustration_logo_features.png";

function Header() {
  console.log('Header component rendering');
  const auth = useAuth();
  console.log('Auth context:', auth);
  const navigate = useNavigate();
  console.log('Navigate function:', !!navigate);

  const handleLogout = () => {
    if (auth && auth.logout) {
      auth.logout();
      navigate('/');
    }
  };

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="CV Builder Logo" className="h-12 w-auto mr-2" />
            <span className="text-3xl font-bold text-[#2c3e50]">CV Builder</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/templates" className="text-gray-600 hover:text-gray-900">Templates</Link>
            <Link to="/examples" className="text-gray-600 hover:text-gray-900">Examples</Link>
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link to="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
            
            {auth?.user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;