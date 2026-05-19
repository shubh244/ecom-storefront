/**
 * Repairs stale CDN HTML that points at deleted /_next/static/css/*.css files.
 * Does not hide the page or remove working stylesheets (avoids breaking mobile refresh).
 */
export const inlineHeadScripts = `
(function () {
  var PRIMARY_A = 'rgb(139, 69, 19)';
  var PRIMARY_B = 'rgb(139,69,19)';

  function tailwindOk() {
    if (!document.body) return false;
    var el = document.createElement('div');
    el.className = 'text-primary';
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
    document.body.appendChild(el);
    var c = window.getComputedStyle(el).color;
    el.remove();
    return c === PRIMARY_A || c === PRIMARY_B;
  }

  function parseCssHref(html) {
    var m = html.match(/href="(\\/_next\\/static\\/css\\/[^"?]+\\.css)"/);
    return m ? m[1] : null;
  }

  function addStylesheet(href) {
    if (!href) return;
    var base = href.split('?')[0];
    var sel = 'link[rel="stylesheet"][href^="' + base + '"]';
    if (document.querySelector(sel)) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = base + '?fix=' + Date.now();
    document.head.appendChild(link);
  }

  function fetchFreshCss(done) {
    var url = location.pathname + location.search;
    var sep = url.indexOf('?') >= 0 ? '&' : '?';
    fetch(url + sep + '_fresh_css=' + Date.now(), {
      cache: 'no-store',
      credentials: 'same-origin',
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    })
      .then(function (r) { return r.text(); })
      .then(function (html) { done(parseCssHref(html)); })
      .catch(function () { done(null); });
  }

  function repair() {
    if (tailwindOk()) return;

    document.querySelectorAll('link[rel="stylesheet"]').forEach(function (link) {
      link.addEventListener(
        'error',
        function () {
          fetchFreshCss(addStylesheet);
        },
        { once: true }
      );
    });

    window.setTimeout(function () {
      if (!tailwindOk()) fetchFreshCss(addStylesheet);
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', repair);
  } else {
    repair();
  }

  window.addEventListener('pageshow', function (e) {
    if (e.persisted || !tailwindOk()) repair();
  });
})();
`.trim()
