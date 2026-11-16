# ============================================================
# convert-article.ps1  -  WeChat article importer for Astro site
#
# Takes a markdown file exported by wechat2md, plus its image
# folder, and produces a ready-to-publish article:
#   1. renames the md file to an english slug
#   2. generates frontmatter (title/description/date/category/tags)
#   3. copies images to public/images/<slug>/ as 01.png, 02.png ...
#   4. rewrites image references in the article body
#   5. strips common WeChat footer junk and broken bold marks
#   6. git add + commit (message encoded as UTF-8, no mojibake)
#
# Usage (run from anywhere):
#   powershell -File convert-article.ps1 `
#     -SourceMd  "D:\export\文章标题.md" `
#     -Slug      "cmos-module-alignment" `
#     -Title     "文章标题（可用中文）" `
#     -Category  hardware `
#     -Tags      "摄像头模组,AA工艺"
#
# If -ImageDir is omitted, the script looks for a folder with the
# same name as the md file, sitting next to it (wechat2md layout).
# Add -NoCommit to skip the git commit step.
# ============================================================
param(
  [Parameter(Mandatory = $true)][string]$SourceMd,
  [Parameter(Mandatory = $true)][string]$Slug,
  [Parameter(Mandatory = $true)][string]$Title,
  [string]$Category = "hardware",
  [string]$Tags = "",
  [string]$Description = "",
  [string]$ImageDir = "",
  [switch]$NoCommit
)

$ErrorActionPreference = "Stop"

# ---- validation ----
if ($Slug -notmatch '^[a-z0-9]+(-[a-z0-9]+)*$') {
  Write-Host "ERROR: slug must be lowercase english words joined by hyphens, e.g. cmos-module-alignment"
  exit 1
}
$cats = @("hardware", "chip", "firmware", "tools")
if ($cats -notcontains $Category) {
  Write-Host "ERROR: category must be one of: hardware | chip | firmware | tools"
  exit 1
}

