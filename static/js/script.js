const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const roadmapCards = document.querySelectorAll(".roadmap-card");
const modal = document.getElementById("roadmapModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalClose = document.querySelector(".modal-close");

function closeModal() {
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

if (roadmapCards.length && modal && modalTitle && modalText) {
  roadmapCards.forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.dataset.title || "Блок";
      modalTitle.textContent = title;
      modalText.textContent = "Подробное описание блока добавишь позже.";
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    });
  });
}

if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

const heroPanel = document.getElementById("heroPanel");

if (
  heroPanel &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches
) {
  heroPanel.addEventListener("mousemove", (event) => {
    const card = heroPanel.querySelector(".profile-card");
    if (!card) return;

    const rect = heroPanel.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    card.style.transform =
      `rotateX(${y * -3}deg) rotateY(${x * 4}deg) translate3d(${x * 6}px, ${y * 6}px, 0)`;
  });

  heroPanel.addEventListener("mouseleave", () => {
    const card = heroPanel.querySelector(".profile-card");
    if (card) {
      card.style.transform =
        "rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)";
    }
  });
}