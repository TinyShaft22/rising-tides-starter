# Skill: Recommend Skills for Project

Analyze the current project and recommend which global skills or plugins to use.

**CRITICAL: When recommending plugins, NEVER show `--plugin-dir` commands. Instead, configure MCPs in the project's `.mcp.json` file. This is the new architecture.**

## Trigger

Invoke when user says:
- "recommend skills"
- "what skills should I use"
- "check skills for this project"
- "import useful skills"

## Workflow

### Step 1: Read the Global Skills Index

Read the index file at:
```
~/.claude/SKILLS_INDEX.json
```

The Skills Index contains:
- 77 global skills organized by category
- 12 plugins for MCP-dependent skills
- CLI and MCP definitions
- Triggers for each skill (for matching against project needs)

### Step 2: Inventory What's Already Available

Check what skills/plugins already exist in the project:
```bash
ls .claude/skills/ 2>/dev/null || echo "No project skills folder"
ls .claude/plugins/ 2>/dev/null || echo "No project plugins folder"
```

These are **already imported** - do NOT recommend re-importing them.

### Step 3: Read Project Planning Docs

Read the project's planning documents to understand goals:
- `.planning/PROJECT.md` (if exists)
- `.planning/ROADMAP.md` (if exists)
- `README.md` (if no planning docs)
- `CLAUDE.md` (project instructions)
- Ask user about goals if no docs found

### Step 4: Cross-Reference Skills Against Goals

For EVERY skill in the global index, assess:
- **IMPORT** - Directly useful for planned/current work
- **MAYBE** - Could be useful in some scenarios
- **SKIP** - Not relevant to this project

**CRITICAL: For skills marked `[PLUGIN]`, recommend the PLUGIN instead of the standalone skill.**

| Skill | MCP | Plugin to Recommend |
|-------|-----|---------------------|
| react-dev | context7 | `react-dev-plugin` |
| frontend-design | context7 | `frontend-design-plugin` |
| mcp-builder | context7 | `mcp-builder-plugin` |
| webapp-testing | playwright | `webapp-testing-plugin` |
| commit-work | github | `git-workflow-plugin` |
| video-generator | remotion | `video-generator-plugin` |

### Step 5: Present Assessment

Show FOUR sections:

**1. Already Available (no action needed)**
| Item | Type | Status |
|------|------|--------|
| [name] | Skill/Plugin | Already in project |

**2. Plugins to Install (for MCP-dependent skills)**
| Plugin | Skill | MCP | Why It Helps |
|--------|-------|-----|--------------|
| [plugin-name] | [skill-name] | [mcp] | [specific reason] |

**IMPORTANT: Do NOT show `--plugin-dir` commands. MCPs will be configured in `.mcp.json` after user confirms.**

**3. Skills to Import (no MCP needed)**
| Skill | Category | Why It Helps |
|-------|----------|--------------|
| [skill-name] | [category] | [specific reason] |

