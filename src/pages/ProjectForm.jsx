import React, { useState } from "react";
import CardProyecto from "../components/CardProyecto";
import "./ProjectForm.css";

export default function ProjectForm({ onClose, onProjectCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    deliveryFormat: "",
    evaluationCriteria: "",
    remuneration: "",
    description: "",
    modality: "Freelance",
    skills: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al publicar proyecto");
      const newProject = await res.json();

      onProjectCreated(newProject);
      onClose();
    } catch (error) {
      console.error(error);
      alert("No se pudo publicar el proyecto.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="projectform-container">
          <form className="projectform" onSubmit={handleSubmit}>
            <h2>Publicar proyecto</h2>

            <label>Título del proyecto *</label>
            <input
              type="text"
              name="title"
              placeholder="Ej. Desarrollo de landing page"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <div className="form-row">
              <div>
                <label>Tiempo estimado *</label>
                <input
                  type="text"
                  name="duration"
                  placeholder="Ej. 3 semanas"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Remuneración *</label>
                <input
                  type="number"
                  name="remuneration"
                  placeholder="Ej. $25.000"
                  value={formData.remuneration}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Formato de entrega *</label>
                <input
                  type="text"
                  name="deliveryFormat"
                  placeholder="Ej. Repositorio GitHub, Demo, PDF..."
                  value={formData.deliveryFormat}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Criterios a evaluar *</label>
                <input
                  type="text"
                  name="evaluationCriteria"
                  placeholder="Ej. Creatividad, Funcionalidad, Cumplimiento"
                  value={formData.evaluationCriteria}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Habilidades requeridas*</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="React, UX/UI, Node.js..."
                  value={formData.skills}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <label>Descripción del proyecto *</label>
            <textarea
              name="description"
              placeholder="Explicá objetivos, tareas, requisitos..."
              value={formData.description}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn-publicar-proyecto">
              Subir proyecto
            </button>
          </form>

          {/* ✅ Vista previa igual */}
          <div className="project-preview">
            <h3>Vista previa</h3>
            <CardProyecto
              title={formData.title || "Título del proyecto"}
              skills={formData.skills || "Habilidades"}
              duration={formData.duration || "Tiempo estimado"}
              modality={formData.modality}
              remuneration={formData.remuneration || "A convenir"}
              company="WorkNow"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
