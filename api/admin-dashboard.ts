import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard - Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Poppins', sans-serif; }
  </style>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div class="flex items-center gap-4">
          <span class="text-gray-600 user-info"></span>
          <button onclick="logout()" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Logout</button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="text-gray-500 text-sm">Total Projects</div>
          <div class="text-3xl font-bold text-gray-900 mt-2" id="totalProjects">0</div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="text-gray-500 text-sm">Total Skills</div>
          <div class="text-3xl font-bold text-gray-900 mt-2" id="totalSkills">0</div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="text-gray-500 text-sm">Unread Messages</div>
          <div class="text-3xl font-bold text-gray-900 mt-2" id="unreadMessages">0</div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">Quick Actions</h2>
        <div class="flex gap-4 flex-wrap">
          <a href="/api/admin-projects" class="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600">Manage Projects</a>
          <a href="/api/admin-skills" class="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600">Manage Skills</a>
          <a href="/api/admin-messages" class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">View Messages</a>
        </div>
      </div>
    </main>
  </div>

  <script>
    function isAuthenticated() {
      return !!localStorage.getItem('authToken');
    }

    function getCurrentUser() {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }

    function logout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/api/admin-login';
    }

    if (!isAuthenticated()) {
      window.location.href = '/api/admin-login';
    }

    const user = getCurrentUser();
    if (user) {
      document.querySelector('.user-info').textContent = user.name || user.email;
    }

    async function loadStats() {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Authorization': 'Bearer ' + token
      };

      try {
        const [projects, skills, messages] = await Promise.all([
          fetch('/api/admin/projects', { headers }).then(r => r.json()),
          fetch('/api/admin/skills', { headers }).then(r => r.json()),
          fetch('/api/admin/messages', { headers }).then(r => r.json())
        ]);

        document.getElementById('totalProjects').textContent = projects.data?.length || 0;
        document.getElementById('totalSkills').textContent = skills.data?.length || 0;

        const unread = messages.data?.filter(m => !m.isRead).length || 0;
        document.getElementById('unreadMessages').textContent = unread;
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }

    loadStats();
  </script>
</body>
</html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
