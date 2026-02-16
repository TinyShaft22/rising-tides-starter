# Context Efficiency

How Rising Tides achieves ~7% context usage for 187 skills.

---

## The Problem

Claude Code has a 200k token context window. Most skill collections burn 20-40% of that just loading skills — before you write a single line of code.

**The math:**
- Average skill file: 2,000-5,000 tokens
- 187 skills × 3,500 avg = **650,000 tokens** (impossible to load)

You'd need 3× Claude's context window just for skills.

---

## Our Solution: Progressive Disclosure

Instead of loading everything, we load in tiers:

| What | Tokens | When |
|------|--------|------|
| Skill descriptions | ~100 per skill | Session start |
| Full SKILL.md content | 500-5,000 per skill | On invoke only |
| MCP tool schemas | ~500 total | On-demand (with Tool Search) |

**Session start cost:** ~12,000 tokens for skill descriptions (~6% of 200k)

**On-demand loading:** Full skill content only loads when you actually use a skill.

---

## Test Results

Measured using Claude Code's `/context` command:

| Configuration | Context Used | % of 200k |
|---------------|--------------|-----------|
| Rising Tides (187 skills, no MCPs) | ~12,000 tokens | 6% |
| Rising Tides + 4 MCPs (without Tool Search) | ~23,000 tokens | 11.5% |
| Rising Tides + 4 MCPs (with Tool Search) | ~12,500 tokens | 6.25% |

**Key finding:** Tool Search (`ENABLE_TOOL_SEARCH=true`) defers MCP schema loading, saving ~10,000 tokens.

---

## How Tool Search Works

Without Tool Search:
- All MCP tool schemas load at session start
- 4 MCPs = ~11,000 tokens immediately consumed

With Tool Search:
- Claude receives a lightweight "Tool Search" tool (~500 tokens)
- MCP schemas load only when Claude searches for them
- ~85% reduction in MCP context cost

**Enable it:**
```bash
export ENABLE_TOOL_SEARCH=true
```

> **Use `true` not `auto`** — auto mode has a known bug where it fails to trigger.

---

## What This Means for You

| Activity | Context Cost |
|----------|--------------|
| Start a session | ~6% (skill descriptions) |
| Invoke a skill | +500-5,000 tokens (that skill only) |
| Use an MCP tool | +~500 tokens (that tool's schema) |
| Everything else | Available for your actual work |

You get access to 187 skills while keeping **~94% of your context free**.

---

## Comparison

| Approach | Skills | Context Cost |
|----------|--------|--------------|
| Load all skills directly | 20-30 max | 20-40% |
| Rising Tides (indexed) | 187 | ~6% |
| No skills | 0 | 0% |

---

## Methodology

**How we measured:**

1. Started fresh Claude Code session
2. Loaded Rising Tides skills pack
3. Ran `/context` command
4. Recorded token usage
5. Repeated with different MCP configurations

**Environment:**
- Claude Code version: Latest
- Skills: 187 (full pack)
- MCPs tested: context7, playwright, github, memory

---

## See Also

- [Architecture](ARCHITECTURE.md) — How the system works
- [MCP Setup Guide](MCP-SETUP-GUIDE.md) — Configuring MCPs efficiently
