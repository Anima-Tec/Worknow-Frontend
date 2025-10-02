const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export async function loginApi({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Credenciales inválidas");
  }

  return res.json();
}

export async function searchJobs(filters) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE}/jobs?${params}`);
  return res.ok ? res.json() : [];
}

export async function searchProjects(filters) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE}/projects?${params}`);
  return res.ok ? res.json() : [];
}

export async function createJob(jobData) {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobData),
  });

  if (!res.ok) {
    throw new Error("Error al crear trabajo");
  }

  return res.json();
}
export async function getJobs() {
  const res = await fetch(`${API_BASE}/jobs`);
  if (!res.ok) {
    throw new Error("Error obteniendo trabajos");
  }
  return res.json();
}