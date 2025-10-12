// ======================= 🌐 CONFIGURACIÓN BASE ==========================
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";


// ============================ 🔐 LOGIN =================================
export async function loginApi({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!res.ok) throw new Error("Credenciales inválidas");
  return res.json();
}


// ======================== 💼 TRABAJOS ==================================
export async function searchJobs(filters) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE}/jobs?${params}`);
  return res.ok ? res.json() : [];
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


// ======================== 🧩 PROYECTOS =================================
export async function searchProjects(filters) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE}/projects?${params}`);
  return res.ok ? res.json() : [];
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


// ==================== 📩 POSTULACIONES (APPLY) ==========================
export async function sendApplication({ projectId, name, email }) {
  try {
    // 🔐 Recuperar token del usuario logueado
    const token = localStorage.getItem("token");

    console.log(
      "🚀 Enviando postulación a:",
      `${API_BASE}/applications/project/${projectId}/apply`
    );

    const res = await fetch(
      `${API_BASE}/applications/project/${projectId}/apply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Token enviado al backend
        },
        body: JSON.stringify({ name, email }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("⚠️ Error en la API de postulación:", res.status, text);
      throw new Error(
        JSON.parse(text)?.message || "Error al enviar postulación"
      );
    }

    const data = await res.json();
    console.log("✅ Postulación enviada correctamente:", data);
    return data;
  } catch (error) {
    console.error("❌ Error en sendApplication:", error);
    throw error;
  }
}



// ==================== 🏢 EMPRESAS (VER POSTULADOS) =====================
export async function getCompanyApplications() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const companyId = user?.id;

  if (!token || !companyId) {
    console.warn("⚠️ No hay token o empresa logueada");
    return [];
  }

  const res = await fetch(`${API_BASE}/applications/company/${companyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Error obteniendo postulaciones:", res.status, text);
    throw new Error("Error obteniendo postulaciones de la empresa");
  }

  const data = await res.json();
  console.log("📦 Postulaciones de empresa:", data);
  return data;
}


// ==================== 🔄 ACTUALIZAR ESTADO POSTULACIÓN =================
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
