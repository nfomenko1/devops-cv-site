// ==========================
// SMOOTH SCROLL (якоря)
// ==========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');

        if (targetId.length > 1) {
            e.preventDefault();

            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});


// ==========================
// POPUP ROADMAP
// ==========================
const roadmapCards = document.querySelectorAll('.roadmap-card');
const popup = document.querySelector('.roadmap-popup');
const popupContent = document.querySelector('.roadmap-popup-content');

roadmapCards.forEach(card => {
    card.addEventListener('click', () => {
        popup.classList.add('active');

        // можно потом подставлять контент динамически
        popupContent.innerHTML = `
            <h3>${card.querySelector('.title').innerText}</h3>
            <p>Описание добавим позже</p>
        `;
    });
});


// Закрытие popup ТОЛЬКО по клику вне окна
popup.addEventListener('click', (e) => {
    if (!e.target.closest('.roadmap-popup-content')) {
        popup.classList.remove('active');
    }
});


// ==========================
// SMOOTH SCROLL WHEEL (плавность)
// ==========================
let scrollContainer = document.scrollingElement || document.documentElement;
let targetScroll = scrollContainer.scrollTop;
let isScrolling = false;

window.addEventListener('wheel', (e) => {
    e.preventDefault();

    targetScroll += e.deltaY * 0.7;

    if (!isScrolling) {
        smoothScroll();
    }
}, { passive: false });

function smoothScroll() {
    isScrolling = true;

    let current = scrollContainer.scrollTop;
    let diff = targetScroll - current;

    scrollContainer.scrollTop = current + diff * 0.1;

    if (Math.abs(diff) > 0.5) {
        requestAnimationFrame(smoothScroll);
    } else {
        isScrolling = false;
    }
}