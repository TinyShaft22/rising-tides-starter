# MCP Setup Guide

> **Complete guide to configuring MCPs for Claude Code.** Covers scopes, context optimization, and project-level configuration.

**Last Updated:** February 15, 2026

---

## TL;DR

1. **Global MCPs eat context in every project** — use sparingly
2. **Project-level MCPs are better** — configure in `.mcp.json`
3. **Enable Tool Search** — MCPs load on-demand, not preloaded
4. **Only memory should be global** — persistence across projects is its purpose

---

## Understanding MCP Scopes

MCPs can be configured at three levels:

| Scope | Config Location | When Loaded | Use Case |
|-------|-----------------|-------------|----------|
| **User (Global)** | `~/.claude/settings.json` | Every session | Truly essential MCPs only |
| **Project** | `.mcp.json` in project root | When in that project | Most MCPs should be here |
| **Local** | `.mcp.json` (gitignored) | When in that project | Personal/secret MCPs |

### Why Scope Matters: Context Cost

**Critical insight:** Every configured MCP loads its tool schemas at session start. This consumes context:

- 1-2 MCPs: ~2-3% of context window
- 5+ MCPs: ~5-10% of context window
- Many MCPs globally: Constant context tax on ALL projects

**The solution:** Configure MCPs at the project level so they only load when needed.

---

## Recommended MCP Strategy

### Global (User Scope) — For Personal MCPs You Want Everywhere

Configure MCPs at user scope when you want them available in ALL your projects:

| MCP | Why User Scope |
|-----|----------------|
| **memory** | Persistence across all projects is its purpose |
| **playwright** | Browser automation you want everywhere |
| **context7** | Live docs you want in all dev projects |
| **n8n** | Workflow automation you use across projects |

**Install at user scope:**
```bash
claude mcp add -s user playwright -- npx -y @playwright/mcp
claude mcp add -s user context7 -- npx -y @upstash/context7-mcp
```

User scope MCPs are available immediately in any project without reinstalling.

### Project Scope — For Team Sharing

Configure MCPs at project scope when you want teammates to have them via `.mcp.json`:

| MCP | Why Project Scope |
|-----|-------------------|
| **project-specific** | MCPs needed for this specific codebase |
| **team-shared** | Config commits to git for team use |

**When to use project scope:**
- Working on a team repo and want MCPs shared via git
- Project-specific MCPs that don't make sense globally

**Install at project scope:**
```bash
claude mcp add -s project context7 -- npx -y @upstash/context7-mcp
```

This creates/updates `.mcp.json` in the project root.

### Local Scope — For Secrets/Personal Config

Use when the MCP config contains secrets or is personal to your machine:

- MCPs with API keys you don't want in git
- Personal workflow MCPs others don't need

---

## How to Create `.mcp.json`

### Basic Structure

Create `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "mcp-name": {
      "command": "command-to-run",
      "args": ["arg1", "arg2"],
      "env": {
        "ENV_VAR": "value"
      }
    }
  }
}
```

### Example: Single MCP (context7)

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

### Example: Multiple MCPs

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"]
    }
  }
}
```

### Using the CLI

You can also use Claude Code's CLI to add MCPs:

```bash
# Add to project (creates/updates .mcp.json)
claude mcp add context7 --scope project

# Add to user config (global)
claude mcp add memory --scope user

# List configured MCPs
claude mcp list
```

---

## Tool Search: Context Optimization

### What Is Tool Search?

Tool Search (`ENABLE_TOOL_SEARCH=true`) defers MCP tool loading:

- **Without Tool Search:** All MCP tools load at session start
- **With Tool Search:** Tools load on-demand when needed

This dramatically reduces context usage when you have many MCPs configured.

### How to Enable Tool Search

**Per-session:**
```bash
ENABLE_TOOL_SEARCH=true claude
```

**In your shell profile (recommended):**
```bash
# Add to ~/.bashrc or ~/.zshrc
export ENABLE_TOOL_SEARCH=true

