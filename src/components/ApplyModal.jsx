import React, { useState, useEffect } from "react";
import "./ApplyModal.css";
import { sendApplication, getProjectById } from "../services/api";
import {
  FaMoneyBillWave,
  FaLaptopCode,
  FaClock,
  FaClipboardList,
  FaCheckCircle,
  FaFileAlt,
} from "react-icons/fa";

export default function ApplyModal({ project, onClose }) {
  const [projectData, setProjectData] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 🔹 Cargar datos del proyecto seleccionado
  useEffect(() => {
    if (project?.id) {
      console.log("📦 Cargando datos del proyecto ID:", project.id);
      getProjectById(project.id)
        .then((data) => {
          console.log("✅ Proyecto cargado:", data);
          setProjectData(data);
        })
        .catch((err) => console.error("❌ Error cargando proyecto:", err));
    }
  }, [project]);

  // 🔹 Manejo de inputs
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🔹 Envío de postulación
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🧩 handleSubmit ejecutado");
    console.log("Datos enviados:", formData, "para projectId:", project.id);

    if (!formData.name || !formData.email) {
      alert("Por favor, completá tu nombre y correo electrónico.");
      return;
    }

    setLoading(true);
    try {
      const response = await sendApplication({
        projectId: project.id,
        name: formData.name,
        email: formData.email,
      });

      console.log("✅ Postulación enviada correctamente:", response);
      setSuccess(true);
    } catch (error) {
      console.error("❌ Error enviando postulación:", error);
      alert("Error al enviar la postulación. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Si no hay datos, no renderiza
  if (!projectData) return null;

  return (
    <div className="apply-modal-overlay">
      <div className="apply-modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        {!success ? (
          <>
            {/* ---------- HEADER ---------- */}
            <h2 className="apply-title">{projectData.title}</h2>
            <p className="apply-company">
              Publicado por {projectData.company?.name || "WorkNow"}
            </p>

            {/* ---------- INFO GENERAL ---------- */}
            <div className="apply-info-box">
              <div className="apply-info-item">
                <FaClock className="icon violet" />
                <strong>Duración estimada:</strong>{" "}
                {projectData.duration || "No especificada"}
              </div>

              <div className="apply-info-item">
                <FaMoneyBillWave className="icon green" />
                <strong>Remuneración:</strong>{" "}
                {projectData.remuneration || "A convenir"}
              </div>

              <div className="apply-info-item">
                <FaClipboardList className="icon blue" />
                <strong>Modalidad:</strong>{" "}
                {projectData.modality || "No especificada"}
              </div>

              <div className="apply-info-item">
                <FaCheckCircle className="icon orange" />
                <strong>Criterios a evaluar:</strong>{" "}
                {projectData.evaluationCriteria || "No definidos"}
              </div>

              <div className="apply-info-item">
                <FaLaptopCode className="icon purple" />
                <strong>Habilidades requeridas:</strong>{" "}
                {projectData.skills || "No especificadas"}
              </div>

              <div className="apply-info-item">
                <FaFileAlt className="icon gray" />
                <strong>Descripción:</strong>{" "}
                {projectData.description || "Sin descripción"}
              </div>
            </div>

            {/* ---------- FORMULARIO ---------- */}
            <div className="apply-form-container">
              <h3 className="apply-subtitle">Completá tu postulación</h3>
              <form className="apply-form" onSubmit={handleSubmit}>
                <div className="input-row">
                  <input
                    type="text"
                    name="name"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Tu correo electrónico"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="apply-submit-btn"
                >
                  {loading ? "Enviando..." : "Enviar postulación"}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="apply-success">
            <h3>✅ ¡Postulación enviada!</h3>
            <p>La empresa recibirá tu información y podrá contactarte pronto.</p>
            <button className="primaryBtn" onClick={onClose}>
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
