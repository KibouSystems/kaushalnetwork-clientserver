import {Route, Routes} from "react-router-dom";
import CompanyUserLogin from "./pages/CompanyUserLogin";
import NotFoundPage from "./pages/NotFoundPage";
import CompanyUserSignup from "./pages/CompanyUserSignup";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import RegisterCompany from "./pages/RegisterCompany";

function App() {
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/login" element={<CompanyUserLogin/>}/>
                <Route path="/signup" element={<CompanyUserSignup/>}/>
                <Route path="/register-company" element={<RegisterCompany/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </>
    );
}

export default App;
