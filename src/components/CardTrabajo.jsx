import "./CardTrabajo.css";

export default function CardTrabajo({
  title,
  company,
  area,
  jobType,
  contractType,
  modality,
  location,
  salary,
  projectUrl,
  isPreview = false,
}) {
  // 🔹 Normalizamos el texto (quita espacios y lo pasa a minúsculas)
  const normalizedType = jobType?.toLowerCase().trim();

  // 🔹 Determina la clase de color según el tipo
  const jobTypeClass =
    normalizedType === "full-time"
      ? "full-time"
      : normalizedType === "part-time"
      ? "part-time"
      : normalizedType === "freelance"
      ? "freelance"
      : "";

  return (
    <div className={`card-trabajo ${isPreview ? "preview-mode" : ""}`}>
      {/* ---------- HEADER SUPERIOR ---------- */}
      <div className="job-banner">
        <div className="banner-text">Empowering people through technology</div>
        <div className="logo-circle">W</div>
      </div>

      {/* ---------- CONTENIDO PRINCIPAL ---------- */}
      <div className="job-content">
        <div className="job-header-column">
          <h3 className="job-title">{title || "Título del puesto"}</h3>
          <div className="job-type-container">
            <span className={`job-type ${jobTypeClass}`}>
              {jobType || "Freelance"}
            </span>
          </div>
        </div>

        <p className="job-company">{company || "Empresa"}</p>

        {/* ---------- INFO RESUMEN ---------- */}
        <ul className="job-summary">
          <li>
            <strong>Salario:</strong> {salary || "A convenir"}
          </li>
          <li>
            <strong>Contrato:</strong> {contractType || "Contrato"}
          </li>
          <li>
            <strong>Ubicación:</strong> {location || "Ubicación"}
          </li>
          <li>
            <strong>Área:</strong> {area || "Área"}
          </li>
        </ul>

        {/* ---------- LINK DE PROYECTO (OPCIONAL) ---------- */}
        {projectUrl && (
          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            Ver proyecto asociado
          </a>
        )}

        {/* ---------- BOTONES ---------- */}
        <div className="job-actions">
          <button className="secondary-btn">Ver detalles</button>
          <button className="primary-btn">Postular</button>
        </div>
      </div>
    </div>
  );
}
