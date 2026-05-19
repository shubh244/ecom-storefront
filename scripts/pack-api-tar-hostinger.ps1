# Creates backend_new-deploy.tar.gz with Unix paths (fixes Hostinger extract showing public\foo as filename).
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root "backend_new"
$tarGz = Join-Path $root "backend_new-deploy.tar.gz"

if (-not (Test-Path $src)) { throw "backend_new folder not found" }

$temp = Join-Path $env:TEMP ("backend_new_tar_" + [guid]::NewGuid().ToString("n"))
New-Item -ItemType Directory -Path $temp | Out-Null

Write-Host "Staging to $temp ..."

robocopy $src $temp /E /XD vendor node_modules .git storage\logs storage\framework\cache\data storage\framework\sessions storage\framework\views /XF .env .env.backup .env.production /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy failed: $LASTEXITCODE" }

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

if (Test-Path $tarGz) { Remove-Item $tarGz -Force }

# Windows tar (Windows 10+): creates paths with /
& tar.exe -czf $tarGz -C $temp .
if ($LASTEXITCODE -ne 0) { throw 'tar.exe failed. Use Git Bash: tar -czf backend_new-deploy.tar.gz -C STAGING_DIR .' }

Remove-Item $temp -Recurse -Force

Write-Host ''
Write-Host "Created: $tarGz"
Write-Host 'Upload to public_html/api/, then SSH:'
Write-Host '  cd .../public_html/api'
Write-Host '  tar -xzf backend_new-deploy.tar.gz'