**4. Not Relevant (skipping)**
| Skill | Reason |
|-------|--------|
| [skill-name] | [why it doesn't apply] |

### Step 6: Get User Confirmation

Ask user which skills/plugins to use. Confirm before proceeding.

### Step 7: Install Plugins (Configure MCPs at Project Level)

For each confirmed plugin:

1. **Copy the skill to project level:**
   ```bash
   mkdir -p .claude/skills
   cp -r ~/.claude/plugins/[plugin-name]/skills/* .claude/skills/
   ```

2. **Read the plugin's MCP configuration:**
   ```bash
   cat ~/.claude/plugins/[plugin-name]/.mcp.json
   ```

3. **Create or merge into project's `.mcp.json`:**

   If project has no `.mcp.json`, create it with the plugin's MCP config.

   If project already has `.mcp.json`, merge the new MCP servers into the existing `mcpServers` object.

   **Example: After importing react-dev-plugin and webapp-testing-plugin:**
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

4. **Explain what happens:**
   - Skill files are now at project level (`.claude/skills/`)
   - MCP configuration is in project's `.mcp.json`
   - MCPs auto-load when Claude restarts in this project
   - No `--plugin-dir` flags needed
   - Uses Tool Search for deferred loading (near-zero context cost)

### Step 8: Import Skills (if any)

For confirmed skills (without MCP dependencies):
```bash
mkdir -p .claude/skills
cp -r ~/.claude/skills/[skill-name] .claude/skills/
```

### Step 9: Confirm Completion

Summarize what was done:
```
Skills imported to .claude/skills/: [list]
MCPs configured in .mcp.json: [list]
Ready to use: [skill commands]

Restart Claude to activate MCPs:
exit
claude
```

**Tip:** Enable Tool Search for optimal MCP context efficiency:
```bash
export ENABLE_TOOL_SEARCH=auto
```

---

## Plugin vs Skill Decision Tree

```
Does the skill need an MCP?
├── Yes → Use the PLUGIN version
│   ├── react-dev → react-dev-plugin
│   ├── frontend-design → frontend-design-plugin
│   ├── mcp-builder → mcp-builder-plugin
│   ├── webapp-testing → webapp-testing-plugin
│   ├── commit-work → git-workflow-plugin
│   └── video-generator → video-generator-plugin
│
└── No → Import the standalone skill
    └── cp from ~/.claude/skills/
```

---

## Available Plugins

**Skill Plugins:**
- `react-dev-plugin` (context7)
- `frontend-design-plugin` (context7)
- `mcp-builder-plugin` (context7)
- `webapp-testing-plugin` (playwright)
- `video-generator-plugin` (remotion)
- `git-workflow-plugin` (github)

**MCP Wrapper Plugins:**
- `context7-plugin` (direct context7 access)
- `playwright-plugin` (direct playwright access)
- `remotion-plugin` (direct remotion access)
- `memory-plugin` (direct memory access)

---

## Example Output

```
## Skills Analysis for [Project Name]

### Already Available (1 item)
| Item | Type | Status |
|------|------|--------|
| copywriting | Skill | Already imported |

### Plugins to Install (2 plugins)
| Plugin | Skill | MCP | Why It Helps |
|--------|-------|-----|--------------|
| react-dev-plugin | react-dev | context7 | Phase 2 involves new React components |
| webapp-testing-plugin | webapp-testing | playwright | E2E tests for Phase 3 |

### Skills to Import (1 skill)
| Skill | Category | Why It Helps |
|-------|----------|--------------|
| mermaid-diagrams | Docs | Document the system architecture |

### Not Relevant (81 skills)
[Collapsed list with reasons]

---

Proceed with these recommendations? (yes/no)
```

After user confirms:

```
## Summary

**Skills imported to .claude/skills/:**
- react-dev
- webapp-testing
- mermaid-diagrams

**MCPs configured in .mcp.json:**
- context7 (for react-dev)
- playwright (for webapp-testing)

**Ready to use:**
- /react-dev (context7 MCP auto-loads)
- /webapp-testing (playwright MCP auto-loads)
- /mermaid (imported skill)

**Restart Claude to activate MCPs:**
exit
claude

**Tip:** Enable Tool Search for optimal MCP loading:
```bash
export ENABLE_TOOL_SEARCH=auto
```
```

---

## Important Rules

1. **Never modify existing project skills/plugins** - They were added for a reason
2. **ALWAYS recommend plugins for MCP-dependent skills** - Not standalone skills
3. **Tie recommendations to specific roadmap items** - Not generic "could be useful"
4. **NEVER show `--plugin-dir` commands** - Configure MCPs in project's `.mcp.json` instead
5. **Mention Tool Search** - When recommending multiple plugins
6. **Prompt user to restart Claude** - MCPs only load on session start

---

## MCP-Enhanced Skills → Plugin Equivalents

| Skill | MCP | Plugin (ALWAYS Use This) |
|-------|-----|--------------------------|
| react-dev | context7 | `react-dev-plugin` |
| frontend-design | context7 | `frontend-design-plugin` |
| mcp-builder | context7 | `mcp-builder-plugin` |
| webapp-testing | playwright | `webapp-testing-plugin` |
| commit-work | github | `git-workflow-plugin` |
| video-generator | remotion | `video-generator-plugin` |

**Direct MCP Access Plugins:**

| Use Case | Plugin |
|----------|--------|
| Pull docs for any library | `context7-plugin` |
| Browser automation | `playwright-plugin` |
| Video generation | `remotion-plugin` |
| Persistent memory | `memory-plugin` |

---

## File Locations

Global skills: `~/.claude/skills/`
Global index: `~/.claude/SKILLS_INDEX.json`
Plugins: `~/.claude/plugins/` or `./plugins/` (project-level)
