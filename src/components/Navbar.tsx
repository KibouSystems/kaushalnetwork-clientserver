import React, { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-white shadow px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold text-blue-600">Kaushal Network</h1>

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
          <Button variant="ghost">BUZZ</Button>
          <Button variant="outline">Login</Button>
          <Button className="bg-blue-600 text-white">Register</Button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-start space-y-2 px-4 pb-4">
          <Button variant="ghost" className="w-full text-left">MSMEs</Button>
          <Button variant="ghost" className="w-full text-left">Service Providers</Button>
          <Button variant="ghost" className="w-full text-left">Corporates</Button>
          <Button variant="ghost" className="w-full text-left">Banks</Button>
          <Button variant="ghost" className="w-full text-left">Network</Button>
          <Button variant="ghost" className="w-full text-left">BUZZ</Button>
          <Button variant="outline" className="w-full text-left">Login</Button>
          <Button className="bg-blue-600 text-white w-full text-left">Register</Button>
        </div>
      )}
    </header>
  );
};

export default Navbar;


// import {Link} from "react-router-dom"; // (make sure it's react-router-dom)

// export default function Navbar() {
//     return (
//         <nav className="px-10 py-4 flex items-center justify-between w-full">
//             {/* Logo */}
//             <div className="flex items-center">
//                 <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
//                     Logo
//                 </Link>
//             </div>

//             {/* Nav Links */}
//             <div className="flex space-x-8">
//                 <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
//                     MSME
//                 </Link>
//                 <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
//                     Services Provided
//                 </Link>
//                 <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
//                     BUZZ
//                 </Link>
//             </div>

//             {/* Auth Buttons */}
//             <div className="flex space-x-4">
//                 <Link to="/login">
//                     <button className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors">
//                         Login
//                     </button>
//                 </Link>
//                 <Link to="/register-company">
//                     <button
//                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors">
//                         Register Now!!
//                     </button>
//                 </Link>
//             </div>
//         </nav>
//     );
// }
