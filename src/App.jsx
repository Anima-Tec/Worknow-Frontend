import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import ChooseRole from "./pages/ChooseRole.jsx";
import HomeCompany from "./pages/HomeCompany.jsx";
import HomeUser from "./pages/HomeUser.jsx";
import Landing from "./pages/Landing.jsx";
import { useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import ContactCompany from "./pages/ContactCompany";
import ContactUser from "./pages/contactUser.jsx";
import PerfilUser from "./pages/perfilUser.jsx";



export default function App() {
  return (
    <Routes>
       <Route path="/landing" element={<Landing />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/choose" element={<ChooseRole />} />
      <Route path="/home/company" element={<HomeCompany />} />
      <Route path="/home/user" element={<HomeUser />} />
      <Route path="/Contactcompany" element={<ContactCompany />} />
      <Route path="/ContactUser" element={<ContactUser />} />
      <Route path="/PerfilUser" element={<PerfilUser />} />


    </Routes>
  );
}
