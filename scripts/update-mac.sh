#!/bin/bash

# ===========================================
# Rising Tides - Update Script (Mac)
# ===========================================
# Updates your skills and plugins to the latest version.
# Run this anytime to get new skills and improvements.
# ===========================================

set -e

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_header() {
    echo ""
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}   Rising Tides - Update                    ${NC}"
    echo -e "${BLUE}============================================${NC}"
    echo ""
}

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_info() { echo -e "${YELLOW}→ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_add() { echo -e "${GREEN}  + $1${NC}"; }
print_remove() { echo -e "${RED}  - $1${NC}"; }

print_header

# Paths
CLAUDE_DIR="$HOME/.claude"
SKILLS_DIR="$CLAUDE_DIR/skills"
PLUGINS_DIR="$CLAUDE_DIR/plugins"
LOCAL_VERSION_FILE="$CLAUDE_DIR/VERSION"

# Check if Rising Tides is installed
if [ ! -d "$SKILLS_DIR" ]; then
    print_error "Rising Tides is not installed."
    echo ""
    echo -e "${YELLOW}Run the setup script first:${NC}"
    echo "  curl -fsSL https://raw.githubusercontent.com/SunsetSystemsAI/rising-tides-starter/main/scripts/setup-mac.sh | bash"
    echo ""
    exit 1
fi

# Get local version
LOCAL_VERSION="0.0.0"
if [ -f "$LOCAL_VERSION_FILE" ]; then
    LOCAL_VERSION=$(cat "$LOCAL_VERSION_FILE" | head -1 | tr -d '\n\r')
fi
print_info "Current version: $LOCAL_VERSION"

# Download latest
print_info "Checking for updates..."

TEMP_DIR=$(mktemp -d)
DOWNLOAD_SUCCESS=false

# Try zip download
ZIP_URL="https://github.com/SunsetSystemsAI/rising-tides-starter/archive/refs/heads/main.zip"
ZIP_FILE="$TEMP_DIR/update.zip"

if curl -fsSL "$ZIP_URL" -o "$ZIP_FILE" 2>/dev/null; then
    unzip -qo "$ZIP_FILE" -d "$TEMP_DIR" 2>/dev/null
    if [ -d "$TEMP_DIR/rising-tides-starter-main" ]; then
        mv "$TEMP_DIR/rising-tides-starter-main/"* "$TEMP_DIR/" 2>/dev/null || true
        rm -rf "$TEMP_DIR/rising-tides-starter-main"
    fi
    rm -f "$ZIP_FILE"
    DOWNLOAD_SUCCESS=true
fi

if [ "$DOWNLOAD_SUCCESS" = false ]; then
    print_error "Could not download update. Check your internet connection."
    rm -rf "$TEMP_DIR"
    exit 1
fi

# Get remote version
REMOTE_VERSION="0.0.0"
if [ -f "$TEMP_DIR/VERSION" ]; then
    REMOTE_VERSION=$(cat "$TEMP_DIR/VERSION" | head -1 | tr -d '\n\r')
fi
print_info "Latest version: $REMOTE_VERSION"

# Compare versions
if [ "$LOCAL_VERSION" = "$REMOTE_VERSION" ]; then
    echo ""
    print_success "You're already on the latest version ($LOCAL_VERSION)"
    echo ""
    rm -rf "$TEMP_DIR"
    exit 0
fi

echo ""
echo -e "${BLUE}Updating: $LOCAL_VERSION → $REMOTE_VERSION${NC}"
echo ""

# Track changes
ADDED=()
REMOVED=()

# Get current skills and plugins
CURRENT_SKILLS=$(ls -1 "$SKILLS_DIR" 2>/dev/null || true)
CURRENT_PLUGINS=$(ls -1 "$PLUGINS_DIR" 2>/dev/null || true)

# Get new skills and plugins
NEW_SKILLS=$(ls -1 "$TEMP_DIR/skills" 2>/dev/null || true)
NEW_PLUGINS=$(ls -1 "$TEMP_DIR/plugins" 2>/dev/null || true)

# Find removed skills
for skill in $CURRENT_SKILLS; do
    if ! echo "$NEW_SKILLS" | grep -q "^${skill}$"; then
        rm -rf "$SKILLS_DIR/$skill"
        REMOVED+=("skill: $skill")
    fi
done

# Find removed plugins
for plugin in $CURRENT_PLUGINS; do
    if ! echo "$NEW_PLUGINS" | grep -q "^${plugin}$"; then
        rm -rf "$PLUGINS_DIR/$plugin"
        REMOVED+=("plugin: $plugin")
    fi
done

# Find added skills
for skill in $NEW_SKILLS; do
    if ! echo "$CURRENT_SKILLS" | grep -q "^${skill}$"; then
        ADDED+=("skill: $skill")
    fi
done

# Find added plugins
for plugin in $NEW_PLUGINS; do
    if ! echo "$CURRENT_PLUGINS" | grep -q "^${plugin}$"; then
        ADDED+=("plugin: $plugin")
    fi
done

# Copy all skills and plugins (overwrites existing, adds new)
if [ -d "$TEMP_DIR/skills" ]; then
    cp -r "$TEMP_DIR/skills/"* "$SKILLS_DIR/" 2>/dev/null || true
fi

if [ -d "$TEMP_DIR/plugins" ]; then
    cp -r "$TEMP_DIR/plugins/"* "$PLUGINS_DIR/" 2>/dev/null || true
fi

# Copy index files
for file in SKILLS_INDEX.json MCP_REGISTRY.md ATTRIBUTION.md VERSION CHANGELOG.md; do
    if [ -f "$TEMP_DIR/$file" ]; then
        cp "$TEMP_DIR/$file" "$CLAUDE_DIR/"
    fi
done

# Clean up
rm -rf "$TEMP_DIR"

# Print summary
echo "-------------------------------------------"

if [ ${#ADDED[@]} -gt 0 ]; then
    echo ""
    echo -e "${GREEN}Added:${NC}"
    for item in "${ADDED[@]}"; do
        print_add "$item"
    done
fi

if [ ${#REMOVED[@]} -gt 0 ]; then
    echo ""
    echo -e "${RED}Removed:${NC}"
    for item in "${REMOVED[@]}"; do
        print_remove "$item"
    done
fi

SKILL_COUNT=$(ls -1 "$SKILLS_DIR" 2>/dev/null | wc -l | tr -d ' ')
PLUGIN_COUNT=$(ls -1 "$PLUGINS_DIR" 2>/dev/null | wc -l | tr -d ' ')

echo ""
echo "-------------------------------------------"
print_success "Update complete!"
echo ""
echo "  Version: $REMOTE_VERSION"
echo "  Skills: $SKILL_COUNT"
echo "  Plugins: $PLUGIN_COUNT"
echo ""

# Show changelog location
if [ -f "$CLAUDE_DIR/CHANGELOG.md" ]; then
    echo -e "See what's new: ${BLUE}~/.claude/CHANGELOG.md${NC}"
    echo ""
fi

echo "Questions? Visit: https://www.skool.com/rising-tides-9034"
echo ""
