import { useState } from "react";
import CardProyecto from "../components/CardProyecto";
import "./ProjectForm.css";

export default function ProjectForm({ onClose, onProjectCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    remuneration: "",
    description: "",
    modality: "Freelance",
    skills: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si el campo es remuneración, forzamos solo números
    if (name === "remuneration") {
      if (/^\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No hay sesión activa. Iniciá sesión nuevamente.");
        return;
      }

      // ✅ Transformamos habilidades en array JSON
      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        skills: skillsArray,
      };

      const res = await fetch("http://localhost:3000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("❌ Error al publicar proyecto:", await res.text());
        alert("No se pudo publicar el proyecto.");
        return;
      }

      const newProject = await res.json();
      onProjectCreated(newProject);
      onClose();
    } catch (error) {
      console.error("❌ Error al enviar el formulario:", error);
      alert("Hubo un problema al publicar el proyecto.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="projectform-container">
          {/* ---------- FORMULARIO ---------- */}
          <form className="projectform" onSubmit={handleSubmit}>
            <h2>Publicar Proyecto</h2>

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
                <label>Duración estimada *</label>
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
                <label>Modalidad *</label>
                <select
                  name="modality"
                  value={formData.modality}
                  onChange={handleChange}
                  required
                >
                  <option value="Freelance">Freelance</option>
                  <option value="Remoto">Remoto</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Presencial">Presencial</option>
                </select>
              </div>

              <div>
                <label>Ubicación *</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Ej. Montevideo, Uruguay"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <label>Habilidades requeridas *</label>
            <input
              type="text"
              name="skills"
              placeholder="React, UX/UI, Node.js..."
              value={formData.skills}
              onChange={handleChange}
              required
            />

            <label>Descripción del proyecto *</label>
            <textarea
              name="description"
              placeholder="Explicá los objetivos, tareas y requisitos del proyecto..."
              value={formData.description}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn-publicar-proyecto">
              Subir proyecto
            </button>
          </form>

          {/* ---------- VISTA PREVIA ---------- */}
          <div className="project-preview">
            <h3>Vista previa</h3>
            <CardProyecto
              title={formData.title || "Título del proyecto"}
              skills={formData.skills || "Habilidades"}
              duration={formData.duration || "Tiempo estimado"}
              modality={formData.modality || "Freelance"}
              remuneration={formData.remuneration || "A convenir"}
              company="WorkNow"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
