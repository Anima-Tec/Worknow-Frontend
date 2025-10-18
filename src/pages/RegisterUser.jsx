import React, { useState } from 'react';
import './RegisterUser.css';
import { useNotification, NotificationContainer } from '../utils/notifications.jsx';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    ciudad: '',
    profesion: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const { notifications, showSuccess, showError, removeNotification } = useNotification();

  // Departamentos de Uruguay CORREGIDOS
  const departamentosUruguay = [
    'Artigas', 'Canelones', 'Cerro Largo', 'Colonia', 'Durazno', 
    'Flores', 'Florida', 'Lavalleja', 'Maldonado', 'Montevideo', 
    'Paysandú', 'Río Negro', 'Rivera', 'Rocha', 'Salto', 
    'San José', 'Soriano', 'Tacuarembó', 'Treinta y Tres'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación específica para teléfono
    if (name === 'telefono') {
      // Si el usuario borra el +598, lo mantenemos automáticamente
      if (!value.startsWith('+598') && value.length > 0) {
        // Si empieza con 598 sin el +, lo convertimos
        if (value.startsWith('598')) {
          setFormData(prev => ({
            ...prev,
            telefono: '+' + value
          }));
          return;
        }
        // Si no tiene código de país, lo agregamos
        else if (!value.startsWith('+')) {
          setFormData(prev => ({
            ...prev,
            telefono: '+598 ' + value
          }));
          return;
        }
      }
      
      // Limpiar espacios para validación
      const telefonoLimpio = value.replace(/\s/g, '');
      
      // Validar que después del código solo haya números
      const telefonoValue = telefonoLimpio.replace('+598', '');
      const telefonoRegex = /^[0-9]*$/;
      if (telefonoValue && !telefonoRegex.test(telefonoValue)) {
        setErrors(prev => ({
          ...prev,
          telefono: 'El teléfono solo puede contener números después del código +598'
        }));
        return;
      }
      
      // Limitar longitud total (código + 8 dígitos)
      if (telefonoLimpio.length > 12) { // +598 + 8 dígitos = 12 caracteres
        setErrors(prev => ({
          ...prev,
          telefono: 'El teléfono no puede tener más de 8 dígitos después del código +598'
        }));
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    
    // Validación email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    // Validación teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!formData.telefono.startsWith('+598')) {
      newErrors.telefono = 'El teléfono debe comenzar con +598 (Uruguay)';
    } else {
      // Limpiar espacios y validar que tenga exactamente 8 dígitos después de +598
      const telefonoLimpio = formData.telefono.replace(/\s/g, '');
      if (!/^\+598\d{8}$/.test(telefonoLimpio)) {
        newErrors.telefono = 'El teléfono debe tener el formato +598XXXXXXXX (8 dígitos después del código de país)';
      }
    }
    
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida';
    if (!formData.ciudad.trim()) newErrors.ciudad = 'El departamento es requerido';
    if (!formData.profesion.trim()) newErrors.profesion = 'La profesión es requerida';
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const userData = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      email: formData.email.trim().toLowerCase(),
      telefono: formData.telefono.trim().replace(/\s/g, ''), // Limpiar espacios del teléfono
      fechaNacimiento: formData.fechaNacimiento,
      ciudad: formData.ciudad.trim(),
      profesion: formData.profesion.trim(),
      password: formData.password,
    };

    try {
      const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

      console.log("📤 Enviando datos de registro:", userData);

      const res = await fetch(`${API_BASE}/auth/register/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const data = await res.json();

      if (res.ok) {
        console.log("✅ Usuario creado exitosamente:", data);
        
        // 🔹 LOGIN AUTOMÁTICO después del registro exitoso
        try {
          console.log("🔄 Iniciando login automático...");
          
          const loginRes = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: userData.email,
              password: userData.password
            })
          });

          if (loginRes.ok) {
            const loginData = await loginRes.json();
            console.log("✅ Login automático exitoso:", loginData);
            
            // 🔹 Guardar token y datos del usuario en localStorage
            if (loginData.token) {
              localStorage.setItem("token", loginData.token);
              localStorage.setItem("user", JSON.stringify(loginData.user));
              localStorage.setItem("role", "user");
              console.log("✅ Datos guardados en localStorage");
              
              showSuccess(
                "¡Registro exitoso!",
                "Ya estás logueado y serás redirigido a tu perfil.",
                3000
              );
              setTimeout(() => {
                window.location.href = "/PerfilUser";
              }, 2000);
            } else {
              console.warn("⚠️ No se recibió token en el login automático");
              showSuccess(
                "Registro exitoso",
                "Ahora podés iniciar sesión con tus credenciales.",
                3000
              );
              setTimeout(() => {
                window.location.href = "/login";
              }, 2000);
            }
          } else {
            console.error("❌ Error en login automático:", await loginRes.text());
            showSuccess(
              "Registro exitoso",
              "Ahora podés iniciar sesión con tus credenciales.",
              3000
            );
            setTimeout(() => {
              window.location.href = "/login";
            }, 2000);
          }
        } catch (loginError) {
          console.error("❌ Error en login automático:", loginError);
          showSuccess(
            "Registro exitoso",
            "Ahora podés iniciar sesión con tus credenciales.",
            3000
          );
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
      } else {
        console.error("❌ Error del backend:", data);
        showError(
          "Error al registrar",
          data.message || "Revisá los datos e intentá nuevamente.",
          5000
        );
      }
    } catch (error) {
      console.error("❌ Error de conexión:", error);
      showError(
        "Error de conexión",
        "No se pudo conectar con el servidor. Verificá que el backend esté corriendo en el puerto 3000.",
        6000
      );
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-split">
          {/* Panel Izquierdo */}
          <div className="register-left-panel">
            <h1 className="register-title">
              Únete a <span className="register-brand">WorkNow</span>
            </h1>
            <p className="register-subtitle">
              Crea tu perfil profesional y accede a miles de oportunidades laborales. 
              Conecta con empresas que buscan tu talento.
            </p>
            <div className="register-features">
              <div className="register-feature-item">
                <div className="register-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </div>
                <span>Oportunidades exclusivas</span>
              </div>
              <div className="register-feature-item">
                <div className="register-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span>Perfil profesional destacado</span>
              </div>
              <div className="register-feature-item">
                <div className="register-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <span>Trabajos en tu zona</span>
              </div>
            </div>
          </div>

          {/* Panel Derecho - Formulario */}
          <div className="register-right-panel">
            <div className="register-header">
              <h2 className="register-form-title">Crear Cuenta</h2>
              <p className="register-form-subtitle">Completa tus datos para comenzar</p>
            </div>

            <div className="register-form">
              <div className="register-form-row">
                {/* Nombre */}
                <div className="register-form-group">
                  <label className="register-label">Nombre</label>
                  <div className="register-input-wrapper">
                    <svg className="register-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Juan"
                      className={`register-input ${errors.nombre ? 'register-input-error' : ''}`}
                    />
                  </div>
                  {errors.nombre && <p className="register-error-text">{errors.nombre}</p>}
                </div>

                {/* Apellido */}
                <div className="register-form-group">
                  <label className="register-label">Apellido</label>
                  <div className="register-input-wrapper">
                    <svg className="register-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      placeholder="Pérez"
                      className={`register-input ${errors.apellido ? 'register-input-error' : ''}`}
                    />
                  </div>
                  {errors.apellido && <p className="register-error-text">{errors.apellido}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="register-form-group">
                <label className="register-label">Correo Electrónico</label>
                <div className="register-input-wrapper">
                  <svg className="register-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@worknow.com"
                    className={`register-input ${errors.email ? 'register-input-error' : ''}`}
                  />
                </div>
                {errors.email && <p className="register-error-text">{errors.email}</p>}
              </div>

              <div className="register-form-row">
                {/* Teléfono */}
                <div className="register-form-group">
                  <label className="register-label">Teléfono</label>
                  <div className="register-input-wrapper">
                    <svg className="register-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+598 99 123 456"
                      className={`register-input ${errors.telefono ? 'register-input-error' : ''}`}
                    />
                  </div>
                  {errors.telefono && <p className="register-error-text">{errors.telefono}</p>}
                </div>

                {/* Fecha de nacimiento */}
                <div className="register-form-group">
                  <label className="register-label">Fecha de Nacimiento</label>
                  <div className="register-input-wrapper">
                    <svg className="register-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleChange}
                      className={`register-input ${errors.fechaNacimiento ? 'register-input-error' : ''}`}
                    />
                  </div>
                  {errors.fechaNacimiento && <p className="register-error-text">{errors.fechaNacimiento}</p>}
                </div>
              </div>

              <div className="register-form-row">
                {/* Departamento - CAMBIADO A SELECT */}
                <div className="register-form-group">
                  <label className="register-label">Departamento</label>
                  <div className="register-input-wrapper">
                    <svg className="register-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <select
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      className={`register-input ${errors.ciudad ? 'register-input-error' : ''}`}
                    >
                      <option value="">Selecciona un departamento</option>
                      {departamentosUruguay.map(depto => (
                        <option key={depto} value={depto}>{depto}</option>
                      ))}
                    </select>
                  </div>
                  {errors.ciudad && <p className="register-error-text">{errors.ciudad}</p>}
                </div>

                {/* Profesión */}
                <div className="register-form-group">
                  <label className="register-label">Profesión</label>
                  <div className="register-input-wrapper">
                    <svg className="register-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    <input
                      type="text"
                      name="profesion"
                      value={formData.profesion}
                      onChange={handleChange}
                      placeholder="Desarrollador Web"
                      className={`register-input ${errors.profesion ? 'register-input-error' : ''}`}
                    />
                  </div>
                  {errors.profesion && <p className="register-error-text">{errors.profesion}</p>}
                </div>
              </div>

              {/* Contraseña */}
              <div className="register-form-group">
                <label className="register-label">Contraseña</label>
                <div className="register-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    className={`register-input ${errors.password ? 'register-input-error' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="register-password-toggle"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="register-error-text">{errors.password}</p>}
              </div>

              {/* Confirmar Contraseña */}
              <div className="register-form-group">
                <label className="register-label">Confirmar Contraseña</label>
                <div className="register-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirma tu contraseña"
                    className={`register-input ${errors.confirmPassword ? 'register-input-error' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="register-password-toggle"
                  >
                    {showConfirmPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="register-error-text">{errors.confirmPassword}</p>}
              </div>

              {/* Botón Submit */}
              <button
                onClick={handleSubmit}
                className="register-submit-btn"
              >
                Crear Cuenta
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
      
      {/* Contenedor de notificaciones */}
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
};

export default Register;