import React, { useState, useEffect } from "react"
import "./PerfilCompanyStyle.css";
import { AiOutlineHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import CardTrabajo from "../components/CardTrabajo";
import CardProyecto from "../components/CardProyecto";
import { getJobs, getProfile, updateProfile } from "../services/api";
import Footer from "../components/Footer";

function PerfilCompany() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoImage, setLogoImage] = useState(null);

  // Datos de la empresa desde el backend
  const [companyData, setCompanyData] = useState({
    nombreEmpresa: '',
    rut: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    sector: '',
    sitioWeb: '',
    tamano: '',
    fundada: '',
    empleados: '',
    ubicaciones: '',
    descripcion: '',
    mision: '',
    vision: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    logoUrl: ''
  });

  const [editData, setEditData] = useState({ ...companyData });

  // Cargar datos de la empresa desde el backend
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.warn('⚠️ No hay token, redirigiendo al login');
          navigate('/login');
          return;
        }

        setLoading(true);
        const data = await getProfile();
        
        console.log('📦 Datos de empresa recibidos:', data);

        setCompanyData(data);
        setEditData(data);
        
        if (data.logoUrl) {
          setLogoImage(data.logoUrl);
        }

        setLoading(false);
      } catch (error) {
        console.error('❌ Error cargando perfil de empresa:', error);
        setLoading(false);
        // Si el token es inválido, redirigir al login
        if (error.message.includes('autenticación')) {
          navigate('/login');
        }
      }
    };

    loadCompanyData();
  }, [navigate]);

  // Cargar proyectos - CORREGIDO CON MANEJO DE ERRORES
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/projects/company/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // ✅ Asegúrate de que sea un array
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.warn("Los proyectos no son un array, estableciendo array vacío");
          setProjects([]);
        }
        
      } catch (error) {
        console.error("❌ Error cargando proyectos:", error);
        setProjects([]); // ✅ Array vacío como fallback
      }
    };

    fetchProjects();
  }, []);

  // Cargar trabajos - CORREGIDO CON MANEJO DE ERRORES
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/jobs/company/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.error("❌ Error del backend al traer trabajos:", res.status);
          setJobs([]);
          return;
        }
        const data = await res.json();
        setJobs(data);
        
      } catch (err) {
        console.error("❌ Error cargando trabajos:", err);
        setJobs([]); // ✅ Array vacío como fallback
      }
    };

    fetchJobs();
  }, []);

  // Manejar cambios en inputs
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardar cambios en el backend
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      console.log('📤 Actualizando perfil con:', editData);

      const response = await updateProfile(editData);
      
      console.log('✅ Perfil actualizado:', response);

      setCompanyData(editData);
      setIsEditing(false);
      alert('✅ Perfil actualizado correctamente');
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error al actualizar el perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditData({ ...companyData });
    setIsEditing(false);
  };

  // Subir logo
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño
      if (file.size > 2 * 1024 * 1024) {
        alert('El logo debe pesar menos de 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result);
        setEditData(prev => ({
          ...prev,
          logoUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="perfil-company">
      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          <h1 className="logo">
            work<span>now</span>
          </h1>
          <p className="link">{companyData.sitioWeb || 'https://WorkNow.com'}</p>
        </div>
        <nav className="nav">
          <ul>
            <li onClick={() => navigate("/home/company")}>
              <AiOutlineHome />
              <span>Home</span>
            </li>
            <li onClick={() => navigate("/PerfilCompany")}>
              <CgProfile />
              <span>Perfil</span>
            </li>
          </ul>
        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        {/* BOTÓN EDITAR PERFIL */}
        <div className="edit-profile-section">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="edit-profile-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Editar Perfil
            </button>
          ) : (
            <div className="edit-actions">
              <button onClick={handleSaveProfile} className="save-btn" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button onClick={handleCancel} className="cancel-btn">Cancelar</button>
            </div>
          )}
        </div>

        <div className="frame">
          {/* COLUMNA IZQUIERDA */}
          <div className="left-column">
            {/* LOGO DE LA EMPRESA */}
            <section className="company-logo-section">
              <div className="company-logo-wrapper">
                {logoImage ? (
                  <img src={logoImage} alt="Logo empresa" className="company-logo-img" />
                ) : (
                  <div className="company-logo-placeholder">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                  </div>
                )}
                {isEditing && (
                  <label className="upload-logo-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="upload-logo-input" />
                  </label>
                )}
              </div>
              <h2 className="company-name-title">{companyData.nombreEmpresa || 'Nombre de la Empresa'}</h2>
            </section>

            {/* PERFIL DE LA EMPRESA */}
            <section className="company-profile">
              <h2>Perfil de la Empresa</h2>
              {isEditing ? (
                <>
                  <div className="edit-field">
                    <label>Descripción</label>
                    <textarea
                      name="descripcion"
                      value={editData.descripcion || ''}
                      onChange={handleEditChange}
                      rows="4"
                      className="edit-textarea"
                      placeholder="Describe tu empresa..."
                    />
                  </div>
                  <div className="edit-field">
                    <label>Misión</label>
                    <textarea
                      name="mision"
                      value={editData.mision || ''}
                      onChange={handleEditChange}
                      rows="3"
                      className="edit-textarea"
                      placeholder="¿Cuál es la misión de tu empresa?"
                    />
                  </div>
                  <div className="edit-field">
                    <label>Visión</label>
                    <textarea
                      name="vision"
                      value={editData.vision || ''}
                      onChange={handleEditChange}
                      rows="3"
                      className="edit-textarea"
                      placeholder="¿Cuál es la visión de tu empresa?"
                    />
                  </div>
                </>
              ) : (
                <>
                  <p>{companyData.descripcion || 'Sin descripción'}</p>
                  {companyData.mision && <p><strong>Misión:</strong> {companyData.mision}</p>}
                  {companyData.vision && <p><strong>Visión:</strong> {companyData.vision}</p>}
                </>
              )}
            </section>

            {/* INFORMACIÓN DE LA EMPRESA */}
            <section className="company-info">
              <h3>Información</h3>
              {isEditing ? (
                <>
                  <div className="edit-field-inline">
                    <label>Fundada:</label>
                    <input 
                      type="text" 
                      name="fundada" 
                      value={editData.fundada || ''} 
                      onChange={handleEditChange}
                      placeholder="Ej: 2020"
                    />
                  </div>
                  <div className="edit-field-inline">
                    <label>Empleados:</label>
                    <input 
                      type="text" 
                      name="empleados" 
                      value={editData.empleados || ''} 
                      onChange={handleEditChange}
                      placeholder="Ej: 50-100"
                    />
                  </div>
                  <div className="edit-field-inline">
                    <label>Ubicaciones:</label>
                    <input 
                      type="text" 
                      name="ubicaciones" 
                      value={editData.ubicaciones || ''} 
                      onChange={handleEditChange}
                      placeholder="Ej: Montevideo, UY"
                    />
                  </div>
                  <div className="edit-field-inline">
                    <label>Sector:</label>
                    <input 
                      type="text" 
                      name="sector" 
                      value={editData.sector || ''} 
                      onChange={handleEditChange}
                      placeholder="Ej: Tecnología"
                    />
                  </div>
                  <div className="edit-field-inline">
                    <label>Ciudad:</label>
                    <input 
                      type="text" 
                      name="ciudad" 
                      value={editData.ciudad || ''} 
                      onChange={handleEditChange}
                      placeholder="Ej: Montevideo"
                    />
                  </div>
                  <div className="edit-field-inline">
                    <label>Dirección:</label>
                    <input 
                      type="text" 
                      name="direccion" 
                      value={editData.direccion || ''} 
                      onChange={handleEditChange}
                      placeholder="Ej: Av. 18 de Julio 1234"
                    />
                  </div>
                  <div className="edit-field-inline">
                    <label>Teléfono:</label>
                    <input 
                      type="text" 
                      name="telefono" 
                      value={editData.telefono || ''} 
                      onChange={handleEditChange}
                      placeholder="Ej: +598 99 123 456"
                    />
                  </div>
                  <div className="edit-field-inline">
                    <label>Sitio Web:</label>
                    <input 
                      type="url" 
                      name="sitioWeb" 
                      value={editData.sitioWeb || ''} 
                      onChange={handleEditChange}
                      placeholder="https://ejemplo.com"
                    />
                  </div>
                </>
              ) : (
                <>
                  {companyData.fundada && <p><strong>Fundada:</strong> {companyData.fundada}</p>}
                  {companyData.empleados && <p><strong>Empleados:</strong> {companyData.empleados}</p>}
                  {companyData.ubicaciones && <p><strong>Ubicación:</strong> {companyData.ubicaciones}</p>}
                  {companyData.sector && <p><strong>Sector:</strong> {companyData.sector}</p>}
                  {companyData.ciudad && <p><strong>Ciudad:</strong> {companyData.ciudad}</p>}
                  {companyData.direccion && <p><strong>Dirección:</strong> {companyData.direccion}</p>}
                  {companyData.telefono && <p><strong>Teléfono:</strong> {companyData.telefono}</p>}
                  {companyData.tamano && <p><strong>Tamaño:</strong> {companyData.tamano} empleados</p>}
                </>
              )}
            </section>

            {/* CONTACTOS */}
            <section className="contact-section">
              <h3>Contactos</h3>
              {isEditing ? (
                <div className="edit-contacts">
                  <input 
                    type="url" 
                    name="twitter" 
                    value={editData.twitter || ''} 
                    onChange={handleEditChange} 
                    placeholder="Twitter URL" 
                  />
                  <input 
                    type="url" 
                    name="facebook" 
                    value={editData.facebook || ''} 
                    onChange={handleEditChange} 
                    placeholder="Facebook URL" 
                  />
                  <input 
                    type="url" 
                    name="linkedin" 
                    value={editData.linkedin || ''} 
                    onChange={handleEditChange} 
                    placeholder="LinkedIn URL" 
                  />
                </div>
              ) : (
                <ul>
                  {companyData.twitter && (
                    <li><a href={companyData.twitter} target="_blank" rel="noreferrer">Twitter</a></li>
                  )}
                  {companyData.facebook && (
                    <li><a href={companyData.facebook} target="_blank" rel="noreferrer">Facebook</a></li>
                  )}
                  {companyData.linkedin && (
                    <li><a href={companyData.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
                  )}
                  {companyData.email && (
                    <li><a href={`mailto:${companyData.email}`}>{companyData.email}</a></li>
                  )}
                  {!companyData.twitter && !companyData.facebook && !companyData.linkedin && (
                    <p style={{ color: '#999' }}>No hay redes sociales configuradas</p>
                  )}
                </ul>
              )}
            </section>

            {/* FOTOS */}
            <section className="photos-section">
              <h3>Trabajando en {companyData.nombreEmpresa || 'WorkNow'}</h3>
              <div className="photo-grid">
                <img src="/images/work1.jpg" alt="Oficina 1" />
                <img src="/images/work2.jpg" alt="Oficina 2" />
                <img src="/images/work3.jpg" alt="Oficina 3" />
              </div>
            </section>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="right-column">
            <section className="benefits-section">
              <h3>Beneficios</h3>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Agrega información sobre los beneficios que ofrece tu empresa a los empleados.
              </p>
            </section>
          </div>
        </div>

        {/* SECCIONES TRABAJOS Y PROYECTOS - CORREGIDAS */}
        <div className="job-and-projects">
          <section className="job-postings">
            <h2>Puestos de Trabajo publicados</h2>
            <div className="carousel-container">
              {Array.isArray(jobs) && jobs.length > 0 ? (
                jobs.map((job) => (
                  <CardTrabajo
                    key={job.id || job.title}
                    title={job.title || "Sin título"}
                    company={job.companyName || "Empresa no disponible"}
                    area={job.area}
                    jobType={job.jobType}
                    contractType={job.contractType}
                    modality={job.modality}
                    location={job.location}
                    salary={job.salaryRange}
                    description={job.description}
                    projectUrl={job.projectUrl}
                  />
                ))
              ) : (
                <p>No hay trabajos publicados aún.</p>
              )}
            </div>
          </section>

          <section className="freelancer-postings">
            <h2>Proyectos publicados</h2>
            <div className="carousel-container">
              {Array.isArray(projects) && projects.length > 0 ? (
                projects.map((p) => (
                  <CardProyecto
                    key={p.id || p.title}
                    title={p.title || "Sin título"}
                    description={p.description || "Sin descripción"}
                    skills={p.skills || "No especificado"}
                    duration={p.duration || "No especificado"}
                    modality={p.modality || "No especificado"}
                    remuneration={p.remuneration || "No especificado"}
                    company={p.company?.email || "Empresa no disponible"}
                  />
                ))
              ) : (
                <p>No hay proyectos publicados todavía.</p>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PerfilCompany;