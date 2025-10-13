import { useEffect, useState } from "react";
import { searchJobs, searchProjects } from "../services/api";
import CardTrabajo from "../components/CardTrabajo";
import CardProyecto from "../components/CardProyecto";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosContacts, IoIosNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import "./HomeUser.css";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Footer from "../components/Footer";

export default function HomeUser() {
  const [jobs, setJobs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [area, setArea] = useState("");
  const [level, setLevel] = useState("");

  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllJobs, setShowAllJobs] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const filters = { query, type, area, level };

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

  useEffect(() => {
    handleSearch();
  }, []);

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
              onClick={() => (window.location.href = "/ContactUser")}
            >
              <IoIosContacts />
              <span>Contacto</span>
            </li>
            <li className="nav-item" onClick={() => {}}>
              <IoIosNotifications />
              <span>Notificaciones</span>
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

      <section className="hero">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src="/video-banner.mp4" type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>
      </section>

      {/* 🔍 FILTROS */}
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
            <option value="">Selecciona</option>
            <option value="jobs">Trabajos</option>
            <option value="projects">Proyectos</option>
          </select>
        </div>

        <div className="filter">
          <label>Área de especialización</label>
          <select value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">Selecciona</option>
            <option value="desarrollo">Desarrollo</option>
            <option value="diseño">Diseño</option>
            <option value="marketing">Marketing</option>
            <option value="data">Data</option>
          </select>
        </div>

        <div className="filter">
          <label>Nivel requerido</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">Selecciona</option>
            <option value="junior">Junior</option>
            <option value="semijunior">Semi Junior</option>
            <option value="senior">Senior</option>
          </select>
        </div>

        <button className="btn-search" onClick={handleSearch}>
          Find
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
      {/* 💼 Trabajos */}
      <section className="featured">
        <div className="header">
          <h3>Featured jobs</h3>
          <a href="#">View all →</a>
        </div>
        <div className="cards">
          {loading ? (
            <p className="loading">Cargando...</p>
          ) : jobs.length > 0 ? (
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
          ) : (
            <p className="no-data">No hay trabajos por ahora</p>
          )}
        </div>
      </section>

      {/* 💡 Proyectos */}
      <section className="featured">
        <div className="header">
          <h3>Featured projects</h3>
          <a href="#">View all →</a>
        </div>

        <div className="cards">
          {loading ? (
            <p className="loading">Cargando...</p>
          ) : projects.length > 0 ? (
            projects.map((project) => (
              <CardProyecto
                key={project.id}
                title={project.title}
                description={project.description}
                skills={project.skills}
                duration={project.duration}
                modality={project.modality}
                remuneration={project.remuneration}
                company={project.companyName || "Empresa"}
              />
            ))
          ) : (
            <p className="no-data">No hay proyectos publicados por ahora</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
