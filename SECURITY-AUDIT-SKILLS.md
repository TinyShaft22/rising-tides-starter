# Security Audit Report: Rising Tides Skills Pack

**Date:** 2026-02-15
**Auditor:** Claude Opus 4.5
**Scope:** All skills, plugins, MCP configurations, and executable scripts

---

## Executive Summary

| Status | Result |
|--------|--------|
| **Overall** | **PASS** |
| Critical Issues | 0 |
| High Issues | 0 |
| Medium Issues | 4 (documented, acceptable) |
| Low/Informational | 12 |

The Rising Tides Skills Pack passes the security audit with no critical or high-severity vulnerabilities.

---

## Files Scanned

| Category | Count |
|----------|-------|
| Skill directories | 177 |
| Plugin directories | 38 |
| Skill files (md/py/sh/json) | 800+ |
| Plugin files (md/py/sh/json) | 260+ |
| MCP configuration files | 15 |
| Starter pack scripts | 19 |
| Python scripts (in skills) | 72 |
| Shell scripts (in skills) | 4 |
| **Total files analyzed** | **1,100+** |

---

## Critical Findings

**None found.**

No hardcoded real API keys, no data exfiltration code, no malicious URLs, no unauthorized privilege escalation.

Scanned patterns with no matches:
- Live API keys (`sk_live_`, `pk_live_`, `api_key_` + 20+ chars): **No matches**
- AWS credentials (`AKIA`, `ABIA`, `ACCA`, `ASIA` + 16 chars): **No matches**
- JWT tokens (long base64-encoded): **No matches**
- Real private keys: **No matches** (only template/example content found)

---

## High Findings

**None found.**

Previous H1/H2 issues have been fixed:
- `eval` replaced with safer `printf -v` pattern in qa-test-planner scripts
- `shell=True` documented with security comments in with_server.py

---

## Medium Findings (Documented)

### M1: verify=False in TLS Connections

**Files:** `github/skills/gitops-workflows/scripts/check_argocd_health.py` (lines 45, 59, 64)

**Issue:** Disables SSL certificate verification, enabling MITM attacks.

**Context:** Diagnostic tool for ArgoCD clusters where self-signed certificates are common in dev/test environments.

**Mitigation:** Expected for internal tooling. Users should be aware of the trade-off.

### M2: shell=True with CLI Arguments

**Files:** `github/skills/webapp-testing/scripts/with_server.py` (line 74)

**Issue:** Uses `shell=True` for subprocess execution.

**Context:** The script includes explicit security documentation (lines 68-71) explaining that the command comes from CLI arguments provided by the user running the script, not from untrusted external input.

**Mitigation:** Properly documented. Only use with trusted input.

### M3: Placeholder Credentials in Templates

**Files:** Multiple documentation and template files

**Examples:**
- `kubernetes-specialist/references/`: `<REPLACE_WITH_*>` patterns
- `stripe-integration/SKILL.md`: `sk_test_xxx` placeholders
- `devops-engineer/references/`: `postgres://user:pass@` examples

**Mitigation:** Clearly marked as placeholders for users to replace.

### M4: pickle.load() in ML Documentation

**Files:** `github/skills/ml-pipeline/references/feature-engineering.md`

**Context:** Documentation showing common ML patterns. Not executable code.

**Mitigation:** Educational content only.

---

## Low/Informational Findings

| Finding | Context |
|---------|---------|
| curl \| bash install commands | Official installation methods from legitimate vendors (Istio, gcloud, Stripe CLI, etc.) |
| Private key template | Truncated example in Kubernetes docs, not a valid key |
| Database connection strings | Generic examples with placeholder credentials |
| Security pattern documentation | Intentional for security training (YARA rules, Semgrep examples) |
| ngrok reference | Legitimate Shopify development workflow |
| pastebin pattern | YARA rule to detect malware, not malicious code |
| requests.post calls | Chaos engineering tools for controlled failure injection |
| Socket operations | Localhost port checking for dev servers |
| dangerouslySetInnerHTML | Legitimate use cases or detection rules |
| IP addresses | All RFC-compliant examples (127.0.0.1, 192.168.x.x, etc.) |
| Base64 references | Kubernetes encoding, YARA rules |
| Environment variable access | Standard auth pattern for tokens |

