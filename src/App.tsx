import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { Toaster } from "react-hot-toast";

// Pages and Components
import CompanyUserLogin from "./pages/Auth/CompanyUserLogin";
import NotFoundPage from "./pages/NotFoundPage";
import CompanyUserSignup from "./pages/CompanyUserSignup";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import RegisterCompany from "./pages/RegisterCompany";
import Register from "./pages/Auth/Register";
import Buzz from "./pages/Naviation_pages/Buzz";
import NetworkPage from "./pages/Naviation_pages/Network_Page";
import CompanyDetails from "./pages/CompanyDetails";
import AdminView from "./pages/Admin/AdminView";
import SuperadminLogin from "./pages/Admin/Superadmin/SuperadminLogin";
import AdminDashboard from "./pages/Admin/Dashboard/SuperAdminDashboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import TenderForm from './components/tender/TenderForm';
import CompanyView from "./pages/CompanyView";

// Redux slice
import { checkAuth } from "./features/auth/authSlice";

function App() {
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    // Only hide the navbar on the exact /admin/dashboard route
    const hideNavbar = location.pathname === "/superadmin/dashboard";

    return (
        <>
            {!hideNavbar && <Navbar />}

            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<CompanyUserLogin />} />
                <Route path="/signup" element={<CompanyUserSignup />} />
                <Route path="/register-company" element={<RegisterCompany />} />
                <Route path="/register" element={<Register />} />
                <Route path="/buzz" element={<Buzz />} />
                <Route path="/network" element={<NetworkPage />} />
                <Route path="/company/:id" element={<CompanyDetails />} />
                <Route path="/tender/create" element={<TenderForm />} />
                <Route path="/company-view" element={<CompanyView />} />

                {/* Admin routes */}
                <Route
                    path="/admin-view"
                    element={
                        <ProtectedAdminRoute>
                            <AdminView />
                        </ProtectedAdminRoute>
                    }
                />
                <Route path="/superadmin/dashboard" element={<AdminDashboard />} />
                <Route path="/superadmin/login" element={<SuperadminLogin />} />

                {/* Catch-all */}
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
