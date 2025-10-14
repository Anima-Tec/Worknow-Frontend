import React, { useState } from "react";
import "./CardTrabajo.css";
import ApplyModal from "./ApplyModal"; // ✅ usamos el mismo modal

export default function CardTrabajo({
  id,
  title,
  company,
  area,
  jobType,
  contractType,
  modality,
  location,
  salary,
  projectUrl,
  isPreview = false,
}) {
  const [showModal, setShowModal] = useState(false);

  // 🟣 Normalizar el nombre de la empresa
  const companyName =
    typeof company === "string"
      ? company
      : company?.nombreEmpresa || company?.email || "WorkNow";

  // 🟣 Obtener inicial segura para el logo
  const companyInitial =
    typeof companyName === "string" && companyName.length > 0
      ? companyName.charAt(0).toUpperCase()
      : "W";

  if (!title && !companyName) {
    console.warn("⚠️ CardTrabajo recibió datos vacíos o inválidos");
    return null;
  }

  // 🟣 Clases según tipo de trabajo
  const normalizedType = jobType?.toLowerCase().trim() || "";
  const jobTypeClass =
    normalizedType === "full-time"
      ? "full-time"
      : normalizedType === "part-time"
      ? "part-time"
      : "";

  // 🟣 Formato de salario
  const formatSalary = (value) => {
    if (!value || value === "null" || value === "0") return "A convenir";
    return `$${value}`;
  };

  return (
    <>
      <div className={`card-trabajo ${isPreview ? "preview-mode" : ""}`}>
        {/* ---------- HEADER SUPERIOR ---------- */}
        <div className="job-banner">
          <div className="banner-text">Empowering people through technology</div>
          <div className="logo-circle">{companyInitial}</div>
        </div>

        {/* ---------- CONTENIDO PRINCIPAL ---------- */}
        <div className="job-content">
          <div className="job-header-column">
            <h3 className="job-title">{title || "Título del puesto"}</h3>
            <div className="job-type-container">
              {jobType && (
                <span className={`job-type ${jobTypeClass}`}>{jobType}</span>
              )}
            </div>
          </div>

          <p className="job-company">{companyName}</p>

          {/* ---------- INFO RESUMEN ---------- */}
          <ul className="job-summary">
            <li>
              <strong>Salario:</strong> {formatSalary(salary)}
            </li>
            <li>
              <strong>Contrato:</strong> {contractType || "Contrato indefinido"}
            </li>
            <li>
              <strong>Ubicación:</strong>{" "}
              {location || "Ubicación no especificada"}
            </li>
            <li>
              <strong>Área:</strong> {area || "General"}
            </li>
          </ul>

          {/* ---------- LINK DE PROYECTO (OPCIONAL) ---------- */}
          {projectUrl && (
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              Ver proyecto asociado
            </a>
          )}

          {/* ---------- BOTONES ---------- */}
          <div className="job-actions">
            <button
              className="secondary-btn"
              onClick={() => console.log(`🟣 Ver detalles de ${title}`)}
            >
              Ver detalles
            </button>

            <button
              className="primary-btn"
              onClick={() => {
                console.log(`🟢 Postular a ${title}`);
                setShowModal(true);
              }}
            >
              Postular
            </button>
          </div>
        </div>
      </div>

      {/* ---------- MODAL DE POSTULACIÓN ---------- */}
      {showModal && (
        <ApplyModal
          job={{ id, title }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
