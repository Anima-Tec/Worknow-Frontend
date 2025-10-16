import { useEffect, useState } from "react";
import { searchJobs, searchProjects } from "../services/api";
import CardTrabajo from "../components/CardTrabajo";
import CardProyecto from "../components/CardProyecto";
import { AiOutlineHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { MdWorkOutline } from "react-icons/md";
import "./HomeUser.css";
import Footer from "../components/Footer";

export default function HomeUser() {
  const [jobs, setJobs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllJobs, setShowAllJobs] = useState(false);

  // 🔍 Buscar trabajos y proyectos
  const handleSearch = async () => {
    setLoading(true);
    try {
      console.log("🔍 Buscando con:", { query, type }); // Para debug
      
      const filters = { 
        query: query.trim(), // Limpiar espacios
        type 
      };

      if (type === "jobs") {
        const jobsData = await searchJobs(filters);
        console.log("📊 Jobs encontrados:", jobsData);
        setJobs(jobsData);
        setProjects([]);
      } else if (type === "projects") {
        const projectsData = await searchProjects(filters);
        console.log("📊 Projects encontrados:", projectsData);
        setProjects(projectsData);
        setJobs([]);
      } else {
        const jobsData = await searchJobs(filters);
        const projectsData = await searchProjects(filters);
        console.log("📊 Todos encontrados - Jobs:", jobsData, "Projects:", projectsData);
        setJobs(jobsData);
        setProjects(projectsData);
      }
    } catch (err) {
      console.error("❌ Error en búsqueda:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔔 Cargar notificaciones
  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:3000/api/applications/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const count = data.filter(
            (app) => app.status !== "Pendiente" && !app.visto
          ).length;
          setNotificationCount(count);
        }
      }
    } catch (err) {
      console.error("❌ Error cargando notificaciones:", err);
    }
  };

  // 🎯 Cargar datos iniciales
  useEffect(() => {
    handleSearch();
    loadNotifications();
  }, []);

  // 🎯 Filtrar cuando cambie el tipo
  useEffect(() => {
    handleSearch();
  }, [type]);

  // ✅ Filtrar solo trabajos activos
  const activeJobs = jobs.filter(
    (job) => job.userStatus === "NONE" || job.userStatus === "RECHAZADO" || job.userStatus === "PENDIENTE"
  );

  // ✅ Filtrar solo proyectos activos
  const activeProjects = projects.filter(
    (project) => project.userStatus === "NONE" || project.userStatus === "RECHAZADO" || project.userStatus === "PENDIENTE"
  );

  return (
    <div className="home-user">
      {/* 🟣 HEADER */}
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
              onClick={() => (window.location.href = "/mis-postulaciones")}
            >
              <MdWorkOutline />
              <span>Mis Postulaciones</span>
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </li>
            <li
              className="nav-item"
              onClick={() => (window.location.href = "/PerfilUser")}
            >
              <CgProfile />
              <span>Perfil</span>
            </li>
          </ul>
        </nav>
      </header>

      {/* 🎬 VIDEO BANNER */}
      <section className="hero">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src="/video-banner.mp4" type="video/mp4" />
        </video>
      </section>

      {/* 🔍 FILTROS CON ESTILO ORIGINAL - CORREGIDO */}
      <div className="search-box">
        <div className="filter">
          <label>Buscar</label>
          <input
            type="text"
            placeholder="Escribe palabras clave..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <div className="filter">
          <label>TIPO</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Todos</option>
            <option value="jobs">Trabajos</option>
            <option value="projects">Proyectos</option>
          </select>
        </div>

        <button className="btn-search" onClick={handleSearch} disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {/* 💼 TRABAJOS - Solo se muestra si type no es "projects" */}
      {(type === "" || type === "jobs") && (
        <section className="featured">
          <div className="header">
            <h3>Featured jobs {activeJobs.length > 0 && `(${activeJobs.length})`}</h3>
            {activeJobs.length > 0 && (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAllJobs(!showAllJobs);
                }}
              >
                {showAllJobs ? "Ver menos ↑" : "View all →"}
              </a>
            )}
          </div>

          {loading ? (
            <p className="loading">Cargando...</p>
          ) : activeJobs.length > 0 ? (
            <div className="cards">
              {activeJobs.map((job) => (
                <CardTrabajo key={job.id} {...job} />
              ))}
            </div>
          ) : (
            <p className="no-data">
              {query ? `No hay trabajos que coincidan con "${query}"` : "No hay trabajos disponibles"}
            </p>
          )}
        </section>
      )}

      {/* 💡 PROYECTOS - Solo se muestra si type no es "jobs" */}
      {(type === "" || type === "projects") && (
        <section className="featured">
          <div className="header">
            <h3>Featured projects {activeProjects.length > 0 && `(${activeProjects.length})`}</h3>
            {activeProjects.length > 0 && (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAllProjects(!showAllProjects);
                }}
              >
                {showAllProjects ? "Ver menos ↑" : "View all →"}
              </a>
            )}
          </div>

          {loading ? (
            <p className="loading">Cargando...</p>
          ) : activeProjects.length > 0 ? (
            <div className="cards">
              {activeProjects.map((p) => (
                <CardProyecto key={p.id} {...p} />
              ))}
            </div>
          ) : (
            <p className="no-data">
              {query ? `No hay proyectos que coincidan con "${query}"` : "No hay proyectos disponibles"}
            </p>
          )}
        </section>
      )}

      <Footer />
    </div>
  );
}