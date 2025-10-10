import Footer from "../components/Footer";
import React, { useState, useEffect } from 'react';
import './PerfilUser.css';

function PerfilUser() {
  return (
    <div>
      <h2>Perfil del Usuario</h2>
      <Footer />

const PerfilUser = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  // Aquí obtendrías los datos del usuario desde tu backend
  // Por ahora usamos datos de ejemplo
  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    ciudad: '',
    profesion: '',
    biografia: '',
    experiencia: '',
    educacion: '',
    habilidades: ''
  });

  const [editData, setEditData] = useState({ ...userData });

  useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token"); // token guardado tras login
      if (!token) {
        alert("No hay sesión activa. Iniciá sesión nuevamente.");
        window.location.href = "/login";
        return;
      }

      const res = await fetch("http://localhost:3000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error al obtener perfil");
      }

      const data = await res.json();

    if (data.fechaNacimiento) {
      data.fechaNacimiento = data.fechaNacimiento.split("T")[0];
}
      // data tiene lo que devolvés desde backend: nombre, apellido, email, etc.
      setUserData(data);
      setEditData(data);
      console.log("Perfil cargado:", data);

    } catch (error) {
      console.error("Error al cargar el perfil:", error);
      alert("No se pudo cargar tu perfil. Ver consola.");
    }
  };

  fetchUserProfile();
}, []);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Aquí subirías la imagen al backend
      /*
      const formData = new FormData();
      formData.append('profileImage', file);
      
      fetch('http://tu-backend-url/api/usuario/foto', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log('Imagen subida:', data);
      })
      .catch(error => console.error('Error:', error));
      */
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay sesión activa");
      return;
    }

    const res = await fetch("http://localhost:3000/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editData),
    });

    if (!res.ok) throw new Error("Error al actualizar perfil");

    const data = await res.json();
    setUserData(editData);
    setIsEditing(false);
    alert("Perfil actualizado correctamente ✅");
    console.log("Perfil actualizado:", data);
  } catch (error) {
    console.error("Error:", error);
    alert("Error al actualizar el perfil ❌");
  }


    
    // Simulación
    setUserData(editData);
    setIsEditing(false);
    alert('Perfil actualizado correctamente');
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
  };

  return (
    <div className="perfil-container">
      <div className="perfil-wrapper">
        {/* Header del Perfil */}
        <div className="perfil-header-card">
          <div className="perfil-header-bg"></div>
          <div className="perfil-header-content">
            <div className="perfil-header-info">
              {/* Foto de Perfil */}
              <div className="perfil-image-container">
                <div className="perfil-image-wrapper">
                  {profileImage ? (
                    <img src={profileImage} alt="Perfil" className="perfil-image" />
                  ) : (
                    <svg className="perfil-image-placeholder" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

              {/* Info Básica */}
              <div className="perfil-basic-info">
                <h1 className="perfil-name">
                  {editData.nombre} {editData.apellido}
                </h1>
                <p className="perfil-profession">{editData.profesion}</p>
                <div className="perfil-contact-info">
                  <div className="perfil-contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{editData.ciudad}</span>
                  </div>
                  <div className="perfil-contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>{editData.email}</span>
                  </div>
                  <div className="perfil-contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>{editData.telefono}</span>
                  </div>
                </div>
              </div>

              {/* Botón Editar */}
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="perfil-edit-btn">
                  Editar Perfil
                </button>
              ) : (
                <div className="perfil-edit-actions">
                  <button onClick={handleSaveProfile} className="perfil-save-btn">
                    Guardar
                  </button>
                  <button onClick={handleCancel} className="perfil-cancel-btn">
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenido del Perfil */}
        <div className="perfil-content-grid">
          {/* Columna Izquierda */}
          <div className="perfil-left-column">
            {/* Información Personal */}
            <div className="perfil-card">
              <h2 className="perfil-card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Información Personal
              </h2>
              <div className="perfil-info-list">
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
                    <p className="perfil-info-value">{editData.fechaNacimiento}</p>
                  )}
                </div>
                <div className="perfil-info-item">
                  <p className="perfil-info-label">Ciudad</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="ciudad"
                      value={editData.ciudad}
                      onChange={handleEditChange}
                      className="perfil-input"
                    />
                  ) : (
                    <p className="perfil-info-value">{editData.ciudad}</p>
                  )}
                </div>
                <div className="perfil-info-item">
                  <p className="perfil-info-label">Teléfono</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="telefono"
                      value={editData.telefono}
                      onChange={handleEditChange}
                      className="perfil-input"
                    />
                  ) : (
                    <p className="perfil-info-value">{editData.telefono}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Habilidades */}
            <div className="perfil-card">
              <h2 className="perfil-card-title">Habilidades</h2>
              {isEditing ? (
                <textarea
                  name="habilidades"
                  value={editData.habilidades}
                  onChange={handleEditChange}
                  placeholder="JavaScript, React, Node.js, etc."
                  rows="4"
                  className="perfil-textarea"
                />
              ) : (
                <div className="perfil-skills-container">
                  {editData.habilidades ? (
                    editData.habilidades.split(',').map((skill, index) => (
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
          </div>

          {/* Columna Derecha */}
          <div className="perfil-right-column">
            {/* Biografía */}
            <div className="perfil-card">
              <h2 className="perfil-card-title">Acerca de mí</h2>
              {isEditing ? (
                <textarea
                  name="biografia"
                  value={editData.biografia}
                  onChange={handleEditChange}
                  placeholder="Cuéntanos sobre ti, tu experiencia y objetivos profesionales..."
                  rows="4"
                  className="perfil-textarea"
                />
              ) : (
                <p className="perfil-text">
                  {editData.biografia || 'Agrega una descripción sobre ti y tu experiencia profesional.'}
                </p>
              )}
            </div>

            {/* Experiencia */}
            <div className="perfil-card">
              <h2 className="perfil-card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                Experiencia Laboral
              </h2>
              {isEditing ? (
                <textarea
                  name="experiencia"
                  value={editData.experiencia}
                  onChange={handleEditChange}
                  placeholder="Empresa - Cargo (Año inicio - Año fin)&#10;Descripción de responsabilidades..."
                  rows="6"
                  className="perfil-textarea"
                />
              ) : (
                <div className="perfil-experience-container">
                  {editData.experiencia ? (
                    <p className="perfil-text-multiline">{editData.experiencia}</p>
                  ) : (
                    <p className="perfil-empty-text">Agrega tu experiencia laboral</p>
                  )}
                </div>
              )}
            </div>

            {/* Educación */}
            <div className="perfil-card">
              <h2 className="perfil-card-title">Educación</h2>
              {isEditing ? (
                <textarea
                  name="educacion"
                  value={editData.educacion}
                  onChange={handleEditChange}
                  placeholder="Institución - Título (Año inicio - Año fin)&#10;Detalles adicionales..."
                  rows="6"
                  className="perfil-textarea"
                />
              ) : (
                <div className="perfil-education-container">
                  {editData.educacion ? (
                    <p className="perfil-text-multiline">{editData.educacion}</p>
                  ) : (
                    <p className="perfil-empty-text">Agrega tu formación académica</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilUser;