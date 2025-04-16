import React, { useState } from 'react';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../logo/image.png'; // Update import

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

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
          <Button variant="ghost">MSMEs</Button>
          <Button variant="ghost">Service Providers</Button>
          <Button variant="ghost">Corporates</Button>
          <Button variant="ghost">Banks</Button>
          <Button variant="ghost">Network</Button>
          <Button variant="ghost" onClick={() => navigate('/buzz')}>
            BUZZ
          </Button>
          <Button variant="outline" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button className="bg-blue-600 text-white" onClick={() => navigate('/register')}>
            Register
          </Button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-start space-y-2 px-4 pb-4">
          <Button variant="ghost" className="w-full text-left">
            MSMEs
          </Button>
          <Button variant="ghost" className="w-full text-left">
            Service Providers
          </Button>
          <Button variant="ghost" className="w-full text-left">
            Corporates
          </Button>
          <Button variant="ghost" className="w-full text-left">
            Banks
          </Button>
          <Button variant="ghost" className="w-full text-left">
            Network
          </Button>
          <Button variant="ghost" className="w-full text-left" onClick={() => navigate('/buzz')}>
            BUZZ
          </Button>
          <Button variant="outline" className="w-full text-left" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button
            className="bg-blue-600 text-white w-full text-left"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
