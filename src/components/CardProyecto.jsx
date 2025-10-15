import { useState } from "react";
import "./CardProyecto.css";
import ApplyModal from "./ApplyModal";
import DetailModalProject from "./DetailModalProject"; // 🟣 nuevo modal de detalle

export default function CardProyecto({
  id,
  title,
  description,
  skills,
  duration,
  modality,
  remuneration,
  company,
  isCompanyView = false, // 🟣 detecta si es vista empresa
}) {
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false); // 🟣 nuevo estado

  // 🟣 Inicial segura del nombre de empresa
  const companyInitial =
    typeof company === "string" && company.length > 0
      ? company.charAt(0).toUpperCase()
      : "W";

  // 🟣 Formateo de salario
  const formatRemuneration = (value) => {
    if (!value || value === "0" || value === "null") return "A convenir";
    return `$${value}`;
  };

  return (
    <>
      <div className="project-card">
        {/* ---------- HEADER ---------- */}
        <div className="project-header">
          <div className="avatar">{companyInitial}</div>
          <span className="project-type">{modality || "Freelance"}</span>
        </div>

        {/* ---------- TITULO ---------- */}
        <h4 className="project-title">{title || "Título del proyecto"}</h4>

        {/* ---------- DETALLES ---------- */}
        <div className="project-details">
          <span>
            <strong>Rango salarial:</strong> {formatRemuneration(remuneration)}
          </span>
          <span>
            <strong>Duración:</strong> {duration || "No especificada"}
          </span>
          <span>
            <strong>Skills:</strong> {skills || "No especificadas"}
          </span>
        </div>

        {/* ---------- BOTONES ---------- */}
        <div className="project-actions">
          <button
            className="secondary-btn"
            onClick={() => setShowDetail(true)}
          >
            Ver detalle
          </button>

          {!isCompanyView && (
            <button
              className="primary-btn"
              onClick={() => setShowModal(true)}
            >
              Postularse
            </button>
          )}
        </div>
      </div>

      {/* ---------- MODAL DE POSTULACIÓN ---------- */}
      {showModal && (
        <ApplyModal
          project={{ id }}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* ---------- MODAL DE DETALLE ---------- */}
      {showDetail && (
        <DetailModalProject
          project={{ id }}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
}
