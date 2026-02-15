# Rising Tides Changelog

All notable changes to the Rising Tides Skills Pack will be documented here.

## [1.0.0] - 2026-02-15

### Added
- Initial release with 187 skills
- 38 plugins with MCP integrations
- 9 CLI integrations (Stripe, Vercel, Supabase, Firebase, GitHub, Netlify, Google Cloud, Jira, Datadog)
- License key validation system
- One-command setup for Mac, Linux, and Windows
- Memory MCP integration for persistent knowledge
- SKILLS_INDEX.json for fast skill discovery
- ENABLE_TOOL_SEARCH support for context efficiency

### Skills by Category
- **Marketing & SEO (16):** copywriting, seo-audit, marketing-psychology, and more
- **Frontend (7):** react-dev, frontend-design, vue-expert, angular-architect
- **Backend (7):** supabase-guide, firebase-guide, database-pro, drizzle-orm
- **Documentation (11):** mermaid-diagrams, c4-architecture, pdf, docx, pptx
- **Workflow (11):** git-workflow, debugging, session-handoff
- **Architecture (6):** mcp-builder, plugin-forge, skill-creator
- **And more across 13 categories**

---

## How to Update

Run the update command:

**Windows (PowerShell):**
```powershell
update-rising-tides
```

**Mac/Linux:**
```bash
update-rising-tides
```

Or run the update script directly:

**Windows:**
```powershell
Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/SunsetSystemsAI/rising-tides-starter/main/scripts/update-windows.ps1' -OutFile "$env:TEMP\update.ps1"; & "$env:TEMP\update.ps1"
```

**Mac:**
```bash
curl -fsSL https://raw.githubusercontent.com/SunsetSystemsAI/rising-tides-starter/main/scripts/update-mac.sh | bash
```

**Linux:**
```bash
curl -fsSL https://raw.githubusercontent.com/SunsetSystemsAI/rising-tides-starter/main/scripts/update-linux.sh | bash
```
