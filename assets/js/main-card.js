document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const card = document.querySelector('.invite-card');

  if (!card) return;

  const updateGlow = (event) => {
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;

    root.style.setProperty('--mouse-x', `${x}`);
    root.style.setProperty('--mouse-y', `${y}`);

    card.style.transform = `translate3d(${(x - 0.5) * 4}px, ${(y - 0.5) * 4}px, 0)`;
  };

  const resetCard = () => {
    card.style.transform = '';
  };

  window.addEventListener('mousemove', updateGlow, { passive: true });
  window.addEventListener('mouseleave', resetCard);
});
