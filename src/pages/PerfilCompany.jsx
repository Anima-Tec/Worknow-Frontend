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
import Select from "react-select";
const API_URL = import.meta.env.VITE_API_URL;

function PerfilCompany() {
  const [projects, setProjects] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoImage, setLogoImage] = useState(null);
  const { notifications, showSuccess, showError, removeNotification, handleApiError } = useNotification();

  // Opciones de departamentos de Uruguay
  const departamentosOptions = [
    { value: "Artigas", label: "Artigas" },
    { value: "Canelones", label: "Canelones" },
    { value: "Cerro Largo", label: "Cerro Largo" },
    { value: "Colonia", label: "Colonia" },
    { value: "Durazno", label: "Durazno" },
    { value: "Flores", label: "Flores" },
    { value: "Florida", label: "Florida" },
    { value: "Lavalleja", label: "Lavalleja" },
    { value: "Maldonado", label: "Maldonado" },
    { value: "Montevideo", label: "Montevideo" },
    { value: "Paysandú", label: "Paysandú" },
    { value: "Río Negro", label: "Río Negro" },
    { value: "Rivera", label: "Rivera" },
    { value: "Rocha", label: "Rocha" },
    { value: "Salto", label: "Salto" },
    { value: "San José", label: "San José" },
    { value: "Soriano", label: "Soriano" },
    { value: "Tacuarembó", label: "Tacuarembó" },
    { value: "Treinta y Tres", label: "Treinta y Tres" },
  ];

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
    anioFundacion: "",
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

  // ===========================
  // 🔹 CARGAR PERFIL DE EMPRESA
  // ===========================
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        console.log("📊 Datos de empresa recibidos:", response);

        const data = response.data || response;
        console.log("📋 Datos extraídos:", data);

        // 🔹 Parsear redes sociales si existen
        let redes = {};
        try {
          redes =
            typeof data.redesSociales === "string"
              ? JSON.parse(data.redesSociales)
              : data.redesSociales || {};
        } catch {
          redes = {};
        }

        // Limpiar prefijo +598
        let telefonoLimpio = data.telefono || "";
        if (telefonoLimpio.startsWith("+598")) {
          telefonoLimpio = telefonoLimpio.replace("+598", "").trim();
        }

        const companyProfileData = {
          ...data,
          telefono: telefonoLimpio,
          twitter: redes.twitter || "",
          facebook: redes.facebook || "",
          linkedin: redes.linkedin || "",
          anioFundacion: data.anioFundacion || "",
        };

        setCompanyData(companyProfileData);
        setEditData(companyProfileData);
        if (data.logoUrl) setLogoImage(data.logoUrl);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando perfil:", error);
        handleApiError(error, "No se pudo cargar el perfil de la empresa.");
        setLoading(false);
      }
    };
    loadCompanyData();
  }, [handleApiError]);
  // ===========================
  // 🔹 CARGAR PROYECTOS
  // ===========================
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/projects/company/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al obtener proyectos");
      const result = await response.json();
      setProjects(result.data || []);

      } catch (error) {
        console.error("Error cargando proyectos:", error);
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  // ===========================
  // 🔹 CARGAR TRABAJOS
  // ===========================
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/jobs/company/me`, {
        headers: { Authorization: `Bearer ${token}` },
        });
      if (!response.ok) throw new Error("Error al obtener trabajos");
      const result = await response.json();
      setJobs(result.data || result || []);

      } catch (error) {
        console.error("Error cargando trabajos:", error);
        setJobs([]);
      }
    };
    fetchJobs();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefono") {
      const numericValue = value.replace(/\D/g, "").slice(0, 8);
      setEditData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDepartamentoChange = (selectedOption) => {
    setEditData((prev) => ({
      ...prev,
      ciudad: selectedOption ? selectedOption.value : "",
    }));
  };

  // ===========================
  // 🔹 GUARDAR PERFIL
  // ===========================
  const handleSaveProfile = async () => {
    try {
      if (editData.telefono && editData.telefono.length !== 8) {
        showError("Teléfono inválido", "El teléfono debe tener exactamente 8 dígitos.", 4000);
        return;
      }

      let telefonoConPrefijo = editData.telefono;
      if (telefonoConPrefijo && !telefonoConPrefijo.startsWith("+598")) {
        telefonoConPrefijo = "+598" + telefonoConPrefijo;
      }

      // 🔹 NUEVO: Combinar redes sociales antes de enviar
      const redesSocialesObj = {
        twitter: editData.twitter,
        facebook: editData.facebook,
        linkedin: editData.linkedin,
      };

      const dataToSend = {
        ...editData,
        telefono: telefonoConPrefijo,
        redesSociales: JSON.stringify(redesSocialesObj),
      };

      const responseData = await updateProfile(dataToSend);
      console.log("Perfil actualizado:", responseData);

      if (responseData.updated) {
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
      showSuccess("¡Perfil actualizado!", "Los datos de la empresa se han guardado correctamente.", 4000);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      handleApiError(error, "No se pudo actualizar el perfil de la empresa.");
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
        {/* HEADER CARD */}
        <div className="company-perfil-header-card">
          <div className="company-perfil-header-bg">
            <div className="violet-icons-bar">
              <FiArrowLeft className="violet-icon back" title="Volver al inicio" onClick={handleGoBack} />
              <FiLogOut className="violet-icon logout" title="Cerrar sesión" onClick={handleLogout} />
            </div>
          </div>

          <div className="company-perfil-header-content">
            <div className="company-perfil-header-info">
              {/* Logo de empresa */}
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
                      <span className="company-upload-text">Cambiar</span>
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

              {/* Info básica */}
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
                    <div className="company-contact-edit-grid">
                      <div className="company-contact-edit-item">
                        <Select
                          options={departamentosOptions}
                          value={departamentosOptions.find((option) => option.value === editData.ciudad) || null}
                          onChange={handleDepartamentoChange}
                          placeholder="Seleccionar departamento"
                          isSearchable
                          isClearable
                          classNamePrefix="company-select"
                        />
                      </div>
                      <div className="company-contact-edit-item">
                        <input
                          type="email"
                          name="email"
                          value={editData.email || ""}
                          onChange={handleEditChange}
                          placeholder="Email"
                          className="company-contact-input"
                        />
                      </div>
                      <div className="company-contact-edit-item">
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
                      <div className="company-contact-edit-item">
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
                      <div className="company-contact-item">📍 {companyData.ciudad || "Ciudad no especificada"}</div>
                      <div className="company-contact-item">📧 {companyData.email || "Email no especificado"}</div>
                      <div className="company-contact-item">📞 {companyData.telefono || "Teléfono no especificado"}</div>
                      {companyData.sitioWeb && (
                        <div className="company-contact-item">
                          🌐{" "}
                          <a href={companyData.sitioWeb} target="_blank" rel="noopener noreferrer" className="company-website-link">
                            {companyData.sitioWeb}
                          </a>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Botones */}
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

        {/* ================= CONTENIDO PRINCIPAL ================= */}
        <div className="company-perfil-content-grid">
          <div className="company-perfil-left">
            <div className="company-perfil-card">
              <h2 className="company-perfil-card-title">Acerca de la Empresa</h2>
              {isEditing ? (
                <textarea
                  name="descripcion"
                  value={editData.descripcion || ""}
                  onChange={handleEditChange}
                  placeholder="Describe tu empresa, sus valores, cultura, etc."
                  rows="6"
                  className="company-perfil-textarea"
                />
              ) : (
                <p className="company-perfil-text">{companyData.descripcion || "Agrega una descripción sobre tu empresa."}</p>
              )}
            </div>

            <div className="company-perfil-card">
              <h2 className="company-perfil-card-title">Información General</h2>
              <div className="company-info-list">
                {/* RUT */}
                <div className="company-info-item">
                  <p className="company-info-label">RUT</p>
                  {isEditing ? (
                    <input type="text" name="rut" value={editData.rut || ""} onChange={handleEditChange} className="company-perfil-input" />
                  ) : (
                    <p className="company-info-value">{companyData.rut || "No especificado"}</p>
                  )}
                </div>

                {/* SECTOR */}
                <div className="company-info-item">
                  <p className="company-info-label">Sector</p>
                  {isEditing ? (
                    <input type="text" name="sector" value={editData.sector || ""} onChange={handleEditChange} className="company-perfil-input" />
                  ) : (
                    <p className="company-info-value">{companyData.sector || "No especificado"}</p>
                  )}
                </div>

                {/* DIRECCIÓN */}
                <div className="company-info-item">
                  <p className="company-info-label">Dirección</p>
                  {isEditing ? (
                    <input type="text" name="direccion" value={editData.direccion || ""} onChange={handleEditChange} className="company-perfil-input" />
                  ) : (
                    <p className="company-info-value">{companyData.direccion || "No especificada"}</p>
                  )}
                </div>

                {/* TAMAÑO */}
                <div className="company-info-item">
                  <p className="company-info-label">Tamaño</p>
                  {isEditing ? (
                    <select name="tamano" value={editData.tamano || ""} onChange={handleEditChange} className="company-perfil-input">
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

                {/* EMPLEADOS */}
                <div className="company-info-item">
                  <p className="company-info-label">Empleados</p>
                  {isEditing ? (
                    <input type="number" name="empleados" value={editData.empleados || ""} onChange={handleEditChange} className="company-perfil-input" />
                  ) : (
                    <p className="company-info-value">{companyData.empleados || "No especificado"}</p>
                  )}
                </div>

                {/* AÑO FUNDACIÓN */}
                <div className="company-info-item">
                  <p className="company-info-label">Año de fundación</p>
                  {isEditing ? (
                    <input type="number" name="anioFundacion" value={editData.anioFundacion || ""} onChange={handleEditChange} min="1900" max={new Date().getFullYear()} className="company-perfil-input" />
                  ) : (
                    <p className="company-info-value">{companyData.anioFundacion || "No especificado"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* DERECHA: Misión / Visión / Redes */}
          <div className="company-perfil-right">
            <div className="company-perfil-card">
              <h2 className="company-perfil-card-title">Misión</h2>
              {isEditing ? (
                <textarea name="mision" value={editData.mision || ""} onChange={handleEditChange} rows="4" className="company-perfil-textarea" />
              ) : (
                <p className="company-perfil-text">{companyData.mision || "Agrega tu misión empresarial."}</p>
              )}
            </div>

            <div className="company-perfil-card">
              <h2 className="company-perfil-card-title">Visión</h2>
              {isEditing ? (
                <textarea name="vision" value={editData.vision || ""} onChange={handleEditChange} rows="4" className="company-perfil-textarea" />
              ) : (
                <p className="company-perfil-text">{companyData.vision || "Agrega tu visión empresarial."}</p>
              )}
            </div>

            <div className="company-perfil-card">
              <h2 className="company-perfil-card-title">Redes Sociales</h2>
              <div className="company-social-links">
                {isEditing ? (
                  <div className="company-social-inputs">
                    <input type="url" name="twitter" value={editData.twitter || ""} onChange={handleEditChange} placeholder="https://twitter.com/empresa" className="company-perfil-input" />
                    <input type="url" name="facebook" value={editData.facebook || ""} onChange={handleEditChange} placeholder="https://facebook.com/empresa" className="company-perfil-input" />
                    <input type="url" name="linkedin" value={editData.linkedin || ""} onChange={handleEditChange} placeholder="https://linkedin.com/company/empresa" className="company-perfil-input" />
                  </div>
                ) : (
                  <div className="company-social-display">
                    {companyData.twitter && <a href={companyData.twitter} target="_blank" rel="noopener noreferrer" className="company-social-link">Twitter</a>}
                    {companyData.facebook && <a href={companyData.facebook} target="_blank" rel="noopener noreferrer" className="company-social-link">Facebook</a>}
                    {companyData.linkedin && <a href={companyData.linkedin} target="_blank" rel="noopener noreferrer" className="company-social-link">LinkedIn</a>}
                    {!companyData.twitter && !companyData.facebook && !companyData.linkedin && (
                      <p className="company-perfil-empty-text">No hay redes sociales agregadas</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PROYECTOS */}
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
                  skills={
                    (() => {
                      try {
                        const parsed = JSON.parse(p.skills);
                        if (Array.isArray(parsed)) return parsed.join(", ");
                        if (typeof parsed === "object") return Object.values(parsed).join(", ");
                        return parsed || "No especificado";
                      } catch {
                        return p.skills || "No especificado";
                      }
                    })()
                  }

                  duration={p.duration || "No especificado"}
                  modality={p.modality || "No especificado"}
                  remuneration={p.remuneration || "A convenir"}
                  company={companyData.nombreEmpresa}
                  isCompanyView
                />
              ))
            ) : (
              <p className="company-empty-message">No hay proyectos publicados aún.</p>
            )}
          </div>
        </div>

        {/* TRABAJOS */}
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
                  area={job.area || ""}
                  jobType={job.jobType || ""}
                  contractType={job.contractType || ""}
                  modality={job.modality || ""}
                  location={job.location || ""}
                  salary={job.salary || job.remuneration || ""}
                  description={job.description || ""}
                  isCompanyView
                />
              ))
            ) : (
              <p className="company-empty-message">No hay puestos de trabajo publicados aún.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </div>
  );
}

export default PerfilCompany;
