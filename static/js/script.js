// ===============================
// Mobile menu toggle (если понадобится)
// ===============================
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

if (burger) {
    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        burger.classList.toggle('active');
    });
}

// ===============================
// Smooth scroll для якорей
// ===============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ===============================
// Mouse movement effect (ТОЛЬКО hero)
// ===============================
const hero = document.querySelector('.hero');
const heroGlow = document.querySelector('.hero-glow');

if (hero && heroGlow) {
    hero.addEventListener('mousemove', (e) => {
        const { width, height, left, top } = hero.getBoundingClientRect();

        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        heroGlow.style.transform = `
            translate(${x * 30}px, ${y * 30}px)
        `;
    });
}

// ===============================
// Reveal animation (плавное появление)
// ===============================
const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(el => observer.observe(el));

// ===============================
// Roadmap modal (открытие блоков)
// ===============================
const roadmapItems = document.querySelectorAll('.roadmap-item');
const modal = document.querySelector('.roadmap-modal');
const modalTitle = document.querySelector('.modal-title');
const modalContent = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');

roadmapItems.forEach(item => {
    item.addEventListener('click', () => {
        const title = item.querySelector('.roadmap-title').innerText;

        modalTitle.innerText = title;
        modalContent.innerText = "Подробное описание блока будет добавлено позже.";

        modal.classList.add('active');
    });
});

// закрытие по кнопке
if (modalClose) {
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });
}

// закрытие по клику вне окна
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// ===============================
// Лёгкий hover tilt для карточек (очень аккуратно)
// ===============================
const tiltCards = document.querySelectorAll('.tilt');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `
            rotateX(${y * -5}deg)
            rotateY(${x * 5}deg)
        `;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
});