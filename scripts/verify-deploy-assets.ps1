# Run after deploy: confirms HTML references a CSS file that returns 200.
$base = if ($args[0]) { $args[0].TrimEnd('/') } else { 'https://shreejeeblessingwood.in' }
$html = (Invoke-WebRequest -Uri $base -UseBasicParsing).Content
if ($html -notmatch 'href="(/_next/static/css/[^"]+\.css)"') {
  Write-Error "No stylesheet link in HTML"
  exit 1
}
$cssPath = $Matches[1]
$cssUrl = "$base$cssPath"
$r = Invoke-WebRequest -Uri $cssUrl -UseBasicParsing
if ($r.StatusCode -ne 200 -or $r.Content.Length -lt 1000) {
  Write-Error "CSS failed: $cssUrl status=$($r.StatusCode) len=$($r.Content.Length)"
  exit 1
}
if ($r.Content -notmatch '\.bg-white') {
  Write-Error "CSS missing Tailwind utilities"
  exit 1
}
Write-Host "OK: $cssUrl ($($r.Content.Length) bytes)"
