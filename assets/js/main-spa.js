document.addEventListener('DOMContentLoaded', () => {
    const giftBoxWrap = document.getElementById('giftBoxWrap');
    const giftBox = document.getElementById('giftBox');
    const certificateBlock = document.getElementById('certificateBlock');

    let opened = false;

    giftBox.addEventListener('click', () => {
        if (opened) return;

        opened = true;
        giftBoxWrap.classList.add('open');

        setTimeout(() => {
            certificateBlock.classList.add('show');
        }, 650);
    });
});