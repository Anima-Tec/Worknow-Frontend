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

  // 🔍 Buscar trabajos/proyectos
  const handleSearch = async () => {
  setLoading(true);
  try {
    const filters = { query: query.trim(), type };

    if (type === "jobs") {
      const jobsData = await searchJobs(filters);
      setJobs(Array.isArray(jobsData) ? jobsData : jobsData.data || []);
      setProjects([]);
    } else if (type === "projects") {
      const projectsData = await searchProjects(filters);
      setProjects(Array.isArray(projectsData) ? projectsData : projectsData.data || []);
      setJobs([]);
    } else {
      const jobsData = await searchJobs(filters);
      const projectsData = await searchProjects(filters);
      setJobs(Array.isArray(jobsData) ? jobsData : jobsData.data || []);
      setProjects(Array.isArray(projectsData) ? projectsData : projectsData.data || []);
    }
  } catch (err) {
    console.error("❌ Error en búsqueda:", err);
  } finally {
    setLoading(false);
  }
};  

  // 🔔 Cargar notificaciones del backend
  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:3000/api/applications/notifications/count", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setNotificationCount(data.count || 0);
      }
    } catch (err) {
      console.error("❌ Error cargando notificaciones:", err);
    }
  };

  // 🟣 Marcar notificaciones como leídas al entrar a Mis Postulaciones
  const handlePostulacionesClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch("http://localhost:3000/api/applications/notifications/user/read", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotificationCount(0); // eliminar badge
      window.location.href = "/mis-postulaciones";
    } catch (err) {
      console.error("❌ Error marcando notificaciones como leídas:", err);
      window.location.href = "/mis-postulaciones"; // redirigir igual
    }
  };

  useEffect(() => {
    handleSearch();
    loadNotifications();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [type]);

  const activeJobs = jobs.filter(
    (job) =>
      job.userStatus === "NONE" ||
      job.userStatus === "RECHAZADO" ||
      job.userStatus === "PENDIENTE"
  );

  const activeProjects = projects.filter(
    (project) =>
      project.userStatus === "NONE" ||
      project.userStatus === "RECHAZADO" ||
      project.userStatus === "PENDIENTE"
  );

  return (
    <div className="home-user">
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

            <li className="nav-item" onClick={handlePostulacionesClick}>
              <MdWorkOutline />
              <span>Mis Postulaciones</span>
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </li>

            <li className="nav-item" onClick={() => (window.location.href = "/PerfilUser")}>
              <CgProfile />
              <span>Perfil</span>
            </li>
          </ul>
        </nav>
      </header>

      <section className="hero">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src="/video-banner.mp4" type="video/mp4" />
        </video>
      </section>

      <div className="search-box">
        <div className="filter">
          <label>Buscar</label>
          <input
            type="text"
            placeholder="Escribe palabras clave..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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

      {(type === "" || type === "projects") && (
        <section className="featured">
          <div className="header">
            <h3>
              Proyectos {activeProjects.length > 0 && `(${activeProjects.length})`}
            </h3>
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
              {query
                ? `No hay proyectos que coincidan con "${query}"`
                : "No hay proyectos disponibles"}
            </p>
          )}
        </section>
      )}

      {(type === "" || type === "jobs") && (
        <section className="featured">
          <div className="header">
            <h3>Trabajos {activeJobs.length > 0 && `(${activeJobs.length})`}</h3>
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
              {query
                ? `No hay trabajos que coincidan con "${query}"`
                : "No hay trabajos disponibles"}
            </p>
          )}
        </section>
      )}

      <Footer />
    </div>
  );
}
