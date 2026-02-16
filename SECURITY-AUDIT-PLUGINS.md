# Security Audit: Rising Tides Plugins
**Date:** 2026-02-15
**Auditor:** Claude Opus 4.5
**Scope:** 38 plugins, 15 MCP configurations
---
## Executive Summary
| Finding | Severity | Count |
|---------|----------|-------|
| Missing NPM packages (@anthropic-ai/*) | **CRITICAL** | 4 plugins |
| Docker socket access | **CRITICAL** | 1 plugin |
| API key exposure risks | HIGH | 2 plugins |
| Browser automation access | MEDIUM | 3 plugins |
| Knowledge-only (no MCP) | LOW/NONE | 23 plugins |
### Critical Issues Requiring Attention
1. **Anthropic MCP packages do not exist on public npm** - `@anthropic-ai/mcp-server-github`, `@anthropic-ai/mcp-server-memory`, and `@anthropic-ai/mcp-server-remotion` return 404 from npm registry.
2. **Docker plugin grants container runtime access** - Can spawn privileged containers with host volume access.
---
## Plugin Inventory
### Plugins WITH MCP Configurations (15)
| # | Plugin | MCP Package | Risk Level |
|---|--------|-------------|------------|
| 1 | context7-plugin | @upstash/context7-mcp | LOW |
| 2 | frontend-design-plugin | @upstash/context7-mcp | LOW |
| 3 | frontend-ui-plugin | @upstash/context7-mcp + shadcn | LOW |
| 4 | mcp-builder-plugin | @upstash/context7-mcp | LOW |
| 5 | react-dev-plugin | @upstash/context7-mcp | LOW |
| 6 | playwright-plugin | @playwright/mcp | MEDIUM |
| 7 | webapp-testing-plugin | @playwright/mcp | MEDIUM |
| 8 | browser-automation-plugin | Built-in (claude-in-chrome) | MEDIUM |
| 9 | github-actions-plugin | github-actions-mcp | HIGH |
| 10 | n8n-plugin | n8n-mcp | HIGH |
| 12 | git-workflow-plugin | @anthropic-ai/mcp-server-github | **BROKEN** |
| 13 | memory-plugin | @anthropic-ai/mcp-server-memory | **BROKEN** |
| 14 | remotion-plugin | @anthropic-ai/mcp-server-remotion | **BROKEN** |
| 15 | video-generator-plugin | @anthropic-ai/mcp-server-remotion | **BROKEN** |
### Plugins WITHOUT MCP (23)
All knowledge-only plugins with **no external tool access**:
- ask-questions-first-plugin
- culture-index-plugin
- dwarf-expert-plugin
- modern-python-plugin
- property-based-testing-plugin
- security-audit-context-plugin
- security-burpsuite-parser-plugin
- security-chrome-troubleshooting-plugin
- security-differential-review-plugin
- security-entry-points-plugin
- security-firebase-apk-plugin
- security-fix-review-plugin
- security-insecure-defaults-plugin
- security-sharp-edges-plugin
- security-smart-contracts-plugin
- security-spec-compliance-plugin
- security-static-analysis-plugin
- security-testing-handbook-plugin
- security-timing-analysis-plugin
- security-variant-analysis-plugin
- semgrep-rule-creator-plugin
- semgrep-rule-variants-plugin
- yara-rule-authoring-plugin
---
## MCP Permission Analysis
### CRITICAL Risk

*No CRITICAL risk plugins in this release.*

> **Note:** docker-plugin was removed from this release due to GPL-3.0 license incompatibility with the MIT-licensed Rising Tides pack. Users who need Docker MCP functionality can install `mcp-server-docker` separately.

---
### HIGH Risk
#### github-actions-plugin
**Environment Variables:** `GITHUB_PERSONAL_ACCESS_TOKEN`
**Capabilities:**
- Trigger GitHub Actions workflows
- View workflow run status and logs
- Cancel/re-run workflows
**Risk:** CI/CD manipulation, secrets exposure in logs, code deployment
**Recommendation:** Use fine-grained PAT with minimal scopes.
#### n8n-plugin
**Environment Variables:** `N8N_API_URL`, `N8N_API_KEY`
**Capabilities:**
- Create/update/delete n8n workflows
- Execute workflows
- Access workflow execution history
**Risk:** External system access (n8n connects to 1000+ services), credential exposure
**Recommendation:** Use read-only API key where possible.
---
### MEDIUM Risk
#### playwright-plugin / webapp-testing-plugin
**Capabilities:**
- Browser automation (Chrome, Firefox, WebKit)
- Navigate to any URL
- Fill forms and click elements
- Execute JavaScript in page context
**Risk:** Credential theft via login forms, session access
**Recommendation:** Avoid authenticated sessions in browser testing.
#### browser-automation-plugin
Built-in Claude in Chrome extension (official Anthropic capability).
**Recommendation:** Use with awareness of active browser sessions.
---
### LOW Risk
#### context7-plugin, frontend-design-plugin, mcp-builder-plugin, react-dev-plugin
All use `@upstash/context7-mcp` for read-only documentation access.
#### frontend-ui-plugin
Uses context7 + shadcn for UI component generation.
**Risk:** None - read-only documentation and code generation.
---
## NPM Package Verification
| Package | Exists | Publisher | Version |
|---------|--------|-----------|---------|
| @upstash/context7-mcp | ✅ YES | Upstash | 2.1.1 |
| @playwright/mcp | ✅ YES | Playwright team | 0.0.68 |
| shadcn | ✅ YES | shadcn-ui | 3.8.4 |
| github-actions-mcp | ✅ YES | msoq (community) | 1.0.1 |
| n8n-mcp | ✅ YES | czlonkowski | 2.35.2 |
| mcp-server-docker | ✅ YES (PyPI) | Community | 0.2.1 |
| @anthropic-ai/mcp-server-github | ❌ **NO** | — | — |
| @anthropic-ai/mcp-server-memory | ❌ **NO** | — | — |
| @anthropic-ai/mcp-server-remotion | ❌ **NO** | — | — |
### Missing Package Analysis
The `@anthropic-ai/*` packages are referenced but do not exist on the public npm registry. Possible explanations:
1. Internal Anthropic packages (private registry)
2. Planned but not yet released
3. Configuration prepared for future packages
**Alternatives that exist:**
- `mcp-server-memory` (v1.0.3) - Community alternative
- `@iflow-mcp/server-github` (v0.6.2) - Community GitHub MCP
---
## Environment Variable Inventory
| Variable | Plugin(s) | Sensitivity |
|----------|-----------|-------------|
| GITHUB_TOKEN | git-workflow-plugin | HIGH |
| GITHUB_PERSONAL_ACCESS_TOKEN | github-actions-plugin | HIGH |
| N8N_API_URL | n8n-plugin | LOW |
| N8N_API_KEY | n8n-plugin | HIGH |
### Best Practices
1. Never commit to version control
2. Use minimal-scope tokens
3. Rotate regularly
4. Use secrets management (1Password, Doppler, etc.)
---
## Recommendations
### Immediate (P0) - ✅ RESOLVED
1. ~~**Fix broken packages**~~ ✅ Fixed - Replaced `@anthropic-ai/*` with correct packages (`@modelcontextprotocol/*`, `@remotion/mcp`)
2. ~~**Docker plugin**~~ ✅ Removed - GPL-3.0 license incompatible with MIT
3. **Document credentials** - Add clear setup documentation for plugins requiring API keys
### Short-term (P1)
4. Add CI/CD check to verify all MCP packages exist
5. Create .env.example files for credential-requiring plugins
6. Add PERMISSIONS.md to each plugin
---
## Risk Classification Summary
| Risk Level | Count | Plugins |
|------------|-------|---------|
| **CRITICAL** | 0 | *(docker-plugin removed - GPL-3.0 incompatible)* |
| **BROKEN** | 0 | *(Fixed: git-workflow, memory, remotion, video-generator)* |
| HIGH | 2 | github-actions, n8n |
| MEDIUM | 3 | playwright, webapp-testing, browser-automation |
| LOW | 5 | context7, frontend-design, frontend-ui, mcp-builder, react-dev |
| NONE | 22 | All security/knowledge plugins |
---
*Report generated by Claude Opus 4.5 security audit - 2026-02-15*
