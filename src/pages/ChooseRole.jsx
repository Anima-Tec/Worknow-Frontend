import { useNavigate } from "react-router-dom";
import { FaUser, FaBuilding } from "react-icons/fa";
import "./ChooseRole.css";

export default function ChooseRole() {
  const navigate = useNavigate();

  return (
    <div className="rolePage">
      <div className="chooseHeader">
        <h1>
          Elige tu <span className="brand">rol</span>
        </h1>
        <p>
          Con WorkNow puedes impulsar tu futuro: postúlate o publica oportunidades.
        </p>
      </div>

      <div className="roles">
        <div className="roleCard userCard">
          <FaUser size={48} className="icon userIcon" />
          <h2>Usuario</h2>
          <p>
          Postúlate a proyectos o trabajos, crea tu huella digital, demuestra tus habilidades y haz crecer tu perfil profesional.
          </p>
          <button className="btnPrimary" onClick={() => navigate("/register/user")}>
            Soy Usuario
          </button>
        </div>

        <div className="roleCard companyCard">
          <FaBuilding size={48} className="icon companyIcon" />
          <h2>Empresa</h2>
          <p>
           Publica proyectos o puestos de trabajo, recibe postulaciones y selecciona al mejor talento para tu necesidad.
          </p>
          <button className="btnLight" onClick={() => navigate("/register/company")}>
            Soy Empresa
          </button>
        </div>
      </div>
    </div>
  );
}
