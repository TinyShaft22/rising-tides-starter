# Security Audit: Community Repositories

**Date:** 2026-02-15
**Verified by:** Claude Code Agent
**Method:** gh CLI verification, license check, security advisory scan

---

## Summary

Verified 16 community repositories used by Rising Tides Skills Pack.

| Verdict | Count |
|---------|-------|
| **SAFE** | 8 |
| **REVIEW** | 6 |
| **REJECT** | 1 |
| **N/A** | 1 (Anthropic built-in) |

---

## Verification Table

| # | Repository | Exists | License | Expected | Stars | Last Activity | Verdict |
|---|-----------|--------|---------|----------|-------|---------------|---------|
| 1 | Anthropic (built-in) | N/A | N/A | N/A | N/A | N/A | **N/A** |
| 2 | vercel-labs/agent-skills | Yes | **No LICENSE** | MIT | 20,449 | 2026-02-02 | **REVIEW** |
| 3 | coreyhaines31/marketingskills | Yes | MIT | MIT | 7,871 | 2026-02-04 | **SAFE** |
| 4 | softaworks/agent-toolkit | Yes | MIT | MIT | 592 | 2026-02-08 | **SAFE** |
| 5 | obra/superpowers | Yes | MIT | MIT | 52,269 | 2026-02-12 | **SAFE** |
| 6 | trailofbits/skills | Yes | **CC-BY-SA-4.0** | Apache-2.0 | 2,672 | 2026-02-13 | **REVIEW** |
| 7 | antonbabenko/terraform-skill | Yes | Apache-2.0 | Apache-2.0 | 1,019 | 2026-02-02 | **SAFE** |
| 8 | rknall/claude-skills | Yes | **No LICENSE** | MIT | 17 | 2025-10-20 | **REVIEW** |
| 9 | harperaa/secure-claude-skills | Yes | MIT | MIT | 4 | 2025-12-14 | **SAFE** |
| 10 | ChrisWiles/claude-code-showcase | Yes | **No LICENSE** | MIT | 5,315 | 2026-01-06 | **REVIEW** |
| 11 | ahmedasmar/devops-claude-skills | Yes | **No LICENSE** | MIT | 68 | 2025-11-01 | **REVIEW** |
| 12 | Jeffallan/claude-skills | Yes | MIT | MIT | 2,711 | 2026-02-13 | **SAFE** |
| 13 | lackeyjb/playwright-skill | Yes | MIT | MIT | 1,693 | 2025-12-19 | **SAFE** |
| 14 | czlonkowski/n8n-skills | Yes | MIT | MIT | 2,752 | 2026-01-08 | **SAFE** |
| 15 | ckreiling/mcp-server-docker | Yes | **GPL-3.0** | MIT | 675 | 2025-06-05 | **REJECT** |
| 16 | ko1ynnky/github-actions-mcp-server | Yes | **No LICENSE** | MIT | 40 | 2025-07-10 | **REVIEW** |

---

## Issues Found

### Repositories That No Longer Exist

**None** - all repositories verified as existing.

### License Changes / Mismatches

| Repository | Expected | Actual | Impact |
|-----------|----------|--------|--------|
| vercel-labs/agent-skills | MIT | No LICENSE | Unclear licensing |
| trailofbits/skills | Apache-2.0 | CC-BY-SA-4.0 | ShareAlike clause |
| rknall/claude-skills | MIT | No LICENSE | Unclear licensing |
| ChrisWiles/claude-code-showcase | MIT | No LICENSE | Unclear licensing |
| ahmedasmar/devops-claude-skills | MIT | No LICENSE | Unclear licensing |
| **ckreiling/mcp-server-docker** | MIT | **GPL-3.0** | **INCOMPATIBLE** |
| ko1ynnky/github-actions-mcp-server | MIT | No LICENSE | Unclear licensing |

### Security Advisories

**None found** for any of the checked repositories.

---

## Verdicts

### SAFE (8 repos)

