// Portfolio JavaScript Functionality
import "./style.css";
import { getProjects, getSkills, submitContactForm } from "./services/api.js";

// ============================================
// LOAD DYNAMIC DATA FROM API
// ============================================

// Load Projects from API
async function loadProjects(category = 'all') {
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) return;

  try {
    // Show loading state
    projectsGrid.innerHTML = '<div class="col-span-full text-center py-12"><div class="text-gray-500">Loading projects...</div></div>';

    const response = await getProjects(category);

    if (!response.success || !response.data || response.data.length === 0) {
      projectsGrid.innerHTML = '<div class="col-span-full text-center py-12"><div class="text-gray-500">No projects found</div></div>';
      return;
    }

    // Clear loading state
    projectsGrid.innerHTML = '';

    // Create project cards
    response.data.forEach(project => {
      const card = createProjectCard(project);
      projectsGrid.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading projects:', error);
    projectsGrid.innerHTML = '<div class="col-span-full text-center py-12"><div class="text-red-500">Failed to load projects. Please try again later.</div></div>';
  }
}

// Create project card element
function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'project-card bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300';
  card.setAttribute('data-category', project.category);

  card.innerHTML = `
    <div class="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
      ${project.imageUrl
        ? `<img src="${project.imageUrl}" alt="${project.title}" class="w-full h-full object-cover">`
        : `<span class="text-gray-500">No Image Available</span>`
      }
    </div>
    <h3 class="text-xl font-bold text-black mb-2">${project.title}</h3>
    <p class="text-sm text-gray-500 mb-3">${project.completedDate ? `Completed: ${project.completedDate}` : ''}</p>
    <div class="flex flex-wrap gap-2 mb-4">
      ${project.techStack.map(tech => `
        <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">${tech}</span>
      `).join('')}
    </div>
    <div class="flex gap-4">
      ${project.demoUrl ? `
        <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors">Live Demo</a>
      ` : `
        <a href="#" class="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors">Live Demo</a>
      `}
      ${project.githubUrl ? `
        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="border border-black text-black px-4 py-2 rounded-lg text-sm hover:bg-black hover:text-white transition-colors">GitHub</a>
      ` : `
        <a href="#" class="border border-black text-black px-4 py-2 rounded-lg text-sm hover:bg-black hover:text-white transition-colors">GitHub</a>
      `}
    </div>
  `;

  return card;
}

