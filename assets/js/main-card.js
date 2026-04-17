document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const card = document.querySelector('.invite-card');
  const glows = document.querySelectorAll('.page-glow');
  const smokes = document.querySelectorAll('.smoke');
  const hazes = document.querySelectorAll('.ambient-haze');

  if (!card) return;

  let currentX = window.innerWidth * 0.5;
  let currentY = window.innerHeight * 0.5;
  let targetX = currentX;
  let targetY = currentY;

  const render = () => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    const x = currentX / window.innerWidth;
    const y = currentY / window.innerHeight;

    const shiftX = (x - 0.5) * 18;
    const shiftY = (y - 0.5) * 18;
    const cardX = (x - 0.5) * 8;
    const cardY = (y - 0.5) * 8;

    root.style.setProperty('--mouse-x', `${(x * 100).toFixed(2)}%`);
    root.style.setProperty('--mouse-y', `${(y * 100).toFixed(2)}%`);
    root.style.setProperty('--mouse-shift-x', `${shiftX.toFixed(2)}px`);
    root.style.setProperty('--mouse-shift-y', `${shiftY.toFixed(2)}px`);

    card.style.transform = `translate3d(${cardX.toFixed(2)}px, ${cardY.toFixed(2)}px, 0)`;

    glows.forEach((glow, index) => {
      const depth = index === 0 ? 0.55 : 0.8;
      glow.style.transform = `translate3d(${(shiftX * depth).toFixed(2)}px, ${(shiftY * depth).toFixed(2)}px, 0)`;
    });

    smokes.forEach((smoke, index) => {
      const depthX = [0.28, -0.24, 0.18][index] || 0.2;
      const depthY = [0.16, 0.2, -0.14][index] || 0.15;
      smoke.style.transform = `translate3d(${(shiftX * depthX).toFixed(2)}px, ${(shiftY * depthY).toFixed(2)}px, 0)`;
    });

    hazes.forEach((haze, index) => {
      const depthX = [0.16, -0.16, 0.08][index] || 0.1;
      const depthY = [0.12, 0.1, -0.08][index] || 0.08;
      const offsetX = (shiftX * depthX).toFixed(2);
      const offsetY = (shiftY * depthY).toFixed(2);

      if (index === 2) {
        haze.style.transform = `translateX(-50%) translate3d(${offsetX}px, ${offsetY}px, 0)`;
      } else {
        haze.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      }
    });

    requestAnimationFrame(render);
  };

  const updateTarget = (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
  };

  const resetTarget = () => {
    targetX = window.innerWidth * 0.5;
    targetY = window.innerHeight * 0.5;
  };

  window.addEventListener('mousemove', updateTarget, { passive: true });
  window.addEventListener('mouseleave', resetTarget);
  window.addEventListener('resize', resetTarget);

  render();
});
