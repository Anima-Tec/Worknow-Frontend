import React, { useState, useEffect } from "react";
import "./PerfilUser.css";
import Footer from "../components/Footer";
import ProyectosCompletados from "../components/ProyectosCompletados";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiArrowLeft } from "react-icons/fi";
import { logout } from "../auth/authContext";
import { useNotification, NotificationContainer } from "../utils/notifications.jsx";
import Select from 'react-select';

const PerfilUser = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { notifications, showSuccess, showError, showWarning, removeNotification } = useNotification();

  // Opciones de departamentos de Uruguay
  const departamentosOptions = [
    { value: 'Artigas', label: 'Artigas' },
    { value: 'Canelones', label: 'Canelones' },
    { value: 'Cerro Largo', label: 'Cerro Largo' },
    { value: 'Colonia', label: 'Colonia' },
    { value: 'Durazno', label: 'Durazno' },
    { value: 'Flores', label: 'Flores' },
    { value: 'Florida', label: 'Florida' },
    { value: 'Lavalleja', label: 'Lavalleja' },
    { value: 'Maldonado', label: 'Maldonado' },
    { value: 'Montevideo', label: 'Montevideo' },
    { value: 'Paysandú', label: 'Paysandú' },
    { value: 'Río Negro', label: 'Río Negro' },
    { value: 'Rivera', label: 'Rivera' },
    { value: 'Rocha', label: 'Rocha' },
    { value: 'Salto', label: 'Salto' },
    { value: 'San José', label: 'San José' },
    { value: 'Soriano', label: 'Soriano' },
    { value: 'Tacuarembó', label: 'Tacuarembó' },
    { value: 'Treinta y Tres', label: 'Treinta y Tres' }
  ];

  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    email: "", // Solo para mostrar, no editable
    telefono: "",
    fechaNacimiento: "",
    ciudad: "",
    profesion: "",
    biografia: "",
    experiencia: "",
    educacion: "",
    habilidades: "",
  });

  // Estados para archivos
  const [educationFiles, setEducationFiles] = useState([]);
  const [curriculumFile, setCurriculumFile] = useState(null);

  // Estado para Formación Académica
  const [educationData, setEducationData] = useState({
    institucion: "",
    titulo: "",
    periodo: "",
    descripcion: ""
  });

  const initializeEditData = (data) => {
    const { email, ...editableFields } = data;
    return editableFields;
  };

  const [editData, setEditData] = useState(initializeEditData(userData));

  const navigate = useNavigate();

const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/login");
  };

