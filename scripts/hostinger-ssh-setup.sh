#!/bin/bash
# Run ON Hostinger after: ssh -p 65002 u274811071@93.127.208.1
set -e
cd ~/domains/darkslategrey-gazelle-896289.hostingersite.com/public_html/api
test -f artisan || { echo "ERROR: artisan not found. Upload and extract backend_new-deploy.zip into public_html/api first."; exit 1; }
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
php artisan migrate --force
php artisan storage:link || true
php artisan config:clear
echo "OK — test: https://api.darkslategrey-gazelle-896289.hostingersite.com/api/categories"