# Or create an alias
alias claude='ENABLE_TOOL_SEARCH=true claude'
```

**Verify it's working:**
When enabled, you'll see tool schemas load dynamically during conversation rather than all at startup.

### When to Use Tool Search

- **Many MCPs configured:** Always enable
- **Context-sensitive work:** Enable to maximize available context
- **Few MCPs:** Optional, but doesn't hurt

---

## Complete MCP Configurations

### Memory MCP (Global — User Scope)

Add to your Claude Code user settings:

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

**Paths:**
- Windows (WSL): `/mnt/c/Users/[USERNAME]/Desktop/claude-memory.jsonl`
- Mac/Linux: `~/Desktop/claude-memory.jsonl`

### Context7 MCP (Project Scope)

Add to project's `.mcp.json`:

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

**Verify:** Ask Claude to fetch docs for a library.

### Playwright MCP (Project Scope)

Add to project's `.mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"]
    }
  }
}
```

**Verify:** Ask Claude to open a browser and navigate to a URL.

### GitHub MCP (Project Scope)

Note: GitHub is often built into Claude Code. Check if already available before adding.

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Verify:** Ask Claude to list PRs or issues.

### Remotion MCP (Project Scope)

```json
{
  "mcpServers": {
    "remotion": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-remotion"]
    }
  }
}
```

**Verify:** Ask Claude to create a video component.

---

## Team Sharing: MCPs in Version Control

### What to Commit

**Commit `.mcp.json`** when MCPs are needed for the project to work:

```
my-project/
├── .mcp.json        # Committed — team needs these MCPs
├── .mcp.local.json  # Gitignored — personal config
└── ...
```

### What to Gitignore

Add to `.gitignore` for personal/secret MCPs:

```
.mcp.local.json
```

### Team Workflow

1. Clone repo with `.mcp.json`
2. Claude Code prompts to approve project MCPs
3. Team member approves
4. MCPs load automatically for that project
5. No global config pollution

---

## Troubleshooting

### MCP Not Loading

1. **Check syntax:** Validate JSON in `.mcp.json`
2. **Check path:** Ensure `.mcp.json` is in project root
3. **Restart session:** Claude Code may need restart after config change
4. **Check installation:** Run the MCP command manually to verify it works

```bash
# Test context7
npx -y @upstash/context7-mcp

# Should start the server without errors
```

### MCP Tools Not Appearing

1. **Check scope:** Is MCP configured for this project?
2. **Check Tool Search:** If enabled, tools load on-demand
3. **Ask explicitly:** Try "use context7 to fetch React docs"

### High Context Usage

1. **Enable Tool Search:** `ENABLE_TOOL_SEARCH=true`
2. **Move MCPs to project level:** Remove from global config
3. **Remove unused MCPs:** If not needed for this project, remove from `.mcp.json`

### Permission Errors

1. **Check npm permissions:** May need `sudo` or fix npm prefix
2. **Check file permissions:** Memory file path must be writable
3. **Check env vars:** Some MCPs need env vars (tokens, paths)

---

## Quick Reference

### Scope Commands

```bash
# Add MCP to project
claude mcp add [mcp-name] --scope project

# Add MCP globally (use sparingly)
claude mcp add [mcp-name] --scope user

# List all configured MCPs
claude mcp list

# Remove an MCP
claude mcp remove [mcp-name] --scope project
```

### File Locations

| Item | Location |
|------|----------|
| Global config | `~/.claude/settings.json` |
| Project config | `.mcp.json` in project root |
| Memory file | `~/Desktop/claude-memory.jsonl` (recommended) |

### Context Cost Rules

1. **Global MCPs:** Load in every session → high cost
2. **Project MCPs:** Load only in that project → manageable
3. **Tool Search:** Defers loading → lowest cost

---

## Summary: The Ideal Setup

1. **Global (user scope):**
   - Only `memory` MCP (for persistence)

2. **Per-project (project scope):**
   - All other MCPs as needed

3. **Tool Search enabled:**
   - `export ENABLE_TOOL_SEARCH=true` in shell profile

4. **Result:**
   - Minimal context overhead
   - MCPs available when needed
   - Clean team sharing via `.mcp.json`
   - Memory persists everywhere
