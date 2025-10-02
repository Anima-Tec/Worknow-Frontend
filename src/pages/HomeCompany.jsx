import React, { useState, useEffect } from "react";
import "./HomeCompany.css";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosContacts, IoIosNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import ContactCompany from "./ContactCompany";
import { Link } from "react-router-dom";
import ProjectForm from "./ProjectForm"; // 👈 importamos el form
import CardProyecto from "../components/CardProyecto";


export default function HomeCompany() {
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err));
  }, []);

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]); // agrega el nuevo arriba
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
