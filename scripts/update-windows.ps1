# ===========================================
# Rising Tides - Update Script (Windows)
# ===========================================
# Updates your skills and plugins to the latest version.
# Run this anytime to get new skills and improvements.
# ===========================================

$ErrorActionPreference = "Stop"

# Colors and formatting
function Print-Header {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "   Rising Tides - Update                    " -ForegroundColor Cyan
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
}

function Print-Success { param([string]$Message) Write-Host "[OK] $Message" -ForegroundColor Green }
function Print-Info { param([string]$Message) Write-Host "-> $Message" -ForegroundColor Yellow }
function Print-Error { param([string]$Message) Write-Host "[ERROR] $Message" -ForegroundColor Red }
function Print-Add { param([string]$Message) Write-Host "  + $Message" -ForegroundColor Green }
function Print-Remove { param([string]$Message) Write-Host "  - $Message" -ForegroundColor Red }
function Print-Change { param([string]$Message) Write-Host "  ~ $Message" -ForegroundColor Yellow }

Print-Header

# Paths
$CLAUDE_DIR = "$env:USERPROFILE\.claude"
$SKILLS_DIR = "$CLAUDE_DIR\skills"
$PLUGINS_DIR = "$CLAUDE_DIR\plugins"
$LOCAL_VERSION_FILE = "$CLAUDE_DIR\VERSION"

# Check if Rising Tides is installed
if (-not (Test-Path $SKILLS_DIR)) {
    Print-Error "Rising Tides is not installed."
    Write-Host ""
    Write-Host "Run the setup script first:" -ForegroundColor Yellow
    Write-Host "  Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/SunsetSystemsAI/rising-tides-starter-pack/main/scripts/setup-windows.ps1' -OutFile `"`$env:TEMP\setup.ps1`"; & `"`$env:TEMP\setup.ps1`""
    Write-Host ""
    exit 1
}

# Get local version
$localVersion = "0.0.0"
if (Test-Path $LOCAL_VERSION_FILE) {
    $localVersion = (Get-Content $LOCAL_VERSION_FILE -ErrorAction SilentlyContinue | Select-Object -First 1).Trim()
}
Print-Info "Current version: $localVersion"

# Download latest version info
Print-Info "Checking for updates..."

$tempDir = Join-Path $env:TEMP "rising-tides-update-$(Get-Date -Format 'yyyyMMddHHmmss')"
$downloadSuccess = $false

# Try zip download
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $zipUrl = "https://github.com/SunsetSystemsAI/rising-tides-starter-pack/archive/refs/heads/main.zip"
    $zipFile = Join-Path $env:TEMP "rising-tides-update.zip"

    Invoke-WebRequest -Uri $zipUrl -OutFile $zipFile -UseBasicParsing
    Expand-Archive -Path $zipFile -DestinationPath $env:TEMP -Force
    $tempDir = Join-Path $env:TEMP "rising-tides-starter-pack-main"
    Remove-Item $zipFile -Force -ErrorAction SilentlyContinue

    if (Test-Path $tempDir) {
        $downloadSuccess = $true
    }
} catch {
    Print-Error "Failed to download update: $_"
    exit 1
}

if (-not $downloadSuccess) {
    Print-Error "Could not download update. Check your internet connection."
    exit 1
}

# Get remote version
$remoteVersion = "0.0.0"
$remoteVersionFile = Join-Path $tempDir "VERSION"
if (Test-Path $remoteVersionFile) {
    $remoteVersion = (Get-Content $remoteVersionFile | Select-Object -First 1).Trim()
}

Print-Info "Latest version: $remoteVersion"

# Compare versions
if ($localVersion -eq $remoteVersion) {
    Write-Host ""
    Print-Success "You're already on the latest version ($localVersion)"
    Write-Host ""
    Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    exit 0
}

Write-Host ""
Write-Host "Updating: $localVersion -> $remoteVersion" -ForegroundColor Cyan
Write-Host ""

# Track changes
$added = @()
$removed = @()
$updated = @()

# Get current skills and plugins
$currentSkills = @()
if (Test-Path $SKILLS_DIR) {
    $currentSkills = Get-ChildItem -Directory $SKILLS_DIR -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name
}

