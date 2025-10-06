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
}) {
  return (
    <div className="card-trabajo">
      {/* ---------- HEADER ---------- */}
      <div className="job-header">
        <div className="avatar">W</div>
        <span className="job-type">{jobType || "Freelance"}</span>
      </div>

      {/* ---------- CONTENIDO ---------- */}
      <h3 className="job-title">{title || "Título del puesto"}</h3>
      <p className="job-company">{company || "Empresa"}</p>

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
  );
}
