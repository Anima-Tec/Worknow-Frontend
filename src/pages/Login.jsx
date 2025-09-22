import { useState, useEffect } from 'react';
import { loginApi } from '../services/api';
import { saveSession, getRememberedEmail } from '../auth/authContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { IoEyeOutline } from 'react-icons/io5';
import { FaRegEyeSlash } from 'react-icons/fa';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    const saved = getRememberedEmail();
    if (saved) setEmail(saved);
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const data = await loginApi({ email, password });
      saveSession(data, { rememberEmail });
      navigate('/choose');
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <form className="card" onSubmit={onSubmit}>
        <div className="header">
          <h1>
            work<span className="brand">now</span>
          </h1>
          <p>Inicie sesión con su cuenta</p>
        </div>

        <label className="label">Correo</label>
        <input
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@worknow.com"
          required
        />

        <label className="label">Contraseña</label>
        <div className="passwordRow">
          <input
            type={showPass ? 'text' : 'password'}
            className="input noBorder"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button
            type="button"
            className="toggleBtn"
            onClick={() => setShowPass((s) => !s)}
            aria-label="Mostrar contraseña"
            title={showPass ? 'Ocultar' : 'Mostrar'}
          >
            {showPass ? <IoEyeOutline /> : <FaRegEyeSlash />}
          </button>
        </div>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={rememberEmail}
            onChange={(e) => setRememberEmail(e.target.checked)}
          />
          <span>Recordar mi email</span>
        </label>

        {err && <p className="error">{err}</p>}

        <button className="primaryBtn" disabled={loading}>
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>

        {/* Link de recuperación */}
        <div className="formFooter">
          <a href="#" className="forgotLink">
            ¿Olvidaste la contraseña?
          </a>
        </div>
      </form>
    </div>
  );
}
