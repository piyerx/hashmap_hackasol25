import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b-2 border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              Adhikar
            </Link>
            <span className="ml-3 text-sm text-text-dark">Decentralized Land Registry</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {user ? (
              <>
                <span className="text-text-dark">
                  Welcome, <span className="font-semibold">{user.username}</span>
                  {user.role === 'admin' && <span className="ml-1 text-xs bg-primary text-white px-2 py-1 rounded">Admin</span>}
                </span>
                {user.role === 'user' && (
                  <>
                    <Link
                      to="/dashboard"
                      className="px-4 py-2 text-primary hover:text-primary-dark"
                    >
                      My Claims
                    </Link>
                    <Link
                      to="/submit-claim"
                      className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                    >
                      Submit Claim
                    </Link>
                  </>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 text-primary hover:text-primary-dark"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary hover:text-primary-dark"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                >
                  Register
                </Link>
              </>
            )}
            <Link
              to="/verify"
              className="px-4 py-2 bg-text-dark text-white rounded hover:bg-gray-800 transition-colors"
            >
              Verify
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
