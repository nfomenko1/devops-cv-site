document.addEventListener('DOMContentLoaded', () => {
  const card = document.querySelector('.invite-card');
  if (!card) return;

  const resetCard = () => {
    card.style.transform = 'translate3d(0, 0, 0)';
  };

  resetCard();
  window.addEventListener('resize', resetCard);
});
