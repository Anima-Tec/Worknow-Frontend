import React, { useState, useEffect } from "react";
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

  // 🟣 Cargar perfil de empresa
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("⚠️ No hay token, redirigiendo al login");
          navigate("/login");
          return;
        }

        setLoading(true);
        const data = await getProfile();
        console.log("📦 Datos de empresa recibidos:", data);

        setCompanyData(data);
        setEditData(data);
        if (data.logoUrl) setLogoImage(data.logoUrl);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error cargando perfil de empresa:", error);
        setLoading(false);
        if (error.message.includes("autenticación")) {
          navigate("/login");
        }
      }
    };
    loadCompanyData();
  }, [navigate]);

  // 🟣 Cargar proyectos de la empresa
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3000/api/projects/company/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error(`Error ${response.status}`);

        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Error cargando proyectos:", error);
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  // 🟣 Cargar trabajos de la empresa
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
        setJobs([]);
      }
    };
    fetchJobs();
  }, []);

  // 🟣 Manejo de edición del perfil
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const response = await updateProfile(editData);
      console.log("✅ Perfil actualizado:", response);

      setCompanyData(editData);
      setIsEditing(false);
      alert("✅ Perfil actualizado correctamente");
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Error al actualizar el perfil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...companyData });
    setIsEditing(false);
  };

  // 🟣 Subida del logo
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

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="perfil-company">
      {/* 🟣 HEADER */}
      <header className="header">
        <div className="header-left">
          <h1 className="logo">
            work<span>now</span>
          </h1>
          <p className="link">
            {companyData.sitioWeb || "https://WorkNow.com"}
          </p>
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

      {/* 🟣 CONTENIDO PRINCIPAL */}
      <main className="main-content">
        {/* BOTÓN EDITAR PERFIL */}
        <div className="edit-profile-section">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="edit-profile-btn"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Editar Perfil
            </button>
          ) : (
            <div className="edit-actions">
              <button
                onClick={handleSaveProfile}
                className="save-btn"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* 🟣 FRAME PRINCIPAL */}
        <div className="frame">
          <div className="left-column">
            {/* LOGO */}
            <section className="company-logo-section">
              <div className="company-logo-wrapper">
                {logoImage ? (
                  <img
                    src={logoImage}
                    alt="Logo empresa"
                    className="company-logo-img"
                  />
                ) : (
                  <div className="company-logo-placeholder">
                    <svg
                      width="60"
                      height="60"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                )}
                {isEditing && (
                  <label className="upload-logo-btn">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="upload-logo-input"
                    />
                  </label>
                )}
              </div>
              <h2 className="company-name-title">
                {companyData.nombreEmpresa || "Nombre de la Empresa"}
              </h2>
            </section>

            {/* PERFIL */}
            <section className="company-profile">
              <h2>Perfil de la Empresa</h2>
              {isEditing ? (
                <>
                  <div className="edit-field">
                    <label>Descripción</label>
                    <textarea
                      name="descripcion"
                      value={editData.descripcion || ""}
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
                      value={editData.mision || ""}
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
                      value={editData.vision || ""}
                      onChange={handleEditChange}
                      rows="3"
                      className="edit-textarea"
                      placeholder="¿Cuál es la visión de tu empresa?"
                    />
                  </div>
                </>
              ) : (
                <>
                  <p>{companyData.descripcion || "Sin descripción"}</p>
                  {companyData.mision && (
                    <p>
                      <strong>Misión:</strong> {companyData.mision}
                    </p>
                  )}
                  {companyData.vision && (
                    <p>
                      <strong>Visión:</strong> {companyData.vision}
                    </p>
                  )}
                </>
              )}
            </section>
          </div>

          <div className="right-column">
            <section className="benefits-section">
              <h3>Beneficios</h3>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Agrega información sobre los beneficios que ofrece tu empresa a
                los empleados.
              </p>
            </section>
          </div>
        </div>

        {/* 🟣 SECCIÓN TRABAJOS Y PROYECTOS */}
        <div className="job-and-projects">
          {/* 🧩 TRABAJOS */}
          <section className="job-postings">
            <h2>Puestos de Trabajo publicados</h2>
            <div className="carousel-container">
              {Array.isArray(jobs) && jobs.length > 0 ? (
                jobs.map((job) => (
                  <CardTrabajo
                    key={job.id || job.title}
                    id={job.id}
                    title={job.title || "Sin título"}
                    company={job.company || job.companyName || "Empresa"}
                    area={job.area}
                    jobType={job.jobType}
                    contractType={job.contractType}
                    modality={job.modality}
                    location={job.location}
                    salary={job.salary || job.salaryRange}
                    description={job.description}
                    projectUrl={job.projectUrl}
                    isCompanyView={true}
                  />
                ))
              ) : (
                <p>No hay trabajos publicados aún.</p>
              )}
            </div>
          </section>

          {/* 💼 PROYECTOS */}
          <section className="freelancer-postings">
            <h2>Proyectos publicados</h2>
            <div className="carousel-container">
              {Array.isArray(projects) && projects.length > 0 ? (
                projects.map((p) => (
                  <CardProyecto
                    key={p.id || p.title}
                    id={p.id}
                    title={p.title || "Sin título"}
                    description={p.description || "Sin descripción"}
                    skills={
                      Array.isArray(p.skills)
                        ? p.skills.join(", ")
                        : p.skills || "No especificado"
                    }
                    duration={p.duration || "No especificado"}
                    modality={p.modality || "No especificado"}
                    remuneration={p.remuneration || "A convenir"}
                    company={p.company?.nombreEmpresa || "Empresa no disponible"}
                    isCompanyView={true}
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
