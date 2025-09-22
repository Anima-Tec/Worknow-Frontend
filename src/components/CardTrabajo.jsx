import "./CardTrabajo.css";

export default function CardTrabajo({ image, title, location, salary }) {
  return (
    <div className="card">
      {image && <img src={image} alt={title} />}
      <h4>{title}</h4>
      <p>{location} · {salary}</p>
      <button>Apply now</button>
    </div>
  );
}
