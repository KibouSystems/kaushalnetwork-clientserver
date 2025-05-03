import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Cookie, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../logo/image.png'; // Update import
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, checkAuthToken } from '../features/auth/authSlice';
import { RootState, AppDispatch } from '../app/store';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

console.warn(isAuthenticated, 'isAuthenticated');

 
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      // No need to manually set isAuthenticated as it's handled by the reducer
      toast.success('Logged out successfully');
      navigate('/login');
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
    console.warn(" is admin view",Cookies.get('admin_view') );
    
    const adminView = Cookies.get('admin_view') === 'true';
    const authToken = Cookies.get('auth_token');
    setIsAdminView(adminView);

    // Check for user view conditions
    if (!adminView && authToken) {
      // Add User View button to nav
      navigate('/company-view'); // or wherever your user view route is
    }
  }, [navigate]);

  const handleAdminNavigation = () => {
    const isAdmin = Cookies.get('admin_view') === 'true';
    if (!isAdmin) {
      toast.error('Access denied: Admin privileges required');
      return;
    }
    navigate('/admin-view');
  };

  const handleSuperAdminNavigation = () => {
    window.open('/admin/dashboard', '_blank');
  };

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
          <Button 
            variant="ghost" 
            onClick={handleSuperAdminNavigation}
          >
            Super Admin
          </Button>
          {isAdminView ? (
            <Button 
              variant="ghost" 
              onClick={handleAdminNavigation}
            >
              Admin view
            </Button>
          ) : Cookies.get('auth_token') && (
            <Button 
              variant="ghost" 
              onClick={() => navigate('/company-view')}
            >
              User View
            </Button>
          )}
          <Button variant="ghost" onClick={() => navigate('/network')}>Network</Button>
          <Button variant="ghost" onClick={() => navigate('/buzz')}>
            BUZZ
          </Button>
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
          <Button 
            variant="ghost" 
            className="w-full text-left"
            onClick={handleSuperAdminNavigation}
          >
            Super Admin
          </Button>
          {isAdminView ? (
            <Button 
              variant="ghost" 
              className="w-full text-left" 
              onClick={handleAdminNavigation}
            >
              Admin view
            </Button>
          ) : Cookies.get('auth_token') && (
            <Button 
              variant="ghost" 
              className="w-full text-left"
              onClick={() => navigate('/company-view')}
            >
              User View
            </Button>
          )}
          <Button variant="ghost" className="w-full text-left" onClick={() => navigate('/network')}>
            Network
          </Button>
          <Button variant="ghost" className="w-full text-left" onClick={() => navigate('/buzz')}>
            BUZZ
          </Button>
          {isAuthenticated ? (
            <Button variant="outline" className="w-full text-left" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button variant="outline" className="w-full text-left" onClick={() => navigate('/login')}>
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
    </header>
  );
};

export default Navbar;
