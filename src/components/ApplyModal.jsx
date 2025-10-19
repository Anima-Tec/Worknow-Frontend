import React, { useState, useEffect } from "react";
import "./ApplyModal.css";
import {
  sendApplication,
  applyToJob,
  getProjectById,
  getJobById,
} from "../services/api";
import {
  FaMoneyBillWave,
  FaLaptopCode,
  FaClock,
  FaClipboardList,
  FaCheckCircle,
  FaFileAlt,
} from "react-icons/fa";

export default function ApplyModal({ project, job, onClose }) {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverMsg, setServerMsg] = useState(""); // 👈 nuevo estado para mensaje
  const [errorMsg, setErrorMsg] = useState("");

  const isJob = Boolean(job);
  const itemId = isJob ? job?.id : project?.id;

  // 🔹 Cargar info del trabajo/proyecto
  useEffect(() => {
    if (!itemId) return;
    const fetchData = async () => {
      try {
        const result = isJob
          ? await getJobById(itemId)
          : await getProjectById(itemId);
        setData(result);
      } catch (err) {
        console.error("❌ Error cargando datos:", err);
      }
    };
    fetchData();
  }, [itemId, isJob]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🔹 Envío de postulación
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg("");
    setErrorMsg("");

    if (!formData.name || !formData.email) {
      alert("Por favor completá tu nombre y correo electrónico.");
      return;
    }

    setLoading(true);
    try {
      let response;

      if (isJob) {
        response = await applyToJob(itemId, {
          name: formData.name,
          email: formData.email,
        });
      } else {
        response = await sendApplication({
          projectId: itemId,
          name: formData.name,
          email: formData.email,
        });
      }

      console.log("📦 Respuesta del backend:", response);

      // 🧩 Evitar mostrar objetos directamente
      const msg =
        typeof response === "string"
          ? response
          : response?.message || "¡Postulación enviada correctamente!";

      setServerMsg(msg);
      setSuccess(true);
    } catch (error) {
      console.error("❌ Error enviando postulación:", error);
      setErrorMsg("Error al enviar la postulación.");
    } finally {
      setLoading(false);
    }
  };

  if (!data) return null;

  return (
    <div className="apply-modal-overlay">
      <div className="apply-modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        {!success ? (
          <>
            <h2 className="apply-title">{data.title}</h2>
            <p className="apply-company">
              Publicado por {data.company?.nombreEmpresa || "WorkNow"}
            </p>

            <div className="apply-info-box">
              {isJob ? (
                <>
                  <div className="apply-info-item">
                    <FaClock className="icon violet" />
                    <strong>Modalidad:</strong> {data.modality || "No especificada"}
                  </div>
                  <div className="apply-info-item">
                    <FaMoneyBillWave className="icon green" />
                    <strong>Remuneración:</strong> {data.remuneration || "A convenir"}
                  </div>
                  <div className="apply-info-item">
                    <FaLaptopCode className="icon purple" />
                    <strong>Habilidades requeridas:</strong>{" "}
                    {data.skills || "No especificadas"}
                  </div>
                  <div className="apply-info-item">
                    <FaClipboardList className="icon blue" />
                    <strong>Ubicación:</strong> {data.location || "No especificada"}
                  </div>
                  <div className="apply-info-item">
                    <FaFileAlt className="icon gray" />
                    <strong>Descripción:</strong> {data.description || "Sin descripción"}
                  </div>
                </>
              ) : (
                <>
                  <div className="apply-info-item">
                    <FaClock className="icon violet" />
                    <strong>Duración estimada:</strong> {data.duration || "No especificada"}
                  </div>
                  <div className="apply-info-item">
                    <FaMoneyBillWave className="icon green" />
                    <strong>Remuneración:</strong> {data.remuneration || "A convenir"}
                  </div>
                  <div className="apply-info-item">
                    <FaClipboardList className="icon blue" />
                    <strong>Modalidad:</strong> {data.modality || "No especificada"}
                  </div>
                  <div className="apply-info-item">
                    <FaCheckCircle className="icon orange" />
                    <strong>Criterios a evaluar:</strong>{" "}
                    {data.evaluationCriteria || "No definidos"}
                  </div>
                  <div className="apply-info-item">
                  <FaLaptopCode className="icon purple" />
                  <strong>Habilidades requeridas:</strong>{" "}
                  {String(data.skills || "No especificadas")}
                </div>

                <div className="apply-info-item">
                  <FaFileAlt className="icon gray" />
                  <strong>Descripción:</strong>{" "}
                  {String(data.description || "Sin descripción")}
                </div>
                                
                </>
              )}
            </div>

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

              {errorMsg && <p className="error-msg">{errorMsg}</p>}
            </div>
          </>
        ) : (
          <div className="apply-success">
  <h3>✅ ¡Postulación enviada!</h3>
  <p>
    {typeof serverMsg === "string"
      ? serverMsg
      : "Tu postulación fue enviada correctamente."}
  </p>
  <button className="primaryBtn" onClick={onClose}>
    Cerrar
  </button>
</div>
        )}
      </div>
    </div>
  );
}
