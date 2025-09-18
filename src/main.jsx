import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import './index.css'

function Placeholder({ title }) {
  return <div style={{ padding: 24, fontFamily: 'sans-serif' }}>{title}</div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/choose-role" element={<Placeholder title="Elegir rol (WIP)" />} />
        <Route path="/onboarding/company" element={<Placeholder title="Onboarding Company" />} />
        <Route path="/onboarding/user" element={<Placeholder title="Onboarding User" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
