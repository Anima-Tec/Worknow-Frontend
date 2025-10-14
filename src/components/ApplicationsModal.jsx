import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import "./ApplicationsModal.css";

export default function ApplicationsModal({ open, onClose }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🟣 Cargar postulaciones de la empresa
  useEffect(() => {
    const loadApplications = async () => {
      if (!open) return;
      
      setLoading(true);
      setError("");
      
      try {
        console.log("🔍 Cargando postulaciones...");
        
        // Intentar cargar desde ambos endpoints
        const [applicationsRes, jobApplicationsRes] = await Promise.all([
          fetch("http://localhost:3000/api/applications/company/me", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch("http://localhost:3000/api/job-applications/company/me", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        ]);

        let applicationsData = [];
        let jobApplicationsData = [];

        // Procesar postulaciones a proyectos
        if (applicationsRes.ok) {
          applicationsData = await applicationsRes.json();
          console.log("📋 Postulaciones a proyectos:", applicationsData);
        } else {
          console.warn("⚠️ No se pudieron cargar postulaciones a proyectos:", applicationsRes.status);
        }

        // Procesar postulaciones a trabajos
        if (jobApplicationsRes.ok) {
          jobApplicationsData = await jobApplicationsRes.json();
          console.log("💼 Postulaciones a trabajos:", jobApplicationsData);
        } else {
          console.warn("⚠️ No se pudieron cargar postulaciones a trabajos:", jobApplicationsRes.status);
        }

        // Combinar y formatear todas las postulaciones
        const allApplications = [
          ...applicationsData.map(app => ({
            id: app.id,
            jobTitle: app.projectTitle || "Proyecto",
            applicantName: app.applicantName,
            applicantEmail: app.applicantEmail,
            createdAt: app.createdAt,
            status: app.status,
            type: "project"
          })),
          ...jobApplicationsData.map(app => ({
            id: app.id,
            jobTitle: app.jobTitle || "Trabajo",
            applicantName: app.applicantName,
            applicantEmail: app.applicantEmail,
            createdAt: app.createdAt,
            status: app.status,
            type: "job"
          }))
        ];

        console.log("📊 Total de postulaciones:", allApplications.length);
        setApplications(allApplications);

      } catch (err) {
        console.error("❌ Error cargando postulaciones:", err);
        setError("Error al cargar las postulaciones");
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [open]);

  if (!open) return null;

  // 🟣 Actualizar estado de postulación
  const updateStatus = async (id, newStatus, type) => {
    try {
      console.log(`🔄 Actualizando postulación ${id} a ${newStatus} (tipo: ${type})`);
      
      // Determinar el endpoint según el tipo
      const endpoint = type === "job" 
        ? `http://localhost:3000/api/job-applications/${id}`
        : `http://localhost:3000/api/applications/${id}`;

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
        console.log("✅ Estado actualizado correctamente");
      } else {
        const errorText = await res.text();
        console.error("❌ Error al actualizar estado:", res.status, errorText);
        setError("Error al actualizar el estado");
      }
    } catch (error) {
      console.error("❌ Error al actualizar estado:", error);
      setError("Error de conexión al actualizar estado");
    }
  };

  // 🟣 Formatear fecha
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("es-UY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  return (
    <div className="applications-modal-overlay">
      <div className="applications-modal">
        <div className="modal-header">
          <h2>Postulados</h2>
          <button onClick={onClose} className="close-btn">
            ✖
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            Cargando postulaciones...
          </div>
        )}

        {error && (
          <div style={{ 
            color: "red", 
            textAlign: "center", 
            padding: "10px",
            backgroundColor: "#ffe6e6",
            margin: "10px",
            borderRadius: "4px"
          }}>
            {error}
          </div>
        )}

        <table className="applications-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Puesto/Proyecto</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {!loading && applications.length > 0 ? (
              applications.map((a) => (
                <tr key={`${a.type}-${a.id}`}>
                  <td>
                    <span className={`type-badge ${a.type}`}>
                      {a.type === "job" ? "💼 Trabajo" : "🧩 Proyecto"}
                    </span>
                  </td>
                  <td>{a.jobTitle}</td>
                  <td>{a.applicantName || "No especificado"}</td>
                  <td>{a.applicantEmail || "No especificado"}</td>
                  <td>{formatDate(a.createdAt)}</td>
                  <td
                    className={`status ${a.status
                      ?.toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {a.status || "PENDIENTE"}
                  </td>
                  <td className="actions">
                    <FaCheckCircle
                      className="icon accept"
                      title="Aceptar"
                      onClick={() => updateStatus(a.id, "ACEPTADO", a.type)}
                    />
                    <FaTimesCircle
                      className="icon reject"
                      title="Rechazar"
                      onClick={() => updateStatus(a.id, "RECHAZADO", a.type)}
                    />
                    <FaHourglassHalf
                      className="icon review"
                      title="En revisión"
                      onClick={() => updateStatus(a.id, "PENDIENTE", a.type)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  {!loading ? "No hay postulaciones aún." : "Cargando..."}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="modal-footer">
          <small style={{ color: "#666" }}>
            Mostrando {applications.length} postulaciones
          </small>
        </div>
      </div>
    </div>
  );
}