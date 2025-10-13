import React, { useState } from 'react';
import './RegisterUser.css';

const RegisterCompany = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombreEmpresa: '',
    rut: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    sector: '',
    sitioWeb: '',
    tamano: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombreEmpresa.trim()) newErrors.nombreEmpresa = 'El nombre de la empresa es requerido';
    if (!formData.email.trim()) newErrors.email = 'El correo es requerido';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es requerida';
    if (!formData.ciudad.trim()) newErrors.ciudad = 'La ciudad es requerida';
    if (!formData.sector.trim()) newErrors.sector = 'El sector es requerido';
    if (!formData.tamano.trim()) newErrors.tamano = 'Debe seleccionar el tamaño';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const companyData = {
      nombreEmpresa: formData.nombreEmpresa.trim(),
      rut: formData.rut.trim(),
      email: formData.email.trim().toLowerCase(),
      telefono: formData.telefono.trim(),
      direccion: formData.direccion.trim(),
      ciudad: formData.ciudad.trim(),
      sector: formData.sector.trim(),
      sitioWeb: formData.sitioWeb.trim(),
      tamano: formData.tamano.trim(),
      password: formData.password
    };

    try {
      const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
      console.log('📤 Enviando datos al backend:', companyData);

      const res = await fetch(`${API_BASE}/auth/register/company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData)
      });

      const data = await res.json();
      console.log('📩 Respuesta del backend:', data);

      if (res.ok) {
        alert('✅ Registro exitoso! Ahora podés iniciar sesión.');
        window.location.href = '/login';
      } else if (res.status === 400) {
        alert(data.message || '⚠️ Datos inválidos. Revisá el formulario.');
      } else {
        alert(data.message || '❌ Error al registrar empresa.');
      }
    } catch (err) {
      console.error('❌ Error de conexión:', err);
      alert('❌ No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-split">
          {/* Panel izquierdo */}
          <div className="register-left-panel">
            <h1 className="register-title">
              Registra tu empresa en <span className="register-brand">WorkNow</span>
            </h1>
            <p className="register-subtitle">
              Publica ofertas de trabajo, encuentra talento calificado y haz crecer tu equipo con los mejores profesionales.
            </p>
            <div className="register-features">
              <div className="register-feature-item">
                <span>Acceso a miles de candidatos</span>
              </div>
              <div className="register-feature-item">
                <span>Publica ofertas ilimitadas</span>
              </div>
              <div className="register-feature-item">
                <span>Gestión eficiente de candidatos</span>
              </div>
            </div>
          </div>

          {/* Panel derecho */}
          <div className="register-right-panel">
            <div className="register-header">
              <h2 className="register-form-title">Crear Cuenta Empresa</h2>
              <p className="register-form-subtitle">Completa los datos de tu empresa</p>
            </div>

            {/* 🔹 Formulario simple */}
            <div className="register-form">
              <input type="text" name="nombreEmpresa" placeholder="Nombre de la empresa" value={formData.nombreEmpresa} onChange={handleChange} />
              <input type="text" name="rut" placeholder="RUT" value={formData.rut} onChange={handleChange} />
              <input type="email" name="email" placeholder="Email corporativo" value={formData.email} onChange={handleChange} />
              <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
              <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} />
              <input type="text" name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleChange} />
              <input type="text" name="sector" placeholder="Sector" value={formData.sector} onChange={handleChange} />
              <input type="text" name="sitioWeb" placeholder="Sitio Web (opcional)" value={formData.sitioWeb} onChange={handleChange} />
              <input type="text" name="tamano" placeholder="Tamaño de la empresa" value={formData.tamano} onChange={handleChange} />

              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
              />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <button onClick={handleSubmit} className="register-submit-btn">
                Crear Cuenta Empresa
              </button>

              <p className="register-login-link">
                ¿Ya tienes cuenta?{' '}
                <a href="/login" className="register-link">
                  Inicia sesión
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCompany;
