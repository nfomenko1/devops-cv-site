document.addEventListener('DOMContentLoaded', () => {
  const card = document.querySelector('.invite-card');

  if (!card) return;

  const updateGlow = (event) => {
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;

    const moveX = (x - 0.5) * 6;
    const moveY = (y - 0.5) * 6;

    card.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  };

  const resetCard = () => {
    card.style.transform = 'translate3d(0, 0, 0)';
  };

  window.addEventListener('mousemove', updateGlow, { passive: true });
  window.addEventListener('mouseleave', resetCard);
});
