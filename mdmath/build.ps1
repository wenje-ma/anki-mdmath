# mdmath build script: package the add-on into an .ankiaddon file.
# Usage: run inside the mdmath folder:  powershell -ExecutionPolicy Bypass -File .\build.ps1
$ErrorActionPreference = "Stop"
$root  = Split-Path -Parent $MyInvocation.MyCommand.Path   # this folder = the add-on folder
$out   = Join-Path $root "mdmath.ankiaddon"
$tmpZip = Join-Path $root "mdmath.zip"

# Only these belong to the add-on runtime (exclude .deps, tests, README, build.ps1, .gitignore)
$include = @("__init__.py", "templates.py", "manifest.json", "assets")

if (Test-Path -LiteralPath $out)   { Remove-Item -LiteralPath $out -Force }
if (Test-Path -LiteralPath $tmpZip){ Remove-Item -LiteralPath $tmpZip -Force }

$paths = $include | ForEach-Object { Join-Path $root $_ }
foreach ($p in $paths) { if (-not (Test-Path -LiteralPath $p)) { throw "missing: $p" } }

# Zip the add-on files (manifest.json lands at zip root)
Compress-Archive -Path $paths -DestinationPath $tmpZip
Move-Item -LiteralPath $tmpZip -Destination $out -Force
Write-Output ("Built: {0}  ({1:N0} KB)" -f $out, ((Get-Item -LiteralPath $out).Length / 1KB))
