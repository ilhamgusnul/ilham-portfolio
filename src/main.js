// Portfolio JavaScript Functionality
import "./style.css";

// Smooth scrolling for navigation links
document.addEventListener("DOMContentLoaded", function () {
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
  const projectCards = document.querySelectorAll(".project-card");

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

      // Filter projects
      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");

        if (filter === "all" || category === filter) {
          card.style.display = "block";
          // Add fade-in animation
          card.style.opacity = "0";
          setTimeout(() => {
            card.style.opacity = "1";
          }, 100);
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Form submission handling
  const contactForm = document.querySelector("form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const name = formData.get("name");
      const email = formData.get("email");
      const message = formData.get("message");

      // Simple validation
      if (!name || !email || !message) {
        alert("Please fill in all fields");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        return;
      }

      // Simulate form submission
      alert("Thank you for your message! I will get back to you soon.");
      this.reset();
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
});

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
`;
document.head.appendChild(style);
