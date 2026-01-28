# Quickstart: Get Running in 5 Minutes

This guide gets you from zero to using skills as fast as possible.

---

## Prerequisites

- Claude Code CLI installed (`claude` command works)
- Basic familiarity with terminal commands

### Recommended CLI Tools

These CLIs enhance specific skills. Install them as needed:

| CLI | Install | Used By |
|-----|---------|---------|
| `gh` | `brew install gh` | github-workflow |
| `stripe` | `brew install stripe/stripe-cli/stripe` | stripe-integration |
| `supabase` | `brew install supabase/tap/supabase` | supabase-guide |
| `vercel` | `npm install -g vercel` | vercel-deployment |
| `firebase` | `npm install -g firebase-tools` | firebase-guide |
| `netlify` | `npm install -g netlify-cli` | netlify-deployment |
| `gcloud` | `brew install google-cloud-sdk` | google-cloud-setup |
| `jq` | `brew install jq` | Status line (optional) |

---

## Step 1: Copy Skills and Plugins

```bash
# Create directories
mkdir -p ~/.claude/skills
mkdir -p ~/.claude/plugins

# Clone or download this repo, then:
cp -r skills/* ~/.claude/skills/
cp -r plugins/* ~/.claude/plugins/
cp SKILLS_INDEX.json MCP_REGISTRY.md ATTRIBUTION.md ~/.claude/
```

**Done.** Skills and plugins are now available globally.

---

## Step 2: Verify Installation

```bash
# Check skills are there
ls ~/.claude/skills/ | head -10

# Should see folders like:
# ab-test-setup
# agent-md-refactor
# analytics-tracking
# ...

# Check plugins are there
ls ~/.claude/plugins/

# Should see folders like:
# react-dev-plugin
# webapp-testing-plugin
# frontend-ui-plugin
# ...
```

---

## Step 3: Try a Skill (1 minute)

Open any project and run:

```
/recommend skills
```

Claude will:
1. Analyze your project context (planning docs, README, structure)
2. Show which skills to **IMPORT** (directly relevant)
3. Show which skills to **SKIP** (not relevant, with reasons)
4. Recommend plugins for MCP-dependent skills

---

## Step 4: Set Up Memory (Optional, 2 minutes)

For persistent context across sessions:

```bash
# Add memory MCP globally
claude mcp add memory --scope user
```

When prompted, set the memory file path to your Desktop:
- **Windows (WSL):** `/mnt/c/Users/YOUR_NAME/Desktop/claude-memory.jsonl`
- **Mac:** `/Users/YOUR_NAME/Desktop/claude-memory.jsonl`
- **Linux:** `/home/YOUR_NAME/Desktop/claude-memory.jsonl`

**Why Desktop?** The memory file is human-readable JSON. Keeping it visible reminds you what Claude knows about you.

---

## Step 5: Enable Tool Search (Recommended)

For optimal context efficiency with MCPs:

```bash
# Add to your shell profile (.bashrc, .zshrc, etc.)
export ENABLE_TOOL_SEARCH=auto
```

This defers MCP schema loading until tools are actually used:
- Without Tool Search: All MCP schemas preload (~20k+ tokens)
- With Tool Search: Schemas load on-demand (~500 tokens per tool when used)

---

## Step 6: Use Plugins (For MCP-Dependent Skills)

Some skills need MCP servers (context7 for docs, playwright for testing).

### Recommended: Automatic Configuration via /recommend-skills

When you run `/recommend skills` and confirm plugin imports, the skill will:
1. Copy skill files to `.claude/skills/`
2. Create/merge MCP configs into project's `.mcp.json`
3. Prompt you to restart Claude

After restart, MCPs auto-load for that project. **No `--plugin-dir` flags needed!**

### Alternative: Manual Plugin Loading

```bash
# Start Claude with a plugin (uses global plugin location)
claude --plugin-dir ~/.claude/plugins/react-dev-plugin

# Multiple plugins
claude --plugin-dir ~/.claude/plugins/react-dev-plugin \
       --plugin-dir ~/.claude/plugins/webapp-testing-plugin
```

**Available plugins:**
| Plugin | MCP | Purpose |
|--------|-----|---------|
| `react-dev-plugin` | context7 | React development with live docs |
| `webapp-testing-plugin` | playwright | E2E browser testing |
| `frontend-ui-plugin` | context7 + shadcn | Full UI with component registry |
| `video-generator-plugin` | remotion | Programmatic video creation |

---

## Step 7: Set Up Status Line (Optional, 1 minute)

Add a status line showing model, context usage, and git branch:

```bash
# Run the setup script
./scripts/setup-statusline.sh
```

Or configure manually with:
```
/statusline show model name, context percentage as progress bar, git branch, and folder name
```

The status line shows:
```
opus-4 | [########------------] 40% | 80k | main | my-project
```

---

## What's Next?

### Browse Available Skills

Open `SKILLS_INDEX.json` to see all 78 skills organized by category.

### Common Skill Commands

| Command | What It Does |
|---------|--------------|
| `/recommend skills` | Get suggestions for current project |
| `/react-dev` | React development guidance |
| `/copywriting` | Marketing copy assistance |
| `/seo-audit` | SEO analysis |
| `/mermaid` | Create diagrams |
| `/context7` | Pull library documentation |

### Project-Specific Skills

Import skills to individual projects:

```bash
# Create project skills folder
mkdir -p .claude/skills

# Copy specific skills
cp -r ~/.claude/skills/react-dev .claude/skills/
cp -r ~/.claude/skills/webapp-testing .claude/skills/
```

### Configure MCPs Per-Project

Instead of global MCPs, create `.mcp.json` in your project root:

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

See `MCP_REGISTRY.md` for all available MCP configurations.

---

## Troubleshooting

### Skills Not Loading

1. Check the path: `ls ~/.claude/skills/`
2. Each skill needs a `SKILL.md` file inside its folder
3. Restart Claude Code after adding skills

### MCP Not Working

1. Check config syntax: `claude mcp list`
2. Test the npx command directly in terminal
3. Restart Claude Code after config changes

### Plugin MCP Not Loading

1. Verify plugins were copied: `ls ~/.claude/plugins/`
2. Check the plugin has `.mcp.json`: `cat ~/.claude/plugins/react-dev-plugin/.mcp.json`
3. Use full path: `claude --plugin-dir ~/.claude/plugins/react-dev-plugin`
4. Test MCP availability: ask "What MCPs are available?"

### Need More Help

- `MCP_REGISTRY.md` - MCP troubleshooting
- `docs/PLUGIN-GUIDE.md` - Plugin details
- `docs/MCP-SETUP-GUIDE.md` - Full MCP setup

---

## Summary

| Step | Command |
|------|---------|
| 1. Copy skills & plugins | `cp -r skills/* ~/.claude/skills/ && cp -r plugins/* ~/.claude/plugins/` |
| 2. Verify | `ls ~/.claude/skills/ && ls ~/.claude/plugins/` |
| 3. Try it | `/recommend skills` |
| 4. Memory (opt) | `claude mcp add memory --scope user` |
| 5. Tool Search (opt) | `export ENABLE_TOOL_SEARCH=auto` (add to shell profile) |
| 6. Use plugins | Via `/recommend skills` (auto-configures .mcp.json) |
| 7. Status line (opt) | `./scripts/setup-statusline.sh` |
