// API Service Layer
const API_BASE_URL = '/api';

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  };

  const response = await fetch(url, config);
  const data = await response.json();
  
  if (!response.ok) throw new Error(data.error || 'API request failed');
  return data;
}

// Auth
export async function login(email, password) {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  if (response.success && response.data.token) {
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response;
}

export function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/admin/login.html';
}

export function isAuthenticated() {
  return !!localStorage.getItem('authToken');
}

export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return { 'Authorization': `Bearer ${token}` };
}

// Admin APIs
export async function adminGetProjects() {
  return apiRequest('/admin/projects', { headers: getAuthHeaders() });
}

export async function adminGetSkills() {
  return apiRequest('/admin/skills', { headers: getAuthHeaders() });
}

export async function adminGetMessages() {
  return apiRequest('/admin/messages', { headers: getAuthHeaders() });
}

export async function adminCreateProject(data) {
  return apiRequest('/admin/projects', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
}

export async function adminUpdateProject(id, data) {
  return apiRequest(`/admin/projects?id=${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
}

export async function adminDeleteProject(id) {
  return apiRequest(`/admin/projects?id=${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
}