$currentPlugins = @()
if (Test-Path $PLUGINS_DIR) {
    $currentPlugins = Get-ChildItem -Directory $PLUGINS_DIR -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name
}

# Get new skills and plugins
$newSkillsDir = Join-Path $tempDir "skills"
$newPluginsDir = Join-Path $tempDir "plugins"

$newSkills = @()
if (Test-Path $newSkillsDir) {
    $newSkills = Get-ChildItem -Directory $newSkillsDir -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name
}

$newPlugins = @()
if (Test-Path $newPluginsDir) {
    $newPlugins = Get-ChildItem -Directory $newPluginsDir -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name
}

# Calculate changes for skills
$addedSkills = $newSkills | Where-Object { $_ -notin $currentSkills }
$removedSkills = $currentSkills | Where-Object { $_ -notin $newSkills }
$commonSkills = $newSkills | Where-Object { $_ -in $currentSkills }

# Calculate changes for plugins
$addedPlugins = $newPlugins | Where-Object { $_ -notin $currentPlugins }
$removedPlugins = $currentPlugins | Where-Object { $_ -notin $newPlugins }

# Remove old skills that are no longer in the pack
foreach ($skill in $removedSkills) {
    $skillPath = Join-Path $SKILLS_DIR $skill
    Remove-Item -Recurse -Force $skillPath -ErrorAction SilentlyContinue
    $removed += "skill: $skill"
}

# Remove old plugins that are no longer in the pack
foreach ($plugin in $removedPlugins) {
    $pluginPath = Join-Path $PLUGINS_DIR $plugin
    Remove-Item -Recurse -Force $pluginPath -ErrorAction SilentlyContinue
    $removed += "plugin: $plugin"
}

# Copy all skills (overwrites existing, adds new)
if (Test-Path $newSkillsDir) {
    Copy-Item -Path "$newSkillsDir\*" -Destination $SKILLS_DIR -Recurse -Force
}

# Copy all plugins (overwrites existing, adds new)
if (Test-Path $newPluginsDir) {
    Copy-Item -Path "$newPluginsDir\*" -Destination $PLUGINS_DIR -Recurse -Force
}

# Track added
foreach ($skill in $addedSkills) {
    $added += "skill: $skill"
}
foreach ($plugin in $addedPlugins) {
    $added += "plugin: $plugin"
}

# Copy index files
$filesToCopy = @("SKILLS_INDEX.json", "MCP_REGISTRY.md", "ATTRIBUTION.md", "VERSION", "CHANGELOG.md")
foreach ($file in $filesToCopy) {
    $srcFile = Join-Path $tempDir $file
    if (Test-Path $srcFile) {
        Copy-Item $srcFile "$CLAUDE_DIR\" -Force
    }
}

# Clean up
Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

# Print summary
Write-Host "-------------------------------------------"

if ($added.Count -gt 0) {
    Write-Host ""
    Write-Host "Added:" -ForegroundColor Green
    foreach ($item in $added) {
        Print-Add $item
    }
}

if ($removed.Count -gt 0) {
    Write-Host ""
    Write-Host "Removed:" -ForegroundColor Red
    foreach ($item in $removed) {
        Print-Remove $item
    }
}

$skillCount = (Get-ChildItem -Directory $SKILLS_DIR -ErrorAction SilentlyContinue | Measure-Object).Count
$pluginCount = (Get-ChildItem -Directory $PLUGINS_DIR -ErrorAction SilentlyContinue | Measure-Object).Count

Write-Host ""
Write-Host "-------------------------------------------"
Print-Success "Update complete!"
Write-Host ""
Write-Host "  Version: $remoteVersion"
Write-Host "  Skills: $skillCount"
Write-Host "  Plugins: $pluginCount"
Write-Host ""

# Show changelog excerpt if available
$changelogFile = "$CLAUDE_DIR\CHANGELOG.md"
if (Test-Path $changelogFile) {
    Write-Host "See what's new: " -NoNewline
    Write-Host "~/.claude/CHANGELOG.md" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "Questions? Visit: https://www.skool.com/rising-tides-9034"
Write-Host ""
