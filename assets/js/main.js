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
            const splitTitle = new SplitText(title, { type: 'chars' });
            const splitSubtitle = subtitle
              ? new SplitText(subtitle, { type: 'chars words' })
              : null;

            gsap.timeline({
              scrollTrigger: typeof ScrollTrigger !== 'undefined' ? {
                trigger: title,
                start: 'top 80%',
                end: 'bottom 60%',
                toggleActions: 'play none none none'
              } : undefined
            })
              .from(splitTitle.chars, {
                duration: 0.2,
                x: -10,
                autoAlpha: group.titleAlpha,
                stagger: group.selector === '.tmp-title-split' ? 0.02 : 0.01
              })
              .from(
                splitSubtitle ? splitSubtitle.words : [],
                {
                  duration: group.selector === '.tmp-title-split' ? 0.8 : 0.2,
                  x: 100,
                  autoAlpha: group.subtitleAlpha,
                  stagger: 0.01
                },
                '-=1'
              );
          });
        });
      });
    },

    animationOnHover() {
      const cards = document.querySelectorAll('.tmponhover');
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
