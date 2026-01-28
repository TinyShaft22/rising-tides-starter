# Plugin Installation Guide

> How to install and use MCP plugins for Claude Code

---

## Quick Start

```bash
# Single plugin (from repo root)
claude --plugin-dir ./plugins/react-dev-plugin

# Multiple plugins
claude --plugin-dir ./plugins/react-dev-plugin --plugin-dir ./plugins/webapp-testing-plugin
```

---

## Available Plugins

### Skill Plugins (Bundled Skill + MCP)

| Plugin | Skill | MCP | Description |
|--------|-------|-----|-------------|
| `react-dev-plugin` | react-dev | context7 | React development with live documentation |
| `frontend-design-plugin` | frontend-design | context7 | Frontend architecture with current framework docs |
| `mcp-builder-plugin` | mcp-builder | context7 | MCP server development guide |
| `webapp-testing-plugin` | webapp-testing | playwright | E2E testing and browser automation |
| `video-generator-plugin` | video-generator | remotion | Programmatic video creation |
| `git-workflow-plugin` | commit-work | github | Git commits and PR management |

### MCP Wrapper Plugins (Direct Access)

| Plugin | MCP | Description |
|--------|-----|-------------|
| `context7-plugin` | context7 | Pull live documentation for any library |
| `playwright-plugin` | playwright | Direct browser automation |
| `remotion-plugin` | remotion | Direct video generation |
| `memory-plugin` | memory | Persistent knowledge graph |

---

## Plugin Location

After cloning, plugins are at:
```
./plugins/
```

---

## How Plugins Work

### 1. Self-Contained

Each plugin bundles:
- `.claude-plugin/plugin.json` — Plugin manifest
- `.mcp.json` — MCP configuration (auto-downloaded via `npx -y`)
- `skills/[name]/SKILL.md` — Skill instructions

**No separate MCP configuration needed.** The plugin handles everything.

### 2. Progressive Disclosure

Skills in plugins load in tiers:
- **Tier 1:** Metadata only (~100 tokens) until the skill is invoked
- **Tier 2:** Full skill instructions load when invoked
- **Tier 3:** Reference files load only if needed

### 3. Tool Search Integration

MCPs bundled in plugins defer loading via Tool Search:
- MCP tools don't load until actually needed
- Near-zero context cost at startup
- Enable with: `export ENABLE_TOOL_SEARCH=auto`

---

## Installation Methods

### Method 1: Command Line Flag

```bash
claude --plugin-dir /path/to/plugin
```

Good for: Testing, one-off usage

### Method 2: Multiple Plugins

```bash
claude --plugin-dir ./plugins/react-dev-plugin \
       --plugin-dir ./plugins/webapp-testing-plugin \
       --plugin-dir ./plugins/context7-plugin
```

Good for: Project-specific plugin combinations

### Method 3: Shell Alias (Persistent)

Add to `~/.bashrc` or `~/.zshrc`:
```bash
alias claude-react='claude --plugin-dir "/path/to/plugins/react-dev-plugin" --plugin-dir "/path/to/plugins/webapp-testing-plugin"'
```

Then use:
```bash
claude-react
```

Good for: Frequent project types

### Method 4: Copy to Project

Copy plugin folder to your project:
```bash
mkdir -p .claude/plugins
cp -r ./plugins/react-dev-plugin .claude/plugins/
```

Then reference locally:
```bash
claude --plugin-dir .claude/plugins/react-dev-plugin
```

Good for: Team sharing, version-controlled plugins

---

## Recommended Combinations

### React/Next.js Development
```bash
claude --plugin-dir ./plugins/react-dev-plugin \
       --plugin-dir ./plugins/frontend-design-plugin \
       --plugin-dir ./plugins/webapp-testing-plugin
```

### MCP Server Development
```bash
claude --plugin-dir ./plugins/mcp-builder-plugin \
       --plugin-dir ./plugins/context7-plugin
```

### Video Production
```bash
claude --plugin-dir ./plugins/video-generator-plugin \
       --plugin-dir ./plugins/remotion-plugin
```