$site = $PSScriptRoot
$src = [System.IO.Path]::GetFullPath($SourceMd)
if (-not (Test-Path -LiteralPath $src)) {
  Write-Host "ERROR: source md not found: $src"
  exit 1
}
$outMd = Join-Path $site ("src\content\articles\" + $Slug + ".md")
if (Test-Path -LiteralPath $outMd) {
  Write-Host "ERROR: article already exists: $Slug.md  -  pick another slug"
  exit 1
}

$md = [System.IO.File]::ReadAllText($src)

# ---- locate image folder ----
if (-not $ImageDir) {
  $guess = Join-Path (Split-Path $src -Parent) ([System.IO.Path]::GetFileNameWithoutExtension($src))
  if (Test-Path -LiteralPath $guess) { $ImageDir = $guess }
}
if (-not $ImageDir -or -not (Test-Path -LiteralPath $ImageDir)) {
  Write-Host "ERROR: image folder not found. Pass it explicitly:  -ImageDir `"D:\export\images`""
  exit 1
}

# ---- collect image refs, in order of appearance ----
$refs = @()
foreach ($m in [regex]::Matches($md, '!\[[^\]]*\]\(([^)]+)\)')) {
  $refs += $m.Groups[1].Value.Trim()
}
$refs = @($refs | Select-Object -Unique)

$imgOut = Join-Path $site ("public\images\" + $Slug)
New-Item -ItemType Directory -Force -Path $imgOut | Out-Null
$allImages = Get-ChildItem -LiteralPath $ImageDir -Recurse -File

$map = @{}
$i = 1
foreach ($r in $refs) {
  $name = [System.IO.Path]::GetFileName(($r -replace '\\', '/'))
  try { $name = [uri]::UnescapeDataString($name) } catch { }
  $file = $allImages | Where-Object { $_.Name -eq $name } | Select-Object -First 1
  if (-not $file) {
    Write-Host "WARN: image not found in source folder, skipped: $name"
    continue
  }
  $newName = ("{0:d2}{1}" -f $i, $file.Extension.ToLower())
  Copy-Item -LiteralPath $file.FullName -Destination (Join-Path $imgOut $newName)
  $map[$r] = "/images/$Slug/$newName"
  $i++
}
foreach ($k in @($map.Keys)) { $md = $md.Replace($k, $map[$k]) }

# ---- light cleanup of WeChat export artifacts ----
# broken bold markers like "** **" or lone "****"
$md = $md -replace '\*\*\s*\*\*', ''
# wechat2md promo / footer lines (short lines only, to be safe)
$keep = New-Object System.Collections.Generic.List[string]
foreach ($line in ($md -split "`r?`n")) {
  $t = $line.Trim()
  if ($t.Length -lt 60 -and $t -match '(点赞|在看|微信扫一扫|扫一扫关注|wechat2md|www\.wechat2md|点击上方.*关注|点击下方.*关注|该文章来源于|使用微信)') {
    continue
  }
  $keep.Add($line)
}
$md = ($keep -join "`n").Trim()

# ---- auto description: first plain paragraph >= 30 chars ----
if (-not $Description) {
  foreach ($p in ($md -split "`r?`n")) {
    $t = $p.Trim()
    if ($t.Length -ge 30 -and $t -notmatch '^[#!\[\*>|]') {
      $Description = $t
      break
    }
  }
  if (-not $Description) { $Description = "" }
  if ($Description.Length -gt 80) { $Description = $Description.Substring(0, 80) }
}

# ---- build frontmatter ----
$titleY = $Title.Replace("'", "''")
$descY  = $Description.Replace("'", "''")
$tagArr = @()
if ($Tags) { $tagArr = @($Tags.Split(',') | ForEach-Object { $_.Trim() } | Where-Object { $_ }) }
$tagYaml = "[]"
if ($tagArr.Count -gt 0) {
  $tagYaml = "[" + (($tagArr | ForEach-Object { "'" + $_.Replace("'", "''") + "'" }) -join ", ") + "]"
}
$date = (Get-Date).ToString("yyyy-MM-dd")

$nl = [char]10
$content = "---$nl" +
  "title: '$titleY'$nl" +
  "description: '$descY'$nl" +
  "date: $date$nl" +
  "category: $Category$nl" +
  "tags: $tagYaml$nl" +
  "draft: false$nl" +
  "---$nl$nl" +
  $md + $nl

[System.IO.File]::WriteAllText($outMd, $content, [System.Text.UTF8Encoding]::new($false))

Write-Host ""
Write-Host ("Article created : src/content/articles/" + $Slug + ".md")
Write-Host ("Images copied   : " + ($i - 1) + " file(s) -> public/images/" + $Slug + "/")
if ($Description) { Write-Host ("Description     : " + $Description) }

# ---- git commit with UTF-8 message (avoids PowerShell mojibake) ----
if (-not $NoCommit) {
  $msg = "post: $Title"
  $tmp = Join-Path $env:TEMP ("cmsg-" + [guid]::NewGuid().ToString() + ".txt")
  [System.IO.File]::WriteAllText($tmp, $msg, [System.Text.UTF8Encoding]::new($false))
  git -C $site add -A 2>$null
  git -C $site commit -F $tmp 2>&1 | Out-Null
  Remove-Item $tmp -ErrorAction SilentlyContinue
  $log = git -C $site log -1 --oneline
  Write-Host ("Committed       : " + $log)
  Write-Host ""
  Write-Host "NEXT STEP (run in your own terminal):"
  Write-Host ("  git -C `"$site`" push")
} else {
  Write-Host ""
  Write-Host "-NoCommit was set. When ready:"
  Write-Host ("  git -C `"$site`" add -A")
  Write-Host ("  git -C `"$site`" commit -m `"post: your title`"")
  Write-Host ("  git -C `"$site`" push")
}
