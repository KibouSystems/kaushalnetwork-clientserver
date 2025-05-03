import { Route, Routes } from "react-router-dom";
import CompanyUserLogin from "./pages/Auth/CompanyUserLogin";
import NotFoundPage from "./pages/NotFoundPage";
import CompanyUserSignup from "./pages/CompanyUserSignup";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import RegisterCompany from "./pages/RegisterCompany";
import Register from "./pages/Auth/Register";
import Buzz from "./pages/Naviation_pages/Buzz";
import { Toaster } from "react-hot-toast";
import NetworkPage from "./pages/Naviation_pages/Network_Page";
import CompanyDetails from "./pages/CompanyDetails";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from './features/auth/authSlice';
import AdminView from "./pages/Admin/AdminView";
import Cookies from 'js-cookie';
import SuperadminLogin from "./pages/Admin/Superadmin/SuperadminLogin";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    const adminInfo = Cookies.get('admin'); // returns a string like 'true' or 'false'

    const isAdmin = adminInfo === 'true'; // Convert string to boolean

    console.warn('isAdmin:', isAdmin);

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<CompanyUserLogin />} />
                <Route path="/signup" element={<CompanyUserSignup />} />
                <Route path="/register-company" element={<RegisterCompany />} />
                <Route path="/register" element={<Register />} />
                <Route path="/buzz" element={<Buzz />} />
                <Route path="/network" element={<NetworkPage />} />
                <Route path="/company/:id" element={<CompanyDetails />} />
                <Route path="/admin-view" element={<AdminView />} />
                <Route path="/admin/login" element={<SuperadminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
            />
        </>
    );
}

export default App;