---

## Starter Pack Scripts Audit

All 19 scripts audited (11 shell, 8 PowerShell):

| Script | Purpose | Status |
|--------|---------|--------|
| setup-mac.sh | Mac installation | ✅ Safe |
| setup-linux.sh | Linux installation | ✅ Safe |
| setup-windows.ps1 | Windows installation | ✅ Safe |
| update-mac.sh | Mac update | ✅ Safe |
| update-linux.sh | Linux update | ✅ Safe |
| update-windows.ps1 | Windows update | ✅ Safe |
| update-skills.sh/ps1 | Skills-only update | ✅ Safe |
| verify-setup.sh/ps1 | Verify installation | ✅ Safe |
| check-prerequisites.sh/ps1 | Check prerequisites | ✅ Safe |
| uninstall.sh/ps1 | Uninstall menu | ✅ Safe |
| uninstall-skills.sh/ps1 | Remove skills only | ✅ Safe |
| uninstall-full.sh/ps1 | Full uninstall | ✅ Safe |
| cleanup-mac.sh | Deep cleanup | ✅ Safe |

**Known Items (By Design):**
- Supabase ANON key hardcoded (public key for license validation)
- No hash verification for downloads (HTTPS mitigates this)
- Sudo usage appropriate for package management

---

## Python Script Analysis

| Category | Count | Issues |
|----------|-------|--------|
| AWS cost optimization | 6 | None |
| GitOps workflow | 8 | verify=False (documented) |
| K8s troubleshooter | 3 | None |
| Webapp testing | 4 | shell=True (acceptable) |
| Office documents | 13 | None |
| Session handoff | 4 | None |
| Other | 34 | None |
| **Total** | **72** | **No critical issues** |

---

## Shell Script Analysis

All 4 skill shell scripts reviewed:

| Script | Risk Assessment |
|--------|-----------------|
| run-taze.sh | Safe - simple tool wrapper |
| check-tool.sh | Safe - uses `command -v` safely |
| generate_test_cases.sh | Safe - uses `printf -v` instead of eval |
| create_bug_report.sh | Safe - uses `printf -v` instead of eval |

---

## Verification Checks Passed

| Check | Result | Notes |
|-------|--------|-------|
| Hardcoded real API keys | ✅ PASS | No real credentials found |
| Malicious URLs | ✅ PASS | All URLs are to official sources |
| Data exfiltration | ✅ PASS | No code sends data externally |
| Command injection | ✅ PASS | All scripts use safe patterns |
| Privilege escalation | ✅ PASS | sudo only in install docs |
| Unsafe file operations | ✅ PASS | No writes to sensitive locations |
| Unvalidated redirects | ✅ PASS | No redirect handling code |
| Deprecated crypto | ✅ PASS | No weak crypto usage |
| MCP over-permissions | ✅ PASS | All MCPs documented with risks |

---

## Recommendations

### Already Implemented
1. ✅ Replaced `eval` in qa-test-planner scripts with `printf -v`
2. ✅ Added security comment to with_server.py shell=True usage
3. ✅ Created SECURITY.md for vulnerability reporting

### Future Considerations
4. Add `--insecure` flag to ArgoCD health checker
5. Consider SHA256 verification for GitHub downloads
6. Pin MCP package versions for reproducibility

---

## Conclusion

The Rising Tides Skills Pack is **approved for distribution**:

- 177 skills audited - no critical issues
- 38 plugins audited - see SECURITY-AUDIT-PLUGINS.md for MCP details
- 19 scripts audited - all safe
- All external references are to trusted sources
- Security-focused skills teach proper detection techniques

---

*Report generated by Claude Opus 4.5 security audit - 2026-02-15*
