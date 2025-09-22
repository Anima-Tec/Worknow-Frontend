import React from 'react';
import "./homeCompany.css";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosContacts, IoIosNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import ContactCompany from './ContactCompany';
import { Link } from 'react-router-dom'

export default function HomeCompany() {
  return (
    <div>
      <header className="header">
        <h1 className="h1">
          work<span>now</span>
        </h1>
        <nav className="nav">
          <ul>
         <li className="nav-item" onClick={() => window.location.reload()}>
        <AiOutlineHome />
        <span>Home</span>
        </li>
          <li className="nav-item" onClick={() => window.location.href = '/contactcompany'}>
          <IoIosContacts />
          <span>Contacto</span>
          </li>
          <li className="nav-item" onClick={() => {}}>
            <IoIosNotifications />
            <span>Notificaciones</span>
              </li>
            <li className="nav-item" onClick={() => window.location.href = '/PerfilCompany'}>
              <CgProfile />
              <span>Perfil</span>
            </li>
          </ul>
        </nav>
      </header>
      <div className="video-container">
        <video src="/EMPRESA.mp4" autoPlay loop muted />
      </div>
      <div className="cards-container">
      <div className="card1">
        <h2>Publicar proyecto Freelance</h2>
        <p>Accedé a talento independiente que se adapta a las necesidades de tu empresa.</p>
        <button className="primaryBtn">
       Publicar Proyecto
      </button>

      </div>
      <div className="card2">
        <h2>Publicar puesto de Trabajo</h2>
        <p>Busca el perfil ideal y suma profesionales comprometidos a largo plazo.</p>
        <button className="primaryBtn">
         Publicar trabajo
        </button>
      </div>
      </div>

       <section className="job-postings">
        <h2>Puestos de Trabajo publicados</h2>
        <div className="jobs">
          <div className="job-card">
            <p>Senior UX/UI Designer</p>
            <p>Salary: $70,000</p>
          </div>
          <div className="job-card">
            <p>Senior UX/UI Designer</p>
            <p>Salary: $65,000</p>
          </div>
        </div>
      </section>

      <section className="freelancer-postings">
        <h2>Puestos Freelancer publicados</h2>
        <div className="freelancer-jobs">
          <div className="job-card">
            <p>Logo minimalista</p>
            <p>Freelance</p>
          </div>
          <div className="job-card">
            <p>Instalación de software</p>
            <p>Freelance</p>
          </div>
        </div>
      </section>
      </div>
      
  );
}
