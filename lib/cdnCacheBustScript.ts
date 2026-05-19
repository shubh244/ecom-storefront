/**
 * Hostinger hCDN caches `/` HTML for ~1 year with old /_next/static hashes → 404 + MIME errors.
 * Any URL with a cache-bust query gets fresh HTML. Redirect once before other scripts run.
 */
export const cdnCacheBustScript = `
(function () {
  if (/[?&](?:__b|_fresh_css)=/.test(location.search)) return;
  try {
    if (sessionStorage.getItem('sjbw_cdn_v') === '2') return;
  } catch (e) {}
  var q = location.search || '';
  var sep = q.indexOf('?') >= 0 ? '&' : '?';
  location.replace(
    location.pathname + q + sep + '__b=' + Date.now() + (location.hash || '')
  );
})();
`.trim()
