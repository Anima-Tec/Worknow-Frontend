import React, { useState, useEffect } from "react"
import "./PerfilCompanyStyle.css";
import { AiOutlineHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import CardTrabajo from "../components/CardTrabajo";
import CardProyecto from "../components/CardProyecto";
import { getJobs } from "../services/api";

function PerfilCompany() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [logoImage, setLogoImage] = useState(null);

  // 🔹 DATOS DE LA EMPRESA (se llenarán desde el backend)
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
    // Redes sociales
    twitter: '',
    facebook: '',
    linkedin: '',
    // Beneficios
    beneficios: []
  });

  const [editData, setEditData] = useState({ ...companyData });

  // 🔹 CARGAR DATOS DE LA EMPRESA DESDE EL BACKEND
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      fetch('http://localhost:3000/api/empresa/perfil', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setCompanyData(data);
        setEditData(data);
        if (data.logoUrl) {
          setLogoImage(data.logoUrl);
        }
      })
      .catch(err => console.error('Error cargando perfil de empresa:', err));
    } else {
      // DATOS DE EJEMPLO (eliminar cuando conectes el backend)
      const ejemploEmpresa = {
        nombreEmpresa: 'WorkNow',
        rut: '12.345.678-9',
        email: 'contacto@worknow.com',
        telefono: '+598 2XXX XXXX',
        direccion: 'Av. Principal 1234',
        ciudad: 'Montevideo',
        sector: 'Tecnología / Software',
        sitioWeb: 'https://WorkNow.com',
        tamano: '201-500',
        fundada: 'Junio 01, 2025',
        empleados: '200+',
        ubicaciones: '1 país',
        descripcion: 'WorkNow es una plataforma creada para conectar talento con oportunidades en tiempo real. Nuestro objetivo es simplificar la forma en que las personas acceden a trabajos y las empresas encuentran a los colaboradores que necesitan.',
        mision: 'Queremos transformar el acceso al trabajo, construyendo herramientas que hagan más simple, rápida y transparente la conexión con el empleo.',
        vision: 'Creemos que el futuro del empleo está en procesos ágiles y sin burocracia, con soluciones digitales integradas y ecosistemas inclusivos.',
        twitter: 'https://twitter.com/WorkNow',
        facebook: 'https://facebook.com/WorkNow',
        linkedin: 'https://linkedin.com/company/WorkNow',
        beneficios: [
          { titulo: 'Salud Integral', descripcion: 'Cobertura de salud completa y programas de bienestar físico y mental. Tu salud es prioridad.' },
          { titulo: 'Vacaciones Flexibles', descripcion: 'Tiempo libre ilimitado para descansar y disfrutar de lo que más te gusta.' },
          { titulo: 'Aprendizaje y Crecimiento', descripcion: 'Acceso a cursos, talleres y conferencias para seguir creciendo profesionalmente.' },
          { titulo: 'Encuentros de Equipo', descripcion: 'Reuniones y actividades que fortalecen el trabajo en equipo y la planificación a futuro.' },
          { titulo: 'Trabajo Remoto', descripcion: 'Flexibilidad para trabajar desde donde quieras, con equipos en todo el mundo.' },
          { titulo: 'Bonos de Productividad', descripcion: 'Reconocimientos y premios por los logros y el desempeño excepcional.' }
        ]
      };
      setCompanyData(ejemploEmpresa);
      setEditData(ejemploEmpresa);
    }
  }, []);

  // 🔹 CARGAR PROYECTOS
  useEffect(() => {
    fetch("http://localhost:3000/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err));
  }, []);

  // 🔹 CARGAR TRABAJOS
  useEffect(() => {
    getJobs()
      .then(setJobs)
      .catch((err) => console.error("Error cargando trabajos:", err));
  }, []);

  // 🔹 MANEJAR CAMBIOS EN INPUTS
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 🔹 GUARDAR CAMBIOS EN EL BACKEND
  const handleSaveProfile = () => {
    const token = localStorage.getItem('token');
    
    fetch('http://localhost:3000/api/empresa/perfil', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(editData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Perfil actualizado:', data);
      setCompanyData(editData);
      setIsEditing(false);
      alert('Perfil actualizado correctamente');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error al actualizar el perfil');
    });
  };

  // 🔹 CANCELAR EDICIÓN
  const handleCancel = () => {
    setEditData({ ...companyData });
    setIsEditing(false);
  };

  // 🔹 SUBIR LOGO
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Subir al backend
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('logo', file);

      fetch('http://localhost:3000/api/empresa/logo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      .then(response => response.json())
      .then(data => console.log('Logo subido:', data))
      .catch(error => console.error('Error subiendo logo:', error));
    }
  };

  return (
    <div className="perfil-company">
      {/* 🔹 HEADER */}
      <header className="header">
        <div className="header-left">
          <h1 className="logo">
            work<span>now</span>
          </h1>
          <p className="link">{editData.sitioWeb || 'https://WorkNow.com'}</p>
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

      {/* 🔹 CONTENIDO PRINCIPAL */}
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
              <button onClick={handleSaveProfile} className="save-btn">Guardar Cambios</button>
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
              <h2 className="company-name-title">{editData.nombreEmpresa || 'Nombre de la Empresa'}</h2>
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
                      value={editData.descripcion}
                      onChange={handleEditChange}
                      rows="4"
                      className="edit-textarea"
                    />
                  </div>
                  <div className="edit-field">
                    <label>Misión</label>
                    <textarea
                      name="mision"
                      value={editData.mision}
                      onChange={handleEditChange}
                      rows="3"
                      className="edit-textarea"
                    />
                  </div>
                  <div className="edit-field">
                    <label>Visión</label>
                    <textarea
                      name="vision"
                      value={editData.vision}
                      onChange={handleEditChange}
                      rows="3"
                      className="edit-textarea"
                    />
                  </div>
                </>
              ) : (
                <>
                  <p>{companyData.descripcion}</p>
                  <p>{companyData.mision}</p>
                  <p>{companyData.vision}</p>
                </>
              )}
            </section>

            {/* INFORMACIÓN DE LA EMPRESA */}
            <section className="company-info">
              {isEditing ? (
                <>
                  <div className="edit-field-inline">
                    <label>Fundada:</label>
                    <input type="text" name="fundada" value={editData.fundada} onChange={handleEditChange} />
                  </div>
                  <div className="edit-field-inline">
                    <label>Empleados:</label>
                    <input type="text" name="empleados" value={editData.empleados} onChange={handleEditChange} />
                  </div>
                  <div className="edit-field-inline">
                    <label>Ubicaciones:</label>
                    <input type="text" name="ubicaciones" value={editData.ubicaciones} onChange={handleEditChange} />
                  </div>
                  <div className="edit-field-inline">
                    <label>Industria:</label>
                    <input type="text" name="sector" value={editData.sector} onChange={handleEditChange} />
                  </div>
                </>
              ) : (
                <>
                  <p><strong>Fundada:</strong> {companyData.fundada}</p>
                  <p><strong>Empleados:</strong> {companyData.empleados}</p>
                  <p><strong>Ubicación:</strong> {companyData.ubicaciones}</p>
                  <p><strong>Industria:</strong> {companyData.sector}</p>
                </>
              )}
            </section>

            {/* CONTACTOS */}
            <section className="contact-section">
              <h3>Contactos</h3>
              {isEditing ? (
                <div className="edit-contacts">
                  <input type="url" name="twitter" value={editData.twitter} onChange={handleEditChange} placeholder="Twitter URL" />
                  <input type="url" name="facebook" value={editData.facebook} onChange={handleEditChange} placeholder="Facebook URL" />
                  <input type="url" name="linkedin" value={editData.linkedin} onChange={handleEditChange} placeholder="LinkedIn URL" />
                  <input type="email" name="email" value={editData.email} onChange={handleEditChange} placeholder="Email" />
                </div>
              ) : (
                <ul>
                  {companyData.twitter && <li><a href={companyData.twitter} target="_blank" rel="noreferrer">Twitter</a></li>}
                  {companyData.facebook && <li><a href={companyData.facebook} target="_blank" rel="noreferrer">Facebook</a></li>}
                  {companyData.linkedin && <li><a href={companyData.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>}
                  {companyData.email && <li><a href={`mailto:${companyData.email}`}>{companyData.email}</a></li>}
                </ul>
              )}
            </section>

            {/* FOTOS */}
            <section className="photos-section">
              <h3>Working at {companyData.nombreEmpresa || 'WorkNow'}</h3>
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
              {companyData.beneficios && companyData.beneficios.length > 0 ? (
                companyData.beneficios.map((beneficio, index) => (
                  <div key={index} className="benefit-card">
                    <h4>{beneficio.titulo}</h4>
                    <p>{beneficio.descripcion}</p>
                  </div>
                ))
              ) : (
                <p>No hay beneficios registrados</p>
              )}
            </section>
          </div>
        </div>

        {/* 🔹 SECCIONES TRABAJOS Y PROYECTOS */}
        <div className="job-and-projects">
          <section className="job-postings">
            <h2>Puestos de Trabajo publicados</h2>
            <div className="carousel-container">
              {jobs.length === 0 ? (
                <p>No hay trabajos publicados aún.</p>
              ) : (
                jobs.map((job) => (
                  <CardTrabajo
                    key={job.id}
                    title={job.title}
                    company={job.companyName}
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
              )}
            </div>
          </section>

          <section className="freelancer-postings">
            <h2>Proyectos publicados</h2>
            <div className="carousel-container">
              {projects.length === 0 ? (
                <p>No hay proyectos publicados todavía.</p>
              ) : (
                projects.map((p) => (
                  <CardProyecto
                    key={p.id}
                    title={p.title}
                    description={p.description}
                    skills={p.skills}
                    duration={p.duration}
                    modality={p.modality}
                    remuneration={p.remuneration}
                    company={p.company?.email}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default PerfilCompany;