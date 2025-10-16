import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import "./ApplicationsModal.css";

export default function ApplicationsModal({ open, onClose }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🟣 Cargar postulaciones de la empresa
  const loadApplications = async () => {
    if (!open) return;

    setLoading(true);
    setError("");

    try {
      console.log("🔍 Cargando postulaciones...");

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

      if (applicationsRes.ok) {
        applicationsData = await applicationsRes.json();
        console.log("📋 Postulaciones a proyectos:", applicationsData);
      }

      if (jobApplicationsRes.ok) {
        jobApplicationsData = await jobApplicationsRes.json();
        console.log("💼 Postulaciones a trabajos:", jobApplicationsData);
      }

      const allApplications = [
        ...applicationsData.map(app => ({
          id: app.id,
          jobId: app.jobId,
          jobTitle: app.projectTitle || "Proyecto",
          applicantName: app.applicantName,
          applicantEmail: app.applicantEmail,
          createdAt: app.createdAt,
          status: app.status,
          type: "project"
        })),
        ...jobApplicationsData.map(app => ({
          id: app.id,
          jobId: app.jobId,
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

  useEffect(() => {
    loadApplications();
  }, [open]);

  if (!open) return null;

  // Actualizar estado de postulación
  const updateStatus = async (id, newStatus, type) => {
    try {
      const selectedApplication = applications.find(a => a.id === id);

      if (!selectedApplication) {
        setError("Postulación no encontrada");
        return;
      }

      const jobId = selectedApplication.jobId;
      const currentStatus = selectedApplication.status;

      // Si está aceptada, no se puede modificar
      if (currentStatus === "ACEPTADO") {
        console.warn("⚠️ No se puede modificar una postulación ya aceptada");
        setError("No se puede modificar una postulación ya aceptada");
        return;
      } // Si está rechazada, no se puede modificar
      else if (currentStatus === "RECHAZADO") {
        console.warn("⚠️ No se puede modificar una postulación ya rechazada");
        setError("No se puede modificar una postulación ya rechazada");
        return;
      }

      // Si se quiere aceptar, verificar que no haya otra ya aceptada para ese jobId
      if (newStatus === "ACEPTADO") {
        const alreadyAccepted = applications.find(
          a => a.status === "ACEPTADO" && a.jobId === jobId
        );

        if (alreadyAccepted && alreadyAccepted.id !== id) {
          console.warn("⚠️ Ya hay una postulación aceptada para este trabajo");
          setError("Ya hay una postulación aceptada para este trabajo");
          return;
        }
      }

      console.log(`🔄 Actualizando postulación ${id} a ${newStatus} (tipo: ${type})`);

      const endpoint = type === "job"
        ? `http://localhost:3000/api/job-applications/company/${id}/status`
        : `http://localhost:3000/api/applications/company/${id}/status`;

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        loadApplications(); // Recargar postulaciones
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