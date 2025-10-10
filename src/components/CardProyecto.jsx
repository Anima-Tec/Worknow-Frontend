import "./CardProyecto.css";

export default function CardProyecto({ title, description, skills, duration, modality, remuneration, company }) {
  return (
    <div className="project-card">
      {/* header con avatar + tipo */}
      <div className="project-header">
        <div className="avatar">{company?.charAt(0) || "W"}</div>
        <span className="project-type">{modality || "Freelance"}</span>
      </div>

      {/* título */}
      <h4 className="project-title">{title}</h4>
      <p className="project-description">{description}</p>

      {/* detalles */}
      <div className="project-details">
        <span><strong>Salary:</strong> {remuneration || "A convenir"}</span>
        <span><strong>Duración:</strong> {duration}</span>
        <span><strong>Skills:</strong> {skills}</span>
      </div>

      {/* botones */}
      <div className="project-actions">
        <button className="secondary-btn">View details</button>
        <button className="primary-btn">Apply now</button>
      </div>
    </div>
  );
}
