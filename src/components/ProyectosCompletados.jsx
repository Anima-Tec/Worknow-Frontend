// src/components/ProyectosCompletados.jsx
import React, { useState, useEffect } from "react";
import "./ProyectosCompletados.css";

const ProyectosCompletados = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarProyectosCompletados = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/completed-projects/my-projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setProyectos(data);
      } else {
        console.error("Error cargando proyectos completados");
        setProyectos([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setProyectos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProyectosCompletados();
  }, []);

  if (loading) {
    return (
      <div className="proyectos-completados-card">
        <h2 className="proyectos-title">Proyectos Realizados</h2>
        <div className="loading-proyectos">Cargando proyectos...</div>
      </div>
    );
  }

  return (
    <div className="proyectos-completados-card">
      <h2 className="proyectos-title">Proyectos Realizados</h2>
      
      {proyectos.length === 0 ? (
        <div className="no-proyectos">
          <p>📝 Aún no tenés proyectos completados</p>
          <small>Los proyectos que marques como "Hecho" aparecerán aquí</small>
        </div>
      ) : (
        <div className="proyectos-list">
          {proyectos.map((proyecto) => (
            <div key={proyecto.id} className="proyecto-item">
              <div className="proyecto-header">
                <h3 className="proyecto-nombre">{proyecto.projectTitle}</h3>
                <span className="proyecto-fecha">
                  {new Date(proyecto.completionDate).toLocaleDateString("es-ES")}
                </span>
              </div>
              
              <div className="proyecto-empresa">
                <strong>Empresa:</strong> {proyecto.companyName}
              </div>
              
              {proyecto.description && (
                <p className="proyecto-descripcion">{proyecto.description}</p>
              )}

              {/* 🆕 NUEVA INFORMACIÓN DEL PROYECTO */}
              <div className="proyecto-detalles">
                {proyecto.duration && proyecto.duration !== "No especificada" && (
                  <div className="proyecto-detalle">
                    <strong>Duración:</strong> {proyecto.duration}
                  </div>
                )}
                
                {proyecto.modality && proyecto.modality !== "No especificada" && (
                  <div className="proyecto-detalle">
                    <strong>Modalidad:</strong> {proyecto.modality}
                  </div>
                )}
                
                {proyecto.remuneration && proyecto.remuneration !== "No especificada" && (
                  <div className="proyecto-detalle">
                    <strong>Remuneración:</strong> {proyecto.remuneration}
                  </div>
                )}
                
                {proyecto.skills && proyecto.skills !== "No especificadas" && (
                  <div className="proyecto-detalle">
                    <strong>Habilidades:</strong> {proyecto.skills}
                  </div>
                )}
              </div>
              
              <div className="proyecto-badge">✅ Completado</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProyectosCompletados;