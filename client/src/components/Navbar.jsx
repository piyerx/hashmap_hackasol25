import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { t } = useLanguage();
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
              {t('appName')}
            </Link>
            <span className="ml-3 text-sm text-text-dark">{t('tagline')}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {user ? (
              <>
                <span className="text-text-dark">
                  {t('welcome')}, <span className="font-semibold">{user.username}</span>
                  {user.role === 'admin' && <span className="ml-1 text-xs bg-primary text-white px-2 py-1 rounded">Admin</span>}
                  {user.role === 'council' && <span className="ml-1 text-xs bg-blue-600 text-white px-2 py-1 rounded">Council</span>}
                </span>
                {user.role === 'user' && (
                  <>
                    <Link
                      to="/dashboard"
                      className="px-4 py-2 text-primary hover:text-primary-dark"
                    >
                      {t('myClaims')}
                    </Link>
                    <Link
                      to="/submit-claim"
                      className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                    >
                      {t('submitClaim')}
                    </Link>
                  </>
                )}
                {(user.role === 'admin' || user.role === 'council') && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 text-primary hover:text-primary-dark"
                  >
                    {user.role === 'council' ? t('councilDashboard') : t('adminDashboard')}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary hover:text-primary-dark"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                >
                  {t('register')}
                </Link>
              </>
            )}
            <Link
              to="/verify"
              className="px-4 py-2 bg-text-dark text-white rounded hover:bg-gray-800 transition-colors"
            >
              {t('verify')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
