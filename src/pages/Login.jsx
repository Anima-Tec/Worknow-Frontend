import { useState, useEffect } from "react";
import { loginApi } from "../services/api";
import { saveSession, getRememberedEmail } from "../auth/authContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const saved = getRememberedEmail();
    if (saved) setEmail(saved);
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const data = await loginApi({ email, password });
      saveSession(data, { rememberEmail });
      console.log("✅ Login exitoso:", data.user.role);
      if (data.user.role === "COMPANY") navigate("/home/company");
      else navigate("/home/user");
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="bg-shape bg1"></div>
      <div className="bg-shape bg2"></div>

      <div className="login-container">
        <div className="login-left">
          <h1 className="title">
            Bienvenido a <span className="brand">WorkNow</span>
          </h1>
          <p className="desc">
            Encuentra oportunidades laborales y proyectos a tu medida.
            Conéctate con empresas y comienza tu futuro hoy mismo.
          </p>
        </div>
        <form className="login-card" onSubmit={onSubmit}>
          <h2 className="form-title">Inicia Sesión</h2>

          <div className="field">
            <label className="label">Correo</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@worknow.com"
              required
            />
          </div>

          <div className="field">
            <label className="label">Contraseña</label>
            <div className="passwordInput">
              <input
                type={showPass ? "text" : "password"}
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <span
                className="iconEye"
                onClick={() => setShowPass((s) => !s)}
              >
                {showPass ? <IoEyeOutline /> : <FaRegEyeSlash />}
              </span>
            </div>
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
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
          <div className="formFooter">
            <a href="#" className="forgotLink">
              ¿Olvidaste la contraseña?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
