import { useNavigate } from "react-router-dom";
import { FaQuoteRight, FaUserCircle } from "react-icons/fa";
import "./Landing.css";
import Footer from "../components/Footer";

export default function Landing() {
  const navigate = useNavigate();

  const testimonials = [
    {
      text: "Gracias a WorkNow conseguí mi primer empleo tech en menos de un mes.",
      name: "Camila Fernández",
      role: "Frontend Jr",
    },
    {
      text: "Los desafíos prácticos me permitieron demostrar mis capacidades reales.",
      name: "Diego López",
      role: "UX Designer",
    },
    {
      text: "Encontramos talento validado en semanas, optimizando todo nuestro proceso.",
      name: "Sofía Martínez",
      role: "HR Partner",
    },
    {
      text: "Pude postularme en segundos y ya estoy trabajando en mi primer proyecto.",
      name: "Martín Pérez",
      role: "Data Analyst",
    },
    {
      text: "Nuestra startup contrató a 3 talentos clave gracias a WorkNow.",
      name: "Andrés Silva",
      role: "CTO",
    },
  ];

  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="hero-content">
          <h1>
            Conecta <span>tu talento</span> con oportunidades reales
          </h1>
          <p>
            La plataforma que transforma perfiles en huellas digitales validadas
            con proyectos reales y empresas.
          </p>
          <div className="cta-buttons">
            <button className="btnPrimary" onClick={() => navigate("/login?role=user")}>
              Soy Usuario
            </button>
            <button className="btnSecondary" onClick={() => navigate("/login?role=company")}>
              Soy Empresa
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img src="/hero-illustration.svg" alt="WorkNow Hero" />
        </div>
      </section>
      <section className="how">
        <h2>
          Cómo funciona <span>WorkNow</span>
        </h2>
        <div className="steps-line">
          <div className="step-circle strong">
            <img src="/icons/cv.svg" alt="CV Upload" />
            <h3>CV Upload</h3>
            <p>Sube tu CV y crea tu huella digital en minutos.</p>
          </div>
          <div className="arrow">➔</div>
          <div className="step-circle light">
            <img src="/icons/challenge.svg" alt="Challenge" />
            <h3>Challenge</h3>
            <p>Participa en desafíos reales con empresas y valida tu talento.</p>
          </div>
          <div className="arrow">➔</div>
          <div className="step-circle strong">
            <img src="/icons/search.svg" alt="Job Search" />
            <h3>Job Search</h3>
            <p>Conecta con empresas y aplica en segundos.</p>
          </div>
        </div>
      </section>
      <section className="banner violet-banner">
        <h2>Impulsa tu carrera con WorkNow</h2>
        <p>Un puente entre talento y empresas reales.</p>
        <button className="btnPrimary" onClick={() => navigate("/login")}>
          Crear mi cuenta
        </button>
      </section>
      <section className="metrics">
        <h2>
          Nuestro <span>impacto</span>
        </h2>
        <div className="metric-grid">
          <div>
            <h3>+60%</h3>
            <p>más inserción laboral</p>
          </div>
          <div>
            <h3>+230</h3>
            <p>proyectos exitosos</p>
          </div>
          <div>
            <h3>+40%</h3>
            <p>primer empleo conseguido</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>
          Historias que <span>inspiran</span>
        </h2>
        <div className="testimonial-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <FaQuoteRight className="quote-icon" />
              <p>{t.text}</p>
              <div className="testimonial-footer">
                <FaUserCircle className="avatar" />
                <div>
                  <h4>{t.name}</h4>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="banner final-banner">
        <h2>¿Listo para crear tu huella digital?</h2>
        <p>Empieza hoy mismo y conecta con el futuro laboral.</p>
        <div className="cta-buttons">
          <button className="btnPrimary" onClick={() => navigate("/login?role=user")}>
            Soy Usuario
          </button>
          <button className="btnSecondary" onClick={() => navigate("/login?role=company")}>
            Soy Empresa
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
