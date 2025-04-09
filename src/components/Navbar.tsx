import {Link} from "react-router-dom"; // (make sure it's react-router-dom)

export default function Navbar() {
    return (
        <nav className="px-10 py-4 flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
                    Logo
                </Link>
            </div>

            {/* Nav Links */}
            <div className="flex space-x-8">
                <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                    MSME
                </Link>
                <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                    Services Provided
                </Link>
                <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                    BUZZ
                </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex space-x-4">
                <Link to="/login">
                    <button className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors">
                        Login
                    </button>
                </Link>
                <Link to="/register-company">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors">
                        Register Now!!
                    </button>
                </Link>
            </div>
        </nav>
    );
}
