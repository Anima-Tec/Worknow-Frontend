import React, { useState, useEffect } from "react";
import "./HomeCompany.css";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosContacts, IoIosNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import ContactCompany from "./ContactCompany";
import { Link, useLocation } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import CardProyecto from "../components/CardProyecto";
import CardTrabajo from "../components/CardTrabajo.jsx";
import JobForm from "./JobForm.jsx";
import { getJobs } from "../services/api";

export default function HomeCompany() {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [jobs, setJobs] = useState([]);
  const location = useLocation();

  // 🔹 Cargar proyectos
  useEffect(() => {
    fetch("http://localhost:3000/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err));
  }, []);

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]);
  };

  // 🔹 Mostrar modal de éxito si viene de JobForm con navigate()
  useEffect(() => {
    if (location.state?.jobCreated) {
      setShowSuccess(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // 🔹 Cargar trabajos al montar
  useEffect(() => {
    getJobs()
      .then(setJobs)
      .catch((err) => console.error("Error cargando trabajos:", err));
  }, []);

  // ✅ AGREGADO: Cuando se crea un nuevo trabajo, se agrega a la lista directamente
  const handleJobCreated = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
    setShowJobForm(false);
    setShowSuccess(true);
  };

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
              onClick={() => (window.location.href = "/contactcompany")}
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
          <p>
            Accedé a talento independiente que se adapta a las necesidades de tu
            empresa.
          </p>
          <button
            className="primaryBtn"
            onClick={() => setShowProjectForm(true)}
          >
            Publicar Proyecto
          </button>
        </div>

        <div className="card2">
          <h2>Publicar puesto de Trabajo</h2>
          <p>
            Busca el perfil ideal y suma profesionales comprometidos a largo
            plazo.
          </p>
          <button className="primaryBtn" onClick={() => setShowJobForm(true)}>
            Publicar trabajo
          </button>
        </div>
      </div>

      {/* Modal formulario de Trabajo */}
      {showJobForm && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setShowJobForm(false)}
              style={{ float: "right" }}
            >
              ✖
            </button>
            {/* 👇 Pasamos la función handleJobCreated */}
            <JobForm onJobCreated={handleJobCreated} />
          </div>
        </div>
      )}

      {/* Modal formulario de Proyecto */}
      {showProjectForm && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setShowProjectForm(false)}
              style={{ float: "right" }}
            >
              ✖
            </button>
            <ProjectForm
              onClose={() => setShowProjectForm(false)}
              onProjectCreated={handleProjectCreated}
            />
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="modal">
          <div className="modal-content">
            ✅ Trabajo subido con éxito
            <br />
            <button className="primaryBtn" onClick={() => setShowSuccess(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Listado de trabajos */}
<section className="job-postings">
  <h2>Puestos de Trabajo publicados</h2>
  <div className="jobs">
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
          projectUrl={job.projectUrl} // si existe un proyecto asociado
        />
      ))
    )}
  </div>
</section>


      {/* 🔹 Listado de proyectos */}
      <section className="freelancer-postings">
        <h2>Proyectos publicados</h2>
        <div className="freelancer-jobs">
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
  );
}