### Full Stack with Testing
```bash
claude --plugin-dir ./plugins/react-dev-plugin \
       --plugin-dir ./plugins/webapp-testing-plugin \
       --plugin-dir ./plugins/git-workflow-plugin
```

---

## Optimizing Performance

### Enable Tool Search

Tool Search defers MCP loading until needed:
```bash
export ENABLE_TOOL_SEARCH=auto
```

Add to your shell profile for persistence.

**How it works:**
- Without Tool Search: All MCP tool schemas load at startup (~2k tokens per MCP)
- With Tool Search: MCP tools load on-demand (~500 tokens when needed)

### Memory MCP (Special Case)

The `memory-plugin` is unique — consider keeping it global rather than per-project:
- Memory persists across all sessions
- Makes sense to always have available

Global config (in Claude Code settings):
```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {
        "MEMORY_FILE_PATH": "/path/to/Desktop/claude-memory.jsonl"
      }
    }
  }
}
```

**Paths by platform:**
- Windows (WSL): `/mnt/c/Users/[USERNAME]/Desktop/claude-memory.jsonl`
- Mac: `/Users/[USERNAME]/Desktop/claude-memory.jsonl`
- Linux: `/home/[USERNAME]/Desktop/claude-memory.jsonl`

---

## Plugin Structure

```
[plugin-name]/
├── .claude-plugin/
│   └── plugin.json        # Manifest (required)
├── skills/
│   └── [skill-name]/
│       ├── SKILL.md       # Skill instructions
│       └── references/    # Optional reference files
└── .mcp.json              # MCP configuration (required for MCP plugins)
```

### plugin.json

```json
{
  "name": "react-dev",
  "description": "React development with live documentation via context7",
  "version": "1.0.0",
  "author": {
    "name": "Nick Mohler"
  }
}
```

### .mcp.json

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

The `npx -y` flag auto-downloads the MCP server if not installed.

---

## Troubleshooting

### Plugin Not Loading

1. Check the path exists:
   ```bash
   ls ./plugins/react-dev-plugin
   ```

2. Verify plugin.json exists:
   ```bash
   cat ".claude-plugin/plugin.json"
   ```

3. Check for JSON syntax errors in plugin.json and .mcp.json

### MCP Not Working

1. Test the MCP manually:
   ```bash
   npx -y @upstash/context7-mcp
   ```

2. Check Tool Search is enabled:
   ```bash
   echo $ENABLE_TOOL_SEARCH
   ```

3. Verify .mcp.json syntax

### Skill Not Found

1. Check skill folder exists in plugin:
   ```bash
   ls plugins/react-dev-plugin/skills/
   ```

2. Verify SKILL.md has proper frontmatter:
   ```yaml
   ---
   name: react-dev
   description: ...
   mcp: context7
   ---
   ```

---

## Creating New Plugins

See the [ARCHITECTURE-DEEP-DIVE.md](./ARCHITECTURE-DEEP-DIVE.md) for detailed plugin creation instructions.

Quick template:
```bash
mkdir -p my-plugin/.claude-plugin my-plugin/skills/my-skill

# Create plugin.json
cat > my-plugin/.claude-plugin/plugin.json << 'EOF'
{
  "name": "my-skill",
  "description": "Description here",
  "version": "1.0.0",
  "author": {"name": "Your Name"}
}
EOF

# Create SKILL.md
cat > my-plugin/skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: What this skill does
---

# My Skill

Instructions here...
EOF

# If MCP needed, create .mcp.json
cat > my-plugin/.mcp.json << 'EOF'
{
  "mcpServers": {
    "mcp-name": {
      "command": "npx",
      "args": ["-y", "@package/mcp-server"]
    }
  }
}
EOF
```

---

## See Also

- [ARCHITECTURE-DEEP-DIVE.md](./ARCHITECTURE-DEEP-DIVE.md) — Technical details on progressive disclosure and Tool Search
- [MCP-SETUP-GUIDE.md](./MCP-SETUP-GUIDE.md) — Manual MCP configuration (if not using plugins)
- [SKILLS_INDEX.json](../SKILLS_INDEX.json) — Full list of available skills and plugins
