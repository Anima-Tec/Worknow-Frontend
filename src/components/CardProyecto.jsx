import { useState } from "react";
import "./CardProyecto.css";
import ApplyModal from "./ApplyModal";

export default function CardProyecto({
  id, 
  title,
  description,
  skills,
  duration,
  modality,
  remuneration,
  company,
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="project-card">
        <div className="project-header">
          <div className="avatar">{company?.charAt(0) || "W"}</div>
          <span className="project-type">{modality || "Freelance"}</span>
        </div>

        <h4 className="project-title">{title}</h4>

        <div className="project-details">
          <span>
            <strong>Salary:</strong> {remuneration || "A convenir"}
          </span>
          <span>
            <strong>Duración:</strong> {duration}
          </span>
          <span>
            <strong>Skills:</strong> {skills}
          </span>
        </div>

        <div className="project-actions">
          <button className="secondary-btn">View details</button>
          <button
  className="primary-btn"
  onClick={() => {
    console.log("✅ Click detectado");
    setShowModal(true);
  }}
>
  Apply now
</button>
        </div>
      </div>

       {showModal && (
       <ApplyModal
  project={{ id }}
  onClose={() => setShowModal(false)}
/>
      )}
    </>
  );
}
