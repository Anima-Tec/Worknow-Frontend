import React, { useState, useEffect } from "react";
import "./PerfilCompanyStyle.css";
import CardTrabajo from "../components/CardTrabajo";
import CardProyecto from "../components/CardProyecto";
import { getProfile, updateProfile } from "../services/api";
import Footer from "../components/Footer";
import { FiLogOut, FiArrowLeft } from "react-icons/fi";
import { logout } from "../auth/authContext";
import { useNavigate } from "react-router-dom";
import { useNotification, NotificationContainer } from "../utils/notifications.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";


function PerfilCompany() {
  const [projects, setProjects] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoImage, setLogoImage] = useState(null);
  const { notifications, showSuccess, showError, removeNotification, handleApiError } = useNotification();

    const navigate = useNavigate();

  const [companyData, setCompanyData] = useState({
    nombreEmpresa: "",
    rut: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    sector: "",
    sitioWeb: "",
    tamano: "",
    fundada: "",
    empleados: "",
    ubicaciones: "",
    descripcion: "",
    mision: "",
    vision: "",
    twitter: "",
    facebook: "",
    linkedin: "",
    logoUrl: "",
  });

  const [editData, setEditData] = useState({ ...companyData });

  // Cargar perfil de empresa
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        console.log("Datos de empresa:", data);

        // Limpiar el prefijo +598 del teléfono para mostrar solo los números
        let telefonoLimpio = data.telefono || "";
        if (telefonoLimpio.startsWith("+598")) {
          telefonoLimpio = telefonoLimpio.replace("+598", "").trim();
        }

        const companyProfileData = {
          ...data,
          telefono: telefonoLimpio
        };

        setCompanyData(companyProfileData);
        setEditData(companyProfileData);
        if (data.logoUrl) setLogoImage(data.logoUrl);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando perfil:", error);
        handleApiError(error, "No se pudo cargar el perfil de la empresa. Revisá tu conexión e intentá nuevamente.");
        setLoading(false);
      }
    };
    loadCompanyData();
  }, [handleApiError]);

  // Cargar proyectos
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/projects/company/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Error");
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando proyectos:", error);
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  // Cargar trabajos
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/jobs/company/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Error");
        const data = await response.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando trabajos:", error);
        setJobs([]);
      }
    };
    fetchJobs();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'telefono') {
      const numericValue = value.replace(/\D/g, '').slice(0, 8);
      setEditData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Validación básica de teléfono
      if (editData.telefono && editData.telefono.length !== 8) {
        showError(
          "Teléfono inválido",
          "El teléfono debe tener exactamente 8 dígitos.",
          4000
        );
        return;
      }

      // Agregar prefijo +598 al teléfono antes de enviar
      let telefonoConPrefijo = editData.telefono;
      if (telefonoConPrefijo && !telefonoConPrefijo.startsWith("+598")) {
        telefonoConPrefijo = "+598" + telefonoConPrefijo;
      }

      const dataToSend = {
        ...editData,
        telefono: telefonoConPrefijo
      };

      const responseData = await updateProfile(dataToSend);
      console.log("Perfil actualizado:", responseData);

      if (responseData.updated) {
        // Limpiar prefijo +598 del teléfono en la respuesta
        let telefonoLimpio = responseData.updated.telefono || "";
        if (telefonoLimpio.startsWith("+598")) {
          telefonoLimpio = telefonoLimpio.replace("+598", "").trim();
        }
        responseData.updated.telefono = telefonoLimpio;
        
        setCompanyData(responseData.updated);
        setEditData(responseData.updated);
        localStorage.setItem("user", JSON.stringify(responseData.updated));
      } else {
        setCompanyData(editData);
        setEditData(editData);
        localStorage.setItem("user", JSON.stringify(editData));
      }

      setIsEditing(false);
      showSuccess(
        "¡Perfil actualizado!",
        "Los datos de la empresa se han guardado correctamente.",
        4000
      );
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      handleApiError(error, "No se pudo actualizar el perfil de la empresa. Intentá nuevamente.");
    }
  };

  const handleCancel = () => {
    setEditData({ ...companyData });
    setIsEditing(false);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("El logo debe pesar menos de 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result);
        setEditData((prev) => ({ ...prev, logoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para manejar la eliminación del logo
  const handleRemoveLogo = () => {
    setLogoImage(null);
    setEditData((prev) => ({ ...prev, logoUrl: "" }));
  };

    const handleLogout = () => {
      logout(); 
      localStorage.clear(); 
      navigate("/login"); 
    };
    
    const handleGoBack = () => {
  navigate("/home/company");
};
  if (loading) {
    return (
      <div className="company-perfil-container">
        <div className="company-perfil-wrapper">
          <LoadingSpinner size="large" text="Cargando perfil de empresa..." />
        </div>
      </div>
    );
  }

  return (
    <div className="company-perfil-container">
      
      <div className="company-perfil-wrapper">
        {/* HEADER CARD - MEJORADO */}
        <div className="company-perfil-header-card">
  <div className="company-perfil-header-bg">
    {/* 🔹 Íconos dentro del área violeta */}
    <div className="violet-icons-bar">
      <FiArrowLeft
        className="violet-icon back"
        title="Volver al inicio"
        onClick={handleGoBack}
      />
      <FiLogOut
        className="violet-icon logout"
        title="Cerrar sesión"
        onClick={handleLogout}
      />
    </div>
  </div>

          
          <div className="company-perfil-header-content">
            <div className="company-perfil-header-info">
              {/* Logo con mejoras */}
              <div className="company-image-container">
                <div className="company-image-wrapper">
                  {logoImage ? (
                    <img src={logoImage} alt="Logo" className="company-image" />
                  ) : (
                    <div className="company-image-placeholder">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                      
                    </div>
                  )}
                </div>
                {isEditing && (
                  <div className="company-image-actions">
                    <label className="company-image-upload">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      Cambiar
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="company-image-input" />
                    </label>
                    {logoImage && (
                      <button onClick={handleRemoveLogo} className="company-image-remove">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Eliminar
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Info básica - MEJORADA Y COMPLETAMENTE EDITABLE */}
              <div className="company-basic-info">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="nombreEmpresa"
                      value={editData.nombreEmpresa || ""}
                      onChange={handleEditChange}
                      placeholder="Nombre de la empresa"
                      className="company-name-input"
                    />
                    <input
                      type="text"
                      name="sector"
                      value={editData.sector || ""}
                      onChange={handleEditChange}
                      placeholder="Sector de la empresa"
                      className="company-sector-input"
                    />
                    <div className="company-contact-info-editable">
                      <div className="company-contact-item-editable">
                        
                        <input
                          type="text"
                          name="ciudad"
                          value={editData.ciudad || ""}
                          onChange={handleEditChange}
                          placeholder="Ciudad"
                          className="company-contact-input"
                        />
                      </div>
                      <div className="company-contact-item-editable">
                        
                        <input
                          type="email"
                          name="email"
                          value={editData.email || ""}
                          onChange={handleEditChange}
                          placeholder="Email"
                          className="company-contact-input"
                        />
                      </div>
                      <div className="company-contact-item-editable">
                        <div className="company-phone-input">
                          <span className="company-phone-prefix">+598</span>
                          <input
                            type="tel"
                            name="telefono"
                            value={editData.telefono || ""}
                            onChange={handleEditChange}
                            placeholder="12345678"
                            maxLength="8"
                            className="company-contact-input"
                          />
                        </div>
                      </div>
                      <div className="company-contact-item-editable">
                       
                        <input
                          type="url"
                          name="sitioWeb"
                          value={editData.sitioWeb || ""}
                          onChange={handleEditChange}
                          placeholder="Sitio web"
                          className="company-contact-input"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="company-name">{companyData.nombreEmpresa || "Nombre Empresa"}</h1>
                    <p className="company-sector">{companyData.sector || "Sector no especificado"}</p>
                    <div className="company-contact-info">
                      <div className="company-contact-item">
                        📍 <span>{companyData.ciudad || "Ciudad no especificada"}</span>
                      </div>
                      <div className="company-contact-item">
                        📧 <span>{companyData.email || "Email no especificado"}</span>
                      </div>
                      <div className="company-contact-item">
                        📞 <span>{companyData.telefono || "Teléfono no especificado"}</span>
                      </div>
                      {companyData.sitioWeb && (
                        <div className="company-contact-item">
                          🌐 <a href={companyData.sitioWeb} target="_blank" rel="noopener noreferrer" className="company-website-link">
                            {companyData.sitioWeb}
                          </a>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Botones de acción */}
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="company-edit-btn">
                  Editar Perfil
                </button>
              ) : (
                <div className="company-edit-actions">
                  <button onClick={handleSaveProfile} className="company-save-btn" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar Cambios"}
                  </button>
                  <button onClick={handleCancel} className="company-cancel-btn">
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="company-perfil-content-grid">
          <div className="company-perfil-left">
            {/* Descripción */}
            <div className="company-perfil-card">
              <h2 className="company-perfil-card-title">Acerca de la Empresa</h2>
              {isEditing ? (
                <textarea
                  name="descripcion"
                  value={editData.descripcion || ""}
                  onChange={handleEditChange}
                  placeholder="Describe tu empresa, sus valores, cultura organizacional, etc."
                  rows="6"
                  className="company-perfil-textarea"
                />
              ) : (
                <p className="company-perfil-text">
                  {companyData.descripcion || "Agrega una descripción sobre tu empresa."}
                </p>
              )}
            </div>

            {/* Información General - MEJORADA */}
            <div className="company-perfil-card">
              <h2 className="company-perfil-card-title">Información General</h2>
              <div className="company-info-list">
                <div className="company-info-item">
                  <p className="company-info-label">RUT</p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="rut" 
                      value={editData.rut || ""} 
                      onChange={handleEditChange} 
                      placeholder="RUT de la empresa"
                      className="company-perfil-input" 
                    />
                  ) : (
                    <p className="company-info-value">{companyData.rut || "No especificado"}</p>
                  )}
                </div>
                <div className="company-info-item">
                  <p className="company-info-label">Dirección</p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="direccion" 
                      value={editData.direccion || ""} 
                      onChange={handleEditChange} 
                      placeholder="Dirección completa"
                      className="company-perfil-input" 
                    />
                  ) : (
                    <p className="company-info-value">{companyData.direccion || "No especificada"}</p>
                  )}
                </div>
                <div className="company-info-item">
                  <p className="company-info-label">Tamaño</p>
                  {isEditing ? (
                    <select 
                      name="tamano" 
                      value={editData.tamano || ""} 
                      onChange={handleEditChange}
                      className="company-perfil-input"
                    >
                      <option value="">Seleccionar tamaño</option>
                      <option value="Micro (1-10 empleados)">Micro (1-10 empleados)</option>
                      <option value="Pequeña (11-50 empleados)">Pequeña (11-50 empleados)</option>
                      <option value="Mediana (51-200 empleados)">Mediana (51-200 empleados)</option>
                      <option value="Grande (201+ empleados)">Grande (201+ empleados)</option>
                    </select>
                  ) : (
                    <p className="company-info-value">{companyData.tamano || "No especificado"}</p>
                  )}
                </div>
                <div className="company-info-item">
                  <p className="company-info-label">Empleados</p>
                  {isEditing ? (
                    <input 
                      type="number" 
                      name="empleados" 
                      value={editData.empleados || ""} 
                      onChange={handleEditChange} 
                      placeholder="Número de empleados"
                      className="company-perfil-input" 
                    />
                  ) : (
                    <p className="company-info-value">{companyData.empleados || "No especificado"}</p>
                  )}
                </div>
                <div className="company-info-item">
                  <p className="company-info-label">Año de fundación</p>
                  {isEditing ? (
                    <input 
                      type="number" 
                      name="fundada" 
                      value={editData.fundada || ""} 
                      onChange={handleEditChange} 
                      placeholder="Año de fundación"
                      min="1900"
                      max={new Date().getFullYear()}
                      className="company-perfil-input" 
                    />
                  ) : (
                    <p className="company-info-value">{companyData.fundada || "No especificado"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="company-perfil-right">
            {/* Misión */}
            <div className="company-perfil-card">
              <h2 className="company-perfil-card-title">Misión</h2>
              {isEditing ? (
                <textarea
                  name="mision"
                  value={editData.mision || ""}
                  onChange={handleEditChange}
                  placeholder="¿Cuál es la misión de tu empresa? ¿Qué haces y para quién?"
                  rows="4"
                  className="company-perfil-textarea"
                />
              ) : (
                <p className="company-perfil-text">
                  {companyData.mision || "Agrega tu misión empresarial."}
                </p>
              )}
            </div>

            {/* Visión */}
            <div className="company-perfil-card">
              <h2 className="company-perfil-card-title">Visión</h2>
              {isEditing ? (
                <textarea
                  name="vision"
                  value={editData.vision || ""}
                  onChange={handleEditChange}
                  placeholder="¿Cuál es la visión de tu empresa? ¿A dónde quieres llegar?"
                  rows="4"
                  className="company-perfil-textarea"
                />
              ) : (
                <p className="company-perfil-text">
                  {companyData.vision || "Agrega tu visión empresarial."}
                </p>
              )}
            </div>

            {/* Redes Sociales - MEJORADA */}
            <div className="company-perfil-card">
              <h2 className="company-perfil-card-title">Redes Sociales</h2>
              <div className="company-social-links">
                {isEditing ? (
                  <div className="company-social-inputs">
                    <div className="company-social-input-group">
                      <span className="company-social-icon">𝕏</span>
                      <input 
                        type="url" 
                        name="twitter" 
                        value={editData.twitter || ""} 
                        onChange={handleEditChange} 
                        placeholder="https://twitter.com/empresa" 
                        className="company-perfil-input" 
                      />
                    </div>
                    <div className="company-social-input-group">
                      <span className="company-social-icon">f</span>
                      <input 
                        type="url" 
                        name="facebook" 
                        value={editData.facebook || ""} 
                        onChange={handleEditChange} 
                        placeholder="https://facebook.com/empresa" 
                        className="company-perfil-input" 
                      />
                    </div>
                    <div className="company-social-input-group">
                      <span className="company-social-icon">in</span>
                      <input 
                        type="url" 
                        name="linkedin" 
                        value={editData.linkedin || ""} 
                        onChange={handleEditChange} 
                        placeholder="https://linkedin.com/company/empresa" 
                        className="company-perfil-input" 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="company-social-display">
                    {companyData.twitter && (
                      <a href={companyData.twitter} target="_blank" rel="noopener noreferrer" className="company-social-link">
                        <span className="company-social-icon">𝕏</span>
                        Twitter
                      </a>
                    )}
                    {companyData.facebook && (
                      <a href={companyData.facebook} target="_blank" rel="noopener noreferrer" className="company-social-link">
                        <span className="company-social-icon">f</span>
                        Facebook
                      </a>
                    )}
                    {companyData.linkedin && (
                      <a href={companyData.linkedin} target="_blank" rel="noopener noreferrer" className="company-social-link">
                        <span className="company-social-icon">in</span>
                        LinkedIn
                      </a>
                    )}
                    {!companyData.twitter && !companyData.facebook && !companyData.linkedin && (
                      <p className="company-perfil-empty-text">No hay redes sociales agregadas</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        
        {/* PROYECTOS PUBLICADOS */}
        <div className="company-postings-section">
          <h2 className="company-section-title">Proyectos Publicados</h2>
          <div className="company-carousel-container">
            {Array.isArray(projects) && projects.length > 0 ? (
              projects.map((p) => (
                <CardProyecto
                  key={p.id}
                  id={p.id}
                  title={p.title || "Sin título"}
                  description={p.description || "Sin descripción"}
                  skills={Array.isArray(p.skills) ? p.skills.join(", ") : p.skills || "No especificado"}
                  duration={p.duration || "No especificado"}
                  modality={p.modality || "No especificado"}
                  remuneration={p.remuneration || "A convenir"}
                  company={companyData.nombreEmpresa}
                  isCompanyView={true}
                />
              ))
            ) : (
              <p className="company-empty-message">No hay proyectos publicados aún.</p>
            )}
          </div>
        </div>

        {/* TRABAJOS PUBLICADOS */}
        <div className="company-postings-section">
          <h2 className="company-section-title">Puestos de Trabajo</h2>
          <div className="company-carousel-container">
            {Array.isArray(jobs) && jobs.length > 0 ? (
              jobs.map((job) => (
                <CardTrabajo
                  key={job.id}
                  id={job.id}
                  title={job.title || "Sin título"}
                  company={companyData.nombreEmpresa}
                  area={job.area}
                  jobType={job.jobType}
                  contractType={job.contractType}
                  modality={job.modality}
                  location={job.location}
                  salary={job.salary || job.remuneration}
                  description={job.description}
                  isCompanyView={true}
                />
              ))
            ) : (
              <p className="company-empty-message">No hay puestos de trabajo publicados aún.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
      
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
}

export default PerfilCompany;