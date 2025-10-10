import React, { useState } from "react";
import CardProyecto from "../components/CardProyecto";
import "./ProjectForm.css";

export default function ProjectForm({ onClose, onProjectCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    description: "",
    modality: "Freelance",
    remuneration: "",
    skills: "",
    location: "",
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
      const token = localStorage.getItem("token"); // JWT
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

            <label>Título *</label>
            <input
              type="text"
              name="title"
              placeholder="Ej. Prototipo UI (Figma)"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <div className="form-row">
              <div>
                <label>Duración *</label>
                <input
                  type="text"
                  name="duration"
                  placeholder="Ej. 2 semanas"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Remuneración</label>
                <input
                  type="text"
                  name="remuneration"
                  placeholder="Ej. $30.000"
                  value={formData.remuneration}
                  onChange={handleChange}
                />
              </div>
            </div>

            <label>Descripción *</label>
            <textarea
              name="description"
              placeholder="Tareas, responsabilidades, objetivos..."
              value={formData.description}
              onChange={handleChange}
              required
            />

            <div className="form-row">
              <div>
                <label>Habilidades</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="React, UX/UI, Node.js..."
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Ubicación</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Remoto / Montevideo"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn-publicar-proyecto">
              Subir proyecto
            </button>
          </form>

          <div className="project-preview">
            <h3>Vista previa</h3>
            <CardProyecto
              title={formData.title || "Título del proyecto"}
              description={formData.description || "Descripción corta..."}
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
