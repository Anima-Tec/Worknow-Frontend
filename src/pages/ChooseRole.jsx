import { useNavigate } from 'react-router-dom';

export default function ChooseRole() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="card">
        <h2>Selecciona tu rol</h2>
        <p>¿Cómo quieres continuar?</p>

        <button className="primaryBtn" onClick={() => navigate('/home/user')}>
          Soy Usuario
        </button>

        <button className="primaryBtn" onClick={() => navigate('/home/company')}>
          Soy Empresa
        </button>
      </div>
    </div>
  );
}
