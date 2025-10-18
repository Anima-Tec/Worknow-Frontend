import React, { useState } from 'react';
import './RegisterCompany.css';
import { useNotification, NotificationContainer } from '../utils/notifications';

const RegisterCompany = () => {
  const { notifications, showSuccess, showError, removeNotification } = useNotification();
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

  // Departamentos de Uruguay
  const departamentosUruguay = [
    'Artigas', 'Canelones', 'Cerro Largo', 'Colonia', 'Durazno', 
    'Flores', 'Florida', 'Lavalleja', 'Maldonado', 'Montevideo', 
    'Paysandú', 'Río Negro', 'Rivera', 'Rocha', 'Salto', 
    'San José', 'Soriano', 'Tacuarembó', 'Treinta y Tres'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación específica para RUT
    if (name === 'rut') {
      // Limitar a 11 caracteres máximo
      if (value.length > 11) {
        setErrors(prev => ({
          ...prev,
          rut: 'El RUT no puede tener más de 11 caracteres'
        }));
        return;
      }
      
      // Validar que solo contenga números, puntos, guiones y la letra K
      const rutRegex = /^[0-9.kK-]+$/;
      if (value && !rutRegex.test(value)) {
        setErrors(prev => ({
          ...prev,
          rut: 'El RUT solo puede contener números, puntos, guiones y la letra K'
        }));
        return;
      }
    }
    
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
      
      // Validar que después del código solo haya números
      const telefonoValue = value.replace('+598 ', '');
      const telefonoRegex = /^[0-9]*$/;
      if (telefonoValue && !telefonoRegex.test(telefonoValue)) {
        setErrors(prev => ({
          ...prev,
          telefono: 'El teléfono solo puede contener números después del código +598'
        }));
        return;
      }
      
      // Limitar longitud total (código + 8 dígitos + espacios)
      if (value.length > 15) {
        setErrors(prev => ({
          ...prev,
          telefono: 'El teléfono no puede tener más de 8 dígitos después del código +598'
        }));
        return;
      }
    }
    
    // Validación específica para sitio web
    if (name === 'sitioWeb') {
      // Validar formato de URL si no está vacío
      if (value && value.trim() !== '') {
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        if (!urlRegex.test(value)) {
          setErrors(prev => ({
            ...prev,
            sitioWeb: 'Por favor ingresa una URL válida (ej: www.empresa.com)'
          }));
        } else {
          // Limpiar error si la URL es válida
          if (errors.sitioWeb) {
            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors.sitioWeb;
              return newErrors;
            });
          }
        }
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo al escribir (excepto para los casos donde ya mostramos error)
    if (errors[name] && !(
      (name === 'rut' && value.length > 11) ||
      (name === 'telefono' && value.length > 15) ||
      (name === 'sitioWeb' && value && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value))
    )) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombreEmpresa.trim()) newErrors.nombreEmpresa = 'El nombre de la empresa es requerido';
    
    // Validación RUT
    if (!formData.rut.trim()) {
      newErrors.rut = 'El RUT es requerido';
    } else if (formData.rut.length > 11) {
      newErrors.rut = 'El RUT no puede tener más de 11 caracteres';
    } else if (!/^[0-9.kK-]+$/.test(formData.rut)) {
      newErrors.rut = 'El RUT solo puede contener números, puntos, guiones y la letra K';
    }
    
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
    } else if (!/^\+598 [0-9]{7,8}$/.test(formData.telefono.replace(/\s/g, '').replace('+598', '+598 '))) {
      newErrors.telefono = 'Formato inválido. Debe ser: +598 seguido de 7 u 8 dígitos';
    }
    
    if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es requerida';
    if (!formData.ciudad.trim()) newErrors.ciudad = 'La ciudad es requerida';
    if (!formData.sector.trim()) newErrors.sector = 'El sector es requerido';
    if (!formData.tamano) newErrors.tamano = 'Selecciona el tamaño de la empresa';
    
    // Validación sitio web (opcional pero debe ser URL válida si se completa)
    if (formData.sitioWeb.trim() && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.sitioWeb)) {
      newErrors.sitioWeb = 'Por favor ingresa una URL válida';
    }
    
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
    
    if (validateForm()) {
      // Aquí conectarás con tu backend
      const companyData = {
        nombreEmpresa: formData.nombreEmpresa,
        rut: formData.rut,
        email: formData.email,
        telefono: formData.telefono.replace(/\s/g, ''), // Remover espacios del teléfono
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        sector: formData.sector,
        sitioWeb: formData.sitioWeb,
        tamano: formData.tamano,
        password: formData.password,
        tipoUsuario: 'empresa' // Identificador para el backend
      };
      
      try {
        console.log("Datos enviados:", companyData);
        
        const res = await fetch("http://localhost:3000/api/auth/register/company", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(companyData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Error del backend:", errorData);
          throw new Error(`Error ${res.status}: ${errorData.message || "Error al registrar empresa"}`);
        }
        
        const data = await res.json();
        console.log("Respuesta exitosa:", data);
        showSuccess("¡Registro de empresa exitoso!");

        // Guardar token y redirigir al perfil de la empresa después de un breve delay
        localStorage.setItem("token", data.token);
        setTimeout(() => {
          window.location.href = "/perfilcompany";
        }, 1500); // 1.5 segundos para que el usuario vea la notificación
      } catch (error) {
        console.error("Error completo:", error);
        showError(error.message);
      }
    }
  };

  return (
    <div className="register-company-container">
      <div className="register-company-card">
        <div className="register-company-split">
          {/* Panel Izquierdo */}
          <div className="register-company-left-panel">
            <h1 className="register-company-title">
              Registra tu empresa en <span className="register-company-brand">WorkNow</span>
            </h1>
            <p className="register-company-subtitle">
              Publica ofertas de trabajo, encuentra talento calificado y haz crecer tu equipo con los mejores profesionales.
            </p>
            <div className="register-company-features">
              <div className="register-company-feature-item">
                <div className="register-company-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <span>Acceso a miles de candidatos</span>
              </div>
              <div className="register-company-feature-item">
                <div className="register-company-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </div>
                <span>Publica ofertas ilimitadas</span>
              </div>
              <div className="register-company-feature-item">
                <div className="register-company-feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <span>Gestión eficiente de candidatos</span>
              </div>
            </div>
          </div>

          {/* Panel Derecho - Formulario */}
          <div className="register-company-right-panel">
            <div className="register-company-header">
              <h2 className="register-company-form-title">Crear Cuenta Empresa</h2>
              <p className="register-company-form-subtitle">Completa los datos de tu empresa</p>
            </div>

            <div className="register-company-form">
              {/* Nombre de Empresa */}
              <div className="register-company-form-group">
                <label className="register-company-label">Nombre de la Empresa*</label>
                <div className="register-company-input-wrapper">
                  <svg className="register-company-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <input
                    type="text"
                    name="nombreEmpresa"
                    value={formData.nombreEmpresa}
                    onChange={handleChange}
                    placeholder="Tech Solutions S.A."
                    className={`register-company-input ${errors.nombreEmpresa ? 'register-company-input-error' : ''}`}
                    required
                  />
                </div>
                {errors.nombreEmpresa && <p className="register-company-error-text">{errors.nombreEmpresa}</p>}
              </div>

              <div className="register-company-form-row">
                {/* RUT */}
                <div className="register-company-form-group">
                  <label className="register-company-label">RUT*</label>
                  <div className="register-company-input-wrapper">
                    <svg className="register-company-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <input
                      type="text"
                      name="rut"
                      value={formData.rut}
                      onChange={handleChange}
                      placeholder="12.345.678-9"
                      className={`register-company-input ${errors.rut ? 'register-company-input-error' : ''}`}
                      required
                      maxLength={11}
                    />
                  </div>
                  {errors.rut && <p className="register-company-error-text">{errors.rut}</p>}
                </div>

                {/* Email */}
                <div className="register-company-form-group">
                  <label className="register-company-label">Email Corporativo*</label>
                  <div className="register-company-input-wrapper">
                    <svg className="register-company-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="contacto@empresa.com"
                      className={`register-company-input ${errors.email ? 'register-company-input-error' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="register-company-error-text">{errors.email}</p>}
                </div>
              </div>

              <div className="register-company-form-row">
                {/* Teléfono */}
                <div className="register-company-form-group">
                  <label className="register-company-label">Teléfono*</label>
                  <div className="register-company-input-wrapper">
                    <svg className="register-company-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+598 2XXX XXXX"
                      className={`register-company-input ${errors.telefono ? 'register-company-input-error' : ''}`}
                    />
                  </div>
                  {errors.telefono && <p className="register-company-error-text">{errors.telefono}</p>}
                </div>

                {/* Ciudad - Cambiado a select */}
                <div className="register-company-form-group">
                  <label className="register-company-label">Departamento*</label>
                  <div className="register-company-input-wrapper">
                    <svg className="register-company-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <select
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      className={`register-company-select ${errors.ciudad ? 'register-company-input-error' : ''}`}
                    >
                      <option value="">Selecciona un departamento</option>
                      {departamentosUruguay.map(depto => (
                        <option key={depto} value={depto}>{depto}</option>
                      ))}
                    </select>
                  </div>
                  {errors.ciudad && <p className="register-company-error-text">{errors.ciudad}</p>}
                </div>
              </div>

              {/* Dirección */}
              <div className="register-company-form-group">
                <label className="register-company-label">Dirección*</label>
                <div className="register-company-input-wrapper">
                  <svg className="register-company-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Av. Principal 1234"
                    className={`register-company-input ${errors.direccion ? 'register-company-input-error' : ''}`}
                  />
                </div>
                {errors.direccion && <p className="register-company-error-text">{errors.direccion}</p>}
              </div>

              <div className="register-company-form-row">
                {/* Sector */}
                <div className="register-company-form-group">
                  <label className="register-company-label">Sector*</label>
                  <div className="register-company-input-wrapper">
                    <svg className="register-company-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    <input
                      type="text"
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                      placeholder="Tecnología, Salud, Educación..."
                      className={`register-company-input ${errors.sector ? 'register-company-input-error' : ''}`}
                    />
                  </div>
                  {errors.sector && <p className="register-company-error-text">{errors.sector}</p>}
                </div>

                {/* Sitio Web */}
                <div className="register-company-form-group">
                  <label className="register-company-label">Sitio Web (opcional)</label>
                  <div className="register-company-input-wrapper">
                    <svg className="register-company-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    <input
                      type="url"
                      name="sitioWeb"
                      value={formData.sitioWeb}
                      onChange={handleChange}
                      placeholder="www.empresa.com"
                      className={`register-company-input ${errors.sitioWeb ? 'register-company-input-error' : ''}`}
                    />
                  </div>
                  {errors.sitioWeb && <p className="register-company-error-text">{errors.sitioWeb}</p>}
                </div>
              </div>

              {/* Tamaño de Empresa */}
              <div className="register-company-form-group">
                <label className="register-company-label">Tamaño de la Empresa*</label>
                <select
                  name="tamano"
                  value={formData.tamano}
                  onChange={handleChange}
                  className={`register-company-select ${errors.tamano ? 'register-company-input-error' : ''}`}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="1-10">1-10 empleados</option>
                  <option value="11-50">11-50 empleados</option>
                  <option value="51-200">51-200 empleados</option>
                  <option value="201-500">201-500 empleados</option>
                  <option value="500+">Más de 500 empleados</option>
                </select>
                {errors.tamano && <p className="register-company-error-text">{errors.tamano}</p>}
              </div>

              {/* Contraseña */}
              <div className="register-company-form-group">
                <label className="register-company-label">Contraseña*</label>
                <div className="register-company-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    className={`register-company-input ${errors.password ? 'register-company-input-error' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="register-company-password-toggle"
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
                {errors.password && <p className="register-company-error-text">{errors.password}</p>}
              </div>

              {/* Confirmar Contraseña */}
              <div className="register-company-form-group">
                <label className="register-company-label">Confirmar Contraseña*</label>
                <div className="register-company-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirma tu contraseña"
                    className={`register-company-input ${errors.confirmPassword ? 'register-company-input-error' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="register-company-password-toggle"
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
                {errors.confirmPassword && <p className="register-company-error-text">{errors.confirmPassword}</p>}
              </div>

              {/* Botón Submit */}
              <button
                onClick={handleSubmit}
                className="register-company-submit-btn"
              >
                Crear Cuenta Empresa
              </button>

              <p className="register-company-login-link">
                ¿Ya tienes cuenta?{' '}
                <a href="/login" className="register-company-link">
                  Inicia sesión
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
};

export default RegisterCompany;