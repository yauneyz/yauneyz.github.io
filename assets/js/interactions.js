/* UI micro-interactions:
   - Spotlight cursor on .spotlight containers (CSS vars --mx / --my)
   - Tilt parallax on [data-tilt]
   - Scroll-reveal on [data-reveal] via IntersectionObserver
   - Animated nav indicator that slides under the active link */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------------- */
  /* Spotlight cursor                                               */
  /* -------------------------------------------------------------- */
  function initSpotlights() {
    const els = document.querySelectorAll('.spotlight');
    els.forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--mx', x + '%');
        el.style.setProperty('--my', y + '%');
      });
    });
  }

  /* -------------------------------------------------------------- */
  /* Tilt parallax + cursor highlight on glass cards                */
  /* -------------------------------------------------------------- */
  function initTilts() {
    if (reduceMotion) return;
    const els = document.querySelectorAll('[data-tilt]');
    els.forEach((el) => {
      let raf = 0;
      const MAX = 6; // degrees

      function onMove(e) {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const rect = el.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;
          const rx = (0.5 - py) * MAX;
          const ry = (px - 0.5) * MAX;
          el.style.transform =
            `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
          el.style.setProperty('--mx', (px * 100).toFixed(2) + '%');
          el.style.setProperty('--my', (py * 100).toFixed(2) + '%');
        });
      }

      function onLeave() {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        el.style.transform = '';
        el.style.setProperty('--mx', '50%');
        el.style.setProperty('--my', '50%');
      }

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
    });
  }

  /* -------------------------------------------------------------- */
  /* Scroll reveal                                                  */
  /* -------------------------------------------------------------- */
  function initReveals() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in-view'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => io.observe(el));
  }

  /* -------------------------------------------------------------- */
  /* Header underline indicator                                     */
  /* -------------------------------------------------------------- */
  function initNavIndicator() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;
    const indicator = nav.querySelector('.nav-indicator');
    const links = Array.from(nav.querySelectorAll('.nav-link'));
    if (!indicator || !links.length) return;

    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    let active = links.find((a) => {
      const href = (a.getAttribute('href') || '').replace(/\/+$/, '') || '/';
      return href === path;
    });
    // Loose match (e.g. /essays/some-essay -> /essays)
    if (!active) {
      active = links.find((a) => {
        const href = (a.getAttribute('href') || '').replace(/\/+$/, '');
        return href && href !== '/' && path.startsWith(href);
      });
    }

    function moveTo(el) {
      if (!el) {
        indicator.classList.remove('visible');
        return;
      }
      const navRect = nav.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      indicator.style.width = r.width + 'px';
      indicator.style.transform = `translateX(${(r.left - navRect.left).toFixed(1)}px)`;
      indicator.classList.add('visible');
    }

    if (active) {
      active.classList.add('active');
      // Wait a frame so layout has settled (fonts may shift widths)
      requestAnimationFrame(() => moveTo(active));
    }

    links.forEach((link) => {
      link.addEventListener('pointerenter', () => moveTo(link));
    });
    nav.addEventListener('pointerleave', () => moveTo(active));
    window.addEventListener('resize', () => moveTo(active), { passive: true });

    // Re-measure once webfonts are loaded (Plus Jakarta Sans changes link widths)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => moveTo(active));
    }
  }

  /* -------------------------------------------------------------- */
  /* Boot                                                            */
  /* -------------------------------------------------------------- */
  function boot() {
    initSpotlights();
    initTilts();
    initReveals();
    initNavIndicator();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
