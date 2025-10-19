// API Test Examples
// Copy and run these in browser console or create a test file

const API_BASE_URL = 'http://localhost:5173/api'; // Change to your Vercel URL in production

// ============================================
// PUBLIC API TESTS (No Auth Required)
// ============================================

// 1. Get All Projects
async function testGetProjects() {
  try {
    const response = await fetch(`${API_BASE_URL}/public/projects`);
    const data = await response.json();
    console.log('Projects:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 2. Get Projects by Category
async function testGetProjectsByCategory(category = 'web') {
  try {
    const response = await fetch(`${API_BASE_URL}/public/projects?category=${category}`);
    const data = await response.json();
    console.log(`${category} Projects:`, data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 3. Get All Skills
async function testGetSkills() {
  try {
    const response = await fetch(`${API_BASE_URL}/public/skills`);
    const data = await response.json();
    console.log('Skills:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 4. Submit Contact Form
async function testContactForm() {
  try {
    const response = await fetch(`${API_BASE_URL}/public/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message from API test',
      }),
    });
    const data = await response.json();
    console.log('Contact Form Response:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// ============================================
// AUTHENTICATION
// ============================================

// 5. Login
async function testLogin(email = 'i.romadhon26@gmail.com', password = 'admin123') {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log('Login Response:', data);

    if (data.success) {
      // Store token in localStorage
      localStorage.setItem('authToken', data.data.token);
      console.log('Token saved to localStorage');
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// ============================================
// ADMIN API TESTS (Auth Required)
// ============================================

// 6. Get All Projects (Admin)
async function testAdminGetProjects() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/projects`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    console.log('Admin Projects:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 7. Create New Project
async function testCreateProject() {
  try {
    const newProject = {
      title: 'Test Project',
      description: 'This is a test project created via API',
      techStack: ['React', 'Node.js', 'PostgreSQL'],
      category: 'web',
      completedDate: 'January 2024',
      order: 10,
      isVisible: true,
    };

    const response = await fetch(`${API_BASE_URL}/admin/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newProject),
    });
    const data = await response.json();
    console.log('Created Project:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 8. Update Project
async function testUpdateProject(projectId) {
  try {
    const updates = {
      title: 'Updated Project Title',
      description: 'This project has been updated',
      isVisible: false,
    };

    const response = await fetch(`${API_BASE_URL}/admin/projects?id=${projectId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    console.log('Updated Project:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 9. Delete Project
async function testDeleteProject(projectId) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/projects?id=${projectId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    console.log('Delete Response:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 10. Get All Skills (Admin)
async function testAdminGetSkills() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/skills`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    console.log('Admin Skills:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 11. Create New Skill
async function testCreateSkill() {
  try {
    const newSkill = {
      title: 'Backend Development',
      proficiency: 90,
      tools: ['Node.js', 'Express', 'PostgreSQL'],
      order: 5,
    };

    const response = await fetch(`${API_BASE_URL}/admin/skills`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newSkill),
    });
    const data = await response.json();
    console.log('Created Skill:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 12. Update Skill
async function testUpdateSkill(skillId) {
  try {
    const updates = {
      proficiency: 95,
      tools: ['Node.js', 'Express', 'PostgreSQL', 'Drizzle ORM'],
    };

    const response = await fetch(`${API_BASE_URL}/admin/skills?id=${skillId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    console.log('Updated Skill:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 13. Delete Skill
async function testDeleteSkill(skillId) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/skills?id=${skillId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    console.log('Delete Response:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 14. Get All Contact Messages
async function testGetMessages() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/messages`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    console.log('Messages:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 15. Mark Message as Read
async function testMarkMessageRead(messageId) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/messages?id=${messageId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    console.log('Mark Read Response:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 16. Delete Message
async function testDeleteMessage(messageId) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/messages?id=${messageId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    console.log('Delete Response:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// ============================================
// RUN ALL TESTS
// ============================================

async function runAllTests() {
  console.log('🧪 Starting API Tests...\n');

  // Public APIs
  console.log('📝 Testing Public APIs...');
  await testGetProjects();
  await testGetProjectsByCategory('web');
  await testGetSkills();
  await testContactForm();

  // Authentication
  console.log('\n🔐 Testing Authentication...');
  await testLogin();

  // Wait a bit for token to be saved
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Admin APIs
  console.log('\n⚙️ Testing Admin APIs...');
  await testAdminGetProjects();
  await testAdminGetSkills();
  await testGetMessages();

  // CRUD Operations
  console.log('\n✏️ Testing CRUD Operations...');
  const newProject = await testCreateProject();
  if (newProject?.data?.id) {
    await testUpdateProject(newProject.data.id);
    // Don't delete in test, but you can uncomment:
    // await testDeleteProject(newProject.data.id);
  }

  const newSkill = await testCreateSkill();
  if (newSkill?.data?.id) {
    await testUpdateSkill(newSkill.data.id);
    // Don't delete in test, but you can uncomment:
    // await testDeleteSkill(newSkill.data.id);
  }

  console.log('\n✅ All tests completed!');
}

// ============================================
// USAGE INSTRUCTIONS
// ============================================

console.log(`
📋 API Test Functions Available:

PUBLIC APIs (No Auth):
- testGetProjects()
- testGetProjectsByCategory('web')
- testGetSkills()
- testContactForm()

AUTHENTICATION:
- testLogin()

ADMIN APIs (Auth Required):
- testAdminGetProjects()
- testCreateProject()
- testUpdateProject(id)
- testDeleteProject(id)
- testAdminGetSkills()
- testCreateSkill()
- testUpdateSkill(id)
- testDeleteSkill(id)
- testGetMessages()
- testMarkMessageRead(id)
- testDeleteMessage(id)

RUN ALL:
- runAllTests()

Example:
> await testLogin()
> await testGetProjects()
> await runAllTests()
`);

// Export functions for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testGetProjects,
    testGetProjectsByCategory,
    testGetSkills,
    testContactForm,
    testLogin,
    testAdminGetProjects,
    testCreateProject,
    testUpdateProject,
    testDeleteProject,
    testAdminGetSkills,
    testCreateSkill,
    testUpdateSkill,
    testDeleteSkill,
    testGetMessages,
    testMarkMessageRead,
    testDeleteMessage,
    runAllTests,
  };
}
