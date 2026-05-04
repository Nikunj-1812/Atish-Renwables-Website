const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getAdminUser() {
  return localStorage.getItem(USER_KEY) || 'Admin';
}

export function setSession({ token, username }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, username || 'Admin');
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}
