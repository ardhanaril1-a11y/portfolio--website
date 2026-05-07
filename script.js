const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const hoverTargets = document.querySelectorAll("a, button, input, textarea, .skill-card, .project-card");
const magneticTargets = document.querySelectorAll(".btn, .skill-card, .project-card");
const tiltTargets = document.querySelectorAll(".skill-card, .project-card");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;
let lastTrail = 0;

const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

function animateCursor() {
  ringX += (mouseX - ringX) * 0.16;
  ringY += (mouseY - ringY) * 0.16;

  cursorDot.style.left = `${mouseX}px`;
  cursorDot.style.top = `${mouseY}px`;
  cursorRing.style.left = `${ringX}px`;
  cursorRing.style.top = `${ringY}px`;

  requestAnimationFrame(animateCursor);
}

if (hasFinePointer) {
  animateCursor();
}

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  if (!hasFinePointer) return;

  cursorDot.classList.add("cursor-visible");
  cursorRing.classList.add("cursor-visible");

  const now = Date.now();
  if (now - lastTrail > 55) {
    const trail = document.createElement("span");
    trail.className = "cursor-trail";
    trail.style.left = `${mouseX}px`;
    trail.style.top = `${mouseY}px`;
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 650);
    lastTrail = now;
  }
});

document.addEventListener("mouseleave", () => {
  cursorDot.classList.remove("cursor-visible");
  cursorRing.classList.remove("cursor-visible");
});

document.addEventListener("mouseenter", () => {
  if (!hasFinePointer) return;
  cursorDot.classList.add("cursor-visible");
  cursorRing.classList.add("cursor-visible");
});

document.addEventListener("mousedown", () => {
  if (!hasFinePointer) return;
  cursorRing.classList.add("cursor-click");
});

document.addEventListener("mouseup", () => {
  cursorRing.classList.remove("cursor-click");
});

hoverTargets.forEach((target) => {
  target.addEventListener("mouseenter", () => cursorRing.classList.add("cursor-hover"));
  target.addEventListener("mouseleave", () => cursorRing.classList.remove("cursor-hover"));
});

magneticTargets.forEach((target) => {
  target.addEventListener("mousemove", (event) => {
    if (!hasFinePointer) return;

    const box = target.getBoundingClientRect();
    const x = event.clientX - box.left - box.width / 2;
    const y = event.clientY - box.top - box.height / 2;
    target.style.setProperty("--mx", `${event.clientX - box.left}px`);
    target.style.setProperty("--my", `${event.clientY - box.top}px`);

    if (target.classList.contains("skill-card") || target.classList.contains("project-card")) {
      const rotateX = (-y / box.height) * 5;
      const rotateY = (x / box.width) * 5;
      target.style.transform = `translate(${x * 0.018}px, ${y * 0.018}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      return;
    }

    target.style.transform = `translate(${x * 0.025}px, ${y * 0.025}px)`;
  });

  target.addEventListener("mouseleave", () => {
    target.style.transform = "";
  });
});

tiltTargets.forEach((target) => {
  target.addEventListener("mouseenter", () => {
    target.style.transformStyle = "preserve-3d";
  });
});

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("img[data-fallback]").forEach((image) => {
  image.addEventListener("error", () => {
    const fallback = document.createElement("div");
    fallback.className = "image-fallback";
    fallback.textContent = image.dataset.fallback;
    image.replaceWith(fallback);
  });
});

const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(
  ".section-heading, .hero-actions, .hero-stats div, .about-photo, .skill-card, .project-card, .about-text, .about-strip, .social-link, .contact-form, .contact-form label, .contact-form .btn"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navItems.forEach((item) => {
        item.classList.toggle("active", item.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { threshold: 0.45 }
);

sections.forEach((section) => observer.observe(section));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => item.classList.add("reveal"));

revealItems.forEach((item) => {
  const section = item.closest("section");
  const sectionItems = section ? [...section.querySelectorAll(".reveal")] : [...revealItems];
  item.style.transitionDelay = `${Math.min(sectionItems.indexOf(item) * 70, 420)}ms`;
  revealObserver.observe(item);
});

document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  alert("Thank you. Your message is ready to send.");
  event.currentTarget.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();
