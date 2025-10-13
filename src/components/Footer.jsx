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
              <li className="disabled-link" onClick={() => (window.location.href = "/QuienesSomos")}>
                <span>Quienes Somos</span>
              </li>
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
