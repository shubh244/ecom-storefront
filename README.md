# Shreejee Storefront (Next.js)

Standalone **Next.js 14** storefront. API is a **separate repo** (`shreejee-api`).

## Hostinger (Node / Git)

1. hPanel → **Websites** → your **storefront** site only (not the API site).
2. **Git** → connect this repo → build command: `npm run build` → start: `npm start` (or Hostinger default for Next).
3. **Environment variables** (set before deploy; rebuild after changes):

```env
NEXT_PUBLIC_SITE_URL=https://YOUR-STOREFRONT-DOMAIN
NEXT_PUBLIC_API_URL=https://YOUR-API-DOMAIN/api
```

Example (preview):

```env
NEXT_PUBLIC_SITE_URL=https://darkslategrey-gazelle-896289.hostingersite.com
NEXT_PUBLIC_API_URL=https://api.YOUR-PHP-HOST/api
```

4. Redeploy. Open site → DevTools → Network → a call like `/api/products/...` must hit **your API host**, not the storefront host.

## Local

```bash
npm install
cp .env.example .env.local
# set NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm run dev
```

## Do not put Laravel here

No `backend_new`, no `public_html/api` inside this repo. PHP API = other repo + PHP hosting.
