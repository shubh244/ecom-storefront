# Builds HOSTINGER_UPLOAD_THIS/ with everything you drag into File Manager + phpMyAdmin.
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root "HOSTINGER_UPLOAD_THIS"

New-Item -ItemType Directory -Path $out -Force | Out-Null

Write-Host "Building Laravel tarball..."
& powershell -ExecutionPolicy Bypass -File (Join-Path $root "scripts\pack-api-tar-hostinger.ps1")

$tar = Join-Path $root "backend_new-deploy.tar.gz"
if (-not (Test-Path $tar)) { throw "Missing $tar - run pack-api-tar-hostinger.ps1" }

Write-Host "Exporting MySQL data from Supabase (needs IMPORT_SOURCE_* in backend_new\.env)..."
Push-Location (Join-Path $root "backend_new")
php artisan config:clear 2>$null | Out-Null
php artisan db:export-mysql-for-hostinger 2>&1 | Write-Host
Pop-Location

Copy-Item $tar (Join-Path $out "backend_new-deploy.tar.gz") -Force
Copy-Item (Join-Path $root "backend_new\database\exports\hostinger-schema.sql") $out -Force
Copy-Item (Join-Path $root "backend_new\database\exports\hostinger-data.sql") $out -Force
Copy-Item (Join-Path $root "scripts\hostinger-api.env.example") (Join-Path $out "rename-to-dot-env-on-server.txt") -Force

@"

HOSTINGER UPLOAD BUNDLE (generated $(Get-Date -Format 'yyyy-MM-dd HH:mm'))

FILES IN THIS FOLDER:
  backend_new-deploy.tar.gz   -> upload to public_html/api/ then SSH: tar -xzf backend_new-deploy.tar.gz
  hostinger-schema.sql       -> phpMyAdmin Import FIRST (database u274811071_shreejee)
  hostinger-data.sql         -> phpMyAdmin Import SECOND
  rename-to-dot-env-on-server.txt -> copy to public_html/api/.env on server; edit DB_PASSWORD

THEN SSH:
  cd ~/domains/darkslategrey-gazelle-896289.hostingersite.com/public_html/api
  composer install --no-dev --optimize-autoloader
  php artisan key:generate --force
  php artisan config:clear
  php artisan storage:link

SUBDOMAIN api.* document root MUST BE:
  .../public_html/api/public

NEXT.JS GIT ENV:
  NEXT_PUBLIC_SITE_URL=https://darkslategrey-gazelle-896289.hostingersite.com
  NEXT_PUBLIC_API_URL=https://api.darkslategrey-gazelle-896289.hostingersite.com/api

Full guide: scripts/HOSTINGER_COMPLETE_SETUP.md

"@ | Set-Content -Path (Join-Path $out "START_HERE.txt") -Encoding UTF8

Write-Host ""
Write-Host "DONE. Open this folder:" -ForegroundColor Green
Write-Host $out
