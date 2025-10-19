// API Service Layer
// Centralized API calls for the portfolio

// Determine API base URL based on environment
const API_BASE_URL = import.meta.env.PROD
  ? '/api'  // Production (Vercel)
  : 'http://localhost:5173/api'; // Development

// Helper function for making API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// ============================================
// PUBLIC API FUNCTIONS
// ============================================

/**
 * Get all visible projects
 * @param {string} category - Filter by category ('all', 'web', 'mobile', 'design')
 * @returns {Promise<Object>} Projects data
 */
export async function getProjects(category = 'all') {
  const endpoint = category && category !== 'all'
    ? `/public/projects?category=${category}`
    : '/public/projects';

  return apiRequest(endpoint);
}

/**
 * Get all skills
 * @returns {Promise<Object>} Skills data
 */
export async function getSkills() {
  return apiRequest('/public/skills');
}

/**
 * Submit contact form
 * @param {Object} formData - Contact form data
 * @param {string} formData.name - Sender name
 * @param {string} formData.email - Sender email
 * @param {string} formData.message - Message content
 * @returns {Promise<Object>} Submission response
 */
export async function submitContactForm(formData) {
  return apiRequest('/public/contact', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

// ============================================
// AUTHENTICATION
// ============================================

/**
 * Login admin user
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise<Object>} Login response with token
 */
export async function login(email, password) {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  // Save token to localStorage if login successful
  if (response.success && response.data.token) {
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response;
}

/**
 * Logout admin user
 */
export function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/src/admin/login.html';
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  return !!localStorage.getItem('authToken');
}

/**
 * Get current user from localStorage
 * @returns {Object|null}
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Get auth headers for admin requests
 * @returns {Object}
 */
function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
  };
}

// ============================================
// ADMIN API FUNCTIONS - PROJECTS
// ============================================

/**
 * Get all projects (admin)
 * @returns {Promise<Object>}
 */
export async function adminGetProjects() {
  return apiRequest('/admin/projects', {
    headers: getAuthHeaders(),
  });
}

/**
 * Create new project
 * @param {Object} projectData - Project data
 * @returns {Promise<Object>}
 */
export async function adminCreateProject(projectData) {
  return apiRequest('/admin/projects', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(projectData),
  });
}

/**
 * Update project
 * @param {number} id - Project ID
 * @param {Object} updates - Updated fields
 * @returns {Promise<Object>}
 */
export async function adminUpdateProject(id, updates) {
  return apiRequest(`/admin/projects?id=${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
}

/**
 * Delete project
 * @param {number} id - Project ID
 * @returns {Promise<Object>}
 */
export async function adminDeleteProject(id) {
  return apiRequest(`/admin/projects?id=${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}

// ============================================
// ADMIN API FUNCTIONS - SKILLS
// ============================================

/**
 * Get all skills (admin)
 * @returns {Promise<Object>}
 */
export async function adminGetSkills() {
  return apiRequest('/admin/skills', {
    headers: getAuthHeaders(),
  });
}

/**
 * Create new skill
 * @param {Object} skillData - Skill data
 * @returns {Promise<Object>}
 */
export async function adminCreateSkill(skillData) {
  return apiRequest('/admin/skills', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(skillData),
  });
}

/**
 * Update skill
 * @param {number} id - Skill ID
 * @param {Object} updates - Updated fields
 * @returns {Promise<Object>}
 */
export async function adminUpdateSkill(id, updates) {
  return apiRequest(`/admin/skills?id=${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
}

/**
 * Delete skill
 * @param {number} id - Skill ID
 * @returns {Promise<Object>}
 */
export async function adminDeleteSkill(id) {
  return apiRequest(`/admin/skills?id=${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}

// ============================================
// ADMIN API FUNCTIONS - MESSAGES
// ============================================

/**
 * Get all contact messages
 * @returns {Promise<Object>}
 */
export async function adminGetMessages() {
  return apiRequest('/admin/messages', {
    headers: getAuthHeaders(),
  });
}

/**
 * Mark message as read
 * @param {number} id - Message ID
 * @returns {Promise<Object>}
 */
export async function adminMarkMessageRead(id) {
  return apiRequest(`/admin/messages?id=${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
}

/**
 * Delete message
 * @param {number} id - Message ID
 * @returns {Promise<Object>}
 */
export async function adminDeleteMessage(id) {
  return apiRequest(`/admin/messages?id=${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}

// Export API_BASE_URL for testing purposes
export { API_BASE_URL };
