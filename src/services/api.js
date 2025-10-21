// ======================= 🌐 CONFIGURACIÓN BASE ==========================
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// ======================= 🔧 UTILIDADES DE ERROR ==========================
class ApiError extends Error {
  constructor(message, status, code, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Función para manejar errores de API de forma consistente
async function handleApiResponse(response) {
  if (response.ok) {
    return await response.json();
  }

  let errorData;
  try {
    errorData = await response.json();
  } catch {
    errorData = { message: 'Error de conexión con el servidor' };
  }

  // Mapeo de códigos de estado HTTP a mensajes de error específicos
  const errorMessages = {
    400: 'Datos inválidos enviados al servidor',
    401: 'Sesión expirada. Por favor, iniciá sesión nuevamente',
    403: 'No tenés permisos para realizar esta acción',
    404: 'El recurso solicitado no fue encontrado',
    409: 'Conflicto: El recurso ya existe o está en uso',
    422: 'Datos de validación incorrectos',
    429: 'Demasiadas solicitudes. Intentá nuevamente en unos minutos',
    500: 'Error interno del servidor. Intentá nuevamente más tarde',
    503: 'Servicio temporalmente no disponible'
  };

  const message = errorData.message || errorMessages[response.status] || 'Error desconocido';
  
  throw new ApiError(message, response.status, errorData.code, errorData.details);
}

// Función para crear headers de autenticación
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Función para verificar si el token está expirado
function isTokenExpired(error) {
  return error.status === 401 || (error.message && error.message.includes('token'));
}

// Función para limpiar sesión expirada
function clearExpiredSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('rememberEmail');
  localStorage.removeItem('role');
}

// Función para redirigir al login
function redirectToLogin() {
  clearExpiredSession();
  window.location.href = '/login';
}

// ============================ 🔐 AUTH =================================
export async function loginApi({ email, password }) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleApiResponse(res);

    // 🟣 Guardar token y datos de usuario
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("✅ Token guardado correctamente");
    } else {
      console.warn("⚠️ No se recibió token del backend:", data);
    }

    return data;
  } catch (error) {
    console.error("❌ Error en login:", error);
    throw error;
  }
}

export async function registerUser(userData) {
  try {
    const res = await fetch(`${API_BASE}/auth/register/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    return await handleApiResponse(res);
  } catch (error) {
    console.error("❌ Error en registro de usuario:", error);
    throw error;
  }
}

export async function registerCompany(companyData) {
  try {
    const res = await fetch(`${API_BASE}/auth/register/company`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(companyData),
    });

    return await handleApiResponse(res);
  } catch (error) {
    console.error("❌ Error en registro de empresa:", error);
    throw error;
  }
}

// ============================ 👤 PERFIL ================================
export async function getProfile() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new ApiError("No hay token de autenticación", 401, "NO_TOKEN");
    }

    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: getAuthHeaders(),
    });

    const result = await handleApiResponse(res);

    // ✅ Arreglo clave: el backend devuelve { success: true, data: {...} }
    // así que devolvemos solo la parte "data"
    return result.data || result;
  } catch (error) {
    if (isTokenExpired(error)) {
      redirectToLogin();
    }
    console.error("❌ Error obteniendo perfil:", error);
    throw error;
  }
}
export async function updateProfile(profileData) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new ApiError("No hay token de autenticación", 401, "NO_TOKEN");
    }

    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(profileData),
    });

    const data = await handleApiResponse(res);
    return data;
  } catch (error) {
    if (isTokenExpired(error)) {
      redirectToLogin();
    }
    console.error("❌ Error actualizando perfil:", error);
    throw error;
  }
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
    const data = await handleApiResponse(res);
    
    console.log(`✅ ${data.length} trabajos encontrados`);
    return data;
  } catch (error) {
    console.error("❌ Error en searchJobs:", error);
    // Retornar array vacío en caso de error para no romper la UI
    return [];
  }
}

export async function getJobs() {
  try {
    const res = await fetch(`${API_BASE}/jobs`);
    return await handleApiResponse(res);
  } catch (error) {
    console.error("❌ Error obteniendo trabajos:", error);
    throw error;
  }
}

export async function createJob(jobData) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new ApiError("No hay token de autenticación", 401, "NO_TOKEN");
    }

    const res = await fetch(`${API_BASE}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(jobData),
    });

    return await handleApiResponse(res);
  } catch (error) {
    if (isTokenExpired(error)) {
      redirectToLogin();
    }
    console.error("❌ Error creando trabajo:", error);
    throw error;
  }
}

