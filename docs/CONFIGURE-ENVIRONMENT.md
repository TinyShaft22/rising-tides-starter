# Environment Configuration Guide

Configure Claude Code for the best experience with status line, Tool Search, and optional MCP servers.

---

## Status Line Setup

The status line shows Claude's current state at the bottom of your terminal.

### Enable Status Line

**Option 1 - Interactive Setup:**

When you first run Claude Code, it may prompt you to enable the status line. Say yes.

**Option 2 - Manual Configuration:**

Edit your settings file:

**Mac/Linux:** `~/.claude/settings.json`
**Windows:** `C:\Users\YourName\.claude\settings.json`

Add or update:
```json
{
  "statusLine": true
}
```

### What the Status Line Shows

```
┌─────────────────────────────────────────┐
│ Your conversation with Claude...        │
│                                         │
├─────────────────────────────────────────┤
│ [Status: thinking...] [Tokens: 1.2k]    │
└─────────────────────────────────────────┘
```

- Current status (idle, thinking, executing)
- Token usage
- Active tools/MCPs

---

## Tool Search (RECOMMENDED)

**Tool Search defers MCP schema loading**, dramatically reducing context usage.

Without Tool Search: All MCP schemas load upfront (~20k+ tokens)
With Tool Search: Schemas load on-demand (~500 tokens per tool when used)

### Enable Tool Search

**Mac/Linux (add to ~/.zshrc or ~/.bashrc):**
```bash
echo 'export ENABLE_TOOL_SEARCH=true' >> ~/.zshrc
source ~/.zshrc
```

**Windows (PowerShell):**
```powershell
Add-Content $PROFILE '$env:ENABLE_TOOL_SEARCH = "true"'
```

Then restart your terminal.

### Verify Tool Search

```bash
echo $ENABLE_TOOL_SEARCH
# Should output: auto
```

---

## Settings Configuration

### Settings File Location

| Platform | Path |
|----------|------|
| Mac/Linux | `~/.claude/settings.json` |
| Windows | `%USERPROFILE%\.claude\settings.json` |

### Recommended Settings

Create or edit `settings.json`:

```json
{
  "statusLine": true,
  "theme": "dark"
}
```

---

## MCP Server Configuration

MCPs (Model Context Protocol) extend Claude's capabilities with external tools.

### Key Principle: Project-Level by Default

**Global MCPs consume context in EVERY session.** Configure MCPs per-project to minimize overhead.

| Scope | When to Use |
|-------|-------------|
| **Global (User)** | Only `memory` — persistence is its purpose |
| **Project** | Everything else — load only when needed |

### Memory MCP Setup (Global)

Memory is the only MCP that should be global — it stores persistent knowledge.

```bash
claude mcp add memory --scope user
```

The CLI will prompt you to configure the memory file path. Recommended locations:

| Platform | Path |
|----------|------|
| Mac | `/Users/[USERNAME]/Desktop/claude-memory.jsonl` |
| Windows | `C:\Users\[USERNAME]\Desktop\claude-memory.jsonl` |
| Windows (WSL) | `/mnt/c/Users/[USERNAME]/Desktop/claude-memory.jsonl` |
| Linux | `/home/[USERNAME]/Desktop/claude-memory.jsonl` |

Putting the memory file on your Desktop makes it easy to see and back up.

### Project-Level MCP Setup

When you run `/recommend skills` in a project, MCPs get configured automatically.

Or configure manually in your project:

```bash
cd your-project
claude mcp add context7 --scope project
claude mcp add playwright --scope project
```

This creates a `.mcp.json` in your project root:

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

### Correct MCP Package Names

| MCP | Package | Purpose |
|-----|---------|---------|
| memory | `@modelcontextprotocol/server-memory` | Persistent knowledge |
| context7 | `@upstash/context7-mcp` | Live library docs |
| playwright | `@playwright/mcp` | Browser automation |
| github | `@anthropic-ai/mcp-server-github` | GitHub API |
| remotion | `@anthropic-ai/mcp-server-remotion` | Video generation |

### Check Configured MCPs

```bash
claude mcp list
```

---

## Project-Level Configuration

Each project can have its own Claude configuration.

### Create Project Config

In your project directory:

```bash
mkdir .claude
```

### Project CLAUDE.md

Create a `CLAUDE.md` in your project root to give Claude context:

```markdown
# Project Name

Brief description of your project.

## Tech Stack
- React 18
- TypeScript
- Tailwind CSS

## Key Files
- `src/App.tsx` - Main entry point
- `src/components/` - UI components

## Conventions
- Use functional components
- Prefer named exports
```

### Project MCP Config

Create `.mcp.json` in your project root (or use `claude mcp add --scope project`):

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

---

## Environment Variables

Some features require environment variables.

### Setting Environment Variables

**Mac/Linux (add to ~/.bashrc or ~/.zshrc):**
```bash
export GITHUB_TOKEN="your-token-here"
export ENABLE_TOOL_SEARCH=true
```

**Windows (PowerShell):**
```powershell
[Environment]::SetEnvironmentVariable("GITHUB_TOKEN", "your-token-here", "User")
$env:ENABLE_TOOL_SEARCH = "true"
```

### Common Environment Variables

| Variable | Purpose |
|----------|---------|
| `ENABLE_TOOL_SEARCH` | Deferred MCP schema loading |
| `GITHUB_TOKEN` | GitHub MCP authentication |
| `STRIPE_SECRET_KEY` | Stripe MCP authentication |

---

## Terminal Configuration

### Recommended Terminal Apps

| Platform | Recommended |
|----------|-------------|
| Windows | Windows Terminal |
| Mac | iTerm2 or built-in Terminal |
| Linux | Your default terminal |

### Font Recommendation

Use a font that supports Unicode for better status line display:

- **Fira Code** (free)
- **JetBrains Mono** (free)
- **SF Mono** (Mac)
- **Cascadia Code** (Windows)

---

## Verification

After configuration, verify:

```bash
# Check Tool Search
echo $ENABLE_TOOL_SEARCH
# Should output: auto

# Check MCPs
claude mcp list

# Start Claude Code
claude

# Check status line appears
# Type a message and watch the status change

# Exit
/exit
```

---

## Troubleshooting

### Status line not appearing

1. Check `statusLine: true` in settings
2. Ensure terminal supports Unicode
3. Try a different terminal app

### MCP not loading

1. Check `.mcp.json` syntax (valid JSON)
2. Ensure npx can run: `npx --version`
3. Check MCP package name is correct (see table above)
4. Restart Claude Code after changes

### Tool Search not working

1. Check `echo $ENABLE_TOOL_SEARCH` outputs `true`
2. Restart terminal after adding to profile
3. On Windows, check PowerShell profile loaded

### Settings not applying

1. Check file location is correct
2. Ensure valid JSON syntax
3. Restart Claude Code after changes

---

## Next Step

Once configured, proceed to [Setup Skills Pack](SETUP-SKILLS-PACK.md).
