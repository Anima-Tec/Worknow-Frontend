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
  description,
  projectUrl,
}) {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <span>Empowering people through technology</span>
        <div className="job-logo">W</div>
      </div>

      {/* Contenido */}
      <div className="job-card-body">
        <h4>{title}</h4>
        <p className="company">{company}</p>

        <div className="job-meta">
          <span className="job-type">{jobType}</span>
          <span className="salary">Salary: {salary}</span>
        </div>

        <p className="extra">{area} · {contractType} · {modality}</p>
        <p className="extra">📍 {location}</p>
        <p className="desc">{description}</p>
      </div>

      {/* Botones */}
      <div className="job-card-footer">
        <button className="btn-outline">View details</button>
        <button className="btn-primary">Apply now</button>
      </div>

      {projectUrl && (
  <p className="extra">
    🔗 <a href={projectUrl} target="_blank" rel="noopener noreferrer">
      Ver proyecto asociado
    </a>
  </p>
)}
    </div>
  );
}
