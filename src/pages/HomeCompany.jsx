import React, { useState, useEffect } from "react";
import "./HomeCompany.css";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosContacts } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { useLocation } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import JobForm from "./JobForm.jsx";
import CardProyecto from "../components/CardProyecto";
import CardTrabajo from "../components/CardTrabajo.jsx";
import ApplicationsModal from "../components/ApplicationsModal";
import Footer from "../components/Footer";

export default function HomeCompany() {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const location = useLocation();

  // 🔔 Cargar notificaciones de empresa
  useEffect(() => {
    async function loadNotifications() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/applications/notifications/company", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setNotificationCount(data.count || 0);
      } catch (err) {
        console.error("❌ Error cargando notificaciones empresa:", err);
      }
    }

    loadNotifications();
  }, []);

  // 🔁 Marcar como leídas cuando abre modal
  useEffect(() => {
    if (!showApplications) return;

    async function markAsRead() {
      try {
        const token = localStorage.getItem("token");
        await fetch("http://localhost:3000/api/applications/notifications/company/read", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setNotificationCount(0);
      } catch (err) {
        console.error("❌ Error marcando como leídas las notificaciones:", err);
      }
    }

    markAsRead();
  }, [showApplications]);

  // 🔹 Obtener proyectos
  useEffect(() => {
  async function fetchCompanyProjects() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/projects/company/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("❌ Error del backend al traer proyectos:", res.status);
        setProjects([]);
        return;
      }

      const result = await res.json();

      // ✅ el backend devuelve { success, data: [...] }
      const projectsData = result.data || result || [];
      console.log("📦 Proyectos obtenidos:", projectsData);

      setProjects(projectsData);
    } catch (err) {
      console.error("❌ Error cargando proyectos de empresa:", err);
      setProjects([]);
    }
  }

  fetchCompanyProjects();
}, []);


  // 🔹 Obtener trabajos
  useEffect(() => {
    async function fetchCompanyJobs() {
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
        console.error("❌ Error cargando trabajos de empresa:", err);
        setJobs([]);
      }
    }
    fetchCompanyJobs();
  }, []);

  const activeProjects = Array.isArray(projects)
  ? projects.filter(
      (p) =>
        p.status !== "HECHO" &&
        p.status !== "NO_HECHO" &&
        p.isCompleted !== true
    )
  : [];

const activeJobs = Array.isArray(jobs)
  ? jobs.filter(
      (j) =>
        j.status !== "HECHO" &&
        j.status !== "NO_HECHO" &&
        j.isCompleted !== true
    )
  : [];


  useEffect(() => {
    if (!showApplications) return;
    async function fetchApplications() {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const companyId = user?.id;
        if (!token || !companyId) return;

        const res = await fetch(
          `http://localhost:3000/api/applications/company/${companyId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        console.error("❌ Error cargando postulaciones:", err);
        setApplications([]);
      }
    }
    fetchApplications();
  }, [showApplications]);

  useEffect(() => {
    if (location.state?.jobCreated) {
      setShowSuccess(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div>
      <header className="header">
        <h1 className="h1">
          work<span>now</span>
        </h1>
        <nav className="nav">
          <ul>
            <li className="nav-item" onClick={() => window.location.reload()}>
              <AiOutlineHome />
              <span>Home</span>
            </li>
            <li
              className="nav-item"
              onClick={() => setShowApplications(true)}
              style={{ cursor: "pointer" }}
            >
              <IoIosContacts />
              <span>Postulados</span>
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </li>
            <li
              className="nav-item"
              onClick={() => (window.location.href = "/PerfilCompany")}
            >
              <CgProfile />
              <span>Perfil</span>
            </li>
          </ul>
        </nav>
      </header>

      <div className="video-container">
        <video src="/EMPRESA.mp4" autoPlay loop muted />
      </div>

      <div className="cards-container">
        <div className="card1">
          <h2>Publicar proyecto Freelance</h2>
          <p>Accedé a talento independiente adaptado a tu empresa.</p>
          <button className="primaryBtn" onClick={() => setShowProjectForm(true)}>
            Publicar Proyecto
          </button>
        </div>

        <div className="card2">
          <h2>Publicar puesto de Trabajo</h2>
          <p>Buscá el perfil ideal y sumá profesionales comprometidos.</p>
          <button className="primaryBtn" onClick={() => setShowJobForm(true)}>
            Publicar Trabajo
          </button>
        </div>
      </div>

      {showJobForm && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowJobForm(false)}>✖</button>
           <JobForm
              onClose={() => setShowJobForm(false)}
              onJobCreated={(response) => {
                const newJob = response?.job || response?.data || response;
                setJobs((prev) => (Array.isArray(prev) ? [newJob, ...prev] : [newJob]));
                setShowSuccess(true);
              }}
            />
          </div>
        </div>
      )}

      {showProjectForm && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowProjectForm(false)}>✖</button>
            <ProjectForm
              onClose={() => setShowProjectForm(false)}
              onProjectCreated={(response) => {
                const newProject = response?.project || response?.data || response; // ✅ toma el objeto real
                setProjects((prev) => (Array.isArray(prev) ? [newProject, ...prev] : [newProject]));
                setShowSuccess(true);
              }}
            />
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="modal">
          <div className="modal-content">
            ✅ Publicación realizada con éxito
            <br />
            <button className="primaryBtn" onClick={() => setShowSuccess(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {showApplications && (
        <ApplicationsModal
          open={showApplications}
          onClose={() => setShowApplications(false)}
        />
      )}

      <section className="featured">
        <div className="header">
          <h3>Proyectos {activeProjects.length > 0 && `(${activeProjects.length})`}</h3>
        </div>
        {loading ? (
          <p className="loading">Cargando...</p>
        ) : activeProjects.length > 0 ? (
          <div className="cards">
            {activeProjects.map((p) => (
              <CardProyecto key={p.id} {...p} isCompanyView={true} />
            ))}
          </div>
        ) : (
          <p className="no-data">No hay proyectos publicados por ahora</p>
        )}
      </section>

      <section className="featured">
        <div className="header">
          <h3>Trabajos {activeJobs.length > 0 && `(${activeJobs.length})`}</h3>
        </div>
        {loading ? (
          <p className="loading">Cargando...</p>
        ) : activeJobs.length > 0 ? (
          <div className="cards">
            {activeJobs.map((job) => (
              <CardTrabajo key={job.id} {...job} isCompanyView={true} />
            ))}
          </div>
        ) : (
          <p className="no-data">No hay trabajos publicados por ahora</p>
        )}
      </section>

      <Footer />
    </div>
  );
}
