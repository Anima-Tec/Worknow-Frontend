import { useState } from "react";
import CardProyecto from "../components/CardProyecto";
import "./ProjectForm.css";
const API_URL = import.meta.env.VITE_API_URL;

export default function ProjectForm({ onClose, onProjectCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    deliveryFormat: "",
    evaluation: "",
    remuneration: "",
    skills: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Solo números en remuneración
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

      // ✅ Transformar habilidades en array JSON
      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
          title: formData.title,
          description: formData.description,
          skills: skillsArray,
          duration: formData.duration,
          modality: formData.deliveryFormat, // 🔹 lo mapeamos para que el backend lo entienda
          remuneration: formData.remuneration,
        };

      const res = await fetch(`${API_URL}/api/projects`, {
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

      const response = await res.json();
      const newProject = response.data || response; // 🔹 el backend devuelve { success, data }
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

            <label>Duración estimada *</label>
            <input
              type="text"
              name="duration"
              placeholder="Ej. 3 semanas"
              value={formData.duration}
              onChange={handleChange}
              required
            />

            <label>Formato de entrega *</label>
            <input
              type="text"
              name="deliveryFormat"
              placeholder="Ej. Repositorio GitHub, PDF, video demo..."
              value={formData.deliveryFormat}
              onChange={handleChange}
              required
            />

            <label>Criterios a evaluar *</label>
<input
  type="text"
  name="evaluation"
  placeholder="Ej. Cumplimiento, diseño, creatividad..."
  value={formData.evaluation}
  onChange={handleChange}
  required
/>


            <label>Remuneración *</label>
            <input
              type="number"
              name="remuneration"
              placeholder="Ej. $25.000"
              value={formData.remuneration}
              onChange={handleChange}
              required
            />

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
              duration={formData.duration || "Tiempo estimado"}
              deliveryFormat={formData.deliveryFormat || "Formato de entrega"}
              evaluation={formData.evaluation || "Criterios a evaluar"}
              remuneration={formData.remuneration || "A convenir"}
              skills={formData.skills || "Habilidades requeridas"}
              description={formData.description || "Descripción del proyecto"}
              company="WorkNow"
              isFormPreview={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
