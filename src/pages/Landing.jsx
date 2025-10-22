import React, { useState, useEffect } from "react";
import { Quote, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-header">
          <div className="hero-logo-box">
            <img src="/logo.png" alt="WorkNow" className="hero-logo" />
          </div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Conectamos <span className="highlight">talento</span> con oportunidades reales
          </h1>
          <p className="hero-text">
            WorkNow impulsa el futuro laboral uniendo personas y empresas a través de proyectos reales y experiencias verificadas.
          </p>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => navigate("/choose")}>
              Registrarme
            </button>
            <button className="btn-outline" onClick={() => navigate("/login")}>
              Iniciar sesión
            </button>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="how-section">
        <h2 className="section-title">
          Cómo funciona <span className="purple-text">WorkNow</span>
        </h2>
        <div className="steps">
          <div className="step">
            <div className="icon-wrapper">
              <img src="/undraw_authentication_1evl.png" alt="crea tu perfil" className="icon-image" />
            </div>
            <h3 className="step-title">Crea tu perfil</h3>
            <p className="step-text">
              Mostrá tus habilidades y experiencia con una huella digital única.
            </p>
          </div>

          <div className="step">
            <div className="icon-wrapper">
              <img src="/undraw_designer_efwz.png" alt="Participá en proyectos" className="icon-image" />
            </div>
            <h3 className="step-title">Participá en proyectos</h3>
            <p className="step-text">
              Demostrá tu talento con desafíos reales de empresas verificadas.
            </p>
          </div>

          <div className="step">
            <div className="icon-wrapper">
              <img src="/undraw_group-project_kow1.png" alt="conecta y trabaja" className="icon-image" />
            </div>
            <h3 className="step-title">Conectá y trabajá</h3>
            <p className="step-text">
              Aplicá a oportunidades en segundos y da el siguiente paso en tu carrera.
            </p>
          </div>
        </div>
      </section>

        {/* BANNER */}
      <section className="banner-section">
        <h2 className="banner-title">El puente entre talento y oportunidad</h2>
        <p className="banner-text">
          Empresas reales, desafíos reales, resultados reales.
        </p>

        <div className="logos-slider">
          <div className="logos-slide-track">
            {Array.from({ length: 2 }).map((_, i) => (
              <React.Fragment key={i}>
                <img src="/globant.png" alt="Empresa 1" className="company-logo" />
                <img src="/empresas/empresa2.png" alt="Empresa 2" className="company-logo" />
                <img src="/empresas/empresa3.png" alt="Empresa 3" className="company-logo" />
                <img src="/empresas/empresa4.png" alt="Empresa 4" className="company-logo" />
                <img src="/empresas/empresa5.png" alt="Empresa 5" className="company-logo" />
                <img src="/empresas/empresa6.png" alt="Empresa 6" className="company-logo" />
                <img src="/empresas/empresa7.png" alt="Empresa 7" className="company-logo" />
                <img src="/empresas/empresa8.png" alt="Empresa 8" className="company-logo" />
              </React.Fragment>
            ))}
          </div>
        </div>

        <button className="btn-white mt-4" onClick={() => navigate("/choose")}>
          Crear mi cuenta
        </button>
      </section>

      {/* MÉTRICAS */}
      <section className="metrics-section">
        <h2 className="section-title">
          Nuestro <span className="purple-text">impacto</span>
        </h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <h3 className="metric-number">+230</h3>
            <p className="metric-label">Proyectos completados</p>
          </div>
          <div className="metric-card">
            <h3 className="metric-number">+60%</h3>
            <p className="metric-label">Mayor inserción laboral</p>
          </div>
          <div className="metric-card">
            <h3 className="metric-number">+40%</h3>
            <p className="metric-label">Primer empleo tech</p>
          </div>
        </div>
      </section>

      {/* 🔮 PLANES WORKNOW */}
      <section className="plans-section">
        <h2 className="section-title">Planes <span className="purple-text">WorkNow</span></h2>
        <p className="plans-subtitle">
          Elegí el plan que se adapta mejor a tus objetivos profesionales
        </p>

        <div className="plans-grid">
          {/* PLAN GRATIS */}
          <div className="plan-card free">
            <h3 className="plan-title">Gratis</h3>
            <p className="plan-price">$0 <span>/ mes</span></p>
            <p className="plan-desc">Ideal para comenzar a explorar WorkNow</p>
            <ul className="plan-features">
              <li>✔ Acceso a proyectos públicos</li>
              <li>✔ Perfil visible para empresas</li>
              <li>✔ Aplicaciones limitadas por mes</li>
              <li>✖ Sin métricas avanzadas</li>
            </ul>
            <button className="btn-outline-light" onClick={() => navigate("/choose")}>
              Tu plan actual
            </button>
          </div>

          {/* PLAN PLUS */}
          <div className="plan-card plus popular">
            <div className="popular-badge">POPULAR</div>
            <h3 className="plan-title">Plus para usuarios</h3>
            <p className="plan-price">$16,23 <span>USD / mes</span></p>
            <p className="plan-desc">Más visibilidad y herramientas para destacar</p>
            <ul className="plan-features">
              <li>✔ Todo del plan Gratis</li>
              <li>✔ Aplicaciones ilimitadas</li>
              <li>✔ Feedback de empresas</li>
              <li>✔ Métricas de rendimiento</li>
            </ul>
            <button className="btn-white" onClick={() => navigate("/choose")}>
              Obtener Plus
            </button>
          </div>

          {/* PLAN PRO */}
          <div className="plan-card pro">
            <h3 className="plan-title">Pro para empresas</h3>
            <p className="plan-price">$37,48 <span>USD / mes</span></p>
            <p className="plan-desc">Para empresas y profesionales que buscan lo máximo</p>
            <ul className="plan-features">
              <li>✔ Acceso total a WorkNow</li>
              <li>✔ Publicación de empleos y proyectos</li>
              <li>✔ Análisis de talento con IA</li>
              <li>✔ Soporte prioritario</li>
            </ul>
            <button className="btn-outline-light" onClick={() => navigate("/choose")}>
              Obtener Pro
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="testimonials-section">
        <h2 className="section-title">
          Historias que <span className="purple-text">inspiran</span>
        </h2>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <Quote className="quote-icon" />
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-footer">
                <User className="avatar" />
                <div>
                  <h4 className="testimonial-name">{t.name}</h4>
                  <span className="testimonial-role">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-section">
        <h2 className="cta-title">¿Listo para crear tu huella digital?</h2>
        <p className="cta-text">
          Registrate y empezá a conectar con oportunidades reales hoy mismo.
        </p>
        <div className="cta-buttons">
          <button className="btn-primary" onClick={() => navigate("/choose")}>
            Registrarme
          </button>
          <button className="btn-outline-light" onClick={() => navigate("/login")}>
            Iniciar sesión
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p className="footer-text">
          © 2025 WorkNow. Conectando talento con oportunidades.
        </p>
      </footer>
    </div>
  );
}