// Load Skills from API
async function loadSkills() {
  const skillsContainer = document.querySelector('#about .grid');
  if (!skillsContainer) return;

  try {
    const response = await getSkills();

    if (!response.success || !response.data || response.data.length === 0) {
      return;
    }

    // Clear existing skills
    skillsContainer.innerHTML = '';

    // Create skill cards
    response.data.forEach(skill => {
      const card = createSkillCard(skill);
      skillsContainer.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading skills:', error);
    // Keep existing static skills if API fails
  }
}

// Create skill card element
function createSkillCard(skill) {
  const card = document.createElement('div');
  card.className = 'bg-white p-6 rounded-xl shadow-lg skill-card card-hover h-64 flex flex-col';

  card.innerHTML = `
    <h3 class="text-lg font-bold text-black mb-4">${skill.title}</h3>
    <div class="flex-grow"></div>
    <div class="mt-auto">
      <div class="mb-4">
        <div class="flex justify-between text-sm mb-2">
          <span>Proficiency</span>
          <span>${skill.proficiency}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-orange h-2 rounded-full progress-bar" style="width: ${skill.proficiency}%"></div>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        ${skill.tools.map(tool => `
          <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">${tool}</span>
        `).join('')}
      </div>
    </div>
  `;

  return card;
}

// ============================================
// DOM CONTENT LOADED
// ============================================

// Smooth scrolling for navigation links
document.addEventListener("DOMContentLoaded", function () {
  // Load dynamic data
  loadProjects();
  loadSkills();

  // Get all navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');

  // Add smooth scrolling to all navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        // Calculate offset for fixed navbar
        const navbarHeight = document.querySelector("nav").offsetHeight;
        const targetPosition = targetSection.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Project filtering functionality
  const filterButtons = document.querySelectorAll(".filter-btn");

  // Add click event to filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      // Remove active class from all buttons
      filterButtons.forEach((btn) => {
        btn.classList.remove("active", "bg-orange", "text-white");
        btn.classList.add("bg-gray-100", "text-gray-700");
      });

      // Add active class to clicked button
      this.classList.add("active", "bg-orange", "text-white");
      this.classList.remove("bg-gray-100", "text-gray-700");

      // Reload projects with filter
      loadProjects(filter);
    });
  });

  // Form submission handling
  const contactForm = document.querySelector("form");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const name = formData.get("name");
      const email = formData.get("email");
      const message = formData.get("message");

      // Simple validation
      if (!name || !email || !message) {
        showNotification("Please fill in all fields", "error");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification("Please enter a valid email address", "error");
        return;
      }

      // Get submit button
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;

      try {
        // Disable submit button and show loading
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        // Submit to API
        const response = await submitContactForm({ name, email, message });

        if (response.success) {
          showNotification("Thank you for your message! I will get back to you soon.", "success");
          this.reset();
        } else {
          showNotification("Failed to send message. Please try again.", "error");
        }
      } catch (error) {
        console.error("Contact form error:", error);
        showNotification("Failed to send message. Please try again.", "error");
      } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    });
  }

  // Navbar scroll effect
  const navbar = document.querySelector("nav");
  let lastScrollTop = 0;

  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      navbar.classList.add("shadow-lg");
    } else {
      navbar.classList.remove("shadow-lg");
    }

    lastScrollTop = scrollTop;
  });

  // Add animation on scroll for elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-in");
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    ".project-card, .service-card, .skill-card"
  );
  animateElements.forEach((el) => {
    observer.observe(el);
  });

  // Back to top functionality
  const backToTopButton = document.getElementById("backToTop");

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  });

  backToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // CTA Section Enhancements
  const ctaSection = document.querySelector("section.bg-gradient-to-br");
  if (ctaSection) {
    const ctaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add animation classes to CTA elements
            const badge = entry.target.querySelector(".inline-flex");
            const heading = entry.target.querySelector("h2");
            const description = entry.target.querySelector("p");
            const buttons = entry.target.querySelectorAll("a");
            const trustCards = entry.target.querySelectorAll(".bg-white\\/5");

            if (badge) badge.classList.add("animate-fade-in-up");
            if (heading) heading.classList.add("animate-fade-in-up");
            if (description) description.classList.add("animate-fade-in-up");

            buttons.forEach((button, index) => {
              setTimeout(() => {
                button.classList.add("animate-fade-in-up");
              }, index * 200);
            });

            trustCards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add("animate-fade-in-up");
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    ctaObserver.observe(ctaSection);
  }
});

// ============================================
// NOTIFICATION HELPER
// ============================================

function showNotification(message, type = "success") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-0 ${
    type === "success"
      ? "bg-green-500 text-white"
      : "bg-red-500 text-white"
  }`;
  notification.textContent = message;

  // Add to DOM
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.add("opacity-100");
  }, 100);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.classList.add("opacity-0", "translate-x-full");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 5000);
}

// Add CSS for animations
const style = document.createElement("style");
style.textContent = `
    .project-card, .service-card, .skill-card {
        transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    }
    
    .animate-fade-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .filter-btn {
        transition: all 0.3s ease;
    }
    
    .filter-btn:hover {
        transform: translateY(-2px);
    }
    
    .project-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .service-card:hover {
        transform: translateY(-5px);
    }
    
    .skill-card:hover {
        transform: translateY(-3px);
    }
    
    /* CTA Section Animations */
    .cta-section {
        position: relative;
        overflow: hidden;
    }
    
    .cta-animated-bg {
        animation: float 6s ease-in-out infinite;
    }
    
    .cta-gradient-text {
        background: linear-gradient(135deg, #ff6b00, #ff8533, #ff6b00);
        background-size: 200% 200%;
        animation: gradientShift 3s ease infinite;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);
