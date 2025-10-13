import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import "./ApplicationsModal.css";

export default function ApplicationsModal({ open, onClose }) {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (open) {
      fetch("http://localhost:3000/api/applications/company/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setApplications(data);
          } else {
            console.error("Respuesta inesperada:", data);
          }
        })
        .catch((err) =>
          console.error("❌ Error cargando postulaciones:", err)
        );
    }
  }, [open]);

  if (!open) return null;

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:3000/api/applications/${id}`, {
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
      } else {
        console.error("Error actualizando estado");
      }
    } catch (error) {
      console.error("❌ Error al actualizar estado:", error);
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

        <table className="applications-table">
          <thead>
            <tr>
              <th>Proyecto</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? (
              applications.map((a) => (
                <tr key={a.id}>
                  <td>{a.projectTitle}</td>
                  <td>{a.applicantName}</td>
                  <td>{a.applicantEmail}</td>
                  <td>
                    {new Date(a.createdAt).toLocaleDateString("es-UY", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td
                    className={`status ${a.status
                      ?.toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {a.status}
                  </td>
                  <td className="actions">
                    <FaCheckCircle
                      className="icon accept"
                      title="Aceptar"
                      onClick={() => updateStatus(a.id, "Aceptado")}
                    />
                    <FaTimesCircle
                      className="icon reject"
                      title="Rechazar"
                      onClick={() => updateStatus(a.id, "Rechazado")}
                    />
                    <FaHourglassHalf
                      className="icon review"
                      title="En revisión"
                      onClick={() => updateStatus(a.id, "En revisión")}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "15px" }}>
                  No hay postulaciones aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}