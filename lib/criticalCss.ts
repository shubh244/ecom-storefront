/** Hide page until Tailwind is confirmed — never show unstyled HTML. */
export const criticalCss = `
*,::before,::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
html:not(.css-ready) body{visibility:hidden!important;opacity:0!important}
html.css-ready body{visibility:visible!important;opacity:1!important}
body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.5;color:#1a1a1a;background:#fff}
img,svg{display:block;max-width:100%;height:auto}
a{color:inherit}
`.trim()
