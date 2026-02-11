# Architecture Deep Dive: Skills, MCPs, Plugins & Dynamic Loading

> **Comprehensive guide** to how Claude Code's extension system works, including progressive disclosure, Tool Search, and the plugin architecture.

**Last Updated:** January 23, 2026

---

## Executive Summary

Claude Code has three extension mechanisms that work together:

| Component | What It Is | Context Cost | When It Loads |
|-----------|------------|--------------|---------------|
| **Skills** | Markdown instructions that guide Claude | **Deferred** | Progressive disclosure |
| **MCPs** | External tools/APIs Claude can call | **Deferred** (with Tool Search) | On-demand |
| **Plugins** | Bundles of skills + MCPs + hooks | **Deferred** | Components load independently |

**Key insight:** With proper configuration, NOTHING loads into context until actually needed.

---

## Part 1: Skills & Progressive Disclosure

### What Are Skills?

Skills are Markdown files (`SKILL.md`) containing instructions that teach Claude how to perform specific tasks. They're NOT code — they're guidance.

```markdown
---
name: react-dev
description: Generate React components following best practices
---

When creating React components:
1. Use functional components with hooks
2. Follow the project's existing patterns
3. Include proper TypeScript types
```

### How Progressive Disclosure Works

Skills use a **three-tier loading system** that dramatically reduces context usage:

```
┌─────────────────────────────────────────────────────────────────┐
│  TIER 1: Metadata Scan (~100 tokens)                            │
│  ─────────────────────────────────────────                      │
│  Claude scans skill frontmatter (name, description) to          │
│  determine if the skill is relevant to the current task.        │
│                                                                 │
│  This happens for ALL skills but costs almost nothing.          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (only if relevant)
┌─────────────────────────────────────────────────────────────────┐
│  TIER 2: Full Instructions (<5k tokens)                         │
│  ─────────────────────────────────────────                      │
│  When Claude determines a skill matches the task, it loads      │
│  the complete SKILL.md body with all instructions.              │
│                                                                 │
│  This ONLY happens for skills Claude decides to use.            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (only if needed)
┌─────────────────────────────────────────────────────────────────┐
│  TIER 3: Bundled Resources (variable)                           │
│  ─────────────────────────────────────────                      │
│  If the skill includes reference files, code examples, or       │
│  other resources, these load ONLY when actually needed.         │
│                                                                 │
│  Skills can have "unbounded" context this way.                  │
└─────────────────────────────────────────────────────────────────┘
```

### Why This Matters

**Without progressive disclosure:**
- 78 skills × 2k tokens average = 156k tokens consumed at startup
- That's most of your context window gone before you ask a question

**With progressive disclosure:**
- 78 skills × 100 tokens (metadata) = ~8k tokens for scanning
- Only relevant skills load fully
- Typical session: 8k + 5k (one skill) = 13k tokens

**The difference:** 156k vs 13k — a 92% reduction.

---

## Part 2: MCPs & Tool Search

### What Are MCPs?

MCPs (Model Context Protocol) are external servers that provide tools Claude can call. They're the bridge between Claude and external systems:

- **context7** → Fetches live documentation for any library
- **playwright** → Controls a browser for testing
- **github** → Manages PRs, issues, repos
- **memory** → Persistent knowledge graph

### The Context Problem with MCPs

Each MCP exposes tools. Each tool has a schema (description, parameters, return types). These schemas consume context:

| Setup | Tools | Schema Tokens | % of Context |
|-------|-------|---------------|--------------|
| 1 MCP (5 tools) | 5 | ~2,000 | ~1% |
| 3 MCPs (15 tools) | 15 | ~6,000 | ~3% |
| 7 MCPs (50+ tools) | 50+ | ~20,000+ | ~10%+ |

**The problem:** If you configure 7 MCPs globally, you lose 10%+ of your context window in EVERY session, even if you don't use those tools.

### Tool Search: The Solution

Tool Search (`ENABLE_TOOL_SEARCH=true`) changes how MCP tools load:

