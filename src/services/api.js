const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export async function loginApi({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // solo si usás cookies
  });

  if (!res.ok) {
    throw new Error('Credenciales inválidas');
  }

  return res.json();
}
