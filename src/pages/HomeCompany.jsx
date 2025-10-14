import React, { useState, useEffect } from "react";
import "./HomeCompany.css";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosContacts } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { useLocation } from "react-router-dom";
import { getJobs } from "../services/api";
import ProjectForm from "./ProjectForm";
import JobForm from "./JobForm.jsx";
import CardProyecto from "../components/CardProyecto";
import CardTrabajo from "../components/CardTrabajo.jsx";
import ApplicationsModal from "../components/ApplicationsModal";
import Footer from "../components/Footer";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export default function HomeCompany() {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const location = useLocation();
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Obtener proyectos del backend
// ✅ Cargar solo los proyectos de la empresa logueada
useEffect(() => {
  async function fetchCompanyProjects() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/projects/company/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("❌ Error del backend al traer proyectos:", res.status);
        setProjects([]);
        return;
      }

      const data = await res.json();
      console.log("🏢 Proyectos de la empresa:", data);
      setProjects(data);
    } catch (err) {
      console.error("❌ Error cargando proyectos de empresa:", err);
      setProjects([]);
    }
  }

  fetchCompanyProjects();
}, []);


  // 🔹 Obtener trabajos del backend
  useEffect(() => {
    getJobs()
      .then(setJobs)
      .catch((err) => console.error("❌ Error cargando trabajos:", err));
  }, []);

  // 🔹 Cargar postulaciones cuando abrís el modal
  useEffect(() => {
    if (!showApplications) return;

    async function fetchApplications() {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const companyId = user?.id;

        if (!token || !companyId) {
          console.warn("⚠️ No hay token o ID de empresa guardado.");
          setApplications([]);
          return;
        }

        const res = await fetch(
          `http://localhost:3000/api/applications/company/${companyId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("📨 Status respuesta:", res.status);

        if (!res.ok) {
          const text = await res.text();
          console.error("⚠️ Error del backend:", res.status, text);
          setApplications([]);
          return;
        }

        const data = await res.json();
        console.log("📦 Postulaciones cargadas:", data);
        setApplications(data);
      } catch (err) {
        console.error("❌ Error cargando postulaciones:", err);
        setApplications([]);
      }
    }

    fetchApplications();
  }, [showApplications]);

  // 🔹 Mostrar modal de éxito tras publicar
  useEffect(() => {
    if (location.state?.jobCreated) {
      setShowSuccess(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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

            {/* ✅ Botón de postulados funcional - SOLO ESTO CAMBIÉ */}
            <li
              className="nav-item"
              onClick={() => {
                console.log("✅ Abriendo modal de postulaciones");
                setShowApplications(true);
              }}
              style={{ cursor: "pointer" }}
            >
              <IoIosContacts />
              <span>Postulados</span>
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
          <button className="primaryBtn" onClick={() => setShowProjectForm(true)}>
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
            <button className="close-btn" onClick={() => setShowJobForm(false)}>
              ✖
            </button>
            <JobForm onJobCreated={() => setShowSuccess(true)} />
          </div>
        </div>
      )}

      {showProjectForm && (
  <div className="modal">
    <div className="modal-content">
      <button className="close-btn" onClick={() => setShowProjectForm(false)}>
        ✖
      </button>
      <ProjectForm
        onClose={() => setShowProjectForm(false)} // ✅ Agregado
        onProjectCreated={(newProject) => {
          setProjects((prev) => [newProject, ...prev]); // opcional: actualiza lista
          setShowSuccess(true);
        }}
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

      {/* ✅ Modal Postulados - SOLO ESTO CAMBIÉ */}
      {showApplications && (
        <ApplicationsModal
          open={showApplications}
          onClose={() => setShowApplications(false)}
        />
      )}

      {/* ---------- PROYECTOS ---------- */}
      <section className="freelancer-postings">
        <div className="section-header">
          <h2>Proyectos publicados</h2>
          {!showAllProjects && projects.length > 3 && (
            <button className="view-more-btn" onClick={() => setShowAllProjects(true)}>
              Ver todo →
            </button>
          )}
        </div>

        {!showAllProjects ? (
          <div id="carouselProjects" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {Array.isArray(projects) && projects.map((p, index) => (
  <div
    className={`carousel-item ${index === 0 ? "active" : ""}`}
    key={p.id || index} // Usa index como fallback si no hay id
  >
    <div className="carousel-card-wrapper">
      <CardProyecto {...p} company={p.company?.email} />
    </div>
  </div>
))}
            </div>
          </div>
        ) : (
          <div className="freelancer-list">
            {projects.map((p) => (
              <CardProyecto key={p.id} {...p} company={p.company?.email} />
            ))}
            <button className="view-more-btn back-btn" onClick={() => setShowAllProjects(false)}>
              ← Volver
            </button>
          </div>
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
      <Footer />
    </div>
  );
}