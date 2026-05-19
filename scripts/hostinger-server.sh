#!/bin/bash
# Run on Hostinger SSH from Laravel root (folder containing artisan), e.g.:
# cd ~/domains/darkslategrey-gazelle-896289.hostingersite.com/public_html/api

set -e

echo "==> Composer install"
composer install --no-dev --optimize-autoloader

echo "==> App key (skip if APP_KEY already set in .env)"
php artisan key:generate --force 2>/dev/null || true

echo "==> Migrations (empty DB only; skip if you imported backup.sql)"
php artisan migrate --force

echo "==> Storage link + config"
php artisan storage:link 2>/dev/null || true
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "==> Permissions (adjust if your host uses different user)"
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

echo "Done. Test: https://api.darkslategrey-gazelle-896289.hostingersite.com/api/categories"
