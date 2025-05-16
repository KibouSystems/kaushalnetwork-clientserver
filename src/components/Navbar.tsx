import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Cookie, Menu, X, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../logo/image.png'; // Update import
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, checkAuthToken } from '../features/auth/authSlice';
import { RootState, AppDispatch } from '../app/store';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import axios from 'axios';

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  console.warn(isAuthenticated, 'isAuthenticated');

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      Cookies.remove('auth_token'); // Explicitly remove cookie
      setIsVerified(false); // Reset verification state
      setIsAdminView(false); // Reset admin view
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error during logout');
    }
  };

  // Add effect to check auth token
  useEffect(() => {
    const isAuth = checkAuthToken();
    if (!isAuth && isAuthenticated) {
      dispatch(logoutUser());
    }
  }, []);

  useEffect(() => {
    const adminView = Cookies.get('admin_view') === 'true';
    const authToken = Cookies.get('auth_token');
    setIsAdminView(adminView);

    // Only navigate to company-view on initial login
    if (!adminView && authToken && window.location.pathname === '/login') {
      navigate('/company-view');
    }
  }, [navigate]);

  useEffect(() => {
    const checkVerification = async () => {
      const token = Cookies.get('auth_token');
      if (token) {
        try {
          const response = await axios.get(
            'http://localhost:3000/api/v0/company/company-user-view',
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setIsVerified(response.data.verified);
        } catch (error) {
          console.error('Error checking verification:', error);
        }
      }
    };

    checkVerification();
  }, []);

  // Add new effect to sync auth state
  useEffect(() => {
    const checkAuthStatus = () => {
      const authToken = Cookies.get('auth_token');
      if (!authToken && isAuthenticated) {
        dispatch(logoutUser());
      }
    };

    // Check immediately
    checkAuthStatus();

    // Add listener for cookie changes
    const intervalId = setInterval(checkAuthStatus, 1000);

    return () => clearInterval(intervalId);
  }, [dispatch, isAuthenticated]);

  const handleAdminNavigation = () => {
    const isAdmin = Cookies.get('admin_view') === 'true';
    if (!isAdmin) {
      toast.error('Access denied: Admin privileges required');
      return;
    }
    navigate('/admin-view');
    window.location.reload(); // Force reload to update permissions
  };

  const handleSuperAdminNavigation = () => {
    window.open('/admin/dashboard', '_blank');
  };

  const handleUserViewNavigation = () => {
    navigate('/company-view');
    window.location.reload(); // Force reload to update permissions
  };

  const handleUnverifiedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.error('Your account needs to be verified to access this feature', {
      icon: '🔒',
      duration: 4000,
    });
  };

  const canAccessFeature = isAuthenticated && isVerified;

  return (
    <header className="bg-white shadow px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logoImage} alt="Kaushal Network" className="h-12 w-12 object-contain" />
          <span className="text-2xl font-bold text-blue-600">Kaushal Network</span>
        </Link>

        {/* Hamburger for mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-2 lg:space-x-4 items-center">
          {isAdminView ? (
            <Button variant="ghost" onClick={handleAdminNavigation}>
              Admin view
            </Button>
          ) : (
            Cookies.get('auth_token') && (
              <Button variant="ghost" onClick={handleUserViewNavigation}>
                User View
              </Button>
            )
          )}

          {/* Network Button */}
          {isAuthenticated && (
            <div className="relative group">
              <Button
                variant="ghost"
                onClick={canAccessFeature ? () => navigate('/network') : handleUnverifiedClick}
                className={!canAccessFeature ? 'opacity-50 cursor-not-allowed' : ''}
              >
                Network
                {!isVerified && (
                  <div className="absolute -top-1 -right-1">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  </div>
                )}
              </Button>
              {!isVerified && (
                <div className="absolute hidden group-hover:block w-48 p-2 bg-amber-50 text-amber-800 text-xs rounded-md -bottom-8 left-1/2 transform -translate-x-1/2 shadow-lg border border-amber-200">
                  Account verification required
                </div>
              )}
            </div>
          )}

          {/* Buzz Button */}
          {isAuthenticated && (
            <div className="relative group">
              <Button
                variant="ghost"
                onClick={canAccessFeature ? () => navigate('/buzz') : handleUnverifiedClick}
                className={!canAccessFeature ? 'opacity-50 cursor-not-allowed' : ''}
              >
                BUZZ
                {!isVerified && (
                  <div className="absolute -top-1 -right-1">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  </div>
                )}
              </Button>
              {!isVerified && (
                <div className="absolute hidden group-hover:block w-48 p-2 bg-amber-50 text-amber-800 text-xs rounded-md -bottom-8 left-1/2 transform -translate-x-1/2 shadow-lg border border-amber-200">
                  Account verification required
                </div>
              )}
            </div>
          )}

          {isAuthenticated ? (
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button className="bg-blue-600 text-white" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-start space-y-2 px-4 pb-4">
          <Button variant="ghost" className="w-full text-left" onClick={handleSuperAdminNavigation}>
            Super Admin
          </Button>
          {isAdminView ? (
            <Button variant="ghost" className="w-full text-left" onClick={handleAdminNavigation}>
              Admin view
            </Button>
          ) : (
            Cookies.get('auth_token') && (
              <Button
                variant="ghost"
                className="w-full text-left"
                onClick={handleUserViewNavigation}
              >
                User View
              </Button>
            )
          )}

          {isAuthenticated && (
            <>
              <Button
                variant="ghost"
                className="w-full text-left relative"
                onClick={canAccessFeature ? () => navigate('/network') : handleUnverifiedClick}
                disabled={!canAccessFeature}
              >
                Network
                {!isVerified && (
                  <AlertCircle className="w-4 h-4 text-amber-500 absolute right-2 top-1/2 -translate-y-1/2" />
                )}
              </Button>

              <Button
                variant="ghost"
                className="w-full text-left relative"
                onClick={canAccessFeature ? () => navigate('/buzz') : handleUnverifiedClick}
                disabled={!canAccessFeature}
              >
                BUZZ
                {!isVerified && (
                  <AlertCircle className="w-4 h-4 text-amber-500 absolute right-2 top-1/2 -translate-y-1/2" />
                )}
              </Button>
            </>
          )}

          {isAuthenticated ? (
            <Button variant="outline" className="w-full text-left" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full text-left"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                className="bg-blue-600 text-white w-full text-left"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </>
          )}
        </div>
      )}

      {!isVerified && isAuthenticated && (
        <div className="bg-amber-50 border-t border-amber-200">
          <div className="max-w-7xl mx-auto px-4 py-2 text-sm text-amber-800 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Your account is pending verification. Some features will be limited until verification
            is complete.
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
