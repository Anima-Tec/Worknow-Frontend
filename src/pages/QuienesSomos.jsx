import "./QuienesSomos.css";

export default function QuienesSomos() {
  return (
    <div className="about-container">
      {/* 🟣 HEADER */}
      <section className="about-hero">
        <h1>
          Quiénes <span>Somos</span>
        </h1>
        <p>
          Somos estudiantes del centro educativo <strong>ÁNIMA</strong> y este
          proyecto nació como nuestro trabajo final integrador en el área de
          <strong> Tecnologías de la Información y la Comunicación (TIC)</strong>.
        </p>
      </section>

      {/* 🟣 HISTORIA */}
      <section className="about-section">
        <h2>📘 Nuestro origen</h2>
        <p>
          WorkNow surge como respuesta a una necesidad que observamos durante
          nuestra formación: la dificultad que enfrentan tanto las empresas como
          los jóvenes profesionales para conectarse de manera rápida, eficaz y
          basada en habilidades reales.
        </p>
        <p>
          Desde el entorno educativo, notamos que muchos talentos técnicos no
          logran acceder a oportunidades laborales por falta de experiencia
          comprobable, mientras que las empresas pierden tiempo y recursos en
          procesos de selección poco efectivos.
        </p>
      </section>

      {/* 🟣 PROBLEMA Y SOLUCIÓN */}
      <section className="about-section purple-bg">
        <h2>💡 El problema y nuestra solución</h2>
        <p>
          El desafío principal era claro: <strong>conectar talento con demanda</strong> en un
          entorno cada vez más digitalizado. Para resolverlo, desarrollamos
          <strong> WorkNow</strong>, una plataforma que une usuarios y empresas en un
          mismo espacio donde los proyectos y desafíos reales son el punto de
          encuentro.
        </p>
        <p>
          De esta forma, <strong>los usuarios</strong> pueden validar sus capacidades y construir
          su experiencia profesional, mientras que <strong>las empresas</strong> encuentran
          candidatos que ya demostraron su talento en entornos reales.
        </p>
      </section>

      {/* 🟣 BENEFICIOS */}
      <section className="about-section">
        <h2>🤝 Beneficios para ambas partes</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <h3>Para los usuarios</h3>
            <p>
              ✔ Desarrollan experiencia real a través de desafíos prácticos. <br />
              ✔ Mejoran su empleabilidad mostrando resultados concretos. <br />
              ✔ Acceden a oportunidades ajustadas a su perfil.
            </p>
          </div>
          <div className="benefit-card">
            <h3>Para las empresas</h3>
            <p>
              ✔ Encuentran talento validado y alineado a sus necesidades. <br />
              ✔ Reducen tiempos de reclutamiento y prueba. <br />
              ✔ Promueven la formación de nuevos profesionales en su sector.
            </p>
          </div>
        </div>
      </section>

      {/* 🟣 EQUIPO */}
      <section className="about-section">
        <h2>👩‍💻 Nuestro equipo</h2>
        <p>
          Este proyecto fue desarrollado por estudiantes del programa
          <strong> ANIMA – Formación Dual TIC</strong>, quienes unimos nuestros
          conocimientos técnicos y creativos para crear una herramienta que
          genera impacto real.
        </p>

        <ul className="team-list">
          <li>Martina Morales Olivera – Frontend & UX/UI</li>
          <li>Avril Botti Emery – Backend & Comunicación</li>
          <li>Gimena Escobal La Puente – Diseño & QA</li>
          <li>Diego Gustavo Núñez Juani – Lógica & Arquitectura</li>
          <li>Facundo Franchini – Infraestructura & Documentación</li>
        </ul>
      </section>

      {/* 🟣 CONTACTO */}
      <section className="about-contact">
        <h2>📩 Contacto</h2>
        <p>
          Si querés conocer más sobre el proyecto o colaborar con nosotros,
          podés escribirnos a:
        </p>
        <div className="contact-emails">
          <a href="mailto:avril.emery@anima.edu.uy">
            avril.emery@anima.edu.uy
          </a>
          <a href="mailto:martina.morales@anima.edu.uy">
            martina.morales@anima.edu.uy
          </a>
          <a href="mailto:gimena.escobal@anima.edu.uy">
            gimena.escobal@anima.edu.uy
          </a>
          <a href="mailto:diego.nunez@anima.edu.uy">
            diego.nunez@anima.edu.uy
          </a>
          <a href="mailto:facundo.franchini@anima.edu.uy">
            facundo.franchini@anima.edu.uy
          </a>
        </div>
      </section>
    </div>
  );
}
