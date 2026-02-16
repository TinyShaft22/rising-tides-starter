<div align="center">

# Rising Tides Skills Pack

**187 skills. 38 plugins. ~7% context. One install.**

[![Skills](https://img.shields.io/badge/Skills-187-blue?style=for-the-badge)](skills/)
[![Plugins](https://img.shields.io/badge/Plugins-38-purple?style=for-the-badge)](plugins/)
[![Security](https://img.shields.io/badge/Security-AUDITED-brightgreen?style=for-the-badge)](SECURITY.md)

*A curated, security-audited collection of Claude Code skills.*

</div>

---

## Quick Install

Run the command for your platform. The script installs everything automatically.

### Mac
```bash
curl -fsSL https://raw.githubusercontent.com/SunsetSystemsAI/rising-tides-starter/main/scripts/setup-mac.sh -o /tmp/setup.sh && bash /tmp/setup.sh
```

### Windows (PowerShell as Admin)
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/SunsetSystemsAI/rising-tides-starter/main/scripts/setup-windows.ps1' -OutFile "$env:TEMP\setup-windows.ps1"
& "$env:TEMP\setup-windows.ps1"
```

### Linux / WSL2
```bash
curl -fsSL https://raw.githubusercontent.com/SunsetSystemsAI/rising-tides-starter/main/scripts/setup-linux.sh -o /tmp/setup.sh && bash /tmp/setup.sh
```

**What it does:**
- Installs Node.js, Git, and prerequisites (skips what you have)
- Installs Claude Code if needed
- Installs the full skills pack
- Enables Tool Search for context efficiency

---

## Getting Started

After installation, start Claude Code and try these:

### Get Skill Recommendations
```
/recommend skills
```
Claude analyzes your project and suggests relevant skills.

### Use Skills Directly
```
Help me build a React login form
```
Claude auto-discovers the `react-dev` skill and applies it.

### Invoke Specific Skills
```
/security-audit check this codebase
/copywriting write a headline for my landing page
/stripe-integration set up payments
```

---

## What's Included

| Category | Skills | Highlights |
|----------|--------|------------|
| **Security** | 24 | Auditing, YARA rules, Semgrep, OWASP patterns |
| **Frontend** | 18 | React, Vue, Angular, TypeScript |
| **Backend** | 22 | Django, FastAPI, Rails, NestJS, Spring Boot |
| **DevOps** | 15 | Kubernetes, Terraform, Docker, CI/CD |
| **Marketing** | 23 | Copywriting, SEO, CRO, analytics |
| **Integrations** | 12 | n8n workflows, Datadog, Jira |
| **Architecture** | 12 | C4 diagrams, API design, microservices |
| **Documentation** | 11 | READMEs, Mermaid, presentations |
| **Workflow** | 14 | Git, debugging, handoffs |
| **Languages** | 31+ | Python, Go, Rust, C++, Java, Kotlin, Swift |

**Plus:** 38 plugins (skill + MCP bundles), 9 CLI integrations, 18 MCPs

See [SKILLS_INDEX.json](SKILLS_INDEX.json) for the complete list.

---

## Staying Updated

Rising Tides includes a built-in update system:

```bash
update-rising-tides
```

This compares your version with the latest, downloads new skills, and shows what's changed.

See [CHANGELOG.md](CHANGELOG.md) for recent updates.

---

## Community & Support

<div align="center">

[![Community](https://img.shields.io/badge/Community-Skool-blue?style=for-the-badge)](https://www.skool.com/rising-tides-9034)
[![Issues](https://img.shields.io/badge/Issues-GitHub-black?style=for-the-badge&logo=github)](https://github.com/SunsetSystemsAI/rising-tides-pack/issues)

**Questions?** Join the community or open an issue.

</div>

---

## Going Deeper

| Topic | Document |
|-------|----------|
| How the system works | [Architecture](docs/ARCHITECTURE.md) |
| Context efficiency proof | [7% Context Test](docs/CONTEXT-EFFICIENCY.md) |
| Security audit results | [Security Report](SECURITY.md) |
| Plugin system | [Plugin Guide](docs/PLUGIN-GUIDE.md) |
| MCP configuration | [MCP Setup](docs/MCP-SETUP-GUIDE.md) |
| Quick reference | [Quickstart](docs/QUICKSTART.md) |

---

## Attribution

This collection curates skills from the open-source community. All credit goes to the original authors.

| Source | Skills | License |
|--------|--------|---------|
| [Trail of Bits](https://github.com/trailofbits/skills) | 24 | Apache-2.0 |
| [Corey Haines](https://github.com/coreyhaines31/marketingskills) | 23 | MIT |
| [Jeff Allan](https://github.com/Jeffallan/claude-skills) | 60+ | MIT |
| [Softaworks](https://github.com/softaworks/agent-toolkit) | 40 | MIT |
| [harperaa](https://github.com/harperaa/secure-claude-skills) | 11 | MIT |
| And more... | | |

See [ATTRIBUTION.md](ATTRIBUTION.md) for the complete list.

---

## License

MIT. Individual skills retain their original licenses (MIT or Apache-2.0).

---

<div align="center">

**A Rising Tide Lifts All Boats**

</div>
