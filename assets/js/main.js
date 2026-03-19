
const roles = ["DevOps Engineer", "Инженер сопровождения"];
const roleNode = document.querySelector(".role-current");
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRole() {
  if (!roleNode) return;

  const fullText = roles[roleIndex];
  roleNode.classList.add("typing");

  if (!deleting) {
    charIndex += 1;
    roleNode.textContent = fullText.slice(0, charIndex);

    if (charIndex === fullText.length) {
      deleting = true;
      setTimeout(typeRole, 1500);
      return;
    }
  } else {
    charIndex -= 1;
    roleNode.textContent = fullText.slice(0, charIndex);

    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  const speed = deleting ? 45 : 80;
  setTimeout(typeRole, speed);
}

typeRole();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

const mobileButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (mobileButton && mobileMenu) {
  mobileButton.addEventListener("click", () => {
    const isOpen = mobileButton.getAttribute("aria-expanded") === "true";
    mobileButton.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.hidden = isOpen;
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.hidden = true;
      mobileButton.setAttribute("aria-expanded", "false");
    });
  });
}

const header = document.querySelector(".site-header");
const navLinks = Array.from(document.querySelectorAll(".nav a, .mobile-menu a, .brand, .btn[href^='#']"));

function getHeaderOffset() {
  const inner = document.querySelector(".header-inner");
  return inner ? inner.offsetHeight + 16 : 90;
}

function animateScrollTo(targetY, duration = 1100) {
  const startY = window.scrollY || window.pageYOffset;
  const diff = Math.max(0, targetY) - startY;
  const startTime = performance.now();

  function easeInOutExpo(t) {
    if (t === 0 || t === 1) return t;
    return t < 0.5
      ? Math.pow(2, 20 * t - 10) / 2
      : (2 - Math.pow(2, -20 * t + 10)) / 2;
  }

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutExpo(progress);
    window.scrollTo(0, startY + diff * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    const targetY = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
    animateScrollTo(targetY);
  });
});

const sections = ["#home", "#about", "#roadmap"]
  .map((selector) => document.querySelector(selector))
  .filter(Boolean);

function updateActiveNav() {
  const marker = window.scrollY + getHeaderOffset() + 40;
  let currentId = "home";

  sections.forEach((section) => {
    if (section.offsetTop <= marker) {
      currentId = section.id;
    }
  });

  document.querySelectorAll(".nav a, .mobile-menu a").forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${currentId}`);
  });
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();

const modal = document.getElementById("roadmapModal");
const modalMeta = document.getElementById("modalMeta");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");

document.querySelectorAll(".roadmap-card").forEach((card) => {
  card.addEventListener("click", () => {
    const blockNumber = card.dataset.block || "";
    const title = card.querySelector("h3")?.textContent || "Название блока обучения";
    const text = card.querySelector("p")?.textContent || "Тестовое описание. Подробности добавим позже.";

    modalMeta.textContent = `Блок ${blockNumber}`;
    modalTitle.textContent = title;
    modalDescription.textContent = `${text} Тестовое описание. Подробное содержание этого блока добавим позже.`;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

modal?.addEventListener("click", (event) => {
  const card = modal.querySelector(".modal-card");
  if (!card.contains(event.target)) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
});

// softer wheel scroll on desktop
if (window.matchMedia("(pointer: fine)").matches) {
  let targetScroll = window.scrollY;
  let currentScroll = window.scrollY;
  let isAnimating = false;

  function maxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function syncScroll() {
    if (!isAnimating) {
      currentScroll = window.scrollY;
      targetScroll = window.scrollY;
    }
  }

  function tick() {
    currentScroll += (targetScroll - currentScroll) * 0.12;
    if (Math.abs(targetScroll - currentScroll) < 0.4) {
      currentScroll = targetScroll;
      window.scrollTo(0, currentScroll);
      isAnimating = false;
      return;
    }

    window.scrollTo(0, currentScroll);
    requestAnimationFrame(tick);
  }

  window.addEventListener("wheel", (event) => {
    if (modal?.classList.contains("is-open")) return;
    const target = event.target;
    if (target.closest(".mobile-menu")) return;

    event.preventDefault();
    targetScroll = Math.max(0, Math.min(maxScroll(), targetScroll + event.deltaY * 0.95));

    if (!isAnimating) {
      isAnimating = true;
      requestAnimationFrame(tick);
    }
  }, { passive: false });

  window.addEventListener("scroll", syncScroll, { passive: true });
  window.addEventListener("resize", () => {
    targetScroll = Math.max(0, Math.min(maxScroll(), targetScroll));
    currentScroll = Math.max(0, Math.min(maxScroll(), currentScroll));
  });
}
