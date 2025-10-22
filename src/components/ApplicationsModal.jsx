import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import "./ApplicationsModal.css";

const API_URL = import.meta.env.VITE_API_URL;

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
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No hay token de autenticación");
        setLoading(false);
        return;
      }

      const [projectRes, jobRes] = await Promise.all([
        fetch(`${API_URL}/api/applications/company/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/job-applications/company/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      let projectData = [];
      let jobData = [];

      if (projectRes.ok) {
        const result = await projectRes.json();
        projectData = (result?.data ?? result ?? []).map((app) => ({
          id: app.id,
          // NO usar app.id como fallback de projectId (eso confunde con la postulación)
          projectId: app.projectId ?? app.project?.id ?? null,
          jobId: null,
          title: app.projectTitle ?? app.project?.title ?? "Proyecto",
          applicantName: app.applicantName,
          applicantEmail: app.applicantEmail,
          createdAt: app.createdAt,
          status: (app.status ?? "PENDIENTE").toUpperCase(),
          type: "project",
        }));
      }

      if (jobRes.ok) {
        const result = await jobRes.json();
        jobData = (result?.data ?? result ?? []).map((app) => ({
          id: app.id,
          jobId: app.jobId ?? app.job?.id ?? null,
          projectId: null,
          title: app.jobTitle ?? app.job?.title ?? "Trabajo",
          applicantName: app.applicantName,
          applicantEmail: app.applicantEmail,
          createdAt: app.createdAt,
          status: (app.status ?? "PENDIENTE").toUpperCase(),
          type: "job",
        }));
      }

      const all = [...projectData, ...jobData];
      setApplications(all);
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
    setError(""); // limpiar error previo

    // Encontrar la postulación correcta según tipo e id (para evitar choques entre job/project)
    const selected = applications.find(
      (a) => a.id === id && a.type === type
    );

    if (!selected) {
      setError("Postulación no encontrada");
      return;
    }

    const currentStatus = selected.status?.toUpperCase();

    // 🔒 Bloquear solo esta si ya está cerrada
    if (["ACEPTADO", "RECHAZADO"].includes(currentStatus)) {
      const msg = `No se puede modificar esta postulación porque ya está ${currentStatus.toLowerCase()}`;
      setError(msg);
      console.warn(msg);
      return;
    }

    // 📌 Identificar tipo de oportunidad
    const opportunityKey = type === "job" ? "jobId" : "projectId";
    const opportunityId = selected[opportunityKey];

    // ✅ Si vas a aceptar, controlar duplicados del mismo tipo
    if (newStatus === "ACEPTADO") {
      const alreadyAccepted = applications.find(
        (a) =>
          a.id !== selected.id &&
          a.type === type &&
          a[opportunityKey] === opportunityId &&
          a.status === "ACEPTADO"
      );

      if (alreadyAccepted) {
        const msg = `Ya hay una postulación aceptada para este ${
          type === "job" ? "trabajo" : "proyecto"
        }`;
        setError(msg);
        console.warn(msg);
        return;
      }

      const confirmAccept = confirm(
        "¿Aceptar esta postulación?\n\nLas demás de esta oportunidad serán rechazadas automáticamente."
      );
      if (!confirmAccept) return;
    }

    // 🚀 Llamada al backend
    const endpoint =
      type === "job"
        ? `${API_URL}/api/job-applications/company/${id}/status`
        : `${API_URL}/api/applications/company/${id}/status`;

    const res = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("❌ Error backend:", res.status, txt);
      setError("Error al actualizar el estado");
      return;
    }

    // 🔁 Actualizar vista local sin recargar
    const updated = applications.map((a) => {
      if (a.id === id && a.type === type) return { ...a, status: newStatus };

      if (
        newStatus === "ACEPTADO" &&
        a.type === type &&
        a[opportunityKey] === opportunityId
      ) {
        // Rechazar automáticamente las demás del mismo proyecto/trabajo
        return { ...a, status: "RECHAZADO" };
      }

      return a;
    });

    setApplications(updated);
    setError(""); // limpiar todo
    console.log("✅ Estado actualizado correctamente");
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
          <button
            onClick={() => {
              setError("");
              onClose();
            }}
            className="close-btn"
          >
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
                          onClick={() => updateStatus(a.id, "ACEPTADO", a.type)}
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
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "20px" }}
                >
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
