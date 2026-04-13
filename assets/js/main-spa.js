document.addEventListener('DOMContentLoaded', () => {
    const giftBoxWrap = document.getElementById('giftBoxWrap');
    const giftBox = document.getElementById('giftBox');
    const certificateBlock = document.getElementById('certificateBlock');
    const giftScene = document.getElementById('giftScene');

    let opened = false;

    giftBox.addEventListener('click', () => {
        if (opened) return;

        opened = true;
        giftBoxWrap.classList.add('open');

        setTimeout(() => {
            certificateBlock.classList.add('show');
        }, 650);
    });

    document.addEventListener('mousemove', (event) => {
        if (!giftScene || opened) return;

        const x = (event.clientX / window.innerWidth - 0.5) * 12;
        const y = (event.clientY / window.innerHeight - 0.5) * 10;

        giftScene.style.transform = `rotateY(${x * 0.35}deg) rotateX(${y * -0.28}deg) translate3d(${x * 0.4}px, ${y * 0.25}px, 0)`;
    });

    document.addEventListener('mouseleave', () => {
        if (!giftScene || opened) return;
        giftScene.style.transform = 'rotateY(0deg) rotateX(0deg) translate3d(0, 0, 0)';
    });
});