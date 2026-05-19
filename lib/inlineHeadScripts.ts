/**
 * Repairs stale CDN HTML: wrong /_next/static CSS + JS hashes (404, text/html MIME on .js).
 */
export const inlineHeadScripts = `
(function () {
  var BUILD = '2';
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

  function parseWebpackHash(html) {
    var m = html.match(/\\/_next\\/static\\/chunks\\/webpack-([a-f0-9]+)\\.js/);
    return m ? m[1] : null;
  }

  function currentWebpackHash() {
    var s = document.querySelector('script[src*="/_next/static/chunks/webpack-"]');
    if (!s) return null;
    var src = s.getAttribute('src') || '';
    var m = src.match(/webpack-([a-f0-9]+)\\.js/);
    return m ? m[1] : null;
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

  function fetchFreshHtml(done) {
    var url = location.pathname + location.search;
    var sep = url.indexOf('?') >= 0 ? '&' : '?';
    fetch(url + sep + '_fresh_css=' + Date.now(), {
      cache: 'no-store',
      credentials: 'same-origin',
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    })
      .then(function (r) { return r.text(); })
      .then(function (html) { done(html); })
      .catch(function () { done(''); });
  }

  function reloadWithBust() {
    try { sessionStorage.removeItem('sjbw_cdn_v'); } catch (e) {}
    var q = location.search || '';
    var sep = q.indexOf('?') >= 0 ? '&' : '?';
    location.replace(location.pathname + q + sep + '__b=' + Date.now() + (location.hash || ''));
  }

  function markOk() {
    try { sessionStorage.setItem('sjbw_cdn_v', BUILD); } catch (e) {}
  }

  function repair() {
    fetchFreshHtml(function (html) {
      if (!html) return;
      var freshWp = parseWebpackHash(html);
      var curWp = currentWebpackHash();
      if (freshWp && curWp && freshWp !== curWp) {
        reloadWithBust();
        return;
      }
      if (!tailwindOk()) addStylesheet(parseCssHref(html));
      else markOk();
    });

    document.querySelectorAll('link[rel="stylesheet"]').forEach(function (link) {
      link.addEventListener('error', function () {
        fetchFreshHtml(function (h) { addStylesheet(parseCssHref(h)); });
      }, { once: true });
    });

    document.querySelectorAll('script[src*="/_next/static/chunks/"]').forEach(function (script) {
      script.addEventListener('error', function () { reloadWithBust(); }, { once: true });
    });

    window.setTimeout(function () {
      if (!tailwindOk()) {
        fetchFreshHtml(function (h) {
          if (parseCssHref(h)) addStylesheet(parseCssHref(h));
          else reloadWithBust();
        });
      } else {
        markOk();
      }
    }, 800);
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