```
┌─────────────────────────────────────────────────────────────────┐
│  WITHOUT TOOL SEARCH                                            │
│  ───────────────────                                            │
│                                                                 │
│  Session Start                                                  │
│       │                                                         │
│       ▼                                                         │
│  Load ALL MCP tool schemas into context                         │
│       │                                                         │
│       ▼                                                         │
│  Context: [system] [50 tool schemas] [conversation]             │
│                         ↑                                       │
│                   ~20k tokens                                   │
│                   always present                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  WITH TOOL SEARCH                                               │
│  ────────────────                                               │
│                                                                 │
│  Session Start                                                  │
│       │                                                         │
│       ▼                                                         │
│  MCP tools are DEFERRED (not loaded)                            │
│       │                                                         │
│       ▼                                                         │
│  Context: [system] [search tool] [conversation]                 │
│                         ↑                                       │
│                   ~500 tokens                                   │
│                                                                 │
│  When Claude needs a tool:                                      │
│       │                                                         │
│       ▼                                                         │
│  Claude searches → Finds relevant tool → Loads ONLY that tool   │
│                                                                 │
│  Context: [system] [search tool] [1-2 tool schemas] [convo]     │
│                                        ↑                        │
│                                  ~1k tokens                     │
│                                  only when needed               │
└─────────────────────────────────────────────────────────────────┘
```

### Enabling Tool Search

```bash
# In your shell profile (~/.bashrc or ~/.zshrc)
export ENABLE_TOOL_SEARCH=true

# Or per-session
ENABLE_TOOL_SEARCH=true claude
```

**Auto mode:** Activates when MCP tools would exceed 10% of context
**Always on:** `ENABLE_TOOL_SEARCH=true`
**Custom threshold:** `ENABLE_TOOL_SEARCH=true:5` (5% threshold)

### Tool Search Requirements

