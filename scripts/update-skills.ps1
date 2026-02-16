# ===========================================
# Rising Tides - Update Skills Script
# ===========================================
# Updates the skills pack to the latest version
# Downloads from GitHub and copies to ~/.claude/
# ===========================================

$CLAUDE_DIR = "$env:USERPROFILE\.claude"
$SKILLS_DIR = "$CLAUDE_DIR\skills"
$PLUGINS_DIR = "$CLAUDE_DIR\plugins"
$SKILLS_REPO = "https://github.com/SunsetSystemsAI/rising-tides-starter-pack.git"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Rising Tides - Update Skills            " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if skills directory exists
if (-not (Test-Path $SKILLS_DIR)) {
    Write-Host "Skills not installed at:" -ForegroundColor Red
    Write-Host "  $SKILLS_DIR"
    Write-Host ""
    Write-Host "Run the setup script first to install skills."
    Write-Host ""
    exit 1
}

# Count current skills
$beforeCount = (Get-ChildItem -Directory $SKILLS_DIR -ErrorAction SilentlyContinue | Measure-Object).Count

Write-Host "Current skills: $beforeCount" -ForegroundColor Yellow
Write-Host "Downloading latest version..." -ForegroundColor Yellow
Write-Host ""

# Create temp directory
$tempDir = Join-Path $env:TEMP "rising-tides-update-$(Get-Date -Format 'yyyyMMddHHmmss')"

try {
    # Clone latest
    git clone --depth 1 $SKILLS_REPO $tempDir 2>$null

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Download complete." -ForegroundColor Green
        Write-Host ""

        # Copy skills
        $tempSkillsDir = Join-Path $tempDir "skills"
        if (Test-Path $tempSkillsDir) {
            Write-Host "Updating skills..." -ForegroundColor Yellow
            Copy-Item -Path "$tempSkillsDir\*" -Destination $SKILLS_DIR -Recurse -Force
        }

        # Copy plugins
        $tempPluginsDir = Join-Path $tempDir "plugins"
        if (Test-Path $tempPluginsDir) {
            Write-Host "Updating plugins..." -ForegroundColor Yellow
            if (-not (Test-Path $PLUGINS_DIR)) {
                New-Item -ItemType Directory -Path $PLUGINS_DIR -Force | Out-Null
            }
            Copy-Item -Path "$tempPluginsDir\*" -Destination $PLUGINS_DIR -Recurse -Force
        }

        # Copy index files
        $indexFile = Join-Path $tempDir "SKILLS_INDEX.json"
        if (Test-Path $indexFile) {
            Copy-Item $indexFile "$CLAUDE_DIR\" -Force
        }

        $registryFile = Join-Path $tempDir "MCP_REGISTRY.md"
        if (Test-Path $registryFile) {
            Copy-Item $registryFile "$CLAUDE_DIR\" -Force
        }

        $attributionFile = Join-Path $tempDir "ATTRIBUTION.md"
        if (Test-Path $attributionFile) {
            Copy-Item $attributionFile "$CLAUDE_DIR\" -Force
        }

        # Count after
        $afterCount = (Get-ChildItem -Directory $SKILLS_DIR -ErrorAction SilentlyContinue | Measure-Object).Count
        $pluginCount = (Get-ChildItem -Directory $PLUGINS_DIR -ErrorAction SilentlyContinue | Measure-Object).Count

        Write-Host ""
        Write-Host "============================================" -ForegroundColor Green
        Write-Host "   Update Complete!                        " -ForegroundColor Green
        Write-Host "============================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Skills: " -NoNewline
        Write-Host "$beforeCount" -ForegroundColor Yellow -NoNewline
        Write-Host " -> " -NoNewline
        Write-Host "$afterCount" -ForegroundColor Green
        Write-Host "Plugins: $pluginCount" -ForegroundColor Green
        Write-Host ""

        # Show if there are new skills
        if ($afterCount -gt $beforeCount) {
            $newCount = $afterCount - $beforeCount
            Write-Host "$newCount new skill(s) added!" -ForegroundColor Green
            Write-Host ""
        }

    } else {
        throw "Clone failed"
    }

} catch {
    Write-Host ""
    Write-Host "Update failed." -ForegroundColor Red
    Write-Host ""
    Write-Host "This might be due to:"
    Write-Host "  - Network issues"
    Write-Host "  - GitHub is unreachable"
    Write-Host ""
    Write-Host "Try again later or check your internet connection."
    Write-Host ""
    exit 1

} finally {
    # Cleanup temp directory
    if (Test-Path $tempDir) {
        Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "Restart Claude Code to use the updated skills."
Write-Host ""
