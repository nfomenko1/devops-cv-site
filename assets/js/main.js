const App = (() => {
  const state = {
    modalOpen: false,
    currentScroll: window.scrollY || 0,
    targetScroll: window.scrollY || 0,
    rafId: null,
    wheelSmoothEnabled: false,
    easing: 0.075,
    anchorDuration: 1400
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
    initTypewriter();
    initReveal();
    initAnchors();
    initWheelSmoothing();
    initRoadmapModal();
    initMobileMenu();
    window.addEventListener('resize', onResize, { passive: true });
  }

  function initTypewriter() {
    if (!selectors.rotatingText) return;

    let words = [];
    try {
      words = JSON.parse(selectors.rotatingText.dataset.words || '[]');
    } catch {
      words = [];
    }
    if (!words.length) return;

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const type = () => {
      const currentWord = words[wordIndex];

      if (!deleting) {
        charIndex += 1;
        selectors.rotatingText.textContent = currentWord.slice(0, charIndex);
        if (charIndex === currentWord.length) {
          deleting = true;
          window.setTimeout(type, 1200);
          return;
        }
        window.setTimeout(type, 88);
        return;
      }

      charIndex -= 1;
      selectors.rotatingText.textContent = currentWord.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        window.setTimeout(type, 260);
        return;
      }
      window.setTimeout(type, 46);
    };

    selectors.rotatingText.textContent = '';
    type();
  }

  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      selectors.revealItems.forEach((item) => item.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
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
        smoothScrollTo(getTargetPosition(target), state.anchorDuration);
      });
    });
  }

  function getTargetPosition(element) {
    const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
    const top = window.scrollY + element.getBoundingClientRect().top - headerOffset - 16;
    return clamp(top, 0, getMaxScroll());
  }

  function initWheelSmoothing() {
    const supportsFinePointer = window.matchMedia('(pointer:fine)').matches;
    if (!supportsFinePointer) return;

    state.wheelSmoothEnabled = true;
    state.currentScroll = window.scrollY || 0;
    state.targetScroll = window.scrollY || 0;

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', syncNativeScroll, { passive: true });
  }

  function onWheel(event) {
    if (!state.wheelSmoothEnabled || state.modalOpen) return;
    if (shouldIgnoreSmooth(event.target)) return;

    event.preventDefault();
    state.targetScroll += event.deltaY * 0.92;
    state.targetScroll = clamp(state.targetScroll, 0, getMaxScroll());

    if (!state.rafId) tickScroll();
  }

  function tickScroll() {
    const diff = state.targetScroll - state.currentScroll;
    state.currentScroll += diff * state.easing;
    window.scrollTo(0, state.currentScroll);

    if (Math.abs(diff) < 0.35) {
      state.currentScroll = state.targetScroll;
      window.scrollTo(0, state.currentScroll);
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
      return;
    }

    state.rafId = requestAnimationFrame(tickScroll);
  }

  function smoothScrollTo(targetY, duration) {
    cancelAnimationFrame(state.rafId);
    state.rafId = null;

    const startY = window.scrollY || 0;
    const diff = targetY - startY;
    const startTime = performance.now();

    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = easeInOutCubic(progress);
      const nextY = startY + diff * eased;
      window.scrollTo(0, nextY);
      state.currentScroll = nextY;
      state.targetScroll = nextY;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  function syncNativeScroll() {
    if (state.rafId) return;
    state.currentScroll = window.scrollY || 0;
    state.targetScroll = state.currentScroll;
  }

  function shouldIgnoreSmooth(target) {
    return Boolean(target.closest('input, textarea, select, [data-native-scroll]'));
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

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function getMaxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