const handleGoBack = () => {
  navigate("/home/user");
};

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          showError(
            "Sesión expirada",
            "No hay sesión activa. Iniciá sesión nuevamente.",
            4000
          );
          setTimeout(() => {
          window.location.href = "/login";
          }, 2000);
          return;
        }

        const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
        
        const res = await fetch(`${API_BASE}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            showError(
              "Sesión expirada",
              "Por favor, iniciá sesión nuevamente.",
              4000
            );
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setTimeout(() => {
            window.location.href = "/login";
            }, 2000);
            return;
          }
          
          const errorText = await res.text();
          throw new Error(`Error ${res.status}: ${res.statusText} - ${errorText}`);
        }

        const data = await res.json();
        if (data.fechaNacimiento) {
          if (typeof data.fechaNacimiento === 'object') {
            data.fechaNacimiento = new Date(data.fechaNacimiento).toISOString().split('T')[0];
          } else if (data.fechaNacimiento.includes('T')) {
            data.fechaNacimiento = data.fechaNacimiento.split('T')[0];
          }
        }

        const profileData = {
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          email: data.email || "",
          telefono: data.telefono || "",
          fechaNacimiento: data.fechaNacimiento || "",
          ciudad: data.ciudad || "",
          profesion: data.profesion || "",
          biografia: data.biografia || "",
          experiencia: data.experiencia || "",
          educacion: data.educacion || "",
          habilidades: data.habilidades || "",
        };

        setUserData(profileData);
        setEditData(initializeEditData(profileData));
        localStorage.setItem("user", JSON.stringify(data));
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        showError(
          "Error al cargar perfil",
          "No se pudo cargar tu perfil. Revisá tu conexión e intentá nuevamente.",
          5000
        );
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handlers para archivos
  const handleEducationFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setEducationFiles(prev => [...prev, ...files]);
  };

  const handleCurriculumFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurriculumFile(file);
    }
  };

  const downloadFile = (file, filename) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadEducationFile = (file) => {
    downloadFile(file, file.name);
  };

  const handleDownloadCurriculumFile = () => {
    if (curriculumFile) {
      downloadFile(curriculumFile, curriculumFile.name);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'telefono') {
      const numericValue = value.replace(/\D/g, '').slice(0, 8);
      setEditData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
    setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDepartamentoChange = (selectedOption) => {
    setEditData((prev) => ({ 
      ...prev, 
      ciudad: selectedOption ? selectedOption.value : '' 
    }));
  };


  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showError(
          "Sesión expirada",
          "No hay sesión activa. Iniciá sesión nuevamente.",
          4000
        );
        return;
      }


      if (editData.telefono && editData.telefono.length !== 8) {
        showError(
          "Teléfono inválido",
          "El teléfono debe tener exactamente 8 dígitos.",
          4000
        );
        return;
      }

      const dataToSend = {
        nombre: editData.nombre,
        apellido: editData.apellido,
        telefono: editData.telefono,
        fechaNacimiento: editData.fechaNacimiento,
        ciudad: editData.ciudad,
        profesion: editData.profesion,
        biografia: editData.biografia,
        experiencia: editData.experiencia,
        educacion: editData.educacion,
        habilidades: editData.habilidades,
        formacionAcademica: {
          institucion: educationData.institucion,
          titulo: educationData.titulo,
          periodo: educationData.periodo,
          descripcion: educationData.descripcion
        }
      };

      const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

      const formData = new FormData();
      
      Object.keys(dataToSend).forEach(key => {
        if (key === 'formacionAcademica') {
          formData.append('formacionAcademica', JSON.stringify(dataToSend[key]));
        } else {
          formData.append(key, dataToSend[key]);
        }
      });

      educationFiles.forEach((file, index) => {
        formData.append(`educationFiles`, file);
      });

      if (curriculumFile) {
        formData.append('curriculumFile', curriculumFile);
      }

      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al actualizar perfil");
      }

      const responseData = await res.json();

      if (responseData.updated) {
        if (responseData.updated.fechaNacimiento) {
          if (typeof responseData.updated.fechaNacimiento === 'object') {
            responseData.updated.fechaNacimiento = new Date(responseData.updated.fechaNacimiento)
              .toISOString()
              .split('T')[0];
          } else if (responseData.updated.fechaNacimiento.includes('T')) {
            responseData.updated.fechaNacimiento = responseData.updated.fechaNacimiento.split('T')[0];
          }
        }
        
        setUserData(responseData.updated);
        setEditData(initializeEditData(responseData.updated));
        localStorage.setItem("user", JSON.stringify(responseData.updated));
      } else {
        setUserData(editData);
        setEditData(initializeEditData(editData));
        localStorage.setItem("user", JSON.stringify(editData));
      }

      setIsEditing(false);
      
      const filesMessage = [];
      if (educationFiles.length > 0) {
        filesMessage.push(`${educationFiles.length} certificado(s) de formación`);
      }
      if (curriculumFile) {
        filesMessage.push("1 curriculum vitae");
      }
      
      const successMessage = filesMessage.length > 0 
        ? `Tus datos y archivos (${filesMessage.join(', ')}) se han guardado correctamente.`
        : "Tus datos se han guardado correctamente.";
      
      showSuccess(
        "¡Perfil actualizado!",
        successMessage,
        4000
      );
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      showError(
        "Error al actualizar",
        error.message || "No se pudo actualizar tu perfil. Intentá nuevamente.",
        5000
      );
    }
  };

  const handleCancel = () => {
    setEditData(initializeEditData(userData));
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="perfil-container">
        <div className="perfil-wrapper">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <div className="perfil-wrapper">
        <div className="perfil-header-card">
  <div className="perfil-header-bg">
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
          <div className="perfil-header-content">
            <div className="perfil-header-info">
              <div className="perfil-image-container">
                <div className="perfil-image-wrapper">
                  {profileImage ? (
                    <img src={profileImage} alt="Perfil" className="perfil-image" />
                  ) : (
                    <svg
                      className="perfil-image-placeholder"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                </div>
                <label className="perfil-image-upload">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="perfil-image-input"
                  />
                </label>
              </div>

                 <div className="perfil-basic-info">
        {isEditing ? (
          <div className="perfil-edit-fields">
            <div className="perfil-name-edit">
              <input
                type="text"
                name="nombre"
                value={editData.nombre}
                onChange={handleEditChange}
                className="perfil-input-large"
                placeholder="Nombre"
              />
              <input
                type="text"
                name="apellido"
                value={editData.apellido}
                onChange={handleEditChange}
                className="perfil-input-large"
                placeholder="Apellido"
              />
            </div>
            <input
              type="text"
              name="profesion"
              value={editData.profesion}
              onChange={handleEditChange}
              className="perfil-input-medium"
              placeholder="Tu profesión"
            />
            <div className="perfil-contact-edit">
              <Select
                options={departamentosOptions}
                value={departamentosOptions.find(option => option.value === editData.ciudad) || null}
                onChange={handleDepartamentoChange}
                placeholder="Seleccionar departamento"
                isSearchable={true}
                isClearable={true}
                className="perfil-departamento-select"
                classNamePrefix="perfil-select"
                noOptionsMessage={() => "No se encontraron departamentos"}
                loadingMessage={() => "Cargando departamentos..."}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '3rem',
                    border: '2px solid rgba(124, 58, 237, 0.1)',
                    borderRadius: '14px',
                    boxShadow: '0 4px 8px -2px rgba(124, 58, 237, 0.1)',
                    '&:hover': {
                      borderColor: 'rgba(124, 58, 237, 0.2)',
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: '12px',
                    boxShadow: '0 8px 16px -4px rgba(124, 58, 237, 0.2)',
                    border: '1px solid rgba(124, 58, 237, 0.1)',
                  }),
                }}
              />
              <div className="perfil-phone-input">
                <span className="perfil-phone-prefix">+598</span>
              <input
                type="tel"
                name="telefono"
                value={editData.telefono}
                onChange={handleEditChange}
                className="perfil-input-small"
                  placeholder="12345678"
                  maxLength="8"
                />
              </div>
            </div>
            
            <div className="perfil-edit-actions">
              <button onClick={handleSaveProfile} className="perfil-save-btn">
                Guardar
              </button>
              <button onClick={handleCancel} className="perfil-cancel-btn">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 
              className={`perfil-name ${userData.nombre && userData.apellido 
                ? `${userData.nombre} ${userData.apellido}`.length > 20 
                  ? 'perfil-name-large' 
                  : `${userData.nombre} ${userData.apellido}`.length > 15 
                    ? 'perfil-name-medium' 
                    : 'perfil-name-small'
                : 'perfil-name-small'}`}
              title={userData.nombre && userData.apellido 
                ? `${userData.nombre} ${userData.apellido}` 
                : "Usuario"}
            >
              {userData.nombre && userData.apellido 
                ? `${userData.nombre} ${userData.apellido}` 
                : "Usuario"}
            </h1>
            <p className="perfil-profession">{userData.profesion || "Profesión no especificada"}</p>
            <div className="perfil-contact-info">
              <div className="perfil-contact-item">
                📍 <span>{userData.ciudad || "Ciudad no especificada"}</span>
              </div>
              <div className="perfil-contact-item">
                📞 <span>{userData.telefono || "Teléfono no especificado"}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {!isEditing && (
        <div className="perfil-edit-btn-container">
                <button onClick={() => setIsEditing(true)} className="perfil-edit-btn">
                  Editar Perfil
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>


        <div className="perfil-content-grid">
          <div className="perfil-left-column">
            <div className="perfil-card">
              <h2 className="perfil-card-title">Información Personal</h2>
              <div className="perfil-info-list">
                <div className="perfil-info-item">
                  <p className="perfil-info-label">Email de Login</p>
                  <div className="perfil-email-display">
                    <p className="perfil-email-text">
                      📧 {userData.email || "Email no especificado"}
                    </p>
                    <p className="perfil-email-note">
                      Credencial de login - No editable
                    </p>
                  </div>
                </div>
                <div className="perfil-info-item">
                  <p className="perfil-info-label">Fecha de Nacimiento</p>
                  {isEditing ? (
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={editData.fechaNacimiento}
                      onChange={handleEditChange}
                      className="perfil-input"
                    />
                  ) : (
                    <p className="perfil-info-value">
                      {userData.fechaNacimiento || "No especificada"}
                    </p>
                  )}
                </div>
              </div>
            </div>




            <div className="perfil-card">
              <h2 className="perfil-card-title">Habilidades</h2>
              {isEditing ? (
                <textarea
                  name="habilidades"
                  value={editData.habilidades}
                  onChange={handleEditChange}
                  placeholder="JavaScript, React, Node.js..."
                  rows="4"
                  className="perfil-textarea"
                />
              ) : (
                <div className="perfil-skills-container">
                  {userData.habilidades ? (
                    userData.habilidades.split(",").map((skill, index) => (
                      <span key={index} className="perfil-skill-tag">
                        {skill.trim()}
                      </span>
                    ))
                  ) : (
                    <p className="perfil-empty-text">Agrega tus habilidades</p>
                  )}
                </div>
              )}
            </div>

            <ProyectosCompletados />

          </div>

          <div className="perfil-right-column">
            <div className="perfil-card">
              <h2 className="perfil-card-title">Acerca de mí</h2>
              {isEditing ? (
                <textarea
                  name="biografia"
                  value={editData.biografia}
                  onChange={handleEditChange}
                  placeholder="Contá sobre vos..."
                  rows="4"
                  className="perfil-textarea"
                />
              ) : (
                <p className="perfil-text">
                  {userData.biografia || "Agrega una descripción sobre ti y tu experiencia profesional."}
                </p>
              )}
            </div>

            <div className="perfil-card">
              <h2 className="perfil-card-title">Formación Académica</h2>
              {isEditing ? (
                <div className="perfil-education-form">
                  <div className="perfil-education-item">
                    <div className="perfil-education-logo">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                      </svg>
                    </div>
                    <div className="perfil-education-content">
                      <input
                        type="text"
                        placeholder="Institución educativa"
                        className="perfil-input"
                        value={educationData.institucion}
                        onChange={(e) => setEducationData(prev => ({...prev, institucion: e.target.value}))}
                      />
                      <input
                        type="text"
                        placeholder="Título o grado"
                        className="perfil-input"
                        value={educationData.titulo}
                        onChange={(e) => setEducationData(prev => ({...prev, titulo: e.target.value}))}
                      />
                      <input
                        type="text"
                        placeholder="Período de estudio"
                        className="perfil-input"
                        value={educationData.periodo}
                        onChange={(e) => setEducationData(prev => ({...prev, periodo: e.target.value}))}
                      />
                <textarea
                        placeholder="Descripción de tu formación académica..."
                  className="perfil-textarea"
                        rows="3"
                        value={educationData.descripcion}
                        onChange={(e) => setEducationData(prev => ({...prev, descripcion: e.target.value}))}
                      />
                      <div className="perfil-file-upload">
                        <label className="perfil-file-label perfil-file-label-custom">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14,2 14,8 20,8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10,9 9,9 8,9"></polyline>
                          </svg>
                          Subir certificado
                          <input 
                            type="file" 
                            accept=".pdf,.doc,.docx,.jpg,.png" 
                            className="perfil-file-input"
                            onChange={handleEducationFileUpload}
                            multiple
                          />
                        </label>
                        {educationFiles.length > 0 && (
                          <div className="perfil-file-feedback">
                            <p className="perfil-file-feedback-title">
                              Archivos seleccionados:
                            </p>
                            {educationFiles.map((file, index) => (
                              <p key={index} className="perfil-file-feedback-item">
                                📄 {file.name}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="perfil-education-display">
                  <div className="perfil-education-item">
                    <div className="perfil-education-logo">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                      </svg>
                    </div>
                    <div className="perfil-education-content">
                      <h3 className="perfil-education-title">{educationData.institucion || "Institución educativa"}</h3>
                      <p className="perfil-education-degree">{educationData.titulo || "Título o grado"}</p>
                      <p className="perfil-education-period">{educationData.periodo || "Período de estudio"}</p>
                      <p className="perfil-education-description">{educationData.descripcion || "Descripción de tu formación académica..."}</p>
                      <div className="perfil-education-files">
                        {educationFiles.length > 0 ? (
                          educationFiles.map((file, index) => (
                            <button 
                              key={index} 
                              onClick={() => handleDownloadEducationFile(file)}
                              className="perfil-file-download-btn"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14,2 14,8 20,8"></polyline>
                                <path d="M12 15l-3-3 3-3"></path>
                                <path d="M9 12h6"></path>
                              </svg>
                              📄 {file.name}
                            </button>
                          ))
                        ) : (
                          <p className="perfil-empty-text">No hay archivos subidos</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="perfil-card">
              <h2 className="perfil-card-title">Curriculum Vitae</h2>
              {isEditing ? (
                <div className="perfil-education-form">
                  <div className="perfil-education-item">
                    <div className="perfil-education-logo">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10,9 9,9 8,9"></polyline>
                      </svg>
                    </div>
                    <div className="perfil-education-content">
                      <div className="perfil-file-upload">
                        <label className="perfil-file-label perfil-file-label-custom">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14,2 14,8 20,8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10,9 9,9 8,9"></polyline>
                          </svg>
                          Subir Curriculum Vitae
                          <input 
                            type="file" 
                            accept=".pdf,.doc,.docx,.jpg,.png" 
                            className="perfil-file-input"
                            onChange={handleCurriculumFileUpload}
                          />
                        </label>
                        {curriculumFile && (
                          <div className="perfil-file-feedback">
                            <p className="perfil-file-feedback-title">
                              Archivo seleccionado:
                            </p>
                            <p className="perfil-file-feedback-item">
                              📄 {curriculumFile.name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="perfil-education-display">
                  <div className="perfil-education-item">
                    <div className="perfil-education-logo">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10,9 9,9 8,9"></polyline>
                      </svg>
                    </div>
                    <div className="perfil-education-content">
                      <h3 className="perfil-education-title">Curriculum Vitae</h3>
                      <p className="perfil-education-degree">Sube tu CV para mostrar tu experiencia profesional</p>
                      <div className="perfil-education-files">
                        {curriculumFile ? (
                          <button 
                            onClick={handleDownloadCurriculumFile}
                            className="perfil-file-download-btn"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14,2 14,8 20,8"></polyline>
                              <path d="M12 15l-3-3 3-3"></path>
                              <path d="M9 12h6"></path>
                            </svg>
                            📄 {curriculumFile.name}
                          </button>
                        ) : (
                          <p className="perfil-empty-text">No hay CV subido</p>
              )}
            </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
        
          </div>
        </div>

        <Footer />
      </div>
      
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
};

export default PerfilUser;