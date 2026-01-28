---
name: skill-safety-check
description: "Verify skill safety before adoption. Scans for dangerous patterns, checks source reputation. Use when evaluating new skills or before adding community skills. Triggers on: 'check skill safety', 'verify skill', 'is this skill safe', 'audit skill'."
---

# Skill Safety Check

Verify skills are safe before adopting them into your workflow.

## Why This Matters

Skills are instruction files that Claude follows. A malicious skill could:
- Execute dangerous shell commands
- Exfiltrate data to external servers
- Delete or corrupt files
- Install malicious packages

**Always verify before adopting.**

---

## Safety Checklist

### 1. Dangerous Pattern Scan

Check the SKILL.md and all reference files for:

| Pattern | Risk | Example |
|---------|------|---------|
| `curl -X POST` | Data exfiltration | Sending data to external server |
| `rm -rf` | Destructive deletion | Wiping directories |
| `wget` + `bash` | Code injection | Downloading and executing scripts |
| Base64 encoded strings | Obfuscation | Hidden malicious code |
| External URLs | Unknown destinations | Links to untrusted sites |
| `eval()` or `exec()` | Code execution | Running arbitrary code |
| Environment variable access | Credential theft | `$GITHUB_TOKEN`, `$AWS_SECRET` |

**Commands to scan:**
```bash
# Search for dangerous patterns
grep -rE "(curl.*POST|rm -rf|wget.*\|.*bash|eval\(|exec\()" ./skill-folder/

# Check for Base64
grep -rE "[A-Za-z0-9+/]{40,}={0,2}" ./skill-folder/

# Find external URLs
grep -rE "https?://[^\s]+" ./skill-folder/
```

### 2. Source Reputation

| Check | How |
|-------|-----|
| Known author? | Check if author has other trusted skills |
| GitHub stars? | Popular repos have community review |
| Recent commits? | Active maintenance indicates legitimacy |
| Other users? | Check if others have adopted it |

**Red flags:**
- Anonymous or new author
- No GitHub presence
- Only one skill/repo
- No documentation

### 3. Structure Validation

A proper skill should have:
- [ ] Valid YAML frontmatter (`name`, `description`)
- [ ] Clear purpose in description
- [ ] No executable scripts (only markdown)
- [ ] References are documentation, not code

**Check structure:**
```bash
# Verify frontmatter
head -20 ./skill-folder/SKILL.md

# List all files (should be .md only)
find ./skill-folder -type f -name "*"
```

### 4. Content Review

Read the actual content looking for:
- Does the skill do what it claims?
- Are instructions reasonable for the stated purpose?
- Any instructions that seem unrelated to the purpose?
- Hidden commands in code blocks?

---

## Quick Audit Command

```bash
# Full audit of a skill folder
skill_folder="./path-to-skill"

echo "=== File list ==="
find "$skill_folder" -type f

echo "=== Dangerous patterns ==="
grep -rE "(curl.*POST|rm -rf|wget.*bash|eval\(|exec\()" "$skill_folder" || echo "None found"

echo "=== External URLs ==="
grep -rE "https?://[^\s\)\]\"]+" "$skill_folder" | head -20

echo "=== Frontmatter ==="
head -10 "$skill_folder/SKILL.md"
```

---

## Trust Levels

| Level | Source | Action |
|-------|--------|--------|
| **High** | Anthropic, Vercel Labs, established authors | Use directly |
| **Medium** | GitHub repos with 100+ stars, known community | Quick review |
| **Low** | Unknown author, no reputation | Full audit required |
| **None** | Anonymous, no source, suspicious patterns | Do not use |

---

## Safe Adoption Process

1. **Identify source** — Where did this skill come from?
2. **Check reputation** — Is the author/repo trusted?
3. **Scan for patterns** — Any dangerous commands?
4. **Review content** — Does it do what it claims?
5. **Test in isolation** — Try in a test project first
6. **Monitor behavior** — Watch what Claude does with it

---

## Reporting Issues

If you find a malicious skill:
1. Do not use it
2. Document the dangerous patterns
3. Report to the source (if legitimate repo) or community

---

## When to Use

- Evaluating skills from new sources
- Before adding community-created skills
- Auditing existing skill collection
- Reviewing skills before sharing with others
