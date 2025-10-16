import React, { useEffect, useState } from "react";
import "./DetailModalProject.css";
import { getProjectById } from "../services/api";
import {
  FaBuilding,
  FaGlobe,
  FaRegClock,
  FaMoneyBillWave,
  FaTools,
  FaFileAlt,
  FaCalendarAlt,
  FaClipboardCheck,
  FaBoxOpen,
} from "react-icons/fa";

export default function DetailModalProject({ project, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!project?.id) return;
    (async () => {
      try {
        const result = await getProjectById(project.id);
        setData(result);
      } catch (err) {
        console.error("❌ Error cargando detalles del proyecto:", err);
      }
    })();
  }, [project?.id]);

  if (!data) return null;

  // skills puede venir como JSON (array) o string
  const skillList = Array.isArray(data.skills)
    ? data.skills
    : typeof data.skills === "string"
    ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="apply-modal-overlay">
      <div className="apply-modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2 className="apply-title">{data.title || "Título del proyecto"}</h2>
        <p className="apply-company">
          Publicado por {data.company?.nombreEmpresa || "WorkNow"}
        </p>

        <div className="apply-info-box">
          <div className="apply-info-item">
            <FaBuilding className="icon violet" />
            <strong>Empresa:</strong>{" "}
            {data.company?.nombreEmpresa || "No especificada"}
          </div>

          <div className="apply-info-item">
            <FaGlobe className="icon green" />
            <strong>Sitio web:</strong>{" "}
            {data.company?.sitioWeb ? (
              <a
                href={data.company.sitioWeb}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.company.sitioWeb.replace(/^https?:\/\//, "")}
              </a>
            ) : (
              "No especificado"
            )}
          </div>

          <div className="apply-info-item">
            <FaRegClock className="icon purple" />
            <strong>Tiempo estimado:</strong>{" "}
            {data.duration || "No especificado"}
          </div>

          <div className="apply-info-item">
            <FaBoxOpen className="icon orange" />
            <strong>Formato de entrega:</strong>{" "}
            {data.deliveryFormat || "No especificado"}
          </div>

          <div className="apply-info-item">
            <FaClipboardCheck className="icon blue" />
            <strong>Criterios a evaluar:</strong>{" "}
            {data.evaluation || "No especificado"}
          </div>

          <div className="apply-info-item">
            <FaMoneyBillWave className="icon green" />
            <strong>Remuneración:</strong>{" "}
            {data.remuneration ? `$${data.remuneration}` : "A convenir"}
          </div>

          <div className="apply-info-item">
            <FaTools className="icon violet" />
            <strong>Habilidades requeridas:</strong>{" "}
            {skillList.length ? (
              <ul className="skills-list">
                {skillList.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            ) : (
              "No especificadas"
            )}
          </div>

          <div className="apply-info-item">
            <FaFileAlt className="icon gray" />
            <strong>Descripción:</strong>{" "}
            {data.description || "Sin descripción"}
          </div>

          <div className="apply-info-item">
            <FaCalendarAlt className="icon gray" />
            <strong>Publicado:</strong>{" "}
            {data.createdAt
              ? new Date(data.createdAt).toLocaleDateString("es-ES")
              : "-"}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
          <button className="primaryBtn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
