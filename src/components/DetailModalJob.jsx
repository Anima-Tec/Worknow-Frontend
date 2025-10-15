import React, { useState, useEffect } from "react";
import "./ApplyModal.css"; // reutilizamos el mismo estilo
import { getJobById } from "../services/api";
import {
  FaBuilding,
  FaGlobe,
  FaUserTie,
  FaRegClock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaFileAlt,
} from "react-icons/fa";

export default function DetailModal({ job, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!job?.id) return;
    const fetchData = async () => {
      try {
        const result = await getJobById(job.id);
        setData(result);
      } catch (err) {
        console.error("❌ Error cargando detalles del trabajo:", err);
      }
    };
    fetchData();
  }, [job?.id]);

  if (!data) return null;

  return (
    <div className="apply-modal-overlay">
      <div className="apply-modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2 className="apply-title">{data.title || "Título del puesto"}</h2>
        <p className="apply-company">
          Publicado por {data.company?.nombreEmpresa || "WorkNow S.A."}
        </p>

        <div className="apply-info-box">
          {/* ---------- Nombre de la empresa ---------- */}
          <div className="apply-info-item">
            <FaBuilding className="icon violet" />
            <strong>Nombre de la empresa:</strong>{" "}
            {data.company?.nombreEmpresa || "No especificado"}
          </div>

          {/* ---------- Website ---------- */}
          <div className="apply-info-item">
            <FaGlobe className="icon green" />
            <strong>Website de la empresa:</strong>{" "}
            {data.company?.sitioWeb ? (
              <a
                href={data.company.sitioWeb}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
              >
                {data.company.sitioWeb}
              </a>
            ) : (
              "No especificado"
            )}
          </div>

          {/* ---------- Título del puesto ---------- */}
          <div className="apply-info-item">
            <FaUserTie className="icon purple" />
            <strong>Título del puesto:</strong>{" "}
            {data.title || "No especificado"}
          </div>

          {/* ---------- Modalidad ---------- */}
          <div className="apply-info-item">
            <FaRegClock className="icon blue" />
            <strong>Modalidad de trabajo:</strong>{" "}
            {data.modality || "No especificada"}
          </div>

          {/* ---------- Ubicación ---------- */}
          <div className="apply-info-item">
            <FaMapMarkerAlt className="icon orange" />
            <strong>Ubicación:</strong> {data.location || "No especificada"}
          </div>

          {/* ---------- Rango salarial ---------- */}
          <div className="apply-info-item">
            <FaMoneyBillWave className="icon green" />
            <strong>Rango salarial:</strong>{" "}
            {data.remuneration ? `$${data.remuneration}` : "A convenir"}
          </div>

          {/* ---------- Descripción ---------- */}
          <div className="apply-info-item">
            <FaFileAlt className="icon gray" />
            <strong>Descripción del puesto:</strong>{" "}
            {data.description || "Sin descripción"}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button className="primaryBtn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
