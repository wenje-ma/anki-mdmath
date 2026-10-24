#mdmath build script: package add-on into .ankiaddon
$ErrorActionPreference="Stop"
$root=Split-Path -Parent $MyInvocation.MyCommand.Path
$out=Join-Path $root "mdmath.ankiaddon"
$tmpZip=Join-Path $root "mdmath.zip"
$include=@("__init__.py","templates.py","manifest.json","config.json","config.md","LICENSE","THIRD_PARTY_NOTICES","assets")
if(Test-Path -LiteralPath $out){Remove-Item -LiteralPath $out -Force}
if(Test-Path -LiteralPath $tmpZip){Remove-Item -LiteralPath $tmpZip -Force}
$paths=$include|ForEach-Object{Join-Path $root $_}
foreach($p in $paths){if(-not(Test-Path -LiteralPath $p)){throw "missing: $p"}}
Compress-Archive -Path $paths -DestinationPath $tmpZip
Move-Item -LiteralPath $tmpZip -Destination $out -Force
Write-Output ("Built: {0}  ({1:N0} KB)" -f $out,((Get-Item -LiteralPath $out).Length/1KB))
