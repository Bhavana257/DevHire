import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/">
          <img src="/devhire-logo.svg" alt="DevHire" className="h-12" />
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/jobs" className="text-gray-600 hover:text-blue-600 font-medium transition">
            Browse Jobs
          </Link>

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {user?.role === 'candidate' && (
                <>
                  <Link to="/ats-scanner" className="text-gray-600 hover:text-blue-600 font-medium transition">
                    ATS Scanner
                  </Link>
                  <Link to="/candidate/applications" className="text-gray-600 hover:text-blue-600 font-medium transition">
                    My Applications
                  </Link>
                </>
              )}
              {user?.role === 'employer' && (
                <Link to="/employer/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition">
                  Dashboard
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-gray-600 hover:text-blue-600 font-medium transition">
                  Admin Panel
                </Link>
              )}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Hi, {user?.full_name.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium text-sm"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
