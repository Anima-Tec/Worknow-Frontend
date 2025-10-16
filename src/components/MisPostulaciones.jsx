import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./MisPostulaciones.css";

export default function MisPostulaciones() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ✅ Normalizar estados
  const normalizeStatus = (status) => {
    if (!status) return "PENDIENTE";
    const s = status.toString().toLowerCase();
    if (s.includes("aceptado") || s.includes("accepted")) return "ACEPTADO";
    if (s.includes("rechazado") || s.includes("rejected")) return "RECHAZADO";
    if (s.includes("hecho") || s.includes("done")) return "HECHO";
    if (s.includes("no_hecho") || s.includes("not_done")) return "NO_HECHO";
    if (s.includes("pendiente") || s.includes("pending")) return "PENDIENTE";
    return "PENDIENTE";
  };

  // ✅ Obtener badge según estado normalizado
  const getEstadoBadge = (estado) => {
    const estados = {
      PENDIENTE: { class: "estado-pendiente", text: "Pendiente" },
      ACEPTADO: { class: "estado-revision", text: "Aceptado" },
      RECHAZADO: { class: "estado-rechazado", text: "Rechazado" },
      HECHO: { class: "estado-contratado", text: "Completado" },
      NO_HECHO: { class: "estado-rechazado", text: "No Completado" },
    };
    return estados[estado] || estados.PENDIENTE;
  };

  // ✅ Cargar postulaciones de proyectos y trabajos
  const loadPostulaciones = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔄 Cargando postulaciones de proyectos y trabajos...");

      const [resProyectos, resTrabajos] = await Promise.all([
        fetch("http://localhost:3000/api/applications/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:3000/api/job-applications/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const proyectos = resProyectos.ok ? await resProyectos.json() : [];
      const trabajos = resTrabajos.ok ? await resTrabajos.json() : [];

      // 🔹 Normalizamos formato para unificar ambos tipos
      const formattedProyectos = proyectos.map((p) => ({
        id: p.id,
        title: p.projectTitle || p.project?.title || "Proyecto sin título",
        companyName:
          p.companyName ||
          p.project?.company?.nombreEmpresa ||
          "Empresa desconocida",
        createdAt: p.createdAt,
        status: p.status,
        tipo: "Proyecto",
      }));

      const formattedTrabajos = trabajos.map((t) => ({
        id: t.id,
        title: t.jobTitle || t.job?.title || "Trabajo sin título",
        companyName:
          t.companyName ||
          t.job?.company?.nombreEmpresa ||
          "Empresa desconocida",
        createdAt: t.createdAt,
        status: t.status,
        tipo: "Trabajo",
      }));

      const allPostulaciones = [...formattedProyectos, ...formattedTrabajos];
      console.log("✅ Total postulaciones combinadas:", allPostulaciones.length);
      setPostulaciones(allPostulaciones);
    } catch (err) {
      console.error("❌ Error cargando postulaciones:", err);
      setPostulaciones([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Actualizar estado de postulación
  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:3000/api/applications/user/${id}/status`;

      console.log(`📤 PUT ${url} - Estado: ${newStatus}`);

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        await loadPostulaciones();
        setMessage("✅ ¡Tu respuesta ha sido guardada!");
      } else {
        setMessage("❌ Error al guardar tu respuesta");
      }
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ Error de conexión:", error);
      setMessage("❌ Error de conexión");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  useEffect(() => {
    loadPostulaciones();
  }, []);

  // ================== RENDER ===================
  if (loading) {
    return (
      <div className="mis-postulaciones">
        <header className="header">
          <h1 className="h1">
            work<span>now</span>
          </h1>
          <nav className="nav">
            <ul>
              <li
                className="nav-item"
                onClick={() => (window.location.href = "/home/user")}
              >
                <span>← Volver al Home</span>
              </li>
            </ul>
          </nav>
        </header>
        <div className="loading">Cargando tus postulaciones...</div>
      </div>
    );
  }

  return (
    <div className="mis-postulaciones">
      <header className="header">
        <h1 className="h1">
          work<span>now</span>
        </h1>
        <nav className="nav">
          <ul>
            <li
              className="nav-item"
              onClick={() => (window.location.href = "/home/user")}
            >
              <span>← Volver al Home</span>
            </li>
          </ul>
        </nav>
      </header>

      <div className="container">
        <h2>Mis Postulaciones</h2>

        {message && <div className="message-alert">{message}</div>}

        {postulaciones.length === 0 ? (
          <div className="no-postulaciones">
            <p>No tenés postulaciones aún</p>
            <button
              onClick={() => (window.location.href = "/home/user")}
              className="btn-primary"
            >
              Buscar Oportunidades
            </button>
          </div>
        ) : (
          <div className="postulaciones-list">
            {postulaciones.map((postulacion) => {
              const normalized = normalizeStatus(postulacion.status);
              const estadoInfo = getEstadoBadge(normalized);

              return (
                <div key={postulacion.id} className="postulacion-card">
                  <div className="postulacion-header">
                    <h3>{postulacion.title}</h3>
                    <span className={`estado-badge ${estadoInfo.class}`}>
                      {estadoInfo.text}
                    </span>
                  </div>

                  <div className="postulacion-info">
                    <p>
                      <strong>Empresa:</strong> {postulacion.companyName}
                    </p>
                    <p>
                      <strong>Fecha de postulación:</strong>{" "}
                      {new Date(postulacion.createdAt).toLocaleDateString(
                        "es-ES"
                      )}
                    </p>
                    <p>
                      <strong>Tipo:</strong> {postulacion.tipo}
                    </p>
                  </div>

                  {/* 🔸 Estado ACEPTADO → comportamiento distinto según tipo */}
                  {normalized === "ACEPTADO" && (
                    <>
                      {postulacion.tipo === "Proyecto" ? (
                        <div className="postulacion-actions">
                          <p className="instruccion">
                            ¿Ya completaste este proyecto?
                          </p>
                          <button
                            className="btn-status hecho"
                            onClick={() =>
                              updateStatus(postulacion.id, "HECHO")
                            }
                          >
                            <FaCheckCircle /> Sí, lo completé
                          </button>
                          <button
                            className="btn-status no-hecho"
                            onClick={() =>
                              updateStatus(postulacion.id, "NO_HECHO")
                            }
                          >
                            <FaTimesCircle /> No lo completé
                          </button>
                        </div>
                      ) : (
                        <div className="estado-mensaje success">
                          <p>
                            ✅ Tu postulación fue aceptada. La empresa se pondrá
                            en contacto contigo pronto.
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* 🔸 Otros estados */}
                  {normalized === "PENDIENTE" && (
                    <div className="estado-mensaje">
                      <p>⏳ Tu postulación está siendo revisada por la empresa</p>
                    </div>
                  )}

                  {normalized === "RECHAZADO" && (
                    <div className="estado-mensaje">
                      <p>❌ Esta postulación fue rechazada por la empresa</p>
                    </div>
                  )}

                  {normalized === "HECHO" && (
                    <div className="estado-mensaje success">
                      <p>
                        ✅ ¡Marcaste este proyecto como completado! Se agregó a
                        tu perfil.
                      </p>
                    </div>
                  )}

                  {normalized === "NO_HECHO" && (
                    <div className="estado-mensaje warning">
                      <p>⚠️ Marcaste este proyecto como no completado</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
