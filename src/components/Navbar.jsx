// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar(){
  const navigate = useNavigate();
  return (
    <nav className="nav">
      <div className="container nav__inner">
        <div className="brand" onClick={()=>navigate("/")}>
          <img src="/logo.svg" alt="WorkNow" />
        </div>
        <div className="nav__actions">
          <button className="link" onClick={()=>navigate("/login")}>Iniciar sesión</button>
          <button className="smallPrimary" onClick={()=>navigate("/choose")}>Empezar</button>
        </div>
      </div>
    </nav>
  );
}
