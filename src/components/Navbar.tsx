import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Menu, X, AlertCircle, ChevronDown, LogOut, User, Box, Settings } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../logo/image.png';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, checkAuthToken } from '../features/auth/authSlice';
import { RootState, AppDispatch } from '../app/store';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  // Toggle menus
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleAccountMenu = () => setShowAccountMenu(!showAccountMenu);

  // Close menus when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => {
      setShowAccountMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Check if a nav link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Add effect to check auth token
  useEffect(() => {
    const isAuth = checkAuthToken();
    if (!isAuth && isAuthenticated) {
      dispatch(logoutUser());
    }
  }, [dispatch, isAuthenticated]);

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
            'http://69.62.79.102:3000/api/v0/company/company-user-view',
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

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      Cookies.remove('auth_token'); // Explicitly remove cookie
      setIsVerified(false); // Reset verification state
      setIsAdminView(false); // Reset admin view
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
    }
  };

  const handleAdminNavigation = () => {
    const isAdmin = Cookies.get('admin_view') === 'true';
    if (!isAdmin) {
      toast.error('Access denied: Admin privileges required');
      return;
    }
    navigate('/admin-view');
    window.location.reload(); // Force reload to update permissions
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
    <>
      <header className="bg-white shadow-sm border-b border-gray-100 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and brand */}
            <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
              <div className="w-10 h-10 overflow-hidden rounded-md">
                <img
                  src={logoImage}
                  alt="Kaushal Network"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
                Kaushal Network
              </span>
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              {/* View toggle button */}
              {isAuthenticated && (
                <>
                  {isAdminView ? (
                    <NavButton onClick={handleAdminNavigation} active={isActive('/admin-view')}>
                      Admin view
                    </NavButton>
                  ) : (
                    Cookies.get('auth_token') && (
                      <NavButton
                        onClick={handleUserViewNavigation}
                        active={isActive('/company-view')}
                      >
                        User View
                      </NavButton>
                    )
                  )}
                </>
              )}

              {/* Network Button */}
              {isAuthenticated && (
                <FeatureNavButton
                  onClick={canAccessFeature ? () => navigate('/network') : handleUnverifiedClick}
                  disabled={!canAccessFeature}
                  verified={isVerified}
                  active={isActive('/network')}
                >
                  Network
                </FeatureNavButton>
              )}

              {/* Buzz Button */}
              {isAuthenticated && (
                <FeatureNavButton
                  onClick={canAccessFeature ? () => navigate('/buzz') : handleUnverifiedClick}
                  disabled={!canAccessFeature}
                  verified={isVerified}
                  active={isActive('/buzz')}
                >
                  BUZZ
                </FeatureNavButton>
              )}

              {/* Auth buttons or user menu */}
              {isAuthenticated ? (
                <div className="relative ml-2">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleAccountMenu();
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium shadow-sm">
                      {isAdminView ? 'A' : 'U'}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {/* Dropdown menu */}
                  <AnimatePresence>
                    {showAccountMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-10"
                      >
                        <div className="p-3 border-b border-gray-100 bg-gray-50">
                          <p className="text-sm font-medium text-gray-900">Account</p>
                          <p className="text-xs text-gray-600 truncate">user@example.com</p>
                        </div>
                        <div className="p-2">
                          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-500" />
                            Profile
                          </button>
                          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center">
                            <Settings className="w-4 h-4 mr-2 text-gray-500" />
                            Settings
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    className="text-gray-700 hover:text-blue-700"
                  >
                    Login
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-sm"
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 pt-2 pb-4 space-y-2 bg-white">
                {isAuthenticated && (
                  <>
                    {isAdminView ? (
                      <MobileNavButton
                        onClick={handleAdminNavigation}
                        active={isActive('/admin-view')}
                      >
                        <Box className="w-5 h-5 mr-2" />
                        Admin view
                      </MobileNavButton>
                    ) : (
                      Cookies.get('auth_token') && (
                        <MobileNavButton
                          onClick={handleUserViewNavigation}
                          active={isActive('/company-view')}
                        >
                          <User className="w-5 h-5 mr-2" />
                          User View
                        </MobileNavButton>
                      )
                    )}

                    <MobileNavButton
                      onClick={
                        canAccessFeature ? () => navigate('/network') : handleUnverifiedClick
                      }
                      active={isActive('/network')}
                      disabled={!canAccessFeature}
                    >
                      {!isVerified && <AlertCircle className="w-4 h-4 text-amber-500 mr-2" />}
                      Network
                    </MobileNavButton>

                    <MobileNavButton
                      onClick={canAccessFeature ? () => navigate('/buzz') : handleUnverifiedClick}
                      active={isActive('/buzz')}
                      disabled={!canAccessFeature}
                    >
                      {!isVerified && <AlertCircle className="w-4 h-4 text-amber-500 mr-2" />}
                      BUZZ
                    </MobileNavButton>

                    <MobileNavButton onClick={handleLogout}>
                      <LogOut className="w-5 h-5 mr-2" />
                      Logout
                    </MobileNavButton>
                  </>
                )}

                {!isAuthenticated && (
                  <>
                    <MobileNavButton onClick={() => navigate('/login')}>Login</MobileNavButton>
                    <div className="mt-4">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        onClick={() => navigate('/register')}
                      >
                        Register
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Verification banner */}
      {!isVerified && isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200"
        >
          <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2 text-amber-800">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm font-medium">
                Your account is pending verification. Some features will be limited until
                verification is complete.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

// Button components for cleaner code
const NavButton = ({
  children,
  onClick,
  active = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active ? 'text-blue-700 bg-blue-50' : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
    }`}
  >
    {children}
  </button>
);

const FeatureNavButton = ({
  children,
  onClick,
  disabled = false,
  verified = true,
  active = false,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  verified?: boolean;
  active?: boolean;
}) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        disabled
          ? 'text-gray-400 cursor-not-allowed'
          : active
            ? 'text-blue-700 bg-blue-50'
            : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center">
        {children}
        {!verified && (
          <div className="ml-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          </div>
        )}
      </div>
    </button>

    {!verified && (
      <div className="absolute hidden group-hover:block w-52 p-2 bg-amber-50 text-amber-800 text-xs rounded-md -bottom-10 left-1/2 transform -translate-x-1/2 shadow-lg border border-amber-200 z-10">
        Account verification required for this feature
      </div>
    )}
  </div>
);

const MobileNavButton = ({
  children,
  onClick,
  active = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: (e?: React.MouseEvent) => void;
  active?: boolean;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex w-full items-center px-4 py-3 text-base rounded-lg transition-colors ${
      disabled
        ? 'text-gray-400'
        : active
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-700 hover:bg-gray-50'
    }`}
  >
    {children}
  </button>
);

export default Navbar;
