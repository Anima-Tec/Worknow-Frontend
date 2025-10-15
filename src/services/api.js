// ======================= 🌐 CONFIGURACIÓN BASE ==========================
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// ============================ 🔐 AUTH =================================
export async function loginApi({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Credenciales inválidas");
  }

  const data = await res.json();

  // 🟣 Guardar token y datos de usuario
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    console.log("✅ Token guardado correctamente:", data.token);
  } else {
    console.warn("⚠️ No se recibió token del backend:", data);
  }

  return data;
}

export async function registerUser(userData) {
  const res = await fetch(`${API_BASE}/auth/register/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al registrar usuario");
  }

  return res.json();
}

export async function registerCompany(companyData) {
  const res = await fetch(`${API_BASE}/auth/register/company`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(companyData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al registrar empresa");
  }

  return res.json();
}

// ============================ 👤 PERFIL ================================
export async function getProfile() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token de autenticación");

  const res = await fetch(`${API_BASE}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error obteniendo perfil");

  return res.json();
}

export async function updateProfile(profileData) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token de autenticación");

  const res = await fetch(`${API_BASE}/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error actualizando perfil");
  }

  return res.json();
}

// ======================== 💼 TRABAJOS =================================
export async function searchJobs(filters) {
  try {
    console.log("🔍 Buscando trabajos con filters:", filters);
    
    // Construir URL de forma MÁS SIMPLE
    let url = `${API_BASE}/jobs`;
    const params = [];
    
    if (filters.query && filters.query.trim() !== '') {
      params.push(`query=${encodeURIComponent(filters.query.trim())}`);
    }
    if (filters.type && filters.type.trim() !== '') {
      params.push(`type=${encodeURIComponent(filters.type.trim())}`);
    }
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    console.log("🔍 URL final jobs:", url);
    
    const res = await fetch(url);
    
    if (!res.ok) {
      console.error(`❌ Error ${res.status} en jobs:`, await res.text());
      return [];
    }
    
    const data = await res.json();
    console.log(`✅ ${data.length} trabajos encontrados`);
    return data;
  } catch (error) {
    console.error("❌ Error en searchJobs:", error);
    return [];
  }
}

export async function getJobs() {
  const res = await fetch(`${API_BASE}/jobs`);
  if (!res.ok) throw new Error("Error obteniendo trabajos");
  return res.json();
}

export async function createJob(jobData) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Error creando trabajo:", text);
    throw new Error("Error al crear trabajo");
  }

  return res.json();
}

export async function getJobById(id) {
  const res = await fetch(`${API_BASE}/jobs/${id}`);
  if (!res.ok) throw new Error("Error obteniendo trabajo");
  return res.json();
}

export async function applyToJob(jobId, applicationData) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/applications/job/${jobId}/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(applicationData),
  });
  console.log("datos enviados:", applicationData);
  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Error postulando a trabajo:", res.status, text);
    throw new Error("Error al postular al trabajo");
  }

  return res.json();
}

// ======================== 🧩 PROYECTOS ================================
export async function searchProjects(filters) {
  try {
    console.log("🔍 Buscando proyectos con filters:", filters);
    
    // Construir URL de forma MÁS SIMPLE
    let url = `${API_BASE}/projects`;
    const params = [];
    
    if (filters.query && filters.query.trim() !== '') {
      params.push(`query=${encodeURIComponent(filters.query.trim())}`);
    }
    if (filters.type && filters.type.trim() !== '') {
      params.push(`type=${encodeURIComponent(filters.type.trim())}`);
    }
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    console.log("🔍 URL final projects:", url);
    
    const res = await fetch(url);
    
    if (!res.ok) {
      console.error(`❌ Error ${res.status} en projects:`, await res.text());
      return [];
    }
    
    const data = await res.json();
    console.log(`✅ ${data.length} proyectos encontrados`);
    return data;
  } catch (error) {
    console.error("❌ Error en searchProjects:", error);
    return [];
  }
}

export async function createProject(projectData) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Error creando proyecto:", text);
    throw new Error("Error al crear proyecto");
  }

  return res.json();
}

export async function getProjectById(id) {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  if (!res.ok) throw new Error("Error obteniendo proyecto");
  return res.json();
}

// ==================== 📩 POSTULACIONES ================================
export async function sendApplication({ projectId, name, email }) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/applications/project/${projectId}/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("⚠️ Error en la API de postulación:", res.status, text);
    throw new Error("Error al enviar postulación");
  }

  return res.json();
}

export async function getCompanyApplications() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const companyId = user?.id;

  if (!token || !companyId) return [];

  const res = await fetch(`${API_BASE}/applications/company/${companyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Error obteniendo postulaciones:", res.status, text);
    throw new Error("Error obteniendo postulaciones de la empresa");
  }

  return res.json();
}

export async function updateApplicationStatus(id, status) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/applications/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Error actualizando estado:", res.status, text);
    throw new Error("Error actualizando estado");
  }

  return res.json();
}

// ==================== 📋 MIS POSTULACIONES ============================
export async function getMyApplications() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token de autenticación");

  const res = await fetch(`${API_BASE}/applications/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Error obteniendo mis postulaciones:", res.status, text);
    throw new Error("Error obteniendo mis postulaciones");
  }

  return res.json();
}

// ==================== 🔔 NOTIFICACIONES ===============================
export async function getNotificationCount() {
  const token = localStorage.getItem("token");
  if (!token) return 0;

  try {
    const res = await fetch(`${API_BASE}/applications/notifications/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return 0;
    const data = await res.json();
    return data.count || 0;
  } catch (error) {
    console.error("❌ Error obteniendo notificaciones:", error);
    return 0;
  }
}

export async function markApplicationAsRead(applicationId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/applications/${applicationId}/mark-read`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Error marcando como leído:", res.status, text);
    throw new Error("Error marcando notificación como leída");
  }

  return res.json();
}