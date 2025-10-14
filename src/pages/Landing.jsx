import { useNavigate } from "react-router-dom";
import { FaQuoteRight, FaUserCircle } from "react-icons/fa";
import Footer from "../components/Footer";
import "./Landing.css";

export default function Landing() {
  const navigate = useNavigate();

  const testimonials = [
    {
      text: "Gracias a WorkNow conseguí mi primer empleo tech en menos de un mes.",
      name: "Camila Fernández",
      role: "Frontend Jr",
    },
    {
      text: "Los desafíos reales me ayudaron a demostrar mi talento a empresas que buscaban justo mi perfil.",
      name: "Diego López",
      role: "UX Designer",
    },
    {
      text: "Encontramos talento validado en semanas, optimizando todo nuestro proceso de selección.",
      name: "Sofía Martínez",
      role: "HR Partner",
    },
  ];

  return (
    <div className="landing">
      {/* 🟣 HERO */}
      <section className="hero-section">
        <video autoPlay loop muted playsInline className="hero-video">
          <source src="/video-banner.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>
            Conectamos <span>talento</span> con oportunidades reales
          </h1>
          <p>
            WorkNow impulsa el futuro laboral uniendo personas y empresas a través de proyectos reales y experiencias verificadas.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary" onClick={() => navigate("/choose")}>
              Registrarme
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/login")}>
              Iniciar sesión
            </button>
          </div>
        </div>
      </section>

      {/* 🟣 FUNCIONAMIENTO */}
      <section className="how-section">
        <h2>
          Cómo funciona <span>WorkNow</span>
        </h2>
        <div className="steps">
          <div className="step">
            <img src="/icons/cv.svg" alt="Perfil" />
            <h3>Crea tu perfil</h3>
            <p>Mostrá tus habilidades y experiencia con una huella digital única.</p>
          </div>
          <div className="step">
            <img src="/icons/challenge.svg" alt="Desafíos" />
            <h3>Participá en proyectos</h3>
            <p>Demostrá tu talento con desafíos reales de empresas verificadas.</p>
          </div>
          <div className="step">
            <img src="/icons/search.svg" alt="Conecta" />
            <h3>Conectá y trabajá</h3>
            <p>Aplicá a oportunidades en segundos y da el siguiente paso en tu carrera.</p>
          </div>
        </div>
      </section>

      {/* 🟣 BANNER */}
      <section className="banner-section">
        <h2>El puente entre talento y oportunidad</h2>
        <p>Empresas reales, desafíos reales, resultados reales.</p>
        <button className="btn btn-white" onClick={() => navigate("/choose")}>
          Crear mi cuenta
        </button>
      </section>

      {/* 🟣 MÉTRICAS */}
      <section className="metrics-section">
        <h2>
          Nuestro <span>impacto</span>
        </h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>+230</h3>
            <p>Proyectos completados</p>
          </div>
          <div className="metric-card">
            <h3>+60%</h3>
            <p>Mayor inserción laboral</p>
          </div>
          <div className="metric-card">
            <h3>+40%</h3>
            <p>Primer empleo tech</p>
          </div>
        </div>
      </section>

      {/* 🟣 TESTIMONIOS */}
      <section className="testimonials-section">
        <h2>
          Historias que <span>inspiran</span>
        </h2>
        <div className="testimonials-grid">
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

      {/* 🟣 CTA FINAL */}
      <section className="cta-section">
        <h2>¿Listo para crear tu huella digital?</h2>
        <p>Registrate y empezá a conectar con oportunidades reales hoy mismo.</p>
        <div className="cta-buttons">
          <button className="btn btn-primary" onClick={() => navigate("/choose")}>
            Registrarme
          </button>
          <button className="btn btn-outline" onClick={() => navigate("/login")}>
            Iniciar sesión
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
