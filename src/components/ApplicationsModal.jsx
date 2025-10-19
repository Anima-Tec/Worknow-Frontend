import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import "./ApplicationsModal.css";

export default function ApplicationsModal({ open, onClose }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ====================== 🔹 Cargar postulaciones ======================
  const loadApplications = async () => {
    if (!open) return;

    setLoading(true);
    setError("");

    try {
      console.log("🔍 Cargando postulaciones...");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No hay token de autenticación");
        return;
      }

      const [projectRes, jobRes] = await Promise.all([
        fetch("http://localhost:3000/api/applications/company/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:3000/api/job-applications/company/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      let projectData = [];
      let jobData = [];

      if (projectRes.ok) {
        const result = await projectRes.json();
        projectData = result.data || result || [];
        console.log("📋 Postulaciones a proyectos:", projectData);
      }

      if (jobRes.ok) {
        const result = await jobRes.json();
        jobData = result.data || result || [];
        console.log("💼 Postulaciones a trabajos:", jobData);
      }

      // 🔹 Combinar ambas listas con identificación por tipo
      const allApplications = [
        ...(Array.isArray(projectData) ? projectData : []).map((app) => ({
          id: app.id,
          projectId: app.projectId,
          jobId: app.jobId || null,
          title: app.projectTitle || "Proyecto",
          applicantName: app.applicantName,
          applicantEmail: app.applicantEmail,
          createdAt: app.createdAt,
          status: app.status,
          type: "project",
        })),
        ...(Array.isArray(jobData) ? jobData : []).map((app) => ({
          id: app.id,
          jobId: app.jobId,
          projectId: app.projectId || null,
          title: app.jobTitle || "Trabajo",
          applicantName: app.applicantName,
          applicantEmail: app.applicantEmail,
          createdAt: app.createdAt,
          status: app.status,
          type: "job",
        })),
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

  // ====================== 🔹 Actualizar estado ======================
  const updateStatus = async (id, newStatus, type) => {
    try {
      const selectedApplication = applications.find((a) => a.id === id);
      if (!selectedApplication) {
        setError("Postulación no encontrada");
        return;
      }

      const currentStatus = selectedApplication.status;

      // Bloquear cambios en postulaciones cerradas
      if (["ACEPTADO", "RECHAZADO"].includes(currentStatus)) {
        const msg = `No se puede modificar una postulación ya ${currentStatus.toLowerCase()}`;
        console.warn("⚠️", msg);
        setError(msg);
        return;
      }

      // Solo permitir cambios si está pendiente
      if (currentStatus === "PENDIENTE") {
        if (newStatus === "ACEPTADO") {
          // 🔍 Determinar si ya hay otra postulación aceptada en la misma oportunidad
          const opportunityKey =
            selectedApplication.type === "job" ? "jobId" : "projectId";
          const opportunityId = selectedApplication[opportunityKey];

          const alreadyAccepted = applications.find(
            (a) =>
              a.status === "ACEPTADO" &&
              a[opportunityKey] === opportunityId &&
              a.type === selectedApplication.type
          );

          if (alreadyAccepted) {
            const msg = `Ya hay una postulación aceptada para este ${
              selectedApplication.type === "job" ? "trabajo" : "proyecto"
            }`;
            console.warn("⚠️", msg);
            setError(msg);
            return;
          }

          const confirmAccept = confirm(
            "¿Estás seguro de aceptar esta postulación?\n\nTodas las demás postulaciones a esta oportunidad serán automáticamente rechazadas."
          );
          if (!confirmAccept) return;
        }

        console.log(`🔄 Actualizando postulación ${id} a ${newStatus} (${type})`);

        const endpoint =
          type === "job"
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
          console.log("✅ Estado actualizado correctamente");
          setError("");
          loadApplications();
        } else {
          const errorText = await res.text();
          console.error("❌ Error al actualizar estado:", res.status, errorText);
          setError("Error al actualizar el estado");
        }
      }
    } catch (error) {
      console.error("❌ Error al actualizar estado:", error);
      setError("Error de conexión al actualizar estado");
    }
  };

  // ====================== 🔹 Utilidad: formatear fecha ======================
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

  if (!open) return null;

  // ====================== 🔹 Render ======================
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
          <div
            style={{
              color: "red",
              textAlign: "center",
              padding: "10px",
              backgroundColor: "#ffe6e6",
              margin: "10px",
              borderRadius: "4px",
            }}
          >
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
                  <td>{a.title}</td>
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
                    {a.status === "PENDIENTE" ? (
                      <>
                        <FaCheckCircle
                          className="icon accept"
                          title="Aceptar"
                          onClick={() =>
                            updateStatus(a.id, "ACEPTADO", a.type)
                          }
                        />
                        <FaTimesCircle
                          className="icon reject"
                          title="Rechazar"
                          onClick={() =>
                            updateStatus(a.id, "RECHAZADO", a.type)
                          }
                        />
                        <FaHourglassHalf
                          className="icon review"
                          title="En revisión"
                          onClick={() =>
                            updateStatus(a.id, "PENDIENTE", a.type)
                          }
                        />
                      </>
                    ) : (
                      <span
                        className={`status-badge ${a.status.toLowerCase()}`}
                      >
                        {a.status === "ACEPTADO"
                          ? "✅ Aceptado"
                          : "❌ Rechazado"}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  {!loading
                    ? "No hay postulaciones aún."
                    : "Cargando..."}
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
