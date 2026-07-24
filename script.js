// ---------- Header scroll state ----------
const header = document.getElementById("siteHeader");
const onScroll = () => {
  if (window.scrollY > 8) header.classList.add("is-scrolled");
  else header.classList.remove("is-scrolled");
};
document.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById("navToggle");
navToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    if (header.classList.contains("is-open")) {
      header.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    }
  });
});

// ---------- Year in footer ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Contact form (demo only — no backend) ----------
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  status.className = "form-status";
  status.textContent = "";

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email) {
    status.classList.add("is-err");
    status.textContent = "Please add your name and an email so I can reply.";
    return;
  }
  const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!okEmail) {
    status.classList.add("is-err");
    status.textContent = "That email looks off — mind double-checking it?";
    return;
  }

  // Opens the user's mail client with a pre-filled message.
  // Replace "komailkhawaja611@gmail.com" with the real address.
  const subject = encodeURIComponent(`Hello from ${name}`);
  const body = encodeURIComponent(
    `${message || "Hi komailkhawaja,"}\n\n— ${name}\n${email}`
  );
  window.location.href = `mailto:komailkhawaja611@gmail.com?subject=${subject}&body=${body}`;

  status.classList.add("is-ok");
  status.textContent = `Thanks, ${name.split(" ")[0]} — your mail app should be opening now.`;
  form.reset();
});

// ---------- Subtle reveal-on-scroll ----------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document
  .querySelectorAll(".work-card, .skill-group, .contact-form, .about-text, .timeline-content, .edu-card, .extras-card")
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    el.style.transition = "opacity .6s ease, transform .6s ease";
    io.observe(el);
  });
