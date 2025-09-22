import "./CardProyecto.css";

export default function CardProyecto({ title, type, category }) {
  return (
    <div className="card">
      <h4>{title}</h4>
      <p>{type} · {category}</p>
      <button>Apply now</button>
    </div>
  );
}
