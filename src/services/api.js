const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// 🔹 Login
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

// 🔹 Buscar trabajos con filtros
export async function searchJobs(filters) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE}/jobs?${params}`);
  return res.ok ? res.json() : [];
}

// 🔹 Buscar proyectos con filtros
export async function searchProjects(filters) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE}/projects?${params}`);
  return res.ok ? res.json() : [];
}
