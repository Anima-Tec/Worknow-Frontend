import { Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login.jsx";
import ChooseRole from "./pages/ChooseRole.jsx";
import HomeCompany from "./pages/HomeCompany.jsx";
import HomeUser from "./pages/HomeUser.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/choose" element={<ChooseRole />} />
      <Route path="/home/company" element={<HomeCompany />} />
      <Route path="/home/user" element={<HomeUser />} />
    </Routes>
  );
}
