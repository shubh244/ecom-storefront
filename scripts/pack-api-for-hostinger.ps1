# Creates backend_new-deploy.zip for File Manager upload (excludes vendor — run composer on server).

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root "backend_new"
$out = Join-Path $root "backend_new-deploy.zip"

if (Test-Path $out) { Remove-Item $out -Force }

$temp = Join-Path $env:TEMP ("backend_new_deploy_" + [guid]::NewGuid().ToString("n"))
New-Item -ItemType Directory -Path $temp | Out-Null

Write-Host "Staging to $temp ..."

robocopy $src $temp /E /XD vendor node_modules .git storage\logs storage\framework\cache\data storage\framework\sessions storage\framework\views /XF .env .env.backup .env.production /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy failed: $LASTEXITCODE" }

# Ensure empty storage dirs exist
@(
    "storage\app\public",
    "storage\framework\cache\data",
    "storage\framework\sessions",
    "storage\framework\views",
    "storage\logs",
    "bootstrap\cache"
) | ForEach-Object {
    $p = Join-Path $temp $_
    if (-not (Test-Path $p)) { New-Item -ItemType Directory -Path $p -Force | Out-Null }
}

Copy-Item (Join-Path $root "scripts\hostinger-api.env.example") (Join-Path $temp ".env.hostinger.example")

Compress-Archive -Path "$temp\*" -DestinationPath $out -Force
Remove-Item $temp -Recurse -Force

Write-Host "Created: $out"
Write-Host "Upload contents to: .../public_html/api/ (Laravel root; public/ is document root)"
Write-Host "Then copy .env.hostinger.example -> .env and fill APP_KEY, DB_PASSWORD"
