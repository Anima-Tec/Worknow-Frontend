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
  const normalizedType = jobType?.toLowerCase().trim();

  const jobTypeClass =
    normalizedType === "full-time"
      ? "full-time"
      : normalizedType === "part-time"
      ? "part-time"
      : "";

  // 🔹 Función que agrega el signo de peso si hay salario
  const formatSalary = (value) => {
    if (!value) return "A convenir";
    return `$${value}`;
  };

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
            {jobType && (
              <span className={`job-type ${jobTypeClass}`}>{jobType}</span>
            )}
          </div>
        </div>

        <p className="job-company">{company || "Empresa"}</p>

        {/* ---------- INFO RESUMEN ---------- */}
        <ul className="job-summary">
          <li>
            <strong>Salario:</strong> {formatSalary(salary)}
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
