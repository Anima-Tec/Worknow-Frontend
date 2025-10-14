import { useEffect, useState } from "react";
import { searchJobs, searchProjects } from "../services/api";
import CardTrabajo from "../components/CardTrabajo";
import CardProyecto from "../components/CardProyecto";
import { AiOutlineHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { MdWorkOutline } from "react-icons/md";
import "./HomeUser.css";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Footer from "../components/Footer";

export default function HomeUser() {
  const [jobs, setJobs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [jobType, setJobType] = useState("");

  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllJobs, setShowAllJobs] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const filters = { query, type, jobType };

      if (type === "jobs") {
        const jobsData = await searchJobs(filters);
        setJobs(jobsData);
        setProjects([]);
      } else if (type === "projects") {
        const projectsData = await searchProjects(filters);
        setProjects(projectsData);
        setJobs([]);
      } else {
        const jobsData = await searchJobs(filters);
        const projectsData = await searchProjects(filters);
        setJobs(jobsData);
        setProjects(projectsData);
      }
    } catch (err) {
      console.error("Error en búsqueda:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setNotificationCount(0);
        return;
      }

      const res = await fetch("http://localhost:3000/api/applications/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          // Contar postulaciones con estado diferente a "Pendiente" y no vistas
          const count = data.filter(app => 
            app.status !== "Pendiente" && !app.visto
          ).length;
          setNotificationCount(count);
        } else {
          setNotificationCount(0);
        }
      } else {
        setNotificationCount(0);
      }
    } catch (err) {
      console.error("Error cargando notificaciones:", err);
      setNotificationCount(0);
    }
  };

  useEffect(() => {
    handleSearch();
    loadNotifications();
  }, []);

  return (
    <div className="home-user">
      {/* 🟣 HEADER SIMPLIFICADO */}
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
            
            {/* BOTÓN DE POSTULACIONES */}
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

            {/* SOLO PERFIL */}
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

      {/* HERO SECTION */}
      <section className="hero">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src="/video-banner.mp4" type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>
      </section>

      {/* 🔍 FILTROS SIMPLIFICADOS */}
      <div className="search-box">
        <div className="filter">
          <label>Buscar</label>
          <input
            type="text"
            placeholder="Escribe palabras clave..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="filter">
          <label>Tipo</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Todos</option>
            <option value="jobs">Trabajos</option>
            <option value="projects">Proyectos</option>
          </select>
        </div>

        <div className="filter">
          <label>Modalidad</label>
          <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
            <option value="">Todas</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>

        <button className="btn-search" onClick={handleSearch}>
          Buscar
        </button>
      </div>

      {/* 💼 TRABAJOS */}
      <section className="featured">
        <div className="header">
          <h3>Featured jobs</h3>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowAllJobs(!showAllJobs);
            }}
          >
            {showAllJobs ? "Ver menos ↑" : "View all →"}
          </a>
        </div>

        {loading ? (
          <p className="loading">Cargando...</p>
        ) : jobs.length > 0 ? (
          showAllJobs ? (
            <div className="cards">
              {jobs.map((job) => (
                <CardTrabajo key={job.id} {...job} />
              ))}
            </div>
          ) : (
            <Carousel
              responsive={{
                desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
                tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
                mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
              }}
              infinite
              autoPlay={false}
              keyBoardControl
              containerClass="carousel-container"
              itemClass="carousel-card"
              removeArrowOnDeviceType={["mobile"]}
            >
              {jobs.map((job) => (
                <CardTrabajo key={job.id} {...job} />
              ))}
            </Carousel>
          )
        ) : (
          <p className="no-data">No hay trabajos por ahora</p>
        )}
      </section>

      {/* 💡 PROYECTOS */}
      <section className="featured">
        <div className="header">
          <h3>Featured projects</h3>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowAllProjects(!showAllProjects);
            }}
          >
            {showAllProjects ? "Ver menos ↑" : "View all →"}
          </a>
        </div>

        {loading ? (
          <p className="loading">Cargando...</p>
        ) : projects.length > 0 ? (
          showAllProjects ? (
            <div className="cards">
              {projects.map((p) => (
                <CardProyecto key={p.id} {...p} />
              ))}
            </div>
          ) : (
            <Carousel
              responsive={{
                desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
                tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
                mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
              }}
              infinite
              autoPlay={false}
              keyBoardControl
              containerClass="carousel-container"
              itemClass="carousel-card"
              removeArrowOnDeviceType={["mobile"]}
            >
              {projects.map((p) => (
                <CardProyecto key={p.id} {...p} />
              ))}
            </Carousel>
          )
        ) : (
          <p className="no-data">No hay proyectos publicados por ahora</p>
        )}
      </section>

      <Footer />
    </div>
  );
}