export async function getJobById(id) {
  try {
    const res = await fetch(`${API_BASE}/jobs/${id}`);
    return await handleApiResponse(res);
  } catch (error) {
    console.error("❌ Error obteniendo trabajo:", error);
    throw error;
  }
}

export async function applyToJob(jobId, applicationData) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new ApiError("No hay token de autenticación", 401, "NO_TOKEN");
    }

    console.log("datos enviados:", applicationData);

    const res = await fetch(`${API_BASE}/applications/job/${jobId}/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(applicationData),
    });

    return await handleApiResponse(res);
  } catch (error) {
    if (isTokenExpired(error)) {
      redirectToLogin();
    }
    console.error("❌ Error postulando a trabajo:", error);
    throw error;
  }
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
    const data = await handleApiResponse(res);
    
    console.log(`✅ ${data.length} proyectos encontrados`);
    return data;
  } catch (error) {
    console.error("❌ Error en searchProjects:", error);
    // Retornar array vacío en caso de error para no romper la UI
    return [];
  }
}

export async function createProject(projectData) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new ApiError("No hay token de autenticación", 401, "NO_TOKEN");
    }

    const res = await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(projectData),
    });

    return await handleApiResponse(res);
  } catch (error) {
    if (isTokenExpired(error)) {
      redirectToLogin();
    }
    console.error("❌ Error creando proyecto:", error);
    throw error;
  }
}

export async function getProjectById(id) {
  try {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    return await handleApiResponse(res);
  } catch (error) {
    console.error("❌ Error obteniendo proyecto:", error);
    throw error;
  }
}

// ==================== 📩 POSTULACIONES ================================
export async function sendApplication({ projectId, name, email }) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new ApiError("No hay token de autenticación", 401, "NO_TOKEN");
    }

    const res = await fetch(`${API_BASE}/applications/project/${projectId}/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ name, email }),
    });

    return await handleApiResponse(res);
  } catch (error) {
    if (isTokenExpired(error)) {
      redirectToLogin();
    }
    console.error("❌ Error enviando postulación:", error);
    throw error;
  }
}

export async function getCompanyApplications() {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const companyId = user?.id;

    if (!token || !companyId) {
      throw new ApiError("No hay token de autenticación o ID de empresa", 401, "NO_TOKEN_OR_COMPANY");
    }

    const res = await fetch(`${API_BASE}/applications/company/${companyId}`, {
      headers: getAuthHeaders(),
    });

    return await handleApiResponse(res);
  } catch (error) {
    if (isTokenExpired(error)) {
      redirectToLogin();
    }
    console.error("❌ Error obteniendo postulaciones:", error);
    throw error;
  }
}

export async function updateApplicationStatus(id, status) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new ApiError("No hay token de autenticación", 401, "NO_TOKEN");
    }

    const res = await fetch(`${API_BASE}/applications/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    });

    return await handleApiResponse(res);
  } catch (error) {
    if (isTokenExpired(error)) {
      redirectToLogin();
    }
    console.error("❌ Error actualizando estado:", error);
    throw error;
  }
}

// ==================== 📋 MIS POSTULACIONES ============================
export async function getMyApplications() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new ApiError("No hay token de autenticación", 401, "NO_TOKEN");
    }

    const res = await fetch(`${API_BASE}/applications/user/me`, {
      headers: getAuthHeaders(),
    });

    return await handleApiResponse(res);
  } catch (error) {
    if (isTokenExpired(error)) {
      redirectToLogin();
    }
    console.error("❌ Error obteniendo mis postulaciones:", error);
    throw error;
  }
}

// ==================== 🔔 NOTIFICACIONES ===============================
export async function getNotificationCount() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return 0;

    const res = await fetch(`${API_BASE}/applications/notifications/count`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) return 0;
    const data = await handleApiResponse(res);
    return data.count || 0;
  } catch (error) {
    console.error("❌ Error obteniendo notificaciones:", error);
    return 0;
  }
}

export async function markApplicationAsRead(applicationId) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new ApiError("No hay token de autenticación", 401, "NO_TOKEN");
    }

    const res = await fetch(`${API_BASE}/applications/${applicationId}/mark-read`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });

    return await handleApiResponse(res);
  } catch (error) {
    if (isTokenExpired(error)) {
      redirectToLogin();
    }
    console.error("❌ Error marcando como leído:", error);
    throw error;
  }
}