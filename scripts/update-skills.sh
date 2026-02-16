#!/bin/bash

# ===========================================
# Rising Tides - Update Skills Script
# ===========================================
# Updates the skills pack to the latest version
# Downloads from GitHub and copies to ~/.claude/
# ===========================================

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

CLAUDE_DIR="$HOME/.claude"
SKILLS_DIR="$CLAUDE_DIR/skills"
PLUGINS_DIR="$CLAUDE_DIR/plugins"
SKILLS_REPO="https://github.com/SunsetSystemsAI/rising-tides-starter-pack.git"

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}   Rising Tides - Update Skills            ${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Check if skills are installed
if [ ! -d "$SKILLS_DIR" ]; then
    echo -e "${RED}Skills not installed at:${NC}"
    echo "  $SKILLS_DIR"
    echo ""
    echo "Run the setup script first to install skills."
    echo ""
    exit 1
fi

# Count current skills
BEFORE_COUNT=$(ls -1 "$SKILLS_DIR" 2>/dev/null | wc -l | tr -d ' ')
echo -e "${YELLOW}Current skills:${NC} $BEFORE_COUNT"
echo -e "${YELLOW}Downloading latest version...${NC}"
echo ""

# Create temp directory
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Clone latest
if git clone --depth 1 "$SKILLS_REPO" "$TEMP_DIR" 2>/dev/null; then
    echo -e "${GREEN}Download complete.${NC}"
    echo ""

    # Backup current index (for comparison)
    if [ -f "$CLAUDE_DIR/SKILLS_INDEX.json" ]; then
        cp "$CLAUDE_DIR/SKILLS_INDEX.json" "$TEMP_DIR/OLD_INDEX.json"
    fi

    # Copy skills
    if [ -d "$TEMP_DIR/skills" ]; then
        echo -e "${YELLOW}Updating skills...${NC}"
        cp -r "$TEMP_DIR/skills/"* "$SKILLS_DIR/" 2>/dev/null || true
    fi

    # Copy plugins
    if [ -d "$TEMP_DIR/plugins" ]; then
        echo -e "${YELLOW}Updating plugins...${NC}"
        mkdir -p "$PLUGINS_DIR"
        cp -r "$TEMP_DIR/plugins/"* "$PLUGINS_DIR/" 2>/dev/null || true
    fi

    # Copy index files
    if [ -f "$TEMP_DIR/SKILLS_INDEX.json" ]; then
        cp "$TEMP_DIR/SKILLS_INDEX.json" "$CLAUDE_DIR/"
    fi

    if [ -f "$TEMP_DIR/MCP_REGISTRY.md" ]; then
        cp "$TEMP_DIR/MCP_REGISTRY.md" "$CLAUDE_DIR/"
    fi

    if [ -f "$TEMP_DIR/ATTRIBUTION.md" ]; then
        cp "$TEMP_DIR/ATTRIBUTION.md" "$CLAUDE_DIR/"
    fi

    # Count after
    AFTER_COUNT=$(ls -1 "$SKILLS_DIR" 2>/dev/null | wc -l | tr -d ' ')
    PLUGIN_COUNT=$(ls -1 "$PLUGINS_DIR" 2>/dev/null | wc -l | tr -d ' ')

    echo ""
    echo -e "${GREEN}============================================${NC}"
    echo -e "${GREEN}   Update Complete!                        ${NC}"
    echo -e "${GREEN}============================================${NC}"
    echo ""
    echo -e "Skills: ${YELLOW}$BEFORE_COUNT${NC} → ${GREEN}$AFTER_COUNT${NC}"
    echo -e "Plugins: ${GREEN}$PLUGIN_COUNT${NC}"
    echo ""

    # Show if there are new skills
    if [ "$AFTER_COUNT" -gt "$BEFORE_COUNT" ]; then
        NEW_COUNT=$((AFTER_COUNT - BEFORE_COUNT))
        echo -e "${GREEN}$NEW_COUNT new skill(s) added!${NC}"
        echo ""
    fi

else
    echo ""
    echo -e "${RED}Update failed.${NC}"
    echo ""
    echo "This might be due to:"
    echo "  • Network issues"
    echo "  • GitHub is unreachable"
    echo ""
    echo "Try again later or check your internet connection."
    echo ""
    exit 1
fi

echo "Restart Claude Code to use the updated skills."
echo ""
