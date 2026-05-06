const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getAdminUser() {
  return sessionStorage.getItem(USER_KEY) || 'Admin';
}

export function setSession({ token, username }) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, username || 'Admin');
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}
