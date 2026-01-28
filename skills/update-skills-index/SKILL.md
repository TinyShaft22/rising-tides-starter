# Skill: Update Skills Index

Scan the global skills folder and update SKILLS_INDEX.json with any new or removed skills.

## Trigger

Invoke when user says:
- "update skills index"
- "refresh skills index"
- "I added new skills"
- "sync skills index"

## Workflow

### Step 1: Scan Global Skills Folder

List all skills in the global folder:
```bash
ls -1 ~/.claude/skills/
```

### Step 2: Read Current Index

Read the existing JSON index:
```
~/.claude/SKILLS_INDEX.json
```

Parse the `skills` array to get the list of currently indexed skills.

### Step 3: Identify Changes

Compare folder contents to the index:
- **New skills:** In folder but NOT in index
- **Removed skills:** In index but NOT in folder

### Step 4: For Each New Skill

Read the skill's SKILL.md to extract:
- `name` — from frontmatter or first heading
- `description` — from frontmatter
- `category` — infer from content or ask user
- `triggers` — keywords that should invoke this skill
- `cli` — if skill uses a CLI (check content)
- `mcp` — if skill uses an MCP (check content)
- `plugin` — if there's a matching plugin
- `source` — attribution

### Step 5: Update the JSON Index

For new skills, add entry to the `skills` array:
```json
{
  "id": "skill-name",
  "name": "Skill Name",
  "category": "category",
  "triggers": ["keyword1", "keyword2"],
  "cli": null,
  "mcp": null,
  "plugin": null,
  "source": "nickmohler"
}
```

For removed skills, remove from the array.

Update `meta.totalSkills` count.
Update `meta.lastUpdated` date.

### Step 6: Report Changes

Show the user:
- Skills added (with their categories)
- Skills removed
- Updated total count
- Reminder to copy updated index to global: `cp SKILLS_INDEX.json ~/.claude/`

## Important Rules

1. **Preserve existing entries** — Don't overwrite unless explicitly asked
2. **Infer triggers from content** — Look for "use when", "trigger when" in SKILL.md
3. **Check for CLI/MCP references** — Look for CLI commands or MCP tool calls
4. **Match to existing plugins** — Check if skill has a corresponding plugin
5. **Ask if unsure** — Don't guess categories or triggers

## File Locations

- Global skills folder: `~/.claude/skills/`
- Index file: `~/.claude/SKILLS_INDEX.json`
- Source repo: `github/SKILLS_INDEX.json`

## Index Structure Reference

```json
{
  "meta": {
    "name": "Rising Tides Skills Pack",
    "version": "1.0.0",
    "lastUpdated": "2026-01-27",
    "totalSkills": 77,
    "totalPlugins": 12,
    "totalCLIs": 9,
    "totalMCPs": 8
  },
  "skills": [
    {
      "id": "skill-id",
      "name": "Display Name",
      "category": "frontend|backend|workflow|etc",
      "triggers": ["keyword1", "keyword2"],
      "cli": "cli-name-or-null",
      "mcp": "mcp-name-or-null",
      "plugin": "plugin-name-or-null",
      "source": "attribution"
    }
  ]
}
```
