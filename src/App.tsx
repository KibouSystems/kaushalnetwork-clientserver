import {Route, Routes} from "react-router-dom";
import CompanyUserLogin from "./pages/CompanyUserLogin";
import NotFoundPage from "./pages/NotFoundPage";
import CompanyUserSignup from "./pages/CompanyUserSignup";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import RegisterCompany from "./pages/RegisterCompany";
import Register from "./pages/Register";
import Buzz from "./pages/Buzz";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/login" element={<CompanyUserLogin/>}/>
                <Route path="/signup" element={<CompanyUserSignup/>}/>
                <Route path="/register-company" element={<RegisterCompany/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/buzz" element={<Buzz/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
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
