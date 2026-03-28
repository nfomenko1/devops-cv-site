(function ($) {
  "use strict";

  const app = {
    init() {
      this.cache();
      this.wowActive();
      this.stickyHeader();
      this.preloaderWithBannerActivation();
      this.animationOnHover();
      this.odoMeter();
    },

    cache() {
      this.$window = $(window);
      this.$document = $(document);
      this.$body = $("body");
    },

    wowActive() {
      if (typeof WOW !== "undefined" && $(".wow").length) {
        new WOW().init();
      }
    },

    stickyHeader() {
      if (!$('.header--sticky').length) return;

      this.$window.on('scroll', function () {
        if ($(this).scrollTop() > 150) {
          $('.header--sticky').addClass('sticky');
        } else {
          $('.header--sticky').removeClass('sticky');
        }
      });
    },

    preloaderWithBannerActivation() {
      if (typeof gsap === 'undefined' || typeof SplitText === 'undefined') {
        return;
      }

      document.addEventListener('DOMContentLoaded', function () {
        const titleGroups = [
          { selector: '.tmp-title-split', titleAlpha: 0.02, subtitleAlpha: 0 },
          { selector: '.tmp-title-split-2', titleAlpha: 0.06, subtitleAlpha: 0.06 }
        ];

        titleGroups.forEach(function (group) {
          const heroTitles = document.querySelectorAll(group.selector);
          const heroSubtitles = document.querySelectorAll('.hero__sub-title');

          heroTitles.forEach(function (title, index) {
            const subtitle = heroSubtitles[index] || null;
            const splitTitle = new SplitText(title, { type: 'lines,words' });
            const splitSubtitle = subtitle
              ? new SplitText(subtitle, { type: 'lines,words' })
              : null;

            gsap.set(splitTitle.lines, { overflow: 'visible' });

            gsap.timeline({
              scrollTrigger: typeof ScrollTrigger !== 'undefined' ? {
                trigger: title,
                start: 'top 80%',
                end: 'bottom 60%',
                toggleActions: 'play none none none'
              } : undefined
            })
              .from(splitTitle.words, {
                duration: group.selector === '.tmp-title-split' ? 0.42 : 0.3,
                yPercent: 18,
                autoAlpha: group.titleAlpha,
                stagger: group.selector === '.tmp-title-split' ? 0.03 : 0.018,
                clearProps: 'all'
              })
              .from(
                splitSubtitle ? splitSubtitle.words : [],
                {
                  duration: group.selector === '.tmp-title-split' ? 0.8 : 0.2,
                  x: 100,
                  autoAlpha: group.subtitleAlpha,
                  stagger: 0.01
                },
                '-=0.45'
              );
          });
        });
      });
    },

    animationOnHover() {
      const cards = document.querySelectorAll('.tmponhover:not(.interactive-border)');
      if (!cards.length) return;

      cards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          const x = e.pageX - card.offsetLeft;
          const y = e.pageY - card.offsetTop;
          card.style.setProperty('--x', x + 'px');
          card.style.setProperty('--y', y + 'px');
        });
      });
    },

    odoMeter() {
      if (!$('.odometer').length) return;

      $(document).ready(function () {
        function isInViewport(element) {
          const rect = element.getBoundingClientRect();
          return (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
          );
        }

        function triggerOdometer(element) {
          const $element = $(element);
          if (!$element.hasClass('odometer-triggered')) {
            const countNumber = $element.attr('data-count');
            $element.html(countNumber);
            $element.addClass('odometer-triggered');
          }
        }

        function handleOdometer() {
          $('.odometer').each(function () {
            if (isInViewport(this)) {
              triggerOdometer(this);
            }
          });
        }

        handleOdometer();
        $(window).on('scroll', handleOdometer);
      });
    }
  };

  app.init();
})(jQuery);

(function ($) {
  "use strict";

  $(document).on('click', 'a[href^="#"]', function (e) {
    const targetId = $(this).attr('href');
    if (!targetId || targetId === '#' || targetId.length < 2) return;

    const $target = $(targetId);
    if (!$target.length) return;

    e.preventDefault();
    const headerHeight = $('.portfolio-glass-header').outerHeight() || 0;

    $('html, body').animate(
      {
        scrollTop: $target.offset().top - headerHeight - 12,
      },
      400
    );
  });
})(jQuery);


(function ($) {
  "use strict";

  function bindInteractiveBorder(selector) {
    document.querySelectorAll(selector).forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--y', (e.clientY - rect.top) + 'px');
      });
    });
  }

  $(document).ready(function () {
    bindInteractiveBorder('.interactive-border');
    bindInteractiveBorder('.skill-chip');

    const $mobileMenu = $('.tmp-popup-mobile-menu');
    function closeMobileMenu() {
      $mobileMenu.removeClass('active');
      $('body').removeClass('mobile-menu-open');
    }

    $('.portfolio-mobile-menu-toggle').on('click', function () {
      $mobileMenu.addClass('active');
      $('body').addClass('mobile-menu-open');
    });

    $('.tmp-popup-mobile-menu .close-button, .tmp-popup-mobile-menu a[href^="#"]').on('click', function () {
      closeMobileMenu();
    });

    $mobileMenu.on('click', function (e) {
      if (e.target === this) {
        closeMobileMenu();
      }
    });

    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') {
        closeMobileMenu();
        if (modal && modal.classList.contains('is-open')) {
          closeEducationModal();
        }
      }
    });

    const modal = document.getElementById('education-modal');
    const modalTitle = document.getElementById('education-modal-title');
    const modalText = document.getElementById('education-modal-text');
    const modalDialog = modal ? modal.querySelector('.education-modal__dialog') : null;

    function openEducationModal(item) {
  if (!modal) return;
  modalTitle.textContent = item.getAttribute('data-detail-title') || 'Подробности';
  modalText.textContent = item.getAttribute('data-detail-text') || 'Описание будет добавлено позже.';
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('is-open');
  document.body.classList.add('education-modal-open');
}

    function closeEducationModal() {
      if (!modal) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('education-modal-open');
    }

    document.querySelectorAll('#education .resume-single').forEach(function (item) {
      item.addEventListener('click', function () {
        openEducationModal(item);
      });
    });

    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target && e.target.closest('[data-modal-close="true"]')) {
          closeEducationModal();
        }
      });
      if (modalDialog) {
        modalDialog.addEventListener('mousemove', function (e) {
          const rect = modalDialog.getBoundingClientRect();
          modalDialog.style.setProperty('--x', (e.clientX - rect.left) + 'px');
          modalDialog.style.setProperty('--y', (e.clientY - rect.top) + 'px');
          modalDialog.classList.add('is-active');
        });
      }
    }
  });
})(jQuery);


(function () {
  const hoverTargets = document.querySelectorAll('.interactive-border, .skill-chip');
  hoverTargets.forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      el.classList.add('is-active');
    });
    el.addEventListener('mouseleave', function () {
      el.classList.remove('is-active');
    });
  });
})();
