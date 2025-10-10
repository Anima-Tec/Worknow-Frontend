import React, { useState, useEffect } from "react";
import "./HomeCompany.css";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosContacts, IoIosNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { useLocation } from "react-router-dom";
import { getJobs } from "../services/api";
import ProjectForm from "./ProjectForm";
import JobForm from "./JobForm.jsx";
import CardProyecto from "../components/CardProyecto";
import CardTrabajo from "../components/CardTrabajo.jsx";

export default function HomeCompany() {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const location = useLocation();

  // 🔹 Obtener proyectos del backend
  useEffect(() => {
    fetch("http://localhost:3000/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error cargando proyectos:", err));
  }, []);

  // 🔹 Obtener trabajos del backend
  useEffect(() => {
    getJobs()
      .then(setJobs)
      .catch((err) => console.error("Error cargando trabajos:", err));
  }, []);

  // 🔹 Mostrar modal de éxito si viene de JobForm con navigate()
  useEffect(() => {
    if (location.state?.jobCreated) {
      setShowSuccess(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // 🔹 Manejar proyecto creado
  const handleProjectCreated = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
    setShowProjectForm(false);
    setShowSuccess(true);
  };

  // 🔹 Manejar trabajo creado
  const handleJobCreated = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
    setShowJobForm(false);
    setShowSuccess(true);
  };

  return (
    <div>
      {/* ---------- HEADER ---------- */}
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
            <li className="nav-item">
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

      {/* ---------- VIDEO ---------- */}
      <div className="video-container">
        <video src="/EMPRESA.mp4" autoPlay loop muted />
      </div>

      {/* ---------- SECCIÓN PUBLICAR ---------- */}
      <div className="cards-container">
        <div className="card1">
          <h2>Publicar proyecto Freelance</h2>
          <p>
            Accedé a talento independiente que se adapta a las necesidades de tu empresa.
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
            Busca el perfil ideal y suma profesionales comprometidos a largo plazo.
          </p>
          <button className="primaryBtn" onClick={() => setShowJobForm(true)}>
            Publicar trabajo
          </button>
        </div>
      </div>

      {/* ---------- MODALES ---------- */}
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
            <JobForm onJobCreated={handleJobCreated} />
          </div>
        </div>
      )}

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
            ✅ Publicación realizada con éxito
            <br />
            <button className="primaryBtn" onClick={() => setShowSuccess(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* ---------- PROYECTOS PUBLICADOS (CARRUSEL BOOTSTRAP) ---------- */}
      <section className="freelancer-postings">
        <div className="section-header">
          <h2>Proyectos publicados</h2>
          {!showAllProjects && projects.length > 3 && (
            <button
              className="view-more-btn"
              onClick={() => setShowAllProjects(true)}
            >
              Ver todo →
            </button>
          )}
        </div>

        {!showAllProjects ? (
          <div
            id="carouselProjects"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {projects.map((p, index) => (
                <div
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                  key={p.id}
                >
                  <div className="carousel-card-wrapper">
                    <CardProyecto
                      title={p.title}
                      description={p.description}
                      skills={p.skills}
                      duration={p.duration}
                      modality={p.modality}
                      remuneration={p.remuneration}
                      company={p.company?.email}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselProjects"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Anterior</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselProjects"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Siguiente</span>
            </button>
          </div>
        ) : (
          <div className="freelancer-list">
            {projects.map((p) => (
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
            ))}
            <button
              className="view-more-btn back-btn"
              onClick={() => setShowAllProjects(false)}
            >
              ← Volver
            </button>
          </div>
        )}
      </section>

      {/* ---------- TRABAJOS PUBLICADOS ---------- */}
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
                projectUrl={job.projectUrl}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
