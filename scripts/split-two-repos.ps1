# Creates two sibling folders ready for separate Git repos + Hostinger deploy:
#   ../shreejee-storefront  (Next.js → Node / Git on Hostinger)
#   ../shreejee-api         (Laravel  → PHP hosting, document root = public/)
#
# Run from repo root:  powershell -ExecutionPolicy Bypass -File scripts/split-two-repos.ps1

$ErrorActionPreference = "Stop"
$Monorepo = Split-Path $PSScriptRoot -Parent
$Root = Split-Path $Monorepo -Parent
$OutFront = Join-Path $Root "shreejee-storefront"
$OutApi = Join-Path $Root "shreejee-api"

function Remove-IfExists($path) {
    if (Test-Path $path) { Remove-Item -Recurse -Force $path }
}

Write-Host "Monorepo: $Monorepo"
Write-Host "Frontend -> $OutFront"
Write-Host "API      -> $OutApi"

Remove-IfExists $OutFront
Remove-IfExists $OutApi
New-Item -ItemType Directory -Path $OutFront, $OutApi | Out-Null

# --- Next.js storefront ---
$frontItems = @(
    "app", "components", "context", "lib", "public", "types",
    "package.json", "package-lock.json", "next.config.js", "postcss.config.js",
    "tailwind.config.js", "tsconfig.json", ".env.example"
)
foreach ($item in $frontItems) {
    $src = Join-Path $Monorepo $item
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination (Join-Path $OutFront $item) -Recurse -Force
    }
}

$frontGitignore = @"
node_modules
.next
out
build
.env
.env.local
.env*.local
.DS_Store
*.pem
npm-debug.log*
.vercel
*.tsbuildinfo
"@
Set-Content -Path (Join-Path $OutFront ".gitignore") -Value $frontGitignore -Encoding utf8

$frontScripts = Join-Path $OutFront "scripts"
New-Item -ItemType Directory -Path $frontScripts -Force | Out-Null
Copy-Item (Join-Path $Monorepo "scripts\hostinger-next-env.txt") $frontScripts -ErrorAction SilentlyContinue

$frontReadme = Join-Path $Monorepo "scripts\split-repos\README-STOREFRONT.md"
if (Test-Path $frontReadme) {
    Copy-Item $frontReadme (Join-Path $OutFront "README.md") -Force
}

# --- Laravel API (backend_new → repo root) ---
$apiSrc = Join-Path $Monorepo "backend_new"
if (-not (Test-Path $apiSrc)) { throw "backend_new not found" }

robocopy $apiSrc $OutApi /E /XD node_modules vendor .git storage\logs storage\framework\cache storage\framework\sessions storage\framework\views bootstrap\cache /XF .env .env.* /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy failed: $LASTEXITCODE" }

$apiScripts = Join-Path $OutApi "scripts"
New-Item -ItemType Directory -Path $apiScripts -Force | Out-Null
@(
    "hostinger-api.env.example", "hostinger-ssh-setup.sh", "HOSTINGER_15_MIN.txt",
    "pack-api-for-hostinger.ps1", "pack-api-tar-hostinger.ps1"
) | ForEach-Object {
    $s = Join-Path $Monorepo "scripts\$_"
    if (Test-Path $s) { Copy-Item $s $apiScripts -Force }
}

$apiReadme = Join-Path $Monorepo "scripts\split-repos\README-API.md"
if (Test-Path $apiReadme) {
    Copy-Item $apiReadme (Join-Path $OutApi "README.md") -Force
}
Copy-Item (Join-Path $Monorepo "scripts\split-repos\HOSTINGER_TWO_SITES.txt") $OutApi -Force -ErrorAction SilentlyContinue
Copy-Item (Join-Path $Monorepo "scripts\split-repos\HOSTINGER_TWO_SITES.txt") $OutFront -Force -ErrorAction SilentlyContinue
Copy-Item (Join-Path $Monorepo "scripts\split-repos\hostinger-api.env.production.example") $OutApi -Force -ErrorAction SilentlyContinue

# Laravel GitHub Action (repo root = Laravel)
$ghApi = Join-Path $OutApi ".github\workflows"
New-Item -ItemType Directory -Path $ghApi -Force | Out-Null
$wfSrc = Join-Path $Monorepo ".github\workflows\deploy-laravel-hostinger.yml"
if (Test-Path $wfSrc) {
    $wf = Get-Content $wfSrc -Raw
    $wf = $wf -replace "backend_new/\*\*", "**"
    $wf = $wf -replace "(?m)^\s+working-directory: backend_new\r?\n", ""
    $wf = $wf -replace "local-dir: \./backend_new/", "local-dir: ./"
    $wf = $wf -replace "deploy-laravel-hostinger\.yml", "deploy-hostinger.yml"
    Set-Content (Join-Path $ghApi "deploy-hostinger.yml") -Value $wf -Encoding utf8
}

Write-Host ""
Write-Host "Done."
Write-Host "  Next:     $OutFront"
Write-Host "  Laravel:  $OutApi"
Write-Host ""
Write-Host "Create two GitHub repos, then in each folder:"
Write-Host "  git init"
Write-Host "  git add ."
Write-Host "  git commit -m `"Initial split from monorepo`""
Write-Host "  git remote add origin https://github.com/YOU/REPO.git"
Write-Host "  git branch -M main"
Write-Host "  git push -u origin main"
