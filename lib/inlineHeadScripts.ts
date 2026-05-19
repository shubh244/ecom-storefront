/**
 * Ensures Tailwind CSS is applied on first load, back/forward (bfcache), and slow networks.
 * Never reveals unstyled HTML.
 */
export const inlineHeadScripts = `
(function () {
  var ROOT = document.documentElement;
  var RELOAD_KEY = 'sjbw-css-reloads';
  var MAX_RELOADS = 2;

  function markCssReady() {
    if (tailwindLoaded()) ROOT.classList.add('css-ready');
  }

  function reloadCount() {
    try {
      return parseInt(sessionStorage.getItem(RELOAD_KEY) || '0', 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  function bumpReload() {
    try {
      sessionStorage.setItem(RELOAD_KEY, String(reloadCount() + 1));
    } catch (e) {}
  }

  function showCssBlockedMessage() {
    if (document.getElementById('sjbw-css-blocked')) return;
    var box = document.createElement('div');
    box.id = 'sjbw-css-blocked';
    box.setAttribute('role', 'alert');
    box.style.cssText =
      'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:24px;background:#fff;font-family:system-ui,sans-serif;text-align:center';
    box.innerHTML =
      '<div><p style="margin:0 0 12px;font-size:18px;font-weight:600;color:#1a1a1a">Loading styles…</p>' +
      '<p style="margin:0 0 16px;font-size:14px;color:#555">If this stays blank, tap below.</p>' +
      '<button type="button" style="padding:12px 20px;border:0;border-radius:8px;background:#8B4513;color:#fff;font-size:16px;font-weight:600">Reload page</button></div>';
    box.querySelector('button').addEventListener('click', function () {
      try {
        sessionStorage.removeItem(RELOAD_KEY);
      } catch (e) {}
      var u = location.pathname + location.search;
      location.replace(u + (u.indexOf('?') >= 0 ? '&' : '?') + '_css=' + Date.now());
    });
    (document.body || document.documentElement).appendChild(box);
  }

  function tryReload(reason) {
    if (reloadCount() >= MAX_RELOADS) {
      if (!tailwindLoaded()) {
        showCssBlockedMessage();
        return;
      }
      markCssReady();
      return;
    }
    bumpReload();
    location.reload();
  }

  try {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (regs) {
        regs.forEach(function (r) { r.unregister(); });
      });
    }
    if ('caches' in window) {
      caches.keys().then(function (keys) {
        keys.forEach(function (k) { caches.delete(k); });
      });
    }
  } catch (e) {}

  function tailwindLoaded() {
    if (!document.body) return false;
    var el = document.createElement('div');
    el.className = 'text-primary';
    el.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
    document.body.appendChild(el);
    var rgb = window.getComputedStyle(el).color;
    el.remove();
    return rgb === 'rgb(139, 69, 19)' || rgb === 'rgb(139,69,19)';
  }

  function moveStylesheetsFirst() {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      document.head.insertBefore(links[i], document.head.firstChild);
    }
  }

  function reinjectStylesheets() {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      var old = links[i];
      var href = (old.getAttribute('href') || '').split('?')[0];
      if (!href) continue;
      var fresh = document.createElement('link');
      fresh.rel = 'stylesheet';
      fresh.href = href + '?v=' + Date.now();
      fresh.dataset.cssGuard = '1';
      fresh.addEventListener('load', function () {
        if (tailwindLoaded()) markCssReady();
      });
      fresh.addEventListener('error', function () {
        tryReload('stylesheet-error');
      });
      document.head.insertBefore(fresh, old);
      old.remove();
    }
  }

  function wireStylesheet(link) {
    if (link.dataset.cssGuard) return;
    link.dataset.cssGuard = '1';

    link.addEventListener('load', function () {
      if (tailwindLoaded()) markCssReady();
    });

    link.addEventListener('error', function () {
      var href = (link.getAttribute('href') || '').split('?')[0];
      if (!href) return;
      var retry = document.createElement('link');
      retry.rel = 'stylesheet';
      retry.href = href + '?v=' + Date.now();
      retry.dataset.cssGuard = '1';
      retry.addEventListener('load', function () {
        if (tailwindLoaded()) markCssReady();
      });
      retry.addEventListener('error', function () {
        tryReload('retry-error');
      });
      document.head.insertBefore(retry, document.head.firstChild);
    });
  }

  function ensureCss(reason) {
    ROOT.classList.remove('css-ready');
    moveStylesheetsFirst();

    if (tailwindLoaded()) {
      markCssReady();
      return;
    }

    var links = document.querySelectorAll('link[rel="stylesheet"]');
    var hasSheet = false;
    for (var i = 0; i < links.length; i++) {
      if (links[i].sheet) hasSheet = true;
      wireStylesheet(links[i]);
    }

    if (!hasSheet && links.length === 0) {
      tryReload('no-stylesheet');
    }
  }

  ensureCss('boot');

  document.addEventListener('DOMContentLoaded', function () {
    ensureCss('dom');
    if (!tailwindLoaded()) {
      setTimeout(function () {
        if (tailwindLoaded()) {
          markCssReady();
        } else {
          reinjectStylesheets();
          setTimeout(function () {
            if (tailwindLoaded()) markCssReady();
            else tryReload('dom-timeout');
          }, 1500);
        }
      }, 300);
    }
  });

  window.addEventListener('pageshow', function (event) {
    ensureCss(event.persisted ? 'bfcache' : 'refresh');
    if (event.persisted || !tailwindLoaded()) {
      reinjectStylesheets();
    }
    setTimeout(function () {
      if (tailwindLoaded()) {
        markCssReady();
      } else if (event.persisted) {
        tryReload('bfcache');
      } else {
        reinjectStylesheets();
        setTimeout(function () {
          if (tailwindLoaded()) markCssReady();
          else tryReload('refresh');
        }, 1200);
      }
    }, event.persisted ? 200 : 100);
  });

  window.addEventListener('popstate', function () {
    setTimeout(function () {
      if (!tailwindLoaded()) ensureCss('popstate');
    }, 0);
  });
})();
`.trim()
