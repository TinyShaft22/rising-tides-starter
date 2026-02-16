# MCP Troubleshooting Guide

Common MCP issues and how to diagnose them.

---

## Symptom: Slow Startup / High RAM / Context Bloat

### What It Looks Like

- Claude Code takes a long time to start
- System uses 2+ GB of extra RAM
- Claude sees hundreds of MCP tool schemas at startup
- Context fills up quickly even before doing real work

### Root Cause: Plugin MCP Bloat

If `.mcp.json` files exist inside plugin directories under `~/.claude/plugins/`, Claude Code starts **every** MCP server in **every** session — even if you don't need them.

Each MCP server process uses ~100-150MB of RAM. With 14+ plugins each bundling an MCP, that's 1.4-2.1 GB of RAM wasted.

Without `ENABLE_TOOL_SEARCH=true`, all MCP tool schemas also preload into context (~5-20k tokens), leaving less room for actual conversation.

### Diagnosis

```bash
# Count .mcp.json files in plugins (should be 0)
find ~/.claude/plugins -name '.mcp.json' 2>/dev/null | wc -l

# Check for enabledPlugins in settings (should not exist)
grep enabledPlugins ~/.claude/settings.json

# Check ENABLE_TOOL_SEARCH is set (should return "true")
grep ENABLE_TOOL_SEARCH ~/.claude/settings.json
echo $ENABLE_TOOL_SEARCH

# Check for stale marketplace plugins
ls ~/.claude/plugins/marketplaces/ 2>/dev/null
```

### Fix

```bash
# 1. Remove .mcp.json from all plugins
find ~/.claude/plugins -name '.mcp.json' -delete

# 2. Remove marketplace plugin directories
rm -rf ~/.claude/plugins/marketplaces

# 3. Remove enabledPlugins from settings.json (use python3 or edit manually)
python3 -c "
import json
with open('$HOME/.claude/settings.json', 'r') as f:
    s = json.load(f)
if 'enabledPlugins' in s:
    del s['enabledPlugins']
    with open('$HOME/.claude/settings.json', 'w') as f:
        json.dump(s, f, indent=2)
    print('Removed enabledPlugins')
"

# 4. Ensure ENABLE_TOOL_SEARCH is in settings.json
python3 -c "
import json
with open('$HOME/.claude/settings.json', 'r') as f:
    s = json.load(f)
if 'env' not in s:
    s['env'] = {}
s['env']['ENABLE_TOOL_SEARCH'] = 'true'
with open('$HOME/.claude/settings.json', 'w') as f:
    json.dump(s, f, indent=2)
print('Added ENABLE_TOOL_SEARCH')
"

# 5. Add to shell profile too
echo 'export ENABLE_TOOL_SEARCH=true' >> ~/.bashrc

# 6. Restart Claude Code
```

### Prevention

Rising Tides plugins (v2.0+) do NOT include `.mcp.json` files. Each skill handles MCP setup at the project level on first use via `claude mcp add`. This means:

- MCP servers only start in projects that need them
- No surprise RAM or context usage
- Same tools, same functionality once active

If you're upgrading from an older version, run the setup script — it includes pre-install cleanup that removes stale `.mcp.json` files automatically.

---

## Symptom: MCP Tools Not Available

### What It Looks Like

- Claude says it can't find MCP tools (e.g., context7, playwright)
- Skill says "MCP not configured" when invoked

### Diagnosis

```bash
# Check what MCPs are configured
claude mcp list

# Check project-level config
cat .mcp.json 2>/dev/null

# Check if Tool Search is working
echo $ENABLE_TOOL_SEARCH
```

### Fix

1. **Invoke the skill** — Skills have "MCP Setup (First Run)" sections that auto-configure the MCP
2. **Manual setup:**
   ```bash
   claude mcp add context7 -- npx -y @upstash/context7-mcp
   ```
3. **Restart Claude Code** after adding MCPs

---

## Symptom: WSL and Windows Showing Different MCPs

### Root Cause

WSL and Windows have **separate** `~/.claude/` directories:
- Windows: `C:\Users\YourName\.claude\`
- WSL: `/home/yourname/.claude/`

### Fix

Pick one environment and use it consistently. If you need both, run setup in both environments.

---

## Quick Reference: Correct MCP Package Names

| MCP | Package | Command |
|-----|---------|---------|
| memory | `@modelcontextprotocol/server-memory` | `claude mcp add memory -- npx -y @modelcontextprotocol/server-memory` |
| context7 | `@upstash/context7-mcp` | `claude mcp add context7 -- npx -y @upstash/context7-mcp` |
| playwright | `@playwright/mcp` | `claude mcp add playwright -- npx -y @playwright/mcp` |
| github | `@anthropic-ai/mcp-server-github` | `claude mcp add github -- npx -y @anthropic-ai/mcp-server-github` |
| remotion | `@remotion/mcp` | `claude mcp add remotion -- npx -y @remotion/mcp` |
