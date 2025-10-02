export function saveSession({ token, user }, { rememberEmail }) {
  if (token) localStorage.setItem('token', token); 
  localStorage.setItem('user', JSON.stringify(user));
  if (rememberEmail) localStorage.setItem('rememberEmail', user.email);
  else localStorage.removeItem('rememberEmail');
}

export function getRememberedEmail() {
  return localStorage.getItem('rememberEmail') || '';
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
