import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../services/api";
import CardTrabajo from "../components/CardTrabajo";
import "./JobForm.css";

export default function JobForm() {
  const [form, setForm] = useState({
    companyName: "",
    companyWebsite: "",
    title: "",
    area: "",
    jobType: "",
    contractType: "",
    projectUrl: "",
    modality: "",
    location: "",
    salaryRange: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createJob(form);
      setLoading(false);
      navigate("/home/company", { state: { jobCreated: true } });
    } catch (err) {
      setLoading(false);
      alert("❌ Error al publicar trabajo");
    }
  };

  return (
    <div className="jobform-container">
      {loading && (
        <div className="modal">
          <div className="modal-content">⏳ Publicando trabajo...</div>
        </div>
      )}

      {/* -------- FORMULARIO -------- */}
      <form className="jobform" onSubmit={handleSubmit}>
        <h2>Publicar Trabajo</h2>

        <label>Nombre de la empresa *</label>
        <input
          name="companyName"
          placeholder="Ingresa el nombre de la empresa"
          value={form.companyName}
          onChange={handleChange}
          required
        />

        <label>Website de la empresa *</label>
        <input
          name="companyWebsite"
          placeholder="Pega la URL del sitio web"
          value={form.companyWebsite}
          onChange={handleChange}
          required
        />

        <label>URL del proyecto asociado</label>
        <input
          name="projectUrl"
          placeholder="https://worknow.com/proyecto/123"
          value={form.projectUrl}
          onChange={handleChange}
        />

        <div className="form-row">
          <div>
            <label>Título del puesto *</label>
            <input
              name="title"
              placeholder="Ej. Diseñador/a UX/UI"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Área/Departamento *</label>
            <input
              name="area"
              placeholder="Ej. Diseño"
              value={form.area}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Tipo de trabajo *</label>
            <select
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un tipo</option>
              <option value="FULL-TIME">Full-time</option>
              <option value="PART-TIME">Part-time</option>
              <option value="FREELANCE">Freelance</option>
            </select>
          </div>
          <div>
            <label>Tipo de contrato *</label>
            <select
              name="contractType"
              value={form.contractType}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un tipo</option>
              <option value="Fijo">Fijo</option>
              <option value="Temporal">Temporal</option>
              <option value="Prácticas">Prácticas</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Modalidad de trabajo *</label>
            <select
              name="modality"
              value={form.modality}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una modalidad</option>
              <option value="Remoto">Remoto</option>
              <option value="Híbrido">Híbrido</option>
              <option value="Presencial">Presencial</option>
            </select>
          </div>
          <div>
            <label>Ubicación *</label>
            <input
              name="location"
              placeholder="Ej. Montevideo, Uruguay"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <label>Rango salarial *</label>
        <input
          name="salaryRange"
          placeholder="Ej. $15.000 - $32.000"
          value={form.salaryRange}
          onChange={handleChange}
          required
        />

        <label>Descripción del puesto *</label>
        <textarea
          name="description"
          placeholder="Tareas, responsabilidades, requisitos, etc."
          value={form.description}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn-publicar">
          Subir trabajo
        </button>
      </form>

      {/* -------- VISTA PREVIA -------- */}
      <div className="preview">
        <h3>Vista previa</h3>
        <CardTrabajo
          title={form.title || "Título del puesto"}
          company={form.companyName || "Empresa"}
          area={form.area || "Área"}
          jobType={form.jobType || "Tipo de trabajo"}
          contractType={form.contractType || "Contrato"}
          modality={form.modality || "Modalidad"}
          location={form.location || "Ubicación"}
          salary={form.salaryRange || "Salario"}
          description={form.description || "Descripción..."}
          projectUrl={form.projectUrl}
          isPreview={true} // 👈 activa el modo compacto
        />
      </div>
    </div>
  );
}
