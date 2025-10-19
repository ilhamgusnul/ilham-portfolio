import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Login - Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: { poppins: ["Poppins", "sans-serif"] },
          colors: { orange: "#FF6B00" }
        }
      }
    };
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body class="font-poppins bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
  <div class="w-full max-w-md px-6">
    <div class="bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-black mb-2">Admin Login</h1>
        <p class="text-gray-600">Portfolio Management System</p>
      </div>

      <form id="loginForm" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input type="email" id="email" name="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent transition-all" placeholder="admin@example.com" />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input type="password" id="password" name="password" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent transition-all" placeholder="Enter your password" />
        </div>

        <div id="errorMessage" class="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"></div>

        <button type="submit" id="submitButton" class="w-full bg-orange text-white py-3 rounded-lg font-medium hover:bg-orange/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2">
          Sign In
        </button>
      </form>

      <div class="mt-6 text-center">
        <a href="/" class="text-sm text-gray-600 hover:text-orange transition-colors">← Back to Portfolio</a>
      </div>
    </div>

    <div class="mt-6 text-center text-sm text-gray-600">
      <p>Default credentials:</p>
      <p class="font-mono text-xs mt-1">Email: i.romadhon26@gmail.com<br />Password: admin123</p>
    </div>
  </div>

  <script type="module">
    const API_BASE_URL = '/api';

    function isAuthenticated() {
      return !!localStorage.getItem('authToken');
    }

    if (isAuthenticated()) {
      window.location.href = '/api/admin-dashboard';
    }

    async function login(email, password) {
      const response = await fetch(API_BASE_URL + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success && data.data.token) {
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }

      return data;
    }

    const loginForm = document.getElementById('loginForm');
    const submitButton = document.getElementById('submitButton');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      errorMessage.classList.add('hidden');
      submitButton.disabled = true;
      submitButton.textContent = 'Signing in...';

      try {
        const response = await login(email, password);

        if (response.success) {
          window.location.href = '/api/admin-dashboard';
        } else {
          errorMessage.textContent = response.error || 'Login failed';
          errorMessage.classList.remove('hidden');
        }
      } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'Invalid email or password';
        errorMessage.classList.remove('hidden');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Sign In';
      }
    });
  </script>
</body>
</html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
