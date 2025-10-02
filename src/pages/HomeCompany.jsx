import React, { useState, useEffect } from "react";
import "./HomeCompany.css";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosContacts, IoIosNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import ContactCompany from "./ContactCompany";
import { Link } from "react-router-dom";
import ProjectForm from "./ProjectForm"; 
import CardProyecto from "../components/CardProyecto";
import { useLocation } from "react-router-dom";
import JobForm from "./JobForm.jsx";
import { getJobs } from "../services/api";

export default function HomeCompany() {
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [jobs, setJobs] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:3000/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err));
  }, []);

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]); 
  };
  useEffect(() => {
    if (location.state?.jobCreated) {
      setShowSuccess(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Cargar trabajos al montar
  useEffect(() => {
    getJobs()
      .then(setJobs)
      .catch((err) => console.error("Error cargando trabajos:", err));
  }, []);

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

          <button className="primaryBtn" onClick={() => setShowForm(true)}>
            Publicar Proyecto
          </button>
        </div>

        <div className="card2">
          <h2>Publicar puesto de Trabajo</h2>
          <p>
            Busca el perfil ideal y suma profesionales comprometidos a largo
            plazo.
          </p>
          <button className="primaryBtn">Publicar trabajo</button>
        </div>
      </div>

          <button className="primaryBtn">Publicar Proyecto</button>
        </div>
        <div className="card2">
          <h2>Publicar puesto de Trabajo</h2>
          <p>
            Busca el perfil ideal y suma profesionales comprometidos a largo
            plazo.
          </p>
          <button className="primaryBtn" onClick={() => setShowForm(true)}>
            Publicar trabajo
          </button>
        </div>
      </div>

      {/* Modal con formulario */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setShowForm(false)}
              style={{ float: "right" }}
            >
              ✖
            </button>
            <JobForm />
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="modal">
          <div className="modal-content">
            ✅ Trabajo subido con éxito
            <br />
            <button
              className="primaryBtn"
              onClick={() => setShowSuccess(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      <section className="job-postings">
        <h2>Puestos de Trabajo publicados</h2>
        <div className="jobs">
          {jobs.length === 0 ? (
            <p>No hay trabajos publicados aún.</p>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="job-card">
                <p>
                  <strong>{job.title}</strong>
                </p>
                <p>{job.companyName}</p>
                <p>
                  {job.location} · {job.salaryRange}
                </p>
                <p>{job.modality}</p>
              </div>
            ))
          )}
        </div>
      </section>

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


      {showForm && (
        <ProjectForm
          onClose={() => setShowForm(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}

    </div>
  );
}