- Requires **Sonnet 4+** or **Opus 4+** (Haiku doesn't support it)
- Works with all MCP transport types (stdio, HTTP, SSE)
- Automatic with Claude Code when threshold is exceeded

---

## Part 3: Plugins — Bundling Everything Together

### What Are Plugins?

Plugins are distributable packages that bundle multiple extension types:

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json        ← Plugin manifest (required)
├── skills/
│   └── react-dev/
│       └── SKILL.md       ← Skills (optional)
├── commands/
│   └── hello.md           ← Commands (optional)
├── agents/
│   └── reviewer.md        ← Custom agents (optional)
├── hooks/
│   └── hooks.json         ← Event handlers (optional)
└── .mcp.json              ← Bundled MCPs (optional)
```

### Why Plugins Are Powerful

**The key insight:** Plugins combine progressive disclosure (skills) with Tool Search (MCPs) for maximum efficiency.

```
┌─────────────────────────────────────────────────────────────────┐
│  PLUGIN LOADING BEHAVIOR                                        │
│  ───────────────────────                                        │
│                                                                 │
│  Plugin Installed                                               │
│       │                                                         │
│       ├──→ Skills: Metadata scanned (~100 tokens each)          │
│       │            Full content DEFERRED                        │
│       │                                                         │
│       ├──→ MCPs: Available but DEFERRED (Tool Search)           │
│       │          Tool schemas NOT loaded                        │
│       │                                                         │
│       └──→ Hooks: Registered but no context cost                │
│                                                                 │
│  Result: Plugin installed with near-zero context cost           │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  User Invokes Skill                                             │
│       │                                                         │
│       ├──→ Skill: Full SKILL.md loads (~2-5k tokens)            │
│       │                                                         │
│       └──→ MCP: Claude searches for needed tools                │
│                 Only relevant tools load (~500 tokens each)     │
│                                                                 │
│  Result: Pay context cost ONLY for what you use                 │
└─────────────────────────────────────────────────────────────────┘
```

### Plugin vs Standalone Comparison

| Aspect | Standalone Skill + Separate MCP | Plugin with Bundled MCP |
|--------|--------------------------------|-------------------------|
| **Installation** | Copy skill, then configure MCP separately | Install plugin, done |
| **Skill loading** | Progressive disclosure ✓ | Progressive disclosure ✓ |
| **MCP loading** | Depends on config location | Tool Search deferred ✓ |
| **Distribution** | Manual file copying | Plugin marketplace |
| **Team sharing** | Copy files + explain MCP setup | Install plugin |
| **Versioning** | Manual | Semantic versioning built-in |
| **Dependencies** | User must know what's needed | Self-contained |

### When to Use What

| Scenario | Recommendation |
|----------|----------------|
| Skill with NO MCP dependency | Standalone SKILL.md |
| Skill that REQUIRES an MCP | Plugin with bundled MCP |
| MCP wrapper for direct access | Plugin |
| Team-shared workflows | Plugin |
| Personal one-off skill | Standalone SKILL.md |
| Distributing to community | Plugin |

---

## Part 4: How It All Works Together

### The Complete Picture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLAUDE CODE SESSION                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STARTUP                                                        │
│  ───────                                                        │
│  1. Load system prompt                                          │
│  2. Scan skill metadata (frontmatter only)                      │
│  3. Register MCP servers (but defer tool loading)               │
│  4. Register hooks                                              │
│                                                                 │
│  Context used: ~10-15k tokens (minimal)                         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  USER ASKS: "Build a React component for user profiles"         │
│                                                                 │
│  CLAUDE'S PROCESS:                                              │
│  ─────────────────                                              │
│                                                                 │
│  1. Scan skill metadata                                         │
│     → "react-dev" description matches "React component"         │
│     → Load full react-dev SKILL.md (~3k tokens)                 │
│                                                                 │
│  2. Skill says "use context7 to fetch React docs"               │
│     → Tool Search: find context7 tools                          │
│     → Load fetch_documentation tool schema (~500 tokens)        │
│                                                                 │
│  3. Call MCP tool                                               │
│     → context7 fetches React 19 documentation                   │
│     → Documentation returned to Claude                          │
│                                                                 │
│  4. Generate code using skill guidance + fresh docs             │
│                                                                 │
│  Context used: ~15k base + 3k skill + 500 tool + docs           │
│  Only paid for what was actually used                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### The Optimal Configuration

```
┌─────────────────────────────────────────────────────────────────┐
│  GLOBAL (User Scope)                                            │
│  ───────────────────                                            │
│  • Memory MCP only (persistence is its purpose)                 │
│  • ENABLE_TOOL_SEARCH=true in shell profile                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PLUGINS (Installed as needed)                                  │
│  ─────────────────────────────                                  │
│  • react-dev-plugin (skill + context7 MCP)                      │
│  • webapp-testing-plugin (skill + playwright MCP)               │
│  • video-generator-plugin (skill + remotion MCP)                │
│                                                                 │
│  Each plugin is self-contained.                                 │
│  Skills load progressively.                                     │
│  MCPs defer via Tool Search.                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STANDALONE SKILLS (No MCP needed)                              │
│  ─────────────────────────────────                              │
│  • copywriting                                                  │
│  • seo-audit                                                    │
│  • mermaid-diagrams                                             │
│  • ... (84 skills without MCP dependencies)                     │
│                                                                 │
│  Simple SKILL.md files.                                         │
│  Progressive disclosure handles efficiency.                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part 5: Creating MCP-Bundled Plugins

### Plugin Structure for MCP-Dependent Skills

```
react-dev-plugin/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   └── react-dev/
│       ├── SKILL.md
│       └── references/
│           └── patterns.md
└── .mcp.json
```

### plugin.json

```json
{
  "name": "react-dev",
  "description": "React development with live documentation via context7",
  "version": "1.0.0",
  "author": {
    "name": "Your Name"
  }
}
```

### .mcp.json (Bundled MCP)

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

### SKILL.md

```markdown
---
name: react-dev
description: Generate production-ready React components with current best practices. Fetches live React documentation before generating code.
---

# React Development

## Before Generating Code

Use context7 to fetch current React documentation:
- React 19 core concepts
- Hooks reference
- Component patterns

## Code Generation Rules

1. Use functional components with hooks
2. Include TypeScript types
3. Follow project conventions
...
```

### Installation & Usage

```bash
# Install the plugin
claude plugin install /path/to/react-dev-plugin

# Or from a marketplace
claude plugin install @my-marketplace/react-dev

# Use it (skill loads progressively, MCP defers via Tool Search)
> Build a React component for user authentication
```

---

## Part 6: Migration Path

### Current System → Plugin-Based System

**Phase 1: Keep What Works**
- 84 skills without MCP dependencies stay as standalone SKILL.md files
- These already use progressive disclosure efficiently

**Phase 2: Convert MCP-Dependent Skills to Plugins**

| Skill | MCP | Plugin Name |
|-------|-----|-------------|
| react-dev | context7 | react-dev-plugin |
| frontend-design | context7 | frontend-design-plugin |
| mcp-builder | context7 | mcp-builder-plugin |
| webapp-testing | playwright | webapp-testing-plugin |
| commit-work | github | git-workflow-plugin |
| video-generator | remotion | video-generator-plugin |

**Phase 3: Create MCP Wrapper Plugins**
- context7-plugin (direct `/context7` access)
- playwright-plugin (direct `/playwright` access)
- etc.

**Phase 4: Update Documentation**
- SETUP_GUIDE.md → Focus on plugin installation
- MCP_REGISTRY.md → Reference plugins instead of manual config
- recommend-skills → Suggest plugins for MCP-dependent skills

---

## Part 7: Best Practices

### For Maximum Efficiency

1. **Enable Tool Search globally**
   ```bash
   export ENABLE_TOOL_SEARCH=true
   ```

2. **Only memory MCP should be global**
   - Persistence across projects is its purpose
   - Everything else should be in plugins

3. **Use plugins for MCP-dependent skills**
   - Self-contained distribution
   - Automatic deferred loading

4. **Keep simple skills standalone**
   - No need to wrap everything in plugins
   - Progressive disclosure handles efficiency

### For Plugin Authors

1. **Write clear skill descriptions**
   - Progressive disclosure uses this for matching
   - Better descriptions = better skill selection

2. **Bundle MCPs with skills that need them**
   - Users shouldn't have to configure separately
   - Self-contained = better UX

3. **Use semantic versioning**
   - Track changes properly
   - Users can pin versions

4. **Document MCP requirements in SKILL.md**
   - Even though MCP is bundled, document what it does
   - Helps users understand the skill's capabilities

---

## Summary

| Concept | What It Does | Context Impact |
|---------|--------------|----------------|
| **Progressive Disclosure** | Skills load in tiers | ~100 tokens until invoked |
| **Tool Search** | MCP tools load on-demand | ~0 tokens until needed |
| **Plugins** | Bundle skills + MCPs | Combines both optimizations |

**The optimal architecture:**
- Plugins for MCP-dependent skills (bundled, deferred)
- Standalone SKILL.md for simple skills (progressive disclosure)
- Memory MCP global (only exception)
- Tool Search enabled (defers everything else)

**Result:** Near-zero upfront context cost. Pay only for what you use.

---

## Sources

- [Claude Code MCP Documentation](https://code.claude.com/docs/en/mcp)
- [Claude Code Plugins Documentation](https://code.claude.com/docs/en/plugins)
- [Skills Explained - Progressive Disclosure](https://claude.com/blog/skills-explained)
- [Claude Code Tool Search Announcement](https://venturebeat.com/orchestration/claude-code-just-got-updated-with-one-of-the-most-requested-user-features/)
- [Skills vs Dynamic MCP Loadouts](https://lucumr.pocoo.org/2025/12/13/skills-vs-mcp/)
- [MCP Tool Search Medium Article](https://medium.com/the-context-layer/claude-code-just-fixed-its-biggest-scaling-problem-with-mcp-tool-search-3aa1aebcd824)
