const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
const year = document.getElementById("year");
const contactForm = document.getElementById("contactForm");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (burger && navLinks) {
  burger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealItems.forEach((item) => observer.observe(item));

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Форма пока декоративная. Потом подключим отправку через backend или Telegram/Email API.");
  });
}