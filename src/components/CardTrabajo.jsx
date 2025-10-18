import React, { useState } from "react";
import "./CardTrabajo.css";
import ApplyModal from "./ApplyModal";
import DetailModal from "./DetailModalJob";

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
  remuneration, // ✅ añadimos compatibilidad
  projectUrl,
  isPreview = false,
  isCompanyView = false, // 🟣 prop para detectar si es vista empresa
  isFormPreview = false, // 🟣 prop para detectar si es vista previa de formulario
}) {
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false); // 🟣 nuevo estado para el detalle

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

  // 🟣 Formato de salario (funciona con salary o remuneration)
  const formatSalary = (value) => {
    if (!value || value === "null" || value === "0") return "A convenir";
    return `$${value}`;
  };

  // ✅ Usa el valor correcto según cuál esté disponible
  const displaySalary = salary || remuneration || null;

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
              <strong>Salario:</strong> {formatSalary(displaySalary)}
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
          {!isFormPreview && (
            <div className="job-actions">
              <button
                className="secondary-btn"
                onClick={() => setShowDetail(true)}
              >
                Ver detalle
              </button>
              {!isCompanyView && (
                <button
                  className="primary-btn"
                  onClick={() => {
                    console.log(`🟢 Postular a ${title}`);
                    setShowModal(true);
                  }}
                >
                  Postularse
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ---------- MODAL DE POSTULACIÓN ---------- */}
      {showModal && !isCompanyView && (
        <ApplyModal job={{ id, title }} onClose={() => setShowModal(false)} />
      )}

      {/* ---------- MODAL DE DETALLE ---------- */}
      {showDetail && (
        <DetailModal job={{ id, title }} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
}
