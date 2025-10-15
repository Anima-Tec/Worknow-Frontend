import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import ChooseRole from "./pages/ChooseRole.jsx";
import HomeCompany from "./pages/HomeCompany.jsx";
import HomeUser from "./pages/HomeUser.jsx";
import Landing from "./pages/Landing.jsx";
import { useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import PerfilUser from "./pages/PerfilUser";
import PerfilCompany from "./pages/PerfilCompany";
import QuienesSomos from "./pages/QuienesSomos";
import JobForm from "./pages/JobForm";
import RegisterUser from "./pages/RegisterUser.jsx";
import RegisterCompany from "./pages/RegisterCompany.jsx";
import MisPostulaciones from './components/MisPostulaciones';

export default function App() {
  return (
    <Routes>
      {/* Páginas públicas */}
      <Route path="/landing" element={<Landing />} />
      <Route path="/" element={<Navigate to="/landing" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/choose" element={<ChooseRole />} />
      <Route path="/register/user" element={<RegisterUser />} />
      <Route path="/register/company" element={<RegisterCompany />} />

      {/* Páginas privadas */}
      <Route path="/home/company" element={<HomeCompany />} />
      <Route path="/home/user" element={<HomeUser />} />
      <Route path="/PerfilUser" element={<PerfilUser />} />
      <Route path="/jobs/form" element={<JobForm />} />
      <Route path="/perfilcompany" element={<PerfilCompany />} />
      <Route path="/QuienesSomos" element={<QuienesSomos />} />
      <Route path="/jobs/form" element={<JobForm />} />
      <Route path="/mis-postulaciones" element={<MisPostulaciones />} /> {/* Agregada esta línea */}
    </Routes>
  );
}