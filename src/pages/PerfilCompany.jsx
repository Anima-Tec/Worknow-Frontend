import React, { useState, useEffect } from "react";
import "./HomeCompany.css";
import "./PerfilCompany.css";
import { AiOutlineHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import CardTrabajo from "../components/CardTrabajo";
import CardProyecto from "../components/CardProyecto";
import { getJobs } from "../services/api";
import Footer from "../components/Footer";

function PerfilCompany() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [jobs, setJobs] = useState([]);

  // 🔹 Cargar proyectos
  useEffect(() => {
    fetch("http://localhost:3000/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err));
  }, []);

  // 🔹 Cargar trabajos
  useEffect(() => {
    getJobs()
      .then(setJobs)
      .catch((err) => console.error("Error cargando trabajos:", err));
  }, []);

  return (
    <div className="perfil-company">
      {/* 🔹 HEADER */}
      <header className="header">
        <div className="header-left">
          <h1 className="logo">
            work<span>now</span>
          </h1>
          <p className="link">https://WorkNow.com</p>
        </div>
        <nav className="nav">
          <ul>
            <li onClick={() => navigate("/home/company")}>
              <AiOutlineHome />
              <span>Home</span>
            </li>
            <li onClick={() => navigate("/PerfilCompany")}>
              <CgProfile />
              <span>Perfil</span>
            </li>
          </ul>
        </nav>
      </header>

      {/* 🔹 CONTENIDO PRINCIPAL */}
      <main className="main-content">
        <div className="frame">
          {/* COLUMNA IZQUIERDA */}
          <div className="left-column">
            <section className="company-profile">
              <h2>Perfil de la Empresa</h2>
              <p>
                WorkNow es una plataforma creada para conectar talento con oportunidades en tiempo real.
                Nuestro objetivo es simplificar la forma en que las personas acceden a trabajos y las empresas
                encuentran a los colaboradores que necesitan.
              </p>
              <p>
                Queremos transformar el acceso al trabajo, construyendo herramientas que hagan más simple,
                rápida y transparente la conexión con el empleo.
              </p>
              <p>
                Creemos que el futuro del empleo está en procesos ágiles y sin burocracia, con soluciones digitales
                integradas y ecosistemas inclusivos. Nuestra meta es clara: hacer que encontrar y ofrecer trabajo sea
                tan fácil como conectarse a internet.
              </p>
            </section>

            <section className="company-info">
              <p><strong>Fundada:</strong> Junio 01, 2025</p>
              <p><strong>Empleados:</strong> 200+</p>
              <p><strong>Ubicación:</strong> 1 país</p>
              <p><strong>Industria:</strong> Tecnología / Software</p>
            </section>

            <section className="contact-section">
              <h3>Contactos</h3>
              <ul>
                <li><a href="https://twitter.com/WorkNow" target="_blank" rel="noreferrer">twitter.com/WorkNow</a></li>
                <li><a href="https://facebook.com/WorkNow" target="_blank" rel="noreferrer">facebook.com/WorkNow</a></li>
                <li><a href="https://linkedin.com/company/WorkNow" target="_blank" rel="noreferrer">linkedin.com/company/WorkNow</a></li>
                <li><a href="mailto:WorkNow@gmail.com">WorkNow@gmail.com</a></li>
              </ul>
            </section>

            <section className="photos-section">
              <h3>Working at WorkNow</h3>
              <div className="photo-grid">
                <img src="/images/work1.jpg" alt="Oficina 1" />
                <img src="/images/work2.jpg" alt="Oficina 2" />
                <img src="/images/work3.jpg" alt="Oficina 3" />
              </div>
            </section>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="right-column">
            <section className="benefits-section">
              <h3>Beneficios</h3>
              <div className="benefit-card">
                <h4>Salud Integral</h4>
                <p>Cobertura de salud completa y programas de bienestar físico y mental. Tu salud es prioridad.</p>
              </div>
              <div className="benefit-card">
                <h4>Vacaciones Flexibles</h4>
                <p>Tiempo libre ilimitado para descansar y disfrutar de lo que más te gusta.</p>
              </div>
              <div className="benefit-card">
                <h4>Aprendizaje y Crecimiento</h4>
                <p>Acceso a cursos, talleres y conferencias para seguir creciendo profesionalmente.</p>
              </div>
              <div className="benefit-card">
                <h4>Encuentros de Equipo</h4>
                <p>Reuniones y actividades que fortalecen el trabajo en equipo y la planificación a futuro.</p>
              </div>
              <div className="benefit-card">
                <h4>Trabajo Remoto</h4>
                <p>Flexibilidad para trabajar desde donde quieras, con equipos en todo el mundo.</p>
              </div>
              <div className="benefit-card">
                <h4>Bonos de Productividad</h4>
                <p>Reconocimientos y premios por los logros y el desempeño excepcional.</p>
              </div>
            </section>
          </div>
        </div>

        {/* 🔹 SECCIONES ABAJO DEL TODO COMO CARRUSEL */}
        <div className="job-and-projects">
          <section className="job-postings">
            <h2>Puestos de Trabajo publicados</h2>
            <div className="carousel-container">
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

          <section className="freelancer-postings">
            <h2>Proyectos publicados</h2>
            <div className="carousel-container">
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
      </main>
      <Footer />
    </div>
  );
}

export default PerfilCompany;