Confirmed MIT or Apache-2.0 licensed, actively maintained:

| Repository | Stars | License |
|-----------|-------|---------|
| coreyhaines31/marketingskills | 7,871 | MIT |
| softaworks/agent-toolkit | 592 | MIT |
| obra/superpowers | 52,269 | MIT |
| antonbabenko/terraform-skill | 1,019 | Apache-2.0 |
| harperaa/secure-claude-skills | 4 | MIT |
| Jeffallan/claude-skills | 2,711 | MIT |
| lackeyjb/playwright-skill | 1,693 | MIT |
| czlonkowski/n8n-skills | 2,752 | MIT |

### REVIEW (6 repos)

Missing LICENSE file or license mismatch:

| Repository | Issue | Action Needed |
|-----------|-------|---------------|
| vercel-labs/agent-skills | No LICENSE file | Contact for clarification |
| trailofbits/skills | CC-BY-SA-4.0 (ShareAlike) | Evaluate derivative work requirements |
| rknall/claude-skills | No LICENSE file | Contact for clarification |
| ChrisWiles/claude-code-showcase | No LICENSE file | Contact for clarification |
| ahmedasmar/devops-claude-skills | No LICENSE file | Contact for clarification |
| ko1ynnky/github-actions-mcp-server | No LICENSE, will be archived | Migrate to official GitHub MCP |

### REJECT (1 repo)

| Repository | Reason |
|-----------|--------|
| ckreiling/mcp-server-docker | GPL-3.0 incompatible with MIT distribution |

---

## Recommendations

### Immediate Actions

1. **REJECT ckreiling/mcp-server-docker** - GPL-3.0 license requires derivative works to be GPL. Find MIT/Apache-2.0 alternative or remove.

2. **Review trailofbits/skills** - CC-BY-SA-4.0 ShareAlike clause may affect distribution. Evaluate which skills are sourced from here.

### Pending Actions

3. **Contact repository owners** for license clarification:
   - vercel-labs/agent-skills (high priority - 20k stars)
   - ChrisWiles/claude-code-showcase (medium - 5k stars)
   - rknall/claude-skills (low - 17 stars)
   - ahmedasmar/devops-claude-skills (low - 68 stars)

4. **Monitor ko1ynnky/github-actions-mcp-server** - Plan migration to official GitHub MCP server when Actions support is released.

### Activity Concerns

Some repositories have not been updated recently:

| Repository | Last Update | Concern |
|-----------|-------------|---------|
| ckreiling/mcp-server-docker | 2025-06-05 | 8+ months stale |
| ko1ynnky/github-actions-mcp-server | 2025-07-10 | 7+ months stale |
| rknall/claude-skills | 2025-10-20 | 4 months stale |
| harperaa/secure-claude-skills | 2025-12-14 | 2 months stale |

---

## Notable Repository Status

### Most Popular (SAFE)

- **obra/superpowers** - 52,269 stars, very active, MIT licensed

### High Stars but Needs Review

- **vercel-labs/agent-skills** - 20,449 stars, no LICENSE file (Vercel Labs suggests permissive intent)
- **ChrisWiles/claude-code-showcase** - 5,315 stars, no LICENSE file

### Deprecated

- **ko1ynnky/github-actions-mcp-server** - README indicates this repo will be archived soon as GitHub's official MCP server is adding Actions support

---

## Previously Rejected Repos (From Earlier Audit)

| Repository | Reason |
|-----------|--------|
| invariantlabs-ai/mcp-scan | Telemetry uploads hostname/username |
| ailabs-393/ai-labs-claude-skills | Empty JS stubs, no real content |
| fr33d3m0n/skill-threat-modeling | Unauditable binary files |
| levnikolaevich/claude-code-skills | `bypassPermissions` flag |
| AgentSecOps/SecOpsAgentKit | `bash <(curl ...)` patterns |
| ThamJiaHe/claude-prompt-engineering-guide | Documentation only |

---

*Report generated by Claude Code Agent - 2026-02-15*
