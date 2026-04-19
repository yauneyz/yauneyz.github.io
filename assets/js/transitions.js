/* Same-origin link interception → View Transitions API blur+fade.
   Falls back to default navigation when the API isn't available. */
(function () {
  'use strict';

  if (!('startViewTransition' in document)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    if (a.target && a.target !== '' && a.target !== '_self') return;
    if (a.hasAttribute('download')) return;
    if (a.dataset.noTransition !== undefined) return;

    let url;
    try { url = new URL(a.href, window.location.href); } catch { return; }
    if (url.origin !== window.location.origin) return;
    // Pure in-page anchor → let the browser handle it
    if (url.pathname === window.location.pathname && url.hash) return;

    e.preventDefault();
    document.startViewTransition(() => {
      window.location.href = a.href;
    });
  });
})();
