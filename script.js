import { animate } from 'https://esm.sh/animejs@4.5.0';

/* === Anime.js SVG Distortion & Shape Morphing === */
try {
  animate(['feTurbulence', 'feDisplacementMap'], {
    baseFrequency: 0.05,
    scale: 15,
    alternate: true,
    loop: true,
    duration: 2500,
    ease: 'easeInOutSine',
  });

  animate('.hero-morph-art polygon', {
    points: '64 68.64 8.574 100 63.446 67.68 64 4 64.554 67.68 119.426 100',
    alternate: true,
    loop: true,
    duration: 3000,
    ease: 'easeInOutQuad',
  });
} catch (e) {
  console.error("Anime.js animation failed to initialize:", e);
}

/* === Theme Switcher with Persistence === */
let isDark = localStorage.getItem("portfolio-theme") === "dark";

function updateTheme() {
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
  const btn = document.querySelector("#theme-btn .theme-label");
  if (btn) btn.textContent = isDark ? "Light Mode" : "Dark Mode";
}

document.querySelector("#theme-btn")?.addEventListener("click", () => {
  isDark = !isDark;
  updateTheme();
});

/* === One-Pager Print / Download PDF Resume Trigger === */
const printResumeBtn = document.getElementById("print-resume-btn");
if (printResumeBtn) {
  printResumeBtn.addEventListener("click", () => {
    window.print();
  });
}

/* === Contact Form Handling === */
const contactForm = document.querySelector("#contact-form");
const submitBtn = document.querySelector("#submit-btn");
const formStatus = document.querySelector("#form-status");

contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (contactForm.action.includes("YOUR_FORM_ID")) {
    formStatus.textContent =
      "Please replace YOUR_FORM_ID in index.html with your Formspree endpoint.";
    formStatus.style.color = "#f59e0b";
    formStatus.style.display = "block";
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  formStatus.style.display = "none";

  const data = new FormData(contactForm);

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      formStatus.textContent =
        "Thank you! Your message has been sent successfully.";
      formStatus.style.color = "#10b981";
      formStatus.style.display = "block";
      contactForm.reset();
    } else {
      const errorData = await response.json();
      formStatus.textContent =
        errorData?.errors?.map((err) => err.message).join(", ") ||
        "Failed to send message. Please try again.";
      formStatus.style.color = "#ef4444";
      formStatus.style.display = "block";
    }
  } catch (error) {
    formStatus.textContent =
      "Network error. Please try again later or email me directly.";
    formStatus.style.color = "#ef4444";
    formStatus.style.display = "block";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send message";
  }
});

/* === Wandering Dots Particle Animation === */
const canvas = document.getElementById("line-particles");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let dots = [];
  const dotCount = 28;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  class WanderingDot {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = 50 + (Math.random() * 40 - 20);
      this.y = initial ? Math.random() * canvas.height : Math.random() * canvas.height;
      this.radius = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.baseAlpha = Math.random() * 0.45 + 0.15;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 15 || this.x > 85) this.vx *= -1;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      const isDarkMode = document.documentElement.dataset.theme === "dark";
      const color = isDarkMode
        ? `rgba(240, 240, 240, ${this.baseAlpha})`
        : `rgba(20, 20, 20, ${this.baseAlpha})`;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  for (let i = 0; i < dotCount; i++) {
    dots.push(new WanderingDot());
  }

  function animateDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach((dot) => {
      dot.update();
      dot.draw();
    });
    requestAnimationFrame(animateDots);
  }

  animateDots();
}

// Initial theme load
updateTheme();