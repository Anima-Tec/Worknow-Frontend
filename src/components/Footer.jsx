import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { PiDribbbleLogoBold } from "react-icons/pi";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h1 className="footer-title">
            work<span>now</span>
          </h1>
          <p>Conectamos empresas con el talento ideal y a usuarios con oportunidades reales, potenciando juntos el futuro laboral.</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Acerca de:</h4>
            <ul>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Inicio
                </a>
              </li>
              <li><span className="disabled-link">Quiénes somos</span></li>
              <li><span className="disabled-link">Empresas</span></li>
              <li><span className="disabled-link">Términos y condiciones</span></li>
              <li><span className="disabled-link">Política de privacidad</span></li>
            </ul>
          </div>

          <div>
            <h4>Recursos</h4>
            <ul>
              <li><span className="disabled-link">Guía de uso</span></li>
              <li><span className="disabled-link">Preguntas frecuentes</span></li>
              <li><span className="disabled-link">Chatbot</span></li>
            </ul>
          </div>

          <div>
            <h4>Contacto</h4>
            <ul>
              <li><span className="disabled-link">contacto@worknow.com</span></li>
              <li><span className="disabled-link">Soporte técnico</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>2025 © Worknow.</p>
        <div className="socials">
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><PiDribbbleLogoBold /></a>
          <a href="#"><FaLinkedinIn /></a>
          <a href="#"><FaTwitter /></a>
        </div>
      </div>
    </footer>
  );
}
