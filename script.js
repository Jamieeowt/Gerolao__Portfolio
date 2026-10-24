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

updateTheme();