const App = (() => {
  const state = {
    modalOpen: false,
    targetScroll: window.scrollY || 0,
    currentScroll: window.scrollY || 0,
    rafId: null,
    ease: 0.1,
    ticking: false
  };

  const selectors = {
    menuToggle: document.querySelector('.mobile-menu-toggle'),
    mobileMenu: document.querySelector('.mobile-menu'),
    modal: document.getElementById('roadmap-modal'),
    modalTitle: document.getElementById('roadmap-modal-title'),
    modalDescription: document.getElementById('roadmap-modal-description'),
    rotatingText: document.querySelector('.rotating-text'),
    revealItems: document.querySelectorAll('.reveal')
  };

  function init() {
    initRotator();
    initReveal();
    initAnchors();
    initWheelSmoothing();
    initRoadmapModal();
    initMobileMenu();
    window.addEventListener('resize', onResize, { passive: true });
  }

  function initRotator() {
    if (!selectors.rotatingText) return;
    let words = [];
    try {
      words = JSON.parse(selectors.rotatingText.dataset.words || '[]');
    } catch (error) {
      words = [];
    }
    if (!words.length) return;

    let index = 0;
    selectors.rotatingText.textContent = words[0];
    setInterval(() => {
      index = (index + 1) % words.length;
      selectors.rotatingText.animate(
        [
          { opacity: 0, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: 420, easing: 'ease-out' }
      );
      selectors.rotatingText.textContent = words[index];
    }, 2600);
  }

  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      selectors.revealItems.forEach((item) => item.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    selectors.revealItems.forEach((item) => observer.observe(item));
  }

  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        closeMobileMenu();
        scrollToTarget(target);
      });
    });
  }

  function scrollToTarget(element) {
    const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
    const top = window.scrollY + element.getBoundingClientRect().top - headerOffset - 12;
    animateTo(clamp(top, 0, getMaxScroll()));
  }

  function initWheelSmoothing() {
    const supportsFinePointer = window.matchMedia('(pointer:fine)').matches;
    if (!supportsFinePointer) return;

    state.currentScroll = window.scrollY || 0;
    state.targetScroll = window.scrollY || 0;

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', syncNativeScroll, { passive: true });
  }

  function onWheel(event) {
    if (state.modalOpen) return;
    if (shouldIgnoreSmooth(event.target)) return;

    event.preventDefault();
    state.targetScroll += event.deltaY;
    state.targetScroll = clamp(state.targetScroll, 0, getMaxScroll());

    if (!state.ticking) {
      state.ticking = true;
      tickScroll();
    }
  }

  function tickScroll() {
    const diff = state.targetScroll - state.currentScroll;
    state.currentScroll += diff * state.ease;

    if (Math.abs(diff) < 0.4) {
      state.currentScroll = state.targetScroll;
      window.scrollTo(0, state.currentScroll);
      state.ticking = false;
      return;
    }

    window.scrollTo(0, state.currentScroll);
    state.rafId = requestAnimationFrame(tickScroll);
  }

  function animateTo(top) {
    cancelAnimationFrame(state.rafId);
    state.targetScroll = top;
    state.currentScroll = window.scrollY || state.currentScroll;
    state.ticking = true;
    tickScroll();
  }

  function syncNativeScroll() {
    if (state.ticking) return;
    state.currentScroll = window.scrollY || 0;
    state.targetScroll = state.currentScroll;
  }

  function shouldIgnoreSmooth(target) {
    return Boolean(target.closest('input, textarea, select, [data-native-scroll]'));
  }

  function getMaxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function initRoadmapModal() {
    const cards = document.querySelectorAll('.roadmap-card');
    if (!cards.length || !selectors.modal) return;

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        selectors.modalTitle.textContent = card.dataset.roadmapTitle || 'Блок';
        selectors.modalDescription.textContent = card.dataset.roadmapDescription || 'Подробное описание появится позже.';
        selectors.modal.classList.add('is-open');
        selectors.modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
        state.modalOpen = true;
      });
    });

    selectors.modal.addEventListener('click', (event) => {
      if (event.target !== selectors.modal) return;
      selectors.modal.classList.remove('is-open');
      selectors.modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
      state.modalOpen = false;
    });
  }

  function initMobileMenu() {
    if (!selectors.menuToggle || !selectors.mobileMenu) return;

    selectors.menuToggle.addEventListener('click', () => {
      const opened = selectors.mobileMenu.classList.toggle('is-open');
      selectors.menuToggle.classList.toggle('is-active', opened);
      selectors.menuToggle.setAttribute('aria-expanded', String(opened));
    });

    selectors.mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  function closeMobileMenu() {
    if (!selectors.menuToggle || !selectors.mobileMenu) return;
    selectors.mobileMenu.classList.remove('is-open');
    selectors.menuToggle.classList.remove('is-active');
    selectors.menuToggle.setAttribute('aria-expanded', 'false');
  }

  function onResize() {
    state.targetScroll = clamp(state.targetScroll, 0, getMaxScroll());
    state.currentScroll = clamp(window.scrollY || 0, 0, getMaxScroll());
    if (window.innerWidth > 860) closeMobileMenu();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
