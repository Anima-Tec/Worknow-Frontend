import { useEffect, useState } from "react";
import { searchJobs, searchProjects } from "../services/api";
import CardTrabajo from "../components/CardTrabajo";
import CardProyecto from "../components/CardProyecto";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosContacts, IoIosNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import "./HomeUser.css";
import { Link } from "react-router-dom";

export default function HomeUser() {
  const [jobs, setJobs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [area, setArea] = useState("");
  const [level, setLevel] = useState("");

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
                <li className="nav-item" onClick={() => window.location.href = '/ContactUser'}>
                <IoIosContacts />
                <span>Contacto</span>
                </li>
                <li className="nav-item" onClick={() => {}}>
                  <IoIosNotifications />
                  <span>Notificaciones</span>
                    </li>
                  <li className="nav-item" onClick={() => window.location.href = '/PerfilUser'}>
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

      <section className="featured">
        <div className="header">
          <h3>Featured job</h3>
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
          projectUrl={job.projectUrl} // si existe un proyecto asociado
              />
            ))
          ) : (
            <p className="no-data">No hay trabajos destacados por ahora</p>
          )}
        </div>
      </section>

      <section className="featured">
        <div className="header">
          <h3>Featured project</h3>
          <a href="#">View all →</a>
        </div>
        <div className="cards">
          {loading ? (
            <p className="loading">Cargando...</p>
          ) : projects.length > 0 ? (
            projects.map((project) => (
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
          ) : (
            <p className="no-data">No hay proyectos destacados por ahora</p>
          )}
        </div>
      </section>
    </div>
  );
}
