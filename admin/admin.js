// Admin Dashboard Shared Functions
import { isAuthenticated, getCurrentUser, logout } from '/src/services/api.js';

// Check authentication on page load
export function checkAuth() {
  if (!isAuthenticated()) {
    window.location.href = '/admin/login.html';
    return false;
  }
  return true;
}

// Get current user info
export function displayUserInfo() {
  const user = getCurrentUser();
  if (user) {
    const userInfoElements = document.querySelectorAll('.user-info');
    userInfoElements.forEach(el => {
      el.textContent = user.name || user.email;
    });
  }
}

// Logout handler
export function setupLogout() {
  const logoutButtons = document.querySelectorAll('.logout-btn');
  logoutButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to logout?')) {
        logout();
      }
    });
  });
}

// Show notification
export function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
    type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  } text-white`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Show loading overlay
export function showLoading(container) {
  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.innerHTML = '<div class="text-gray-500">Loading...</div>';
  container.innerHTML = '';
  container.appendChild(loading);
}

// Modal helper
export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Confirm dialog
export function confirmAction(message) {
  return confirm(message);
}

// Format date
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Initialize admin page
export function initAdmin() {
  checkAuth();
  displayUserInfo();
  setupLogout();
}